// The states each component is shown in. Every demo renders the real component from poiesis-components; the
// gallery owns only the sample content.
import { useState } from "react";
import type * as React from "react";
import { Button, IconButton } from "@poiesis/library/button.js";
import { Disclosure } from "@poiesis/library/disclosure.js";
import { Field } from "@poiesis/library/field.js";
import { Empty, Hint, Section, Stack, Tile } from "@poiesis/library/layout.js";
import { Dots, Loading } from "@poiesis/library/loading.js";
import { Meter, Progress } from "@poiesis/library/meter.js";
import { Notice } from "@poiesis/library/notice.js";
import { StatusDot } from "@poiesis/library/status.js";
import { Switch } from "@poiesis/library/switch.js";
import { Segmented, Tabs, TabsContent, TabsList } from "@poiesis/library/tabs.js";
import { Tip } from "@poiesis/library/tip.js";

export type Demo = { name: string; render: () => React.ReactNode };

export const icons = {
  filter: (
    <svg viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 3h12M4.5 8h7M7 13h2" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />
    </svg>
  ),
};

function Toggle({ label, initial = false }: { label: string; initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <IconButton label={label} pressed={on} onClick={() => setOn(!on)}>
      {icons.filter}
    </IconButton>
  );
}

function SwitchDemo({ initial, label }: { initial: boolean; label: string }) {
  const [on, setOn] = useState(initial);
  return <Switch checked={on} onChange={setOn} label={label} />;
}

function BusyButton() {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="primary"
      busy={busy}
      onClick={() => {
        setBusy(true);
        setTimeout(() => setBusy(false), 2000);
      }}
    >
      {busy ? "Saving…" : "Save changes"}
    </Button>
  );
}

function NoticeDemo() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Notice action={<Button variant="quiet" size="s">Update</Button>} onClose={() => setOpen(false)}>
      New version available: 2.4
    </Notice>
  ) : (
    <Button size="s" onClick={() => setOpen(true)}>Show the notice again</Button>
  );
}

function FieldDemo({ error }: { error?: boolean }) {
  const [value, setValue] = useState(error ? "Atlas" : "");
  return (
    <Field
      label="Project name"
      placeholder="Untitled"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      hint="Letters, numbers and spaces, up to 40 characters."
      error={error ? "That name is taken. Try another one." : undefined}
    />
  );
}

function ProgressDemo({ value }: { value: number }) {
  return (
    <div className="g-progress">
      <span>Upload</span>
      <Progress value={value} label="Upload" />
      <span className="g-num">{Math.round(value * 100)}%</span>
    </div>
  );
}

const started = Date.now() - 12_000;

export const demos: Record<string, Demo[]> = {
  button: [
    { name: "Variants", render: () => (
      <div className="g-row">
        <Button variant="primary">Save changes</Button>
        <Button variant="secondary">Export CSV</Button>
        <Button variant="quiet">Cancel</Button>
      </div>
    ) },
    { name: "Small", render: () => (
      <div className="g-row">
        <Button variant="primary" size="s">Import data</Button>
        <Button size="s">Export CSV</Button>
        <Button variant="quiet" size="s">Cancel</Button>
      </div>
    ) },
    { name: "Busy (press it)", render: () => <BusyButton /> },
    { name: "Disabled, with and without a reason", render: () => (
      <div className="g-row">
        <Button disabled reason="Add a name first">Publish</Button>
        <Button disabled>Publish</Button>
      </div>
    ) },
  ],
  iconbutton: [
    { name: "Action", render: () => <IconButton label="Grid view">{icons.grid}</IconButton> },
    { name: "On/off (press it)", render: () => (
      <div className="g-row">
        <Toggle label="Only flagged rows" />
        <Toggle label="Only flagged rows" initial />
      </div>
    ) },
    { name: "Disabled", render: () => <IconButton label="Grid view" disabled>{icons.grid}</IconButton> },
  ],
  tabs: [
    { name: "Sections", render: () => (
      <Tabs defaultValue="overview">
        <TabsList label="Sections" items={[["overview", "Overview"], ["activity", "Activity"], ["settings", "Settings"]]} />
        <TabsContent value="overview"><Hint>Overview content.</Hint></TabsContent>
        <TabsContent value="activity"><Hint>Activity content.</Hint></TabsContent>
        <TabsContent value="settings"><Hint>Settings content.</Hint></TabsContent>
      </Tabs>
    ) },
  ],
  segmented: [
    { name: "Two views", render: () => (
      <Tabs defaultValue="list">
        <Segmented label="View" items={[["list", "List"], ["grid", "Grid"]]} />
      </Tabs>
    ) },
    { name: "Three views", render: () => (
      <Tabs defaultValue="week">
        <Segmented label="Range" items={[["day", "Day"], ["week", "Week"], ["month", "Month"]]} />
      </Tabs>
    ) },
  ],
  switch: [
    { name: "On", render: () => <SwitchDemo initial label="Email me a weekly summary" /> },
    { name: "Off", render: () => <SwitchDemo initial={false} label="Share with the team" /> },
  ],
  disclosure: [
    { name: "Closed", render: () => (
      <Disclosure title="Advanced options"><Hint>Keep raw files for 30 days after import.</Hint></Disclosure>
    ) },
    { name: "Open", render: () => (
      <Disclosure title="Advanced options" defaultOpen><Hint>Keep raw files for 30 days after import.</Hint></Disclosure>
    ) },
  ],
  field: [
    { name: "Empty, with hint", render: () => <FieldDemo /> },
    { name: "Error", render: () => <FieldDemo error /> },
    { name: "Disabled", render: () => <Field label="Workspace" value="Poiesis Lab" disabled readOnly /> },
  ],
  notice: [
    { name: "With action and close", render: () => <NoticeDemo /> },
    { name: "Text only", render: () => <Notice>Saved. Everyone in the project sees the change.</Notice> },
  ],
  loading: [
    { name: "Just started", render: () => <Loading>Reading the file</Loading> },
    { name: "After a while", render: () => <Loading since={started}>Reading the file</Loading> },
    { name: "Dots alone", render: () => <Dots /> },
  ],
  statusdot: [
    { name: "Four states", render: () => (
      <div className="g-row g-dots">
        <StatusDot state="active" label="Importing" />
        <StatusDot state="paused" label="Paused" />
        <StatusDot state="stopped" label="Stopped" />
        <StatusDot state="error" label="Import failed" />
      </div>
    ) },
    { name: "In a row of text", render: () => (
      <div className="g-row"><StatusDot state="active" label="Importing" live /> Supplier survey</div>
    ) },
  ],
  tip: [
    { name: "On hover or focus", render: () => (
      <Tip label="Exports the visible rows">
        <span className="pc-tip-target g-tip-target" tabIndex={0}>Hover or focus me</span>
      </Tip>
    ) },
  ],
  meter: [
    { name: "Levels", render: () => (
      <div className="g-row">
        <Meter value={1} label="Level 1 of 3" />
        <Meter value={2} label="Level 2 of 3" />
        <Meter value={3} label="Level 3 of 3" />
      </div>
    ) },
    { name: "Tones", render: () => (
      <div className="g-row">
        <Meter value={1} tone="success" label="Risk: low" />
        <Meter value={2} tone="warning" label="Risk: medium" />
        <Meter value={3} tone="danger" label="Risk: high" />
      </div>
    ) },
  ],
  progress: [
    { name: "Under way", render: () => <ProgressDemo value={0.64} /> },
    { name: "Start and end", render: () => <Stack><ProgressDemo value={0} /><ProgressDemo value={1} /></Stack> },
  ],
  tile: [
    { name: "Item", render: () => (
      <Tile>
        <div className="g-tile-head"><strong>Quarterly costs</strong><Meter value={3} tone="danger" label="Risk: high" /></div>
        <Hint>Updated 14 Oct · 3 sources</Hint>
      </Tile>
    ) },
  ],
  section: [
    { name: "Sections in a stack", render: () => (
      <Stack>
        <Section title="Reports">
          <Tile><strong>Quarterly costs</strong><Hint>Updated 14 Oct</Hint></Tile>
          <Tile><strong>Supplier survey</strong><Hint>Updated 2 Oct</Hint></Tile>
        </Section>
        <Section title="Sources">
          <Hint>Three files, last added yesterday.</Hint>
        </Section>
      </Stack>
    ) },
  ],
  hint: [
    { name: "Under a title", render: () => <div><strong>Supplier survey</strong><Hint>Updated 2 Oct · 1 source</Hint></div> },
  ],
  empty: [
    { name: "With its action", render: () => (
      <Empty action={<Button variant="primary" size="s">Import data</Button>}>No reports yet. They appear after the first import.</Empty>
    ) },
  ],
};

/** Every component at once, as a screen would use them: the overview column. */
export function Composition() {
  return (
    <>
      <Tabs defaultValue="overview">
        <TabsList label="Sections" items={[["overview", "Overview"], ["activity", "Activity"], ["settings", "Settings"]]} />
      </Tabs>
      <div className="g-row">
        <Tabs defaultValue="list"><Segmented label="View" items={[["list", "List"], ["grid", "Grid"]]} /></Tabs>
        <Toggle label="Only flagged rows" />
        <span className="g-row g-dots g-push">
          <StatusDot state="active" label="Importing" />
          <StatusDot state="paused" label="Paused" />
          <StatusDot state="stopped" label="Stopped" />
          <StatusDot state="error" label="Import failed" />
        </span>
      </div>
      <div className="g-row">
        <Button variant="primary">Save changes</Button>
        <Button>Export CSV</Button>
        <Button variant="quiet">Cancel</Button>
      </div>
      <div className="g-row">
        <Button size="s" busy>Saving…</Button>
        <Button size="s" disabled reason="Add a name first">Publish</Button>
      </div>
      <NoticeDemo />
      <Section title="Reports">
        <Tile>
          <div className="g-tile-head"><strong>Quarterly costs</strong><Meter value={3} tone="danger" label="Risk: high" /></div>
          <Hint>Updated 14 Oct · 3 sources</Hint>
        </Tile>
        <Tile>
          <div className="g-tile-head"><strong>Supplier survey</strong><Meter value={1} tone="warning" label="Risk: low" /></div>
          <Hint>Updated 2 Oct · 1 source</Hint>
        </Tile>
      </Section>
      <Loading since={started}>Reading the file</Loading>
      <ProgressDemo value={0.64} />
      <SwitchDemo initial label="Email me a weekly summary" />
      <FieldDemo error />
      <Disclosure title="Advanced options"><Hint>Keep raw files for 30 days after import.</Hint></Disclosure>
      <Empty action={<Button variant="primary" size="s">Import data</Button>}>No reports yet. They appear after the first import.</Empty>
    </>
  );
}
