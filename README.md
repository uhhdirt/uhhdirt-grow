# UHH DIRT // GROW — tracker (grow.uhhdirt.com)

Standalone React grow tracker, Field Manual skin. Saves to the browser's localStorage.
Deploys independently from the main UHH DIRT static site, on Cloudflare Pages.

## Run locally
```
npm install
npm run dev
```

## Build
```
npm run build      # outputs to dist/
```

## Deploy to grow.uhhdirt.com (Cloudflare Pages)
1. Push this folder to its own GitHub repo (e.g. `uhhdirt-grow`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings:
   - Framework preset: **Vite**
   - Build command: **npm run build**
   - Build output directory: **dist**
4. Save & Deploy. You get a `*.pages.dev` URL to confirm it works.
5. In the Pages project → Custom domains → add **grow.uhhdirt.com**.
   - Since uhhdirt.com is on Cloudflare already, it adds the DNS record for you.
   - (If DNS is still at GoDaddy: add a CNAME, host `grow` → your `*.pages.dev` target.)
6. HTTPS auto-issues.

Separate from the main `uhhdirt` repo by design — keeps the art site clean and static.
`public/_redirects` makes any path serve index.html (SPA-safe), matching Cloudflare Pages conventions.

## Notes
- Data is per-device (localStorage), not a shared database.
- Edit the SOP data at the top of `src/GrowTracker.jsx`.
