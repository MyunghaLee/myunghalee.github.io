# Myungha Lee — personal website

A lightweight, responsive academic homepage inspired by the structure of [Jongseok Park's website](https://www.js-park.info/home). Built with plain HTML and CSS; deployment runs through a small GitHub Actions workflow that also precomputes the last-updated dates, so changing content never needs a build step.

## Preview locally

Open `index.html` in a browser, or serve this folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. The "last updated" dates show their fallback values locally, because `assets/updated.json` is only generated during deployment.

## Edit the content

- `index.html`, `gallery/index.html`: page content.
- `highlights/`: no page of its own. `highlights/index.html` redirects to the default category, and the category pages live under `highlights/research/`, `highlights/awards/`, `highlights/scholarship/`, and `highlights/coursework/`.
- `styles.css`: colors, typography, layout, and mobile styles.
- `assets/site.js`: replaces the last-updated dates using `assets/updated.json`.
- `assets/profile.jpg`: profile photo.

The site uses Pretendard for all text, loaded from a CDN in each page's `<head>`.

The publications section is intentionally a placeholder. The public CV currently includes a sample publication title, so no publication was copied from it. Add real entries to this section when they are ready.

## Last-updated dates

`assets/updated.json` is generated at deploy time by `.github/scripts/generate-dates.sh` and is not committed (see `.gitignore`). It contains two ISO 8601 dates:

- `cv`: the latest release or GitHub Pages deployment of `myunghalee/cv`.
- `site`: the committer date of the deployed commit.

If a lookup fails, the script keeps the previously deployed values; if the file is missing entirely, `assets/site.js` leaves the dates hardcoded in the HTML. Visitors' browsers never call the GitHub API.

## Publish

The site deploys with `.github/workflows/deploy.yml` through GitHub Pages. Set the Pages source to **GitHub Actions** (Settings → Pages → Build and deployment → Source). Every push to `main` deploys the site, a daily run refreshes the dates, and the workflow can also be started manually from the Actions tab. The workflow never commits anything back to the repository.
