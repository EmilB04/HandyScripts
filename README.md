<h1 align="center">HandyScripts</h1>

<p align="center"><strong>Small scripts for everyday annoyances.</strong><br />
One-click fixes for third-party apps that keep breaking after updates.</p>

<p align="center">
  <img src="https://img.shields.io/badge/Windows-batch-0078D4?logo=windows&logoColor=white" alt="Windows batch scripts" />
  <img src="https://img.shields.io/badge/Node.js-script-5FA04E?logo=nodedotjs&logoColor=white" alt="Node.js script" />
</p>

## What's inside

| Folder | Script | What it does |
| --- | --- | --- |
| [`Spicetify`](Spicetify/README.md) | `restart_spicetify.bat` | Updates and restarts Spicetify after a Spotify update re-breaks it |
| [`Vencord`](Vencord/README.md) | `restart_vencord.bat`, `restart_vencord_auto.bat` | Re-injects Vencord after a Discord update, with the auto version finding the installer for you |
| [`WSL`](WSL/README.md) | `stop_wsl.bat` | Shuts down every running WSL instance in one click |
| [`Cloudflare`](Cloudflare/iterative-deployment-deletion/README.md) | `iterative-deployment-deletion` | Interactively deletes old Cloudflare Pages deployments in batches, keeping production |

## Use a script

The batch scripts target Windows. Double-click one to run it, or call it from a terminal. Each folder's README lists its requirements and troubleshooting tips. The Cloudflare tool is a Node.js script: run `npm i` and `npm run dev` inside its folder and follow the prompts.

---

Created by [Emil Berglund](https://github.com/EmilB04)
