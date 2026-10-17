// The gallery: each component, one section, in the poiesis-ui theme. Light or dark follows the system.
import type * as React from "react"
import { ChevronDown, CircleCheck, CircleX, Grid2x2, Info, ListFilter, OctagonAlert, Sparkles, TriangleAlert, X } from "lucide-react"
import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Masthead, MastheadByline, MastheadDescription, MastheadName, MastheadTitle } from "@/components/ui/masthead"
import { Meter } from "@/components/ui/meter"
import { PageSection, PageSectionDescription, PageSectionHeader, PageSectionTitle } from "@/components/ui/page-section"
import { Progress } from "@/components/ui/progress"
import { SectionNav } from "@/components/ui/section-nav"
import { Spinner } from "@/components/ui/spinner"
import { StatusDot } from "@/components/ui/status-dot"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { typography } from "@/typography"

type Entry = { id: string; name: string; for: string; states: [string, React.ReactNode][] }

const row = "flex flex-wrap items-center gap-2"

/** A state's title: the name in strong ink, the tokens it shows (in brackets) muted and regular after it. */
function StateTitle({ name }: { name: string }) {
  const at = name.indexOf(" (")
  const title = at < 0 ? name : name.slice(0, at)
  const tokens = at < 0 ? "" : name.slice(at)
  return (
    <span className="text-ui">
      <span className="font-strong text-ink">{title}</span>
      {tokens && <span className="font-regular text-muted">{tokens}</span>}
    </span>
  )
}

const ROLES = [
  ["info", "Info", "bg-info text-on-color", "bg-info-tint", "text-info"],
  ["success", "Success", "bg-success text-on-color", "bg-success-tint", "text-success"],
  ["warning", "Warning", "bg-warning text-on-color", "bg-warning-tint", "text-warning"],
  ["caution", "Caution", "bg-caution text-on-color", "bg-caution-tint", "text-caution"],
  ["danger", "Danger", "bg-danger text-on-color", "bg-danger-tint", "text-danger"],
  ["new", "New", "bg-new text-on-color", "bg-new-tint", "text-new"],
] as const

const NEUTRALS = [
  ["bg-paper text-ink ring-1 ring-divider", "Paper", "page, blocks"],
  ["bg-surface text-ink", "Surface", "grey fill, hover"],
  ["bg-divider text-ink", "Divider", "between sections"],
  ["bg-line text-paper", "Line", "control edges"],
  ["bg-faint text-ink", "Faint", "text out of focus"],
  ["bg-muted text-paper", "Muted", "secondary text"],
  ["bg-ink text-paper", "Ink", "text, primary fill"],
] as const

const swatch = "grid min-h-12 content-center rounded-md px-3 py-2 text-ui"

/** The gallery's name, who made it (quiet, so Get is the one call to action), what it is, and where to get it. */
const masthead = (
  <Masthead>
    <MastheadTitle>
      <MastheadName>Poiesis Gallery</MastheadName>
      <MastheadByline>
        {" by "}
        <Button variant="quiet" size="inline" asChild>
          <a href="https://georgemihai.com" target="_blank" rel="noreferrer">George Mihai</a>
        </Button>
      </MastheadByline>
    </MastheadTitle>
    <MastheadDescription>A design system: components, type, spacing and color, shown in its own theme.</MastheadDescription>
    <Button size="sm" asChild>
      <a href="https://github.com/gorgmihai92/poiesis-design" target="_blank" rel="noreferrer">Get</a>
    </Button>
  </Masthead>
)

const ENTRIES: Entry[] = [
  { id: "typography", name: "Typography", for: "Three typefaces, the type atoms, the scale they produce and the text roles. Values are read from the page, so they are the current theme's.", states: typography },
  { id: "colors", name: "Colors", for: "The palette's roles. Each is one color, for fills, text, icons and lines, with a tint for backgrounds under ink text.", states: [
    ["Roles", (
      <div className="grid gap-2">
        {ROLES.map(([id, name, fill, tint, strong]) => (
          <div key={id} className="grid grid-cols-3 gap-2">
            <div className={`${swatch} ${fill}`}>{name}</div>
            <div className={`${swatch} ${tint}`}>{name} tint</div>
            <div className={`${swatch} bg-paper font-strong ${strong}`}>{name} text</div>
          </div>
        ))}
      </div>
    )],
    ["Neutrals", (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {NEUTRALS.map(([cls, name, use]) => (
          <div key={name} className={`${swatch} ${cls}`}><span>{name}</span><span className="opacity-(--disabled)">{use}</span></div>
        ))}
      </div>
    )],
    ["States", (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className={`${swatch} bg-selected text-selected-foreground`}>Selected</div>
        <div className={`${swatch} bg-surface text-ink`}>Hover, plain</div>
        <div className={`${swatch} bg-ink text-paper opacity-(--hover)`}>Hover, filled</div>
        <div className={`${swatch} bg-ink text-paper opacity-(--disabled)`}>Disabled</div>
      </div>
    )],
  ] },
  { id: "tokens", name: "Size, shape and state", for: "Control heights and padding follow density; icons, the disabled look and widths each have one token.", states: [
    ["Control heights (--control-*)", (
      <div className="flex flex-wrap items-end gap-3">
        {(["xs", "sm", "md", "lg"] as const).map((s) => (
          <div key={s} className="grid justify-items-center gap-1">
            <div className="w-16 bg-surface" style={{ height: `var(--control-${s})` }} />
            <span className="font-mono text-ui text-muted">{s}</span>
          </div>
        ))}
      </div>
    )],
    ["Icons (--icon, --icon-sm)", <div className="flex items-center gap-3"><Grid2x2 className="size-(--icon)" /><Grid2x2 className="size-(--icon-sm)" /></div>],
    ["Disabled (--disabled)", <div className="flex gap-2"><Button>Enabled</Button><Button disabled>Disabled</Button></div>],
    ["Widths (max-w-narrow, max-w-measure)", (
      <div className="grid gap-6">
        {([["max-w-narrow", "Narrow · tooltips, empty states, short forms"], ["max-w-measure", "Measure · running text"]] as const).map(([w, use]) => (
          <div key={w} className="grid gap-1">
            <span className="text-muted">{use}</span>
            <p className={w}>A line stops at this width, so text never stretches across the whole screen and stays easy to follow from one line to the next.</p>
          </div>
        ))}
      </div>
    )],
  ] },
  { id: "button", name: "Button", for: "Triggers an action.", states: [
    ["Variants", <div className={row}><Button>Default</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button><Button variant="link">Link</Button></div>],
    ["Quiet link (a byline or credit, in the text's own color)", <p className="text-muted">Photo by <Button variant="quiet" size="inline">Ana Pop</Button></p>],
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
        <TabsContent value="overview" className="pt-2 text-muted">3 imports this week.</TabsContent>
        <TabsContent value="activity" className="pt-2 text-muted">Last change 2 hours ago.</TabsContent>
        <TabsContent value="settings" className="pt-2 text-muted">Notifications are on.</TabsContent>
      </Tabs>
    )],
  ] },
  { id: "switch", name: "Switch", for: "Toggles a setting on or off.", states: [
    ["With label", (
      <div className="grid max-w-narrow gap-3">
        <Field orientation="horizontal"><Label htmlFor="s1" className="flex-auto">Email me a weekly summary</Label><Switch id="s1" defaultChecked /></Field>
        <Field orientation="horizontal"><Label htmlFor="s2" className="flex-auto">Share with the team</Label><Switch id="s2" /></Field>
      </div>
    )],
  ] },
  { id: "tooltip", name: "Tooltip", for: "A short label shown on hover or focus.", states: [
    ["Default", <Tooltip><TooltipTrigger asChild><Button variant="outline">Export</Button></TooltipTrigger><TooltipContent>Exports the visible rows</TooltipContent></Tooltip>],
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
        <CollapsibleContent className="px-2.5 pt-2 text-muted">Keep raw files for 30 days after import.</CollapsibleContent>
      </Collapsible>
    )],
  ] },
  { id: "field", name: "Field", for: "A label, a control, its description and its error.", states: [
    ["Default", (
      <Field className="max-w-narrow">
        <FieldLabel htmlFor="f1">Project name</FieldLabel>
        <Input id="f1" placeholder="Untitled" />
        <FieldDescription>Up to 40 characters.</FieldDescription>
      </Field>
    )],
    ["Invalid", (
      <Field data-invalid className="max-w-narrow">
        <FieldLabel htmlFor="f2">Project name</FieldLabel>
        <Input id="f2" defaultValue="Atlas" aria-invalid />
        <FieldError>That name is taken. Try another.</FieldError>
      </Field>
    )],
    ["Disabled", (
      <Field className="max-w-narrow">
        <FieldLabel htmlFor="f3">Workspace</FieldLabel>
        <Input id="f3" defaultValue="Poiesis Lab" disabled />
      </Field>
    )],
  ] },
  { id: "alert", name: "Alert", for: "A message that needs attention.", states: [
    ["Default", (
      <Alert className="max-w-narrow">
        <AlertDescription>New version available: 2.4</AlertDescription>
        <AlertAction><Button variant="link" size="sm">Update</Button></AlertAction>
      </Alert>
    )],
    ["Danger", <Alert variant="danger" className="max-w-narrow"><AlertDescription>The import failed. Check the file and try again.</AlertDescription></Alert>],
    ["Roles", (
      <div className="grid max-w-narrow gap-2">
        <Alert variant="info"><Info /><AlertDescription>Imports run every night at 2:00.</AlertDescription></Alert>
        <Alert variant="success"><CircleCheck /><AlertDescription>All 3 sources imported.</AlertDescription></Alert>
        <Alert variant="warning"><TriangleAlert /><AlertDescription>One source has not changed in 30 days. Check that it still exports.</AlertDescription></Alert>
        <Alert variant="caution"><OctagonAlert /><AlertDescription>The quota is 90% used.</AlertDescription></Alert>
        <Alert variant="danger"><CircleX /><AlertDescription>The import failed. Check the file and try again.</AlertDescription></Alert>
        <Alert variant="new"><Sparkles /><AlertDescription>New: export to PDF.</AlertDescription></Alert>
      </div>
    )],
  ] },
  { id: "spinner", name: "Spinner", for: "Shows that something is loading.", states: [
    ["Default", <div className="flex items-center gap-2 text-muted"><Spinner />Reading the file</div>],
  ] },
  { id: "progress", name: "Progress", for: "How much of a task is done.", states: [
    ["Default", <Progress value={64} aria-label="Upload" className="max-w-narrow" />],
  ] },
  { id: "status-dot", name: "Status dot", for: "The state of a process.", states: [
    ["States", <div className="flex items-center gap-3.5"><StatusDot state="active" aria-label="Active" /><StatusDot state="paused" aria-label="Paused" /><StatusDot state="stopped" aria-label="Stopped" /><StatusDot state="error" aria-label="Error" /></div>],
  ] },
  { id: "meter", name: "Meter", for: "A level from 1 to 3.", states: [
    ["Values", <div className={row}><Meter value={1} aria-label="Level 1" /><Meter value={2} aria-label="Level 2" /><Meter value={3} aria-label="Level 3" /></div>],
    ["Tones", <div className={row}><Meter value={1} tone="success" aria-label="Low" /><Meter value={2} tone="warning" aria-label="Medium" /><Meter value={2} tone="caution" aria-label="Medium-high" /><Meter value={3} tone="danger" aria-label="High" /></div>],
  ] },
  { id: "card", name: "Card", for: "A container for one item.", states: [
    ["Default", (
      <Card className="max-w-narrow">
        <CardHeader>
          <CardTitle>Quarterly costs</CardTitle>
          <CardDescription>Updated 14 Oct · 3 sources</CardDescription>
        </CardHeader>
        <CardContent className="text-muted">Costs rose in two of three regions.</CardContent>
      </Card>
    )],
  ] },
  { id: "empty", name: "Empty", for: "An empty state with what to do next.", states: [
    ["Default", (
      <Empty className="max-w-narrow border">
        <EmptyHeader>
          <EmptyTitle>No reports yet</EmptyTitle>
          <EmptyDescription>They appear after the first import.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button size="sm">Import data</Button></EmptyContent>
      </Empty>
    )],
  ] },
  { id: "masthead", name: "Masthead", for: "A page's name, byline and one call to action.", states: [
    ["Default", masthead],
  ] },
  { id: "page-section", name: "Page section", for: "One section of a long page: a divider on top, the content near it, the section's space after it. Every section on this page is one.", states: [
    ["Parts", <p className="text-muted">Its parts sit one level of space apart (--subsection-space), the sections a level above (--section-space).</p>],
  ] },
  { id: "section-nav", name: "Section navigation", for: "Navigation for a page of sections: the column on the left of this page on wide screens, a wrapped list on narrow ones.", states: [
    ["Behavior", <p className="text-muted">Passed sections stack at the top, coming ones at the bottom. Each row rides up with its section and darkens from faint to ink as it nears the current place.</p>],
  ] },
]

export function App() {
  return (
    <div className="mx-auto grid max-w-page gap-8 px-4 md:px-8 lg:grid-cols-[16rem_16rem_minmax(0,1fr)]">
      <SectionNav items={ENTRIES.map((e) => ({ id: e.id, title: e.name, description: e.for }))} header={masthead} />
      {/* An empty column as wide as the navigation, between it and the content. */}
      <div aria-hidden className="hidden lg:block" />
      {/* The bottom padding lets the last sections scroll up to the top, so their rows can become current. */}
      <main className="grid min-w-0 content-start pb-8 lg:pt-8 lg:pb-[50svh]">
        {ENTRIES.map((e) => (
          <PageSection key={e.id} id={e.id} className="scroll-mt-8">
            <PageSectionHeader className="lg:sr-only">
              <PageSectionTitle>{e.name}</PageSectionTitle>
              <PageSectionDescription>{e.for}</PageSectionDescription>
            </PageSectionHeader>
            {e.states.map(([name, node]) => (
              <div key={name} className="grid gap-3">
                <StateTitle name={name} />
                <div>{node}</div>
              </div>
            ))}
          </PageSection>
        ))}
      </main>
    </div>
  )
}
