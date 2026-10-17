// The navigation column on wide screens: one row per section. Rows of sections already passed stack at the top,
// rows still to come stack at the bottom, and each row rides up with its section as it scrolls into view. The
// current section's row also shows its description, which the next row closes as it arrives. Rows are faint at
// both ends and darken toward ink as they rise from the bottom stack to the current place.
import { useLayoutEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type Item = { id: string; name: string; for: string }

export function StackNav({ items }: { items: Item[] }) {
  const area = useRef<HTMLDivElement>(null)
  const brand = useRef<HTMLParagraphElement>(null)
  const rows = useRef<(HTMLLIElement | null)[]>([])
  const notes = useRef<(HTMLParagraphElement | null)[]>([])
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    let frame = 0
    const place = () => {
      frame = 0
      const box = area.current
      if (!box) return
      const boxTop = box.getBoundingClientRect().top
      const height = box.clientHeight
      const start = brand.current?.offsetHeight ?? 0
      const row = rows.current[0]?.querySelector("a")?.offsetHeight ?? 0
      const n = items.length
      // Where each row would be if it scrolled with its section's top edge.
      const natural = items.map(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? 0) - boxTop)
      let current = 0
      natural.forEach((y, i) => { if (y <= start + i * row + 0.5) current = i })
      natural.forEach((y, i) => {
        const top = start + i * row
        const bottom = height - (n - i) * row
        const pos = i <= current ? top : Math.min(Math.max(y, top), bottom)
        const li = rows.current[i]
        if (li) {
          li.style.transform = `translateY(${pos}px)`
          const rise = i === current ? 1 : i < current || bottom <= top ? 0 : (bottom - pos) / (bottom - top)
          li.style.setProperty("--rise", `${Math.round(Math.min(Math.max(rise, 0), 1) * 100)}%`)
        }
        const note = notes.current[i]
        if (note) {
          const room = i + 1 < n ? natural[i + 1] - (top + row) : Infinity
          note.style.height = i === current ? `${Math.max(0, Math.min(note.scrollHeight, room))}px` : "0px"
        }
      })
      setActive(current)
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(place) }
    place()
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    document.fonts?.ready.then(queue)
    return () => {
      window.removeEventListener("scroll", queue)
      window.removeEventListener("resize", queue)
      cancelAnimationFrame(frame)
    }
  }, [items])

  return (
    <nav aria-label="Sections" className="sticky top-0 h-svh">
      <div ref={area} className="absolute inset-x-0 top-8 bottom-8 overflow-hidden">
        <p ref={brand} className="absolute inset-x-0 top-0 px-2.5 pb-2 font-strong">Poiesis Gallery</p>
        <ul>
          {items.map((e, i) => (
            <li key={e.id} ref={(el) => { rows.current[i] = el }} className="absolute inset-x-0 top-0 bg-paper">
              {/* The row's grey is a mix of faint and ink by how far it has risen (--rise); hover brings it to ink. */}
              <Button variant="ghost" size="sm" asChild className="w-full justify-start text-[color-mix(in_oklch,var(--ink)_var(--rise,0%),var(--faint))]">
                <a href={`#${e.id}`} aria-current={i === active ? "location" : undefined}>{e.name}</a>
              </Button>
              <p ref={(el) => { notes.current[i] = el }} className="h-0 overflow-hidden px-2.5 text-muted">
                <span className="block pt-1 pb-2">{e.for}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
