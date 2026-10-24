# Poiesis Gallery

The Poiesis library in one place, in the Poiesis theme: the tokens, the primitives, and every component and
pattern in its states. This is where you **look at** it; [poiesis-design](https://github.com/gorgmihai92/poiesis-design) is
where the tokens (poiesis-ui), the primitives and components (poiesis-components) and the rules **live**. Nothing
is copied here while developing: the page reads them from a poiesis-design checkout.

The gallery is plain HTML, CSS and a small script, like the library it shows. No framework, no packages, nothing
to install.

## Run

```
npm run dev        # http://localhost:5174/ (the next free port if taken; PORT=… for another)
npm run build      # a static site in dist/, the library copied in
```

Node 18+. It expects poiesis-design next to it (`../poiesis-design`). Anywhere else:
`POIESIS_DESIGN=/path/to/poiesis-design npm run dev`. Reload the page to see a change in poiesis-design.

## What lives where

| File | Holds |
|---|---|
| `site/index.html` | the page: tokens, primitives, and each component and pattern in its states |
| `site/sections.html` | a page built with `<po-sections>`, shown in a phone-sized frame and opened on its own for wide screens |
| `site/gallery.css` | imports the tokens, the theme and the library, then the page's own layout |
| `site/gallery.js` | reads the typography values from the browser, lists the icons, marks the current section |
| `serve.mjs`, `build.mjs`, `paths.mjs` | the development server and the static build, Node's own modules only |
| poiesis-design `…/poiesis-ui/skills/ui/tokens/` | served as `poiesis-ui/`: atoms, cells, the theme |
| poiesis-design `…/poiesis-components/skills/components/library/` | served as `poiesis-components/`: primitives, components, their scripts |

To try another feel, change atoms in poiesis-ui's `tokens/themes/poiesis.css` and reload: every primitive and
component follows.
