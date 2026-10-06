# Myungha Lee — personal website

A lightweight, responsive academic homepage inspired by the structure of [Jongseok Park's website](https://www.js-park.info/home). Built with plain HTML and CSS, so it works directly on GitHub Pages without a build step.

## Preview locally

Open `index.html` in a browser, or serve this folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Edit the content

- `home/index.html`, `projects/index.html`, `gallery/index.html`: page content.
- `styles.css`: colors, typography, layout, and mobile styles.
- `assets/site.js`: footer year and last-updated dates.
- `assets/profile.jpg`: profile photo.
- `assets/fonts/Jetendard-Regular.woff2`: self-hosted Jetendard subset used for the monospace email address.

Fonts are loaded in each page's `<head>`: Pretendard and Wanted Sans come from CDNs, and Jetendard is self-hosted so everything works on GitHub Pages. Body text uses Pretendard, headings use Wanted Sans, and monospace text uses Jetendard.

The publications section is intentionally a placeholder. The public CV currently includes a sample publication title, so no publication was copied from it. Add real entries to this section when they are ready.

## Publish

This repository can be published with GitHub Pages. Set the Pages source to the repository's root directory on your chosen branch. No installation or build command is required.
