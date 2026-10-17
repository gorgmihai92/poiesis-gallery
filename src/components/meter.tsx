// Meter: a level from 1 to 3 as rising bars, like a signal indicator; the number of filled bars reads without a
// legend or colour, the tone repeats it. No shadcn equivalent. Rules: C4 never colour alone · C2 tones are status
// colours only · I3 named.
import { cn } from "@/lib/utils"

const BARS = [
  { x: 0, h: 5 },
  { x: 5, h: 8.5 },
  { x: 10, h: 12 },
]

const TONE = {
  ink: "text-foreground",
  danger: "text-destructive",
  warning: "text-warning",
  success: "text-success",
}

/** `label`: the level in words ("High", "Level 2 of 3"); without it the meter is decorative. */
export function Meter({ value, tone = "ink", label, className }: {
  value: 1 | 2 | 3
  tone?: keyof typeof TONE
  label?: string
  className?: string
}) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const }
  return (
    <svg viewBox="0 0 14 12" className={cn("inline-block h-3 w-3.5 shrink-0", TONE[tone], className)} {...a11y}>
      {BARS.map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={12 - b.h}
          width="4"
          height={b.h}
          className={i < value ? "fill-current" : tone === "ink" ? "fill-current opacity-25" : "fill-foreground opacity-25"}
        />
      ))}
    </svg>
  )
}
