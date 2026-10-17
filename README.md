# Poiesis Gallery

The components Poiesis uses, in one place, in the Poiesis theme. This is where you **look at** the output;
[poiesis-design](https://github.com/gorgmihai92/poiesis-design) is where the rules and the theme **live**.

The components are [shadcn/ui](https://ui.shadcn.com) (MIT), plus two built the same way where shadcn has none
(status dot, meter). They keep shadcn's structure and behaviour; only their look comes from poiesis-ui. The
gallery imports `atoms.css`, one style, `cells.css` and `shadcn.css` straight out of a poiesis-design checkout.
Change an atom there and every component follows on the next reload.

**Another style:** change the style line in `src/index.css` (`styles/quiet.css` → `soft`, `crisp` or `bold`). A
new style is a new file in poiesis-ui's `tokens/styles/` that sets the shape atoms.

## Run

```
npm install
npm run dev
npm run build      # static site in dist/
```

It expects poiesis-design next to it (`../poiesis-design`). Anywhere else: `POIESIS_DESIGN=/path/to/poiesis-design npm run dev`.

## What lives where

| File | Holds |
|---|---|
| `src/components/ui/` | the components: shadcn's, added with `npx shadcn add <name>`, and status dot and meter |
| `src/App.tsx` | the gallery page: each component, its source and its states |
| `src/index.css` | Tailwind, shadcn's base, and the poiesis-ui theme (with the style line) |
| poiesis-design `…/tokens/shadcn.css` | the theme: shadcn's colour, radius, shadow, font and spacing slots → the cells |
