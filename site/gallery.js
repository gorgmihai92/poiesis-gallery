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
const ICONS = ["chevron-down", "close", "check", "grid", "filter", "spinner", "info", "success", "warning", "caution", "danger", "new", "circle", "plus", "pencil", "calendar-plus", "search", "arrow-left", "arrow-right"]

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

// Demos that need a hand from the page: a control that opens a fold, a morph swapped to its form and back, checks
// that set their line done (a task's check sets its steps too, one after another by --po-step), dates set to
// tomorrow, and the tasks a line form adds, shown as rows above it.
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

const day = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}
for (const pick of document.querySelectorAll("[data-demo-tomorrow]")) pick.setAttribute("value", day(1))

// A task added: its verb in strong, its date in words and colored by how near it is, as the rows above it.
const dueWords = (value) => {
  const days = Math.round((new Date(`${value}T12:00`) - new Date(`${day(0)}T12:00`)) / 864e5)
  if (days < 0) return [`${-days} day${days === -1 ? "" : "s"} late`, "danger"]
  if (days === 0) return ["due today", "caution"]
  if (days === 1) return ["due tomorrow", "warning"]
  return [days < 7 ? `due in ${days} days` : `due ${new Date(`${value}T12:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}`, ""]
}
for (const form of document.querySelectorAll("[data-demo-add]")) {
  form.addEventListener("save", (e) => {
    const { text, due } = e.detail
    const [verb, ...rest] = text.split(" ")
    const line = el("div", { className: "po-line" })
    const check = el("input", { type: "checkbox" })
    check.setAttribute("aria-label", `Done: ${text}`)
    check.addEventListener("change", () => setLine(check))
    const words = el("div", { className: "po-line-text" }, el("strong", { textContent: verb }), rest.length ? ` ${rest.join(" ")}` : "")
    if (due) {
      const [label, urgency] = dueWords(due)
      const tag = el("span", { className: "po-due", textContent: ` · ${label}` })
      if (urgency) tag.dataset.urgency = urgency
      words.append(tag)
    }
    line.append(el("span", { className: "po-line-mark" }, el("label", { className: "po-check" }, check)), words)
    form.before(line)
  })
}

// A task checked off: a few words take its place for about 2 s.
for (const line of document.querySelectorAll("[data-demo-cheer]")) {
  const check = line.querySelector("input")
  check.addEventListener("change", () => {
    line.dataset.state = check.checked ? "done" : ""
    if (!check.checked) return delete line.dataset.cheer
    line.dataset.cheer = ""
    setTimeout(() => delete line.dataset.cheer, 2000)
  })
}

// A task picked: its line says so, and the search starts again.
for (const picker of document.querySelectorAll("[data-demo-picker]")) {
  picker.addEventListener("change", (e) => {
    const field = picker.querySelector("input")
    field.value = ""
    field.placeholder = `Picked: ${e.detail.option.querySelector("span span").textContent}`
    field.dispatchEvent(new Event("input", { bubbles: true }))
    field.focus()
  })
  picker.addEventListener("close", () => picker.querySelector("input").blur())
}

// The toast: a routine change with Undo, or an error that stays until it is closed.
const toast = document.getElementById("demo-toast")
for (const button of document.querySelectorAll("[data-demo-toast]")) {
  button.addEventListener("click", () => {
    const error = button.dataset.demoToast === "error"
    const alert = toast.querySelector(".po-alert")
    if (error) alert.dataset.role = "danger"
    else delete alert.dataset.role
    alert.setAttribute("role", error ? "alert" : "status")
    alert.querySelector("p").textContent = error ? "Couldn’t save the task. Check your connection and try again." : "Moved “Send the contract” to Archive."
    const action = alert.querySelector("button")
    action.textContent = error ? "Close" : "Undo"
    action.toggleAttribute("data-undo", !error)
    action.toggleAttribute("data-close", error)
    toast.setAttribute("open", "")
  })
}
