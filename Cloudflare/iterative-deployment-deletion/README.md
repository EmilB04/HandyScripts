# iterative-deployment-deletion

Deletes old Cloudflare Pages deployments for a project, batch by batch,
keeping the live production deployment. Fully interactive — no env vars
required.

## Run it

```
npm i
npm run dev
```

That's it. The script prompts for everything it needs and asks you to
confirm before deleting each batch of deployments, so you can stop at
any point (`n` at a prompt) and re-run later to pick up where you left off.

## What it asks for, and where to find it

1. **Cloudflare API Token**
   `dash.cloudflare.com` → click your profile icon (top right) → **My Profile** →
   **API Tokens** → **Create Token**. Use the "Edit Cloudflare Workers" template
   or a custom token with **Account > Cloudflare Pages > Edit** permission.

2. **Cloudflare Account ID**
   `dash.cloudflare.com` → open any domain or the **Workers & Pages** overview →
   the Account ID is shown in the right-hand sidebar (also visible in the
   dashboard URL: `dash.cloudflare.com/<ACCOUNT_ID>/...`).

3. **Cloudflare Pages Project Name**
   `dash.cloudflare.com` → **Workers & Pages** → the project's name as listed,
   or the subdomain slug in its `https://<PROJECT_NAME>.pages.dev` URL.

4. **Delete aliased deployments too?** (`true`/`false`, default `true`)
   Aliased deployments are preview deployments tied to a branch, e.g.
   `my-branch.<project>.pages.dev`. Answer `false` to keep those and only
   delete plain preview deployments.

## Notes

- The live production (canonical) deployment is always skipped.
- Deployments are fetched and deleted in batches of 30; you're asked to
  confirm before each batch runs.
- Values can still be supplied via env vars (`CF_API_TOKEN`, `CF_ACCOUNT_ID`,
  `CF_PAGES_PROJECT_NAME`, `CF_DELETE_ALIASED_DEPLOYMENTS`) to skip a prompt,
  but this isn't required.
