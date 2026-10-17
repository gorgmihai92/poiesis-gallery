// The gallery: each component, one section, in the poiesis-ui theme. Light or dark follows the system.
import type * as React from "react"
import { ChevronDown, Grid2x2, ListFilter, X } from "lucide-react"
import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Meter } from "@/components/ui/meter"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { StatusDot } from "@/components/ui/status-dot"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Entry = { id: string; name: string; for: string; states: [string, React.ReactNode][] }

const row = "flex flex-wrap items-center gap-2"

const ENTRIES: Entry[] = [
  { id: "button", name: "Button", for: "Triggers an action.", states: [
    ["Variants", <div className={row}><Button>Default</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive">Destructive</Button><Button variant="link">Link</Button></div>],
    ["Sizes", <div className={row}><Button size="xs">Extra small</Button><Button size="sm">Small</Button><Button>Default</Button><Button size="lg">Large</Button></div>],
    ["Icon", <div className={row}><Button variant="outline" size="icon" aria-label="Grid view"><Grid2x2 /></Button><Button variant="ghost" size="icon" aria-label="Close"><X /></Button></div>],
    ["Loading and disabled", <div className={row}><Button disabled><Spinner data-icon="inline-start" />Saving…</Button><Button variant="secondary" disabled>Disabled</Button></div>],
  ] },
  { id: "toggle", name: "Toggle", for: "A two-state button that can be on or off.", states: [
    ["Off and on", <div className={row}><Toggle aria-label="Filter"><ListFilter /></Toggle><Toggle aria-label="Filter" defaultPressed><ListFilter /></Toggle></div>],
  ] },
  { id: "tabs", name: "Tabs", for: "Layered sections of content, one shown at a time.", states: [
    ["Default", (
      <Tabs defaultValue="list">
        <TabsList><TabsTrigger value="list">List</TabsTrigger><TabsTrigger value="grid">Grid</TabsTrigger></TabsList>
      </Tabs>
    )],
    ["Line", (
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
  { id: "switch", name: "Switch", for: "Toggles a setting on or off.", states: [
    ["With label", (
      <div className="grid max-w-sm gap-3">
        <Field orientation="horizontal"><Label htmlFor="s1" className="flex-auto">Email me a weekly summary</Label><Switch id="s1" defaultChecked /></Field>
        <Field orientation="horizontal"><Label htmlFor="s2" className="flex-auto">Share with the team</Label><Switch id="s2" /></Field>
      </div>
    )],
  ] },
  { id: "tooltip", name: "Tooltip", for: "A short label shown on hover or focus.", states: [
    ["Default", <Tooltip><TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger><TooltipContent>Exports the visible rows</TooltipContent></Tooltip>],
  ] },
  { id: "collapsible", name: "Collapsible", for: "Shows and hides a panel of content.", states: [
    ["Default", (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="group">
            Advanced options
            <ChevronDown data-icon="inline-end" className="transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-2.5 pt-2 text-muted-foreground">Keep raw files for 30 days after import.</CollapsibleContent>
      </Collapsible>
    )],
  ] },
  { id: "field", name: "Field", for: "A label, a control, its description and its error.", states: [
    ["Default", (
      <Field className="max-w-sm">
        <FieldLabel htmlFor="f1">Project name</FieldLabel>
        <Input id="f1" placeholder="Untitled" />
        <FieldDescription>Up to 40 characters.</FieldDescription>
      </Field>
    )],
    ["Invalid", (
      <Field data-invalid className="max-w-sm">
        <FieldLabel htmlFor="f2">Project name</FieldLabel>
        <Input id="f2" defaultValue="Atlas" aria-invalid />
        <FieldError>That name is taken.</FieldError>
      </Field>
    )],
    ["Disabled", (
      <Field className="max-w-sm">
        <FieldLabel htmlFor="f3">Workspace</FieldLabel>
        <Input id="f3" defaultValue="Poiesis Lab" disabled />
      </Field>
    )],
  ] },
  { id: "alert", name: "Alert", for: "A message that needs attention.", states: [
    ["Default", (
      <Alert className="max-w-md">
        <AlertDescription>New version available: 2.4</AlertDescription>
        <AlertAction><Button variant="link" size="sm">Update</Button></AlertAction>
      </Alert>
    )],
    ["Destructive", <Alert variant="destructive" className="max-w-md"><AlertDescription>The import failed.</AlertDescription></Alert>],
  ] },
  { id: "spinner", name: "Spinner", for: "Shows that something is loading.", states: [
    ["Default", <div className="flex items-center gap-2 text-muted-foreground"><Spinner />Reading the file</div>],
  ] },
  { id: "progress", name: "Progress", for: "How much of a task is done.", states: [
    ["Default", <Progress value={64} aria-label="Upload" className="max-w-sm" />],
  ] },
  { id: "status-dot", name: "Status dot", for: "The state of a process.", states: [
    ["States", <div className="flex items-center gap-3.5"><StatusDot state="active" aria-label="Active" /><StatusDot state="paused" aria-label="Paused" /><StatusDot state="stopped" aria-label="Stopped" /><StatusDot state="error" aria-label="Error" /></div>],
  ] },
  { id: "meter", name: "Meter", for: "A level from 1 to 3.", states: [
    ["Values", <div className={row}><Meter value={1} aria-label="Level 1" /><Meter value={2} aria-label="Level 2" /><Meter value={3} aria-label="Level 3" /></div>],
    ["Tones", <div className={row}><Meter value={1} tone="success" aria-label="Low" /><Meter value={2} tone="warning" aria-label="Medium" /><Meter value={3} tone="destructive" aria-label="High" /></div>],
  ] },
  { id: "card", name: "Card", for: "A container for one item.", states: [
    ["Default", (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Quarterly costs</CardTitle>
          <CardDescription>Updated 14 Oct · 3 sources</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">Costs rose in two of three regions.</CardContent>
      </Card>
    )],
  ] },
  { id: "empty", name: "Empty", for: "An empty state with what to do next.", states: [
    ["Default", (
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
