# Poiesis Gallery

The components Poiesis uses, in one place, in the Poiesis theme. This is where you **look at** the output;
[poiesis-design](https://github.com/gorgmihai92/poiesis-design) is where the rules and the theme **live**.

The components are [shadcn/ui](https://ui.shadcn.com) (MIT) where it has them, and our own, built the same way,
where it does not (status dot, meter, loading with elapsed time). Their look comes from poiesis-ui: the gallery
imports `atoms.css`, `cells.css` and `shadcn.css` straight out of a poiesis-design checkout. Change an atom there
and every component follows on the next reload.

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
| `src/components/ui/` | shadcn components, added with `npx shadcn add <name>`; ours to change |
| `src/components/` | our own components: status dot, meter, loading |
| `src/App.tsx` | the gallery page: each component, its source and its states |
| `src/index.css` | Tailwind, shadcn's base, and the poiesis-ui theme |
| poiesis-design `…/tokens/shadcn.css` | the theme: shadcn's colour, radius, shadow, font and spacing slots → the cells |
