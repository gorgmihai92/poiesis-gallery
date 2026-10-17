import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const meterVariants = cva("inline-block h-3 w-3.5 shrink-0", {
  variants: {
    tone: {
      default: "text-foreground",
      destructive: "text-destructive",
      warning: "text-warning",
      success: "text-success",
    },
  },
  defaultVariants: {
    tone: "default",
  },
})

const bars = [
  { x: 0, h: 5 },
  { x: 5, h: 8.5 },
  { x: 10, h: 12 },
]

function Meter({
  className,
  tone,
  value,
  ...props
}: React.ComponentProps<"svg"> & VariantProps<typeof meterVariants> & { value: 1 | 2 | 3 }) {
  return (
    <svg
      data-slot="meter"
      viewBox="0 0 14 12"
      role="img"
      className={cn(meterVariants({ tone }), className)}
      {...props}
    >
      {bars.map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={12 - b.h}
          width="4"
          height={b.h}
          data-on={i < value || undefined}
          className="fill-current not-data-on:fill-foreground/20"
        />
      ))}
    </svg>
  )
}

export { Meter, meterVariants }
