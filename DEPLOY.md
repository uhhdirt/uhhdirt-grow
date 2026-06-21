# Getting the grow app LIVE (and linked from "Dig In The Dirt")

Your main site is plain HTML, so it serves straight from the repo.
This grow app is a React app — it must be BUILT first. This folder is set up
so GitHub builds it for you automatically every time you push. You don't run
any commands yourself.

## ONE-TIME SETUP

### 1. Put this folder in its own GitHub repo
You already committed it — make sure ALL these files are in the repo, including
the hidden `.github/workflows/deploy.yml` file (that's the auto-builder).

### 2. Turn on GitHub Pages with "Actions" as the source
In the grow repo on github.com:
- Click **Settings** (top of the repo)
- Click **Pages** (left sidebar)
- Under "Build and deployment" → **Source** → choose **GitHub Actions**
  (NOT "Deploy from a branch" — that's what the static site uses, but this app
  needs the Actions build.)
- That's it. No build commands to type.

### 3. Push (or click "Re-run") to trigger the first build
- Any push to the `main` branch now triggers an automatic build + deploy.
- Watch it under the repo's **Actions** tab. Green check = deployed.
- When done, **Settings → Pages** shows your live URL, like:
  `https://YOURNAME.github.io/REPONAME/`

### 4. (Optional) Use grow.uhhdirt.com instead of the github.io URL
In GoDaddy DNS, add a **CNAME**:
- Host/Name: `grow`
- Value: `YOURNAME.github.io`
Then in the grow repo: **Settings → Pages → Custom domain** → enter
`grow.uhhdirt.com` → Save.

IMPORTANT: if you use a github.io/REPONAME/ URL (step 3, no custom domain),
open `vite.config.js` and change `base: '/'` to `base: '/REPONAME/'`, then push
again. If you use the grow.uhhdirt.com subdomain (step 4), leave base as '/'.

## LINK IT FROM THE MAIN SITE
Once you have the live URL, edit `index.html` in your MAIN site repo.
Find the nav link for "Dig In The Dirt" (currently `href="#"`) and change it to:

  <a href="https://grow.uhhdirt.com" target="_blank" rel="noopener">Dig In The Dirt</a>

(or the github.io URL if you didn't set up the subdomain). Commit. Done.
