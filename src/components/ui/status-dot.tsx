import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusDotVariants = cva("relative inline-block size-2.5 shrink-0", {
  variants: {
    state: {
      active: "text-success-strong",
      paused: "text-warning-strong",
      stopped: "text-muted-foreground",
      error: "text-danger-strong",
    },
  },
  defaultVariants: {
    state: "active",
  },
})

const shapes = {
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

function StatusDot({
  className,
  state = "active",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof statusDotVariants>) {
  const s = state ?? "active"
  return (
    <span
      data-slot="status-dot"
      data-state={s}
      role="img"
      className={cn(statusDotVariants({ state: s }), className)}
      {...props}
    >
      {s === "active" && <span className="absolute inset-0 animate-ping bg-current opacity-40" />}
      <svg viewBox="0 0 10 10" aria-hidden="true" className="absolute inset-0 size-full">
        {shapes[s]}
      </svg>
    </span>
  )
}

export { StatusDot, statusDotVariants }
