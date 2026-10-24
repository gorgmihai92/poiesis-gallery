// The gallery as a static site in dist/: the page, and the tokens and components it reads, copied from the
// poiesis-design checkout into the same paths, so it runs from any static host.
import { cpSync, rmSync } from "node:fs"
import { join } from "node:path"
import { HERE, MOUNTS } from "./paths.mjs"

const out = join(HERE, "dist")
rmSync(out, { recursive: true, force: true })
for (const [prefix, dir] of Object.entries(MOUNTS)) cpSync(dir, join(out, prefix), { recursive: true })
console.log(`Built: ${out}`)
