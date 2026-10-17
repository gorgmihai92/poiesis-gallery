// Loading: says what is pending, and for how long once it takes a while, so a slow answer never looks stuck.
// shadcn's Spinner plus the words and the seconds. Rules: F2 the loading state of every async view · F3 what is
// pending is announced (the seconds are not) · I5 the spinner only turns without reduced motion · T5 tabular
// figures for the changing number.
import { useEffect, useState } from "react"
import type * as React from "react"
import { Spinner } from "@/components/ui/spinner"

/** `since`: when the work started (ms); the elapsed seconds appear after 3 s. */
export function Loading({ children, since }: { children: React.ReactNode; since?: number }) {
  const [now, setNow] = useState(() => Date.now())
  // A live region is announced when its content changes: mount it empty, then fill it.
  const [filled, setFilled] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setFilled(true), 50)
    return () => clearTimeout(id)
  }, [])
  useEffect(() => {
    if (since === undefined) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [since])
  const seconds = since === undefined ? 0 : Math.max(0, Math.round((now - since) / 1000))
  return (
    <p className="flex flex-wrap items-center gap-2 text-muted-foreground">
      <Spinner className="motion-reduce:animate-none" />
      <span role="status" className="text-foreground">{filled ? children : null}</span>
      {seconds >= 3 && <span className="tabular-nums">· {seconds} s</span>}
    </p>
  )
}
