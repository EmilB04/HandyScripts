const fetch = require('node-fetch')
const { backOff } = require('exponential-backoff')
const readline = require('readline')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const prompt = (question, defaultValue) =>
  new Promise((resolve) => {
    const hint = defaultValue ? ` [${defaultValue}]` : ''
    rl.question(`${question}${hint}: `, (answer) => {
      resolve(answer.trim() || defaultValue || '')
    })
  })

const confirm = async (question) => {
  const answer = await prompt(`${question} (y/n)`, 'y')
  return answer.toLowerCase().startsWith('y')
}

const MAX_ATTEMPTS = 5

const DEPLOYMENTS_PER_PAGE = 10
const PAGINATION_BATCH_SIZE = 3
const BATCH_MAX_RESULTS = PAGINATION_BATCH_SIZE * DEPLOYMENTS_PER_PAGE

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

// Populated at runtime after prompting
const config = {}

const getHeaders = () => ({
  Authorization: `Bearer ${config.CF_API_TOKEN}`,
})

/** Get the canonical deployment (the live deployment) */
async function getProductionDeploymentId() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.CF_ACCOUNT_ID}/pages/projects/${config.CF_PAGES_PROJECT_NAME}`,
    {
      method: 'GET',
      headers: getHeaders(),
    }
  )
  const body = await response.json()
  if (!body.success) {
    throw new Error(body.errors[0].message)
  }
  const prodDeploymentId = body.result.canonical_deployment?.id
  if (!prodDeploymentId) {
    return null
  }
  return prodDeploymentId
}

async function deleteDeployment(id) {
  let params = ''
  if (config.CF_DELETE_ALIASED_DEPLOYMENTS === 'true') {
    params = '?force=true' // Forces deletion of aliased deployments
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.CF_ACCOUNT_ID}/pages/projects/${config.CF_PAGES_PROJECT_NAME}/deployments/${id}${params}`,
    {
      method: 'DELETE',
      headers: getHeaders(),
    }
  )
  const body = await response.json()
  if (!body.success) {
    throw new Error(body.errors[0].message)
  }
  console.log(`Deleted deployment ${id} for project ${config.CF_PAGES_PROJECT_NAME}`)
}

async function listDeploymentsPerPage(page) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.CF_ACCOUNT_ID}/pages/projects/${config.CF_PAGES_PROJECT_NAME}/deployments?per_page=${DEPLOYMENTS_PER_PAGE}&page=${page}`,
    {
      method: 'GET',
      headers: getHeaders(),
    }
  )
  const body = await response.json()
  if (!body.success) {
    throw new Error(`Could not fetch deployments for ${config.CF_PAGES_PROJECT_NAME}`)
  }

  if (body.result?.length) {
    const amountOfDeploymentsFound = (page - 1) * DEPLOYMENTS_PER_PAGE + body.result?.length
    console.log(`Fetching deployments... (${amountOfDeploymentsFound} deployments fetched)`)
  }

  return body.result
}

async function listNextDeployments() {
  let page = 1
  const deploymentIds = []

  console.log(`Listing next ${BATCH_MAX_RESULTS} deployments, this may take a while...`)
  while (true) {
    let result
    try {
      result = await backOff(() => listDeploymentsPerPage(page), {
        numOfAttempts: 5,
        startingDelay: 1000, // 1s, 2s, 4s, 8s, 16s
        retry: (_, attempt) => {
          console.warn(
            `Failed to list deployments on page ${page}... retrying (${attempt}/${MAX_ATTEMPTS})`
          )
          return true
        },
      })
    } catch (err) {
      console.warn(`Failed to list deployments on page ${page}.`)
      console.warn(err)
      process.exit(1)
    }

    for (const deployment of result) {
      deploymentIds.push(deployment.id)
    }

    if (result.length && BATCH_MAX_RESULTS > page * DEPLOYMENTS_PER_PAGE) {
      page = page + 1
      await sleep(500)
    } else {
      return deploymentIds
    }
  }
}

async function deleteBatch(deploymentIds, productionDeploymentId) {
  for (const id of deploymentIds) {
    if (productionDeploymentId !== null && id === productionDeploymentId) {
      console.log(`Skipping production deployment: ${id}`)
    } else {
      try {
        await deleteDeployment(id)
        await sleep(500)
      } catch (error) {
        console.log(error)
      }
    }
  }
}

async function main() {
  console.log('--- Cloudflare Pages credentials (Dashboard > project > Settings > General) ---')
  config.CF_API_TOKEN = process.env.CF_API_TOKEN ||
    await prompt('Cloudflare API Token (dash.cloudflare.com > My Profile > API Tokens > Create Token)')
  config.CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID ||
    await prompt('Cloudflare Account ID (dash.cloudflare.com > right sidebar of any domain/Pages overview)')
  config.CF_PAGES_PROJECT_NAME = process.env.CF_PAGES_PROJECT_NAME ||
    await prompt('Cloudflare Pages Project Name (Workers & Pages list, or the slug in your *.pages.dev URL)')
  config.CF_DELETE_ALIASED_DEPLOYMENTS = process.env.CF_DELETE_ALIASED_DEPLOYMENTS ||
    await prompt('Delete aliased deployments too? (true/false)', 'true')

  if (!config.CF_API_TOKEN) {
    throw new Error('Please provide a Cloudflare API Token')
  }
  if (!config.CF_ACCOUNT_ID) {
    throw new Error('Please provide a Cloudflare Account ID')
  }
  if (!config.CF_PAGES_PROJECT_NAME) {
    throw new Error('Please provide a Cloudflare Pages Project Name')
  }

  const productionDeploymentId = await getProductionDeploymentId()
  if (productionDeploymentId !== null) {
    console.log(`Live production deployment (kept, never deleted): ${productionDeploymentId}`)
  }

  let deploymentIds = await listNextDeployments()
  while (deploymentIds.length > 1) { // Ignoring live production deployment
    const toDelete = deploymentIds.filter((id) => id !== productionDeploymentId)
    console.log(`\nNext batch: ${toDelete.length} deployment(s) will be deleted.`)
    const proceed = await confirm('Proceed with deleting this batch?')
    if (!proceed) {
      console.log('Stopped. Re-run the script to continue deleting later.')
      break
    }
    await deleteBatch(deploymentIds, productionDeploymentId)
    deploymentIds = await listNextDeployments()
  }

  rl.close()
}

main()
