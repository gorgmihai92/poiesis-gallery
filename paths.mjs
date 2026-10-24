// Where the gallery reads Poiesis from: a poiesis-design checkout, ../poiesis-design by default, another one with
// POIESIS_DESIGN=/path. Nothing is copied while developing; the page asks for these paths and they are served
// from the checkout. Shared by serve.mjs and build.mjs.
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const HERE = dirname(fileURLToPath(import.meta.url))
const DESIGN = resolve(process.env.POIESIS_DESIGN ?? resolve(HERE, "../poiesis-design"))

// Published path → folder it comes from.
export const MOUNTS = {
  "poiesis-ui/": resolve(DESIGN, "plugins/poiesis-ui/skills/ui/tokens"),
  "poiesis-components/": resolve(DESIGN, "plugins/poiesis-components/skills/components/library"),
  "": resolve(HERE, "site"),
}
