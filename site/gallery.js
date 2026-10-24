// The gallery's own script: the values on the page are read from the browser, so they are always the current
// theme's, the section navigation marks where the reader is, and a few demos get a hand (below). The components
// need only poiesis-components.js.

const root = getComputedStyle(document.documentElement)
const px = (v) => `${Math.round(parseFloat(v) * 100) / 100}px`
const rem = (v) => `${Math.round((parseFloat(v) / 16) * 1000) / 1000}rem`
const firstFamily = (f) => f.split(",")[0].replace(/["']/g, "").trim()
const el = (tag, props = {}, ...children) => {
  const node = Object.assign(document.createElement(tag), props)
  node.append(...children)
  return node
}
const meta = (...parts) => el("div", { className: "gallery-meta" }, ...parts.map((p) => typeof p === "string" ? el("span", { textContent: p }) : p))

const FACES = [["Sans", "--font-sans"], ["Serif", "--font-serif"], ["Mono", "--font-mono"]]
const ATOMS = [
  ["--atom-font-sans", "sans typeface"],
  ["--atom-font-serif", "serif typeface"],
  ["--atom-font-mono", "mono typeface"],
  ["--atom-text-base", "page body size"],
  ["--atom-text-ui", "component text size"],
  ["--atom-ratio", "scale ratio"],
  ["--atom-leading", "body line height"],
  ["--atom-leading-tight", "heading line height"],
  ["--atom-weight-regular", "regular weight: running text"],
  ["--atom-weight-strong", "strong weight: headings, buttons, toggles, tabs, card titles"],
  ["--atom-tracking", "body letter spacing"],
  ["--atom-tracking-tight", "heading letter spacing"],
  ["--atom-measure", "line length"],
]
const SCALE = ["2xl", "xl", "lg", "md", "base", "sm"]
const ROLES = [
  ["title", "Quarterly report"],
  ["heading", "Costs by region"],
  ["subheading", "North and east"],
  ["body", "Costs rose in two of three regions, led by energy and transport."],
  ["caption", "Updated 14 Oct · 3 sources"],
  ["code", '<button class="po-pressable po-button">Save</button>'],
  ["ui", "Every component's text: buttons, labels, captions, content"],
]
const COLOR_ROLES = [["info", "Info"], ["success", "Success"], ["warning", "Warning"], ["caution", "Caution"], ["danger", "Danger"], ["new", "New"]]
const ICONS = ["chevron-down", "close", "check", "grid", "filter", "spinner", "info", "success", "warning", "caution", "danger", "new"]

// Fills a sample's details once its style is known, and again when the web fonts arrive.
const measured = []
const measure = (node, describe) => measured.push(() => describe(getComputedStyle(node)))

for (const [name, cell] of FACES) {
  const sample = el("p", { textContent: "The quick brown fox jumps over the lazy dog" })
  sample.style.cssText = `font: var(--weight-regular) var(--text-2xl) / var(--leading-display) var(${cell})`
  const family = el("span")
  document.querySelector("[data-faces]").append(el("div", { className: "po-stack" }, meta(name, family, cell), sample))
  measure(sample, (s) => { family.textContent = firstFamily(s.fontFamily) })
}

for (const [name, about] of ATOMS)
  document.querySelector("[data-atoms]").append(el("tr", {}, el("td", { textContent: name }), el("td", { textContent: root.getPropertyValue(name).trim() }), el("td", { textContent: about })))

for (const step of SCALE) {
  const sample = el("span", { textContent: "Poiesis Gallery" })
  sample.style.cssText = `font-size: var(--text-${step}); line-height: var(--leading-heading)`
  const size = el("span")
  document.querySelector("[data-scale]").append(el("div", {}, meta(`--text-${step}`, size), sample))
  measure(sample, (s) => { size.textContent = `${px(s.fontSize)} · ${rem(s.fontSize)}` })
}

for (const [name, text] of ROLES) {
  const sample = el("p", { className: `po-${name}`, textContent: text })
  const details = el("span")
  document.querySelector("[data-roles]").append(el("div", {}, meta(el("strong", { textContent: name }), details), sample))
  measure(sample, (s) => {
    const leading = Math.round((parseFloat(s.lineHeight) / parseFloat(s.fontSize)) * 100) / 100
    const tracking = s.letterSpacing === "normal" ? "0" : px(s.letterSpacing)
    details.textContent = `${firstFamily(s.fontFamily)} · size ${px(s.fontSize)} · ${rem(s.fontSize)} · weight ${s.fontWeight} · line height ${px(s.lineHeight)} · ${leading} · tracking ${tracking}`
  })
}

for (const [id, name] of COLOR_ROLES) {
  const swatch = (text, css) => { const d = el("div", { className: "gallery-swatch", textContent: text }); d.style.cssText = css; return d }
  document.querySelector("[data-roles-colors]").append(el("div", { className: "gallery-role" },
    swatch(name, `background: var(--${id}); color: var(--on-color)`),
    swatch(`${name} tint`, `background: var(--${id}-tint); color: var(--ink)`),
    swatch(`${name} text`, `color: var(--${id}); font-weight: var(--weight-strong); box-shadow: inset 0 0 0 1px var(--divider)`),
  ))
}

for (const name of ICONS) {
  const icon = el("span", { className: "po-icon" })
  icon.dataset.icon = name
  icon.setAttribute("aria-hidden", "true")
  document.querySelector("[data-icons]").append(el("figure", {}, icon, el("figcaption", { textContent: name })))
}

const describe = () => measured.forEach((f) => f())
describe()
document.fonts?.ready.then(describe)

// The navigation marks the section in view (aria-current), so the reader sees where they are.
const links = new Map([...document.querySelectorAll(".gallery-nav a")].map((a) => [a.hash.slice(1), a]))
const seen = new Set()
const io = new IntersectionObserver((entries) => {
  for (const e of entries) e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)
  // The last section reaching the top of the screen: the one whose content is there, not the space after the one before.
  const current = [...links.keys()].findLast((id) => seen.has(id))
  for (const [id, a] of links) id === current ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current")
}, { rootMargin: "0px 0px -70% 0px" })
for (const id of links.keys()) {
  const section = document.getElementById(id)
  if (section) io.observe(section)
}

// Demos that need a hand from the page: a control that opens a fold, a morph swapped to its form and back, and
// checks that set their line done (a task's check sets its steps too, one after another by --po-step).
for (const button of document.querySelectorAll("[data-fold-toggle]")) {
  const fold = document.getElementById(button.getAttribute("aria-controls"))
  button.addEventListener("click", () => {
    const open = fold.inert
    fold.inert = !open
    button.setAttribute("aria-expanded", String(open))
    button.textContent = open ? "Hide filters" : "Show filters"
  })
}

for (const morph of document.querySelectorAll("[data-morph]")) {
  const closed = morph.innerHTML
  const form = morph.parentElement.querySelector("[data-morph-form]")
  morph.addEventListener("click", (e) => {
    if (e.target.closest("[data-morph-open]")) {
      morph.replaceChildren(form.content.cloneNode(true))
      morph.querySelector("textarea")?.focus()
    } else if (e.target.closest("[data-morph-close]")) {
      morph.innerHTML = closed
      morph.querySelector("button")?.focus()
    }
  })
}

const setLine = (input) => { input.closest(".po-line").dataset.state = input.checked ? "done" : "" }
for (const input of document.querySelectorAll("[data-line-check]")) input.addEventListener("change", () => setLine(input))
for (const main of document.querySelectorAll("[data-steps-main]")) {
  main.addEventListener("change", () => {
    setLine(main)
    for (const step of main.closest("[data-steps]").querySelectorAll("[data-line-check]")) {
      step.checked = main.checked
      setLine(step)
    }
  })
}
