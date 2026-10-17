// The gallery: the components Poiesis uses, one section each, in the poiesis-ui theme. shadcn/ui where it has
// the component, our own (in the same way) where it does not. One style; light or dark follows the system.
import { useState } from "react"
import type * as React from "react"
import { ChevronDown, Grid2x2, ListFilter, X } from "lucide-react"
import { Loading } from "@/components/loading"
import { Meter } from "@/components/meter"
import { StatusDot } from "@/components/status-dot"
import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Entry = { id: string; name: string; source: string; for: string; states: [string, React.ReactNode][] }

const started = Date.now() - 12_000

function BusyButton() {
  const [busy, setBusy] = useState(false)
  return (
    <Button
      aria-disabled={busy || undefined}
      aria-busy={busy || undefined}
      onClick={() => {
        if (busy) return
        setBusy(true)
        setTimeout(() => setBusy(false), 2000)
      }}
    >
      {busy && <Spinner data-icon="inline-start" />}
      {busy ? "Saving…" : "Save changes"}
    </Button>
  )
}

/** Disabled with a reason: stays focusable (aria-disabled) so the tooltip and description can be reached (E1). */
function ReasonButton({ reason, children }: { reason: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary" aria-disabled aria-description={reason} className="cursor-not-allowed opacity-50" onClick={(e) => e.preventDefault()}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  )
}

function IconAction({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function FilterToggle({ initial = false }: { initial?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle aria-label="Only flagged rows" defaultPressed={initial}><ListFilter /></Toggle>
      </TooltipTrigger>
      <TooltipContent>Only flagged rows</TooltipContent>
    </Tooltip>
  )
}

function SwitchRow({ id, label, initial }: { id: string; label: string; initial: boolean }) {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <Label htmlFor={id} className="flex-auto">{label}</Label>
      <Switch id={id} defaultChecked={initial} />
    </Field>
  )
}

function NameField({ error }: { error?: boolean }) {
  const id = error ? "name-error" : "name"
  return (
    <Field data-invalid={error || undefined} className="max-w-sm">
      <FieldLabel htmlFor={id}>Project name</FieldLabel>
      <Input id={id} placeholder="Untitled" defaultValue={error ? "Atlas" : ""} aria-invalid={error || undefined} />
      <FieldDescription>Letters, numbers and spaces, up to 40 characters.</FieldDescription>
      {error && <FieldError>That name is taken. Try another one.</FieldError>}
    </Field>
  )
}

function Notice() {
  const [open, setOpen] = useState(true)
  if (!open) return <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Show the notice again</Button>
  return (
    <Alert role="status" className="max-w-md">
      <AlertDescription>New version available: 2.4</AlertDescription>
      <AlertAction className="flex items-center gap-1">
        <Button variant="link" size="sm">Update</Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => setOpen(false)}><X /></Button>
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
      </AlertAction>
    </Alert>
  )
}

function Disclosure({ open }: { open?: boolean }) {
  return (
    <Collapsible defaultOpen={open}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="group -ml-2.5">
          Advanced options
          <ChevronDown data-icon="inline-end" className="transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 text-muted-foreground">Keep raw files for 30 days after import.</CollapsibleContent>
    </Collapsible>
  )
}

function UploadProgress({ value }: { value: number }) {
  return (
    <div className="grid max-w-sm grid-cols-[auto_1fr_auto] items-center gap-2">
      <span id={`upload-${value}`}>Upload</span>
      <Progress value={value} aria-labelledby={`upload-${value}`} />
      <span className="text-muted-foreground tabular-nums">{value}%</span>
    </div>
  )
}

const row = "flex flex-wrap items-center gap-2"

const ENTRIES: Entry[] = [
  { id: "button", name: "Button", source: "shadcn button", for: "One action. Primary once per view; secondary; quiet as a text link.", states: [
    ["Variants", <div className={row}><Button>Save changes</Button><Button variant="secondary">Export CSV</Button><Button variant="link">Cancel</Button></div>],
    ["Small", <div className={row}><Button size="sm">Import data</Button><Button variant="secondary" size="sm">Export CSV</Button></div>],
    ["Busy (press it)", <BusyButton />],
    ["Disabled, with and without a reason", <div className={row}><ReasonButton reason="Add a name first">Publish</ReasonButton><Button variant="secondary" disabled>Publish</Button></div>],
  ] },
  { id: "icon-button", name: "Icon button", source: "shadcn button (icon) + tooltip, toggle", for: "An action shown as an icon, always named; a toggle for an on/off icon.", states: [
    ["Action", <IconAction label="Grid view"><Grid2x2 /></IconAction>],
    ["On/off (press it)", <div className={row}><FilterToggle /><FilterToggle initial /></div>],
  ] },
  { id: "tabs", name: "Tabs", source: "shadcn tabs (line)", for: "The main sections of a screen.", states: [
    ["Sections", (
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-2 text-muted-foreground">Overview content.</TabsContent>
        <TabsContent value="activity" className="pt-2 text-muted-foreground">Activity content.</TabsContent>
        <TabsContent value="settings" className="pt-2 text-muted-foreground">Settings content.</TabsContent>
      </Tabs>
    )],
  ] },
  { id: "segmented", name: "Segmented", source: "shadcn tabs", for: "A small choice between views of the same content.", states: [
    ["Two views", <Tabs defaultValue="list"><TabsList><TabsTrigger value="list">List</TabsTrigger><TabsTrigger value="grid">Grid</TabsTrigger></TabsList></Tabs>],
  ] },
  { id: "switch", name: "Switch", source: "shadcn switch + label", for: "An on/off setting that applies at once, with its label.", states: [
    ["On", <SwitchRow id="weekly" label="Email me a weekly summary" initial />],
    ["Off", <SwitchRow id="share" label="Share with the team" initial={false} />],
  ] },
  { id: "tooltip", name: "Tooltip", source: "shadcn tooltip", for: "A short label on hover and focus; Esc closes. Never the only copy of needed information.", states: [
    ["On hover or focus", <Tooltip><TooltipTrigger asChild><Button variant="secondary">Export CSV</Button></TooltipTrigger><TooltipContent>Exports the visible rows</TooltipContent></Tooltip>],
  ] },
  { id: "disclosure", name: "Disclosure", source: "shadcn collapsible", for: "Secondary content under its name; arrow down closed, up open.", states: [
    ["Closed", <Disclosure />],
    ["Open", <Disclosure open />],
  ] },
  { id: "field", name: "Field", source: "shadcn field + input", for: "A labelled input with hint and error; the error says what to do and keeps the input.", states: [
    ["Empty, with hint", <NameField />],
    ["Error", <NameField error />],
  ] },
  { id: "notice", name: "Notice", source: "shadcn alert", for: "A short status with its action and close, in one fixed slot.", states: [
    ["With action and close", <Notice />],
  ] },
  { id: "loading", name: "Loading", source: "own, on shadcn spinner", for: "What is pending and, after 3 s, for how long.", states: [
    ["Just started", <Loading>Reading the file</Loading>],
    ["After a while", <Loading since={started}>Reading the file</Loading>],
  ] },
  { id: "status", name: "Status dot", source: "own", for: "A process running, paused, stopped or failed, by colour and shape.", states: [
    ["Four states", <div className="flex items-center gap-3.5"><StatusDot state="active" label="Importing" /><StatusDot state="paused" label="Paused" /><StatusDot state="stopped" label="Stopped" /><StatusDot state="error" label="Import failed" /></div>],
  ] },
  { id: "meter", name: "Meter", source: "own", for: "A level 1–3 as rising bars; the tone repeats the count.", states: [
    ["Levels", <div className={row}><Meter value={1} label="Level 1 of 3" /><Meter value={2} label="Level 2 of 3" /><Meter value={3} label="Level 3 of 3" /></div>],
    ["Tones", <div className={row}><Meter value={1} tone="success" label="Risk: low" /><Meter value={2} tone="warning" label="Risk: medium" /><Meter value={3} tone="danger" label="Risk: high" /></div>],
  ] },
  { id: "progress", name: "Progress", source: "shadcn progress", for: "How much of a known amount is done, from real work.", states: [
    ["Under way", <UploadProgress value={64} />],
  ] },
  { id: "tile", name: "Tile", source: "shadcn card", for: "One item on a grey step.", states: [
    ["Item", (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">Quarterly costs<Meter value={3} tone="danger" label="Risk: high" /></CardTitle>
          <CardDescription>Updated 14 Oct · 3 sources</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">Costs rose in two of three regions.</CardContent>
      </Card>
    )],
  ] },
  { id: "empty", name: "Empty", source: "shadcn empty", for: "An empty view that says why and what to do, with its action.", states: [
    ["With its action", (
      <Empty className="max-w-md border">
        <EmptyHeader>
          <EmptyTitle>No reports yet</EmptyTitle>
          <EmptyDescription>They appear after the first import.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button size="sm">Import data</Button></EmptyContent>
      </Empty>
    )],
  ] },
]

export function App() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[11rem_1fr] md:px-8">
      <nav aria-label="Components" className="md:sticky md:top-8 md:self-start">
        <p className="mb-2 font-semibold">Poiesis Gallery</p>
        <ul className="flex flex-wrap gap-x-3 gap-y-1 md:grid md:gap-1">
          {ENTRIES.map((e) => (
            <li key={e.id}><a href={`#${e.id}`} className="text-muted-foreground hover:text-foreground">{e.name}</a></li>
          ))}
        </ul>
      </nav>
      <main className="grid gap-12">
        {ENTRIES.map((e) => (
          <section key={e.id} id={e.id} className="grid scroll-mt-8 gap-4">
            <header className="grid gap-1">
              <h2 className="font-heading text-lg font-semibold">{e.name}</h2>
              <p className="text-muted-foreground">{e.for}</p>
              <p className="font-mono text-sm text-muted-foreground">{e.source}</p>
            </header>
            {e.states.map(([name, node]) => (
              <div key={name} className="grid gap-2 rounded-lg bg-card p-4">
                <span className="text-sm text-muted-foreground">{name}</span>
                <div>{node}</div>
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  )
}
