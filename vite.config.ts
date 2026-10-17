// The gallery reads poiesis-design in place: the components from poiesis-components, the tokens from poiesis-ui.
// Nothing is copied, so the gallery always shows what the rules repository holds now. POIESIS_DESIGN points at
// another checkout; by default it is the sibling folder ../poiesis-design.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const DESIGN = resolve(process.env.POIESIS_DESIGN ?? resolve(__dirname, "../poiesis-design"));
const LIBRARY = join(DESIGN, "plugins/poiesis-components/skills/components");
const TOKENS = join(DESIGN, "plugins/poiesis-ui/skills/ui/tokens");

export const PRESETS = ["tool", "reading", "expressive"];
export const STYLES = ["quiet", "soft", "crisp", "bold"];

/** One stylesheet with every preset and style, each scoped to its attribute, the way preview.mjs builds it. */
function tokens(): Plugin {
  const ID = "virtual:poiesis-tokens.css";
  const files = [
    join(TOKENS, "atoms.css"),
    ...PRESETS.map((p) => join(TOKENS, `presets/${p}.css`)),
    ...STYLES.map((s) => join(TOKENS, `styles/${s}.css`)),
    join(TOKENS, "cells.css"),
  ];
  const scope = (file: string, attr: string, value: string) =>
    readFileSync(file, "utf8").replace(/:root\s*\{/, `[data-${attr}="${value}"] {`);
  return {
    name: "poiesis-tokens",
    resolveId: (id) => (id === ID ? "\0" + ID : undefined),
    load(id) {
      if (id !== "\0" + ID) return;
      files.forEach((f) => this.addWatchFile(f));
      return [
        readFileSync(files[0], "utf8"),
        ...PRESETS.map((p) => scope(join(TOKENS, `presets/${p}.css`), "preset", p)),
        ...STYLES.map((s) => scope(join(TOKENS, `styles/${s}.css`), "style", s)),
        readFileSync(join(TOKENS, "cells.css"), "utf8"),
      ].join("\n");
    },
  };
}

export default defineConfig({
  plugins: [react(), tokens()],
  base: "./",
  resolve: {
    alias: { "@poiesis": LIBRARY },
    // The library sits outside this folder: its imports of react and radix-ui resolve to ours.
    dedupe: ["react", "react-dom", "radix-ui"],
  },
  server: { fs: { allow: [__dirname, DESIGN] } },
});
