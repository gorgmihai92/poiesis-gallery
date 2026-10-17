# Poiesis Gallery

The components Poiesis uses, in one place, in the Poiesis theme. This is where you **look at** the output;
[poiesis-design](https://github.com/gorgmihai92/poiesis-design) is where the rules and the theme **live**.

The components are [shadcn/ui](https://ui.shadcn.com) (MIT), plus two built the same way where shadcn has none
(status dot, meter). They keep shadcn's structure and behaviour; their look comes from poiesis-ui, read straight
out of a poiesis-design checkout: `poiesis.css` (the token engine) and one **theme**.

## Themes: another feel without touching the components

A theme is one file in poiesis-ui's `tokens/themes/` that picks one file from each layer and can set extra atoms:

| Layer | Sets | Files |
|---|---|---|
| palette | colors: paper, ink, and a color + tint for info, success, warning, caution, danger, new | `tokens/palettes/` |
| typeface | the sans, serif and mono families | `tokens/typefaces/` |
| preset | type and density | `tokens/presets/` |
| style | corners, lines, shadows, selection | `tokens/styles/` |

To try another feel, point the theme line in `src/index.css` at another theme. To make one, copy
`themes/poiesis.css` and change its layers or atoms. Components use only role names (`bg-success`,
`text-danger-strong`, `bg-info-tint`…), so they follow any theme.

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
| `src/App.tsx` | the gallery page: each component and its states |
| `src/typography.tsx` | the typography section: typefaces, type atoms, scale and roles, with live values |
| `src/index.css` | Tailwind, shadcn's base, `poiesis.css` and the theme line |
| poiesis-design `…/tokens/poiesis.css` | the theme: atoms, cells, and the components’ colour, radius, shadow, font and spacing slots mapped onto the cells |
