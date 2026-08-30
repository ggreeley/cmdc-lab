# Collective Memory and Dynamic Cognition Lab

Single-page static site. No build step — plain HTML/CSS/JS.

## Structure

- `index.html` — the whole site
- `assets/css/style.css`, `assets/js/main.js` — styles and behavior
- `assets/img/people/` — headshots (referenced by filename in `index.html`)
- `content/` — Markdown source for People and Research. Edit these
  and ask Claude to sync the corresponding section of `index.html` to match
  (there's no runtime Markdown rendering, by design, to keep this static and
  dependency-free).

## Deploying to GitHub Pages

1. Create a new repo on GitHub (don't initialize with a README).
2. `git remote add origin <repo-url>`
3. `git add -A && git commit -m "Initial site"`
4. `git push -u origin main`
5. In the repo on GitHub: Settings → Pages → Source → Deploy from branch →
   `main` / `/ (root)`.
6. Site will be live at `https://<username>.github.io/<repo>/` within a
   couple minutes.

If you want a custom domain, add a `CNAME` file at the repo root containing
the domain, and point its DNS at GitHub Pages.
