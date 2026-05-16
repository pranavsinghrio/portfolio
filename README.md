# Pranav Singh — Portfolio

Personal portfolio website showcasing my work as a Java Backend Developer.

**Live site:** https://pranavsinghrio.github.io/portfolio/

## Stack

- Plain HTML, CSS, and JavaScript — zero build step
- Deployed via GitHub Actions to GitHub Pages

## Local preview

Open `index.html` in a browser, or serve it with any static server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which publishes
the site to GitHub Pages.
