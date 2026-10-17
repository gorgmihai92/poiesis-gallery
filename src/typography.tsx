// The typography section: typefaces, the type atoms, the scale and the text roles, each with the values the
// browser computes from the current theme, so the numbers are always the theme's own.
import { useLayoutEffect, useRef, useState } from "react"
import type * as React from "react"

const FACES = [
  ["Sans", "--font-sans"],
  ["Serif", "--font-serif"],
  ["Mono", "--font-mono"],
] as const

const ATOMS = [
  ["--atom-font-sans", "sans typeface"],
  ["--atom-font-serif", "serif typeface"],
  ["--atom-font-mono", "mono typeface"],
  ["--atom-font-body", "body uses"],
  ["--atom-font-display", "headings use"],
  ["--atom-text-base", "body size"],
  ["--atom-ratio", "scale ratio"],
  ["--atom-leading", "body line height"],
  ["--atom-leading-tight", "heading line height"],
  ["--atom-weight-regular", "regular weight"],
  ["--atom-weight-strong", "strong weight"],
  ["--atom-weight-heading", "heading weight"],
  ["--atom-tracking", "body letter spacing"],
  ["--atom-tracking-tight", "heading letter spacing"],
  ["--atom-measure", "line length"],
] as const

const SCALE = ["2xl", "xl", "lg", "md", "base", "sm"] as const

const ROLES = [
  ["title", "Quarterly report"],
  ["heading", "Costs by region"],
  ["subheading", "North and east"],
  ["body", "Costs rose in two of three regions, led by energy and transport."],
  ["label", "Project name"],
  ["control", "Save changes"],
  ["caption", "Updated 14 Oct · 3 sources"],
  ["code", "import { Button } from \"@/components/ui/button\""],
] as const

/** A role's cells as inline style: the text takes its size, weight, leading, font and tracking together. */
const role = (r: string): React.CSSProperties => ({
  fontFamily: `var(--${r}-font)`,
  fontSize: `var(--${r}-size)`,
  fontWeight: `var(--${r}-weight)`,
  lineHeight: `var(--${r}-leading)`,
  letterSpacing: `var(--${r}-tracking)`,
})

const px = (v: string) => `${Math.round(parseFloat(v) * 100) / 100}px`
const rem = (v: string) => `${Math.round((parseFloat(v) / 16) * 1000) / 1000}rem`
const firstFamily = (f: string) => f.split(",")[0].replace(/["']/g, "").trim()

/** The computed style of the element the ref is on, read after layout and again once web fonts have loaded. */
function useComputed<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [style, setStyle] = useState<CSSStyleDeclaration | null>(null)
  useLayoutEffect(() => {
    const read = () => ref.current && setStyle(getComputedStyle(ref.current))
    read()
    document.fonts?.ready.then(read)
  }, [])
  return [ref, style] as const
}

function useRootValue(name: string) {
  const [value, setValue] = useState("")
  useLayoutEffect(() => setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim()), [name])
  return value
}

const details = "flex flex-wrap gap-x-4 gap-y-1"
const meta = { ...role("code"), color: "var(--muted)" }

function Face({ name, cell }: { name: string; cell: string }) {
  const [ref, style] = useComputed<HTMLDivElement>()
  const loaded = style && document.fonts?.check(`16px "${firstFamily(style.fontFamily)}"`)
  return (
    <div ref={ref} className="grid gap-2" style={{ fontFamily: `var(${cell})` }}>
      <div className={details} style={meta}>
        <span>{name}</span>
        <span>{style ? firstFamily(style.fontFamily) : ""}</span>
        <span>{style ? (loaded ? "loaded" : "fallback in use") : ""}</span>
        <span>{cell}</span>
      </div>
      <p style={{ fontSize: "var(--text-2xl)", lineHeight: "var(--leading-display)" }}>The quick brown fox jumps over the lazy dog</p>
      <p className="text-muted-foreground">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 &amp;!?@€%</p>
      <p className="flex flex-wrap gap-x-4">
        <span style={{ fontWeight: "var(--weight-regular)" }}>Regular</span>
        <span style={{ fontWeight: "var(--weight-strong)" }}>Strong</span>
        <span style={{ fontWeight: "var(--weight-heading)" }}>Heading</span>
        <span className="italic">Italic</span>
      </p>
    </div>
  )
}

function Atom({ name, about }: { name: string; about: string }) {
  const value = useRootValue(name)
  return (
    <tr className="border-b border-border align-baseline">
      <td className="py-2 pr-4" style={role("code")}>{name}</td>
      <td className="py-2 pr-4" style={role("code")}>{value}</td>
      <td className="py-2 text-muted-foreground">{about}</td>
    </tr>
  )
}

function Step({ step }: { step: string }) {
  const [ref, style] = useComputed<HTMLSpanElement>()
  return (
    <div className="grid gap-1 border-b border-border py-3">
      <div className={details} style={meta}>
        <span>--text-{step}</span>
        <span>{style ? `${px(style.fontSize)} · ${rem(style.fontSize)}` : ""}</span>
      </div>
      <span ref={ref} style={{ fontSize: `var(--text-${step})`, lineHeight: "var(--leading-heading)" }}>Poiesis Gallery</span>
    </div>
  )
}

function Role({ name, sample }: { name: string; sample: string }) {
  const [ref, style] = useComputed<HTMLParagraphElement>()
  const leading = style ? parseFloat(style.lineHeight) / parseFloat(style.fontSize) : 0
  return (
    <div className="grid gap-1 border-b border-border py-3">
      <div className={details} style={meta}>
        <span style={{ color: "var(--ink)" }}>{name}</span>
        {style && (
          <>
            <span>{firstFamily(style.fontFamily)}</span>
            <span>size {px(style.fontSize)} · {rem(style.fontSize)}</span>
            <span>weight {style.fontWeight}</span>
            <span>line height {px(style.lineHeight)} · {Math.round(leading * 100) / 100}</span>
            <span>tracking {style.letterSpacing === "normal" ? "0" : px(style.letterSpacing)}</span>
          </>
        )}
      </div>
      <p ref={ref} style={role(name)}>{sample}</p>
    </div>
  )
}

export const typography: [string, React.ReactNode][] = [
  ["Typefaces", <div className="grid gap-8">{FACES.map(([n, c]) => <Face key={n} name={n} cell={c} />)}</div>],
  ["Atoms", (
    <div className="overflow-x-auto">
      <table className="w-full border-t border-border text-left">
        <tbody>{ATOMS.map(([n, a]) => <Atom key={n} name={n} about={a} />)}</tbody>
      </table>
    </div>
  )],
  ["Scale", <div className="border-t border-border">{SCALE.map((s) => <Step key={s} step={s} />)}</div>],
  ["Roles", <div className="border-t border-border">{ROLES.map(([n, s]) => <Role key={n} name={n} sample={s} />)}</div>],
]
