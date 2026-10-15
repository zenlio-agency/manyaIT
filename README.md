# Client-1

ManyaIT website redesign.

| Folder       | What it is                                                                      |
| ------------ | ------------------------------------------------------------------------------- |
| `site/`      | The website, built with Astro and Lumos. See `site/README.md`.                  |
| `studio/`    | Sanity Studio, where HR and marketing edit content. See `studio/README.md`.     |
| `content/`   | Homepage copy (`homepage-copy.md`) and the legal pack design (`legal-pack.md`). |
| `wireframe/` | Black-and-white homepage wireframe.                                             |

## Site

```sh
cd site
npm install
npm run dev
```

Then open http://localhost:4321. `site/README.md` covers the structure, brand
tokens, motion, and what has to be confirmed before launch.

## Wireframe

`wireframe/index.html` is the black-and-white homepage wireframe (navbar + 13 sections). Open it in a browser; no build step is needed.

The toolbar at the top has these controls:

- **Desktop / Tablet / Mobile** resizes the artboard to 1440, 834 or 390 px, and the layout reflows using container queries.
- **Notes** shows or hides the annotation strips and component tags.
- **12-col grid** overlays the layout grid.
- **Jump to…** scrolls to any section.

Figures marked `XX` are placeholders to confirm with ManyaIT.
