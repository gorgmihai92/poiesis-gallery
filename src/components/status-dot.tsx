// StatusDot: whether a process runs, waits, stopped or failed. Each state has its own shape (filled, pause bars,
// hollow, "!"), not only its colour, and its name is the accessible label and the tooltip. No shadcn equivalent.
// Rules: C4 never colour alone · I3 named · I4 a 24px target · I5 the pulse only without reduced motion.
import type * as React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type ProcessState = "active" | "paused" | "stopped" | "error"

const SHAPES: Record<ProcessState, React.ReactNode> = {
  active: <rect x="0" y="0" width="10" height="10" fill="currentColor" />,
  paused: (
    <>
      <rect x="1" y="0" width="3" height="10" fill="currentColor" />
      <rect x="6" y="0" width="3" height="10" fill="currentColor" />
    </>
  ),
  stopped: <rect x="0.75" y="0.75" width="8.5" height="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />,
  error: (
    <>
      <rect x="0" y="0" width="10" height="10" fill="currentColor" />
      <path d="M5 2v4M5 7.5v1" className="stroke-background" strokeWidth="1.5" />
    </>
  ),
}

const TONE: Record<ProcessState, string> = {
  active: "text-success",
  paused: "text-warning",
  stopped: "text-muted-foreground",
  error: "text-destructive",
}

/** `label`: the state in words. Keep 14px or more between dots, so their 24px targets don't overlap. */
export function StatusDot({ state, label, className }: { state: ProcessState; label: string; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="img"
          aria-label={label}
          tabIndex={0}
          data-state={state}
          className={cn(
            "relative inline-block size-2.5 shrink-0 outline-none after:absolute after:-inset-[7px] focus-visible:ring-[3px] focus-visible:ring-ring/50",
            TONE[state],
            className,
          )}
        >
          {state === "active" && <span className="absolute inset-0 bg-current opacity-0 motion-safe:animate-[status-ring_1.6s_ease-out_infinite]" />}
          <svg viewBox="0 0 10 10" aria-hidden className="absolute inset-0 size-full">{SHAPES[state]}</svg>
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
