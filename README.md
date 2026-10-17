# Poiesis Gallery

Every Poiesis component, organized, in each style, preset and theme. This is where you **look at** the output;
[poiesis-design](https://github.com/gorgmihai92/poiesis-design) is where the rules and the components **live**.

The gallery copies nothing. It imports the components from `poiesis-components` and the tokens from `poiesis-ui`
straight out of a poiesis-design checkout, and reads the component list (what each is for, its file, its rules)
from `catalog.md`. Change a component or a token there and the gallery shows it on the next reload.

## Run

```
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
```

It expects poiesis-design next to it (`../poiesis-design`). Anywhere else: `POIESIS_DESIGN=/path/to/poiesis-design npm run dev`.

## What lives where

| File | Holds |
|---|---|
| `src/catalog.ts` | reads `catalog.md`; the groups in the sidebar (a new catalog row with no group shows under "Other") |
| `src/demos.tsx` | the states each component is shown in, and the all-components composition |
| `src/App.tsx` | sidebar, preset / theme / style controls, one page per component |
| `src/gallery.css` | the gallery's own layout, cells only |
| `vite.config.ts` | where poiesis-design is, and the tokens stylesheet built from it |

A new component: add it to poiesis-design (its `.tsx`, `.css` and a row in `catalog.md`), then its states to
`src/demos.tsx` here.
