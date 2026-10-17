// The gallery: a list of components by group on the left, the chosen one on the right in every state and in
// each style. Preset and theme apply to the whole page; the style can be one or all four side by side.
import { useEffect, useState } from "react";
import type * as React from "react";
import { Segmented, Tabs } from "@poiesis/library/tabs.js";
import { Hint } from "@poiesis/library/layout.js";
import { type Entry, entries, groups } from "./catalog.ts";
import { Composition, demos } from "./demos.tsx";

const PRESETS = ["tool", "reading", "expressive"] as const;
const THEMES = ["system", "light", "dark"] as const;
const STYLES = [
  ["quiet", "Square, no lines, no shadows. Selected is inverted."],
  ["soft", "Rounded, no lines, gentle shadows. Selected is tinted."],
  ["crisp", "Small corners, thin lines, flat. Selected is tinted."],
  ["bold", "Round, strong lines, raised. Selected is inverted."],
] as const;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** A setting kept between visits in this browser; works without storage too. */
function useSaved<T extends string>(key: string, initial: T, allowed: readonly string[]) {
  const [value, setValue] = useState<T>(() => {
    try {
      const v = localStorage.getItem(`gallery.${key}`);
      return v && allowed.includes(v) ? (v as T) : initial;
    } catch {
      return initial;
    }
  });
  const set = (v: T) => {
    setValue(v);
    try {
      localStorage.setItem(`gallery.${key}`, v);
    } catch {}
  };
  return [value, set] as const;
}

function useRoute() {
  const read = () => decodeURIComponent(location.hash.replace(/^#\/?/, "")) || "overview";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      setRoute(read());
      document.querySelector(".g-main")?.scrollTo(0, 0);
    };
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return route;
}

function Choice<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="g-control">
      <span className="g-control__label">{label}</span>
      <Tabs value={value} onValueChange={(v) => onChange(v as T)}>
        <Segmented label={label} items={options.map((o) => [o, cap(o)])} />
      </Tabs>
    </div>
  );
}

/** One style's column: the attributes that scope the cells to it. */
function Stage({ style, children, head }: { style: string; children: React.ReactNode; head?: React.ReactNode }) {
  return (
    <div className="g-stage" data-atoms data-style={style}>
      {head}
      {children}
    </div>
  );
}

function ComponentPage({ entry, styles }: { entry: Entry; styles: readonly (typeof STYLES)[number][] }) {
  const list = demos[entry.slug];
  return (
    <article className="g-page">
      <header className="g-intro">
        <h1>{entry.name}</h1>
        <p>{entry.for}</p>
        <p className="g-meta">
          <code>{entry.file}</code>
          <span className="g-rules">{entry.rules.map((r) => <span key={r} className="g-rule">{r}</span>)}</span>
        </p>
      </header>
      {list ? (
        list.map((d) => (
          <section key={d.name} className="g-state">
            <h2 className="g-state__name">{d.name}</h2>
            <div className="g-stages" data-count={styles.length}>
              {styles.map(([s]) => (
                <Stage key={s} style={s} head={styles.length > 1 && <span className="g-stage__tag">{s}</span>}>
                  {d.render()}
                </Stage>
              ))}
            </div>
          </section>
        ))
      ) : (
        <Hint>No demo yet. It is in the catalog; add its states to src/demos.tsx.</Hint>
      )}
    </article>
  );
}

function Overview({ styles }: { styles: readonly (typeof STYLES)[number][] }) {
  return (
    <article className="g-page">
      <header className="g-intro">
        <h1>All components</h1>
        <p>
          The same components in each style. The style sets corners, lines, shadows and how a selected thing looks;
          the preset sets type and density. They only use the cells from poiesis-ui, so every one follows.
        </p>
      </header>
      <div className="g-stages" data-count={styles.length}>
        {styles.map(([s, about]) => (
          <Stage key={s} style={s} head={<header className="g-stage__head"><h2>{s}</h2><Hint>{about}</Hint></header>}>
            <Composition />
          </Stage>
        ))}
      </div>
    </article>
  );
}

export function App() {
  const route = useRoute();
  const [preset, setPreset] = useSaved<(typeof PRESETS)[number]>("preset", "tool", PRESETS);
  const [theme, setTheme] = useSaved<(typeof THEMES)[number]>("theme", "system", THEMES);
  const [style, setStyle] = useSaved<"all" | (typeof STYLES)[number][0]>("style", "all", ["all", ...STYLES.map(([s]) => s)]);
  const [menu, setMenu] = useState(false);

  // On <html>, so tooltips (rendered at the end of <body>) take the preset and theme too.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.preset = preset;
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
  }, [preset, theme]);
  useEffect(() => setMenu(false), [route]);

  const styles = style === "all" ? STYLES : STYLES.filter(([s]) => s === style);
  const entry = entries.find((e) => e.slug === route);

  return (
    <div className="g-shell" data-atoms data-preset="tool" data-style="quiet">
      <header className="g-bar">
        <button type="button" className="g-menu pc-button" data-variant="secondary" data-size="s" aria-expanded={menu} aria-controls="g-nav" onClick={() => setMenu(!menu)}>
          Components
        </button>
        <a className="g-brand" href="#/">Poiesis Gallery</a>
        <div className="g-controls">
          <Choice label="Preset" value={preset} options={PRESETS} onChange={setPreset} />
          <Choice label="Theme" value={theme} options={THEMES} onChange={setTheme} />
          <Choice label="Style" value={style} options={["all", ...STYLES.map(([s]) => s)] as const} onChange={setStyle} />
        </div>
      </header>
      <nav id="g-nav" className="g-nav" data-open={menu} aria-label="Components">
        <a href="#/" aria-current={route === "overview" ? "page" : undefined}>All components</a>
        {groups.map(([group, list]) => (
          <div key={group} className="g-group">
            <span className="g-group__name">{group}</span>
            {list.map((e) => (
              <a key={e.slug} href={`#/${e.slug}`} aria-current={route === e.slug ? "page" : undefined}>
                {e.name}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <main className="g-main">
        <div data-atoms data-preset={preset} className="g-content">
          {entry ? <ComponentPage entry={entry} styles={styles} /> : <Overview styles={styles} />}
        </div>
      </main>
    </div>
  );
}
