// The gallery while developing: a small static server with no packages, on the first free port from 5174
// (PORT=… for another). Reload the page to see a change in poiesis-design.
import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { extname, join, normalize, sep } from "node:path"
import { MOUNTS } from "./paths.mjs"

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
}

async function file(urlPath) {
  const path = decodeURIComponent(urlPath.replace(/^\/+/, "")) || "index.html"
  for (const [prefix, dir] of Object.entries(MOUNTS)) {
    if (!path.startsWith(prefix)) continue
    const full = normalize(join(dir, path.slice(prefix.length)))
    // Never outside the mounted folder.
    if (full !== dir && !full.startsWith(dir + sep)) return null
    try { return { body: await readFile(full), type: TYPES[extname(full)] ?? "application/octet-stream" } }
    catch { return null }
  }
  return null
}

const server = createServer(async (req, res) => {
  // The path alone, without the query; a malformed one is simply not found.
  let found = null
  try { found = await file(req.url.split(/[?#]/)[0]) } catch {}
  if (!found) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found")
    return
  }
  res.writeHead(200, { "content-type": found.type, "cache-control": "no-store" }).end(found.body)
})

let port = Number(process.env.PORT ?? 5174)
server.on("error", (e) => {
  if (e.code !== "EADDRINUSE" || process.env.PORT) throw e
  server.listen(++port)
})
server.on("listening", () => console.log(`Poiesis Gallery: http://localhost:${port}/`))
server.listen(port)
