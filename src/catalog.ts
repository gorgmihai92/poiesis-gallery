// What each component is for and which rules it meets, read from poiesis-components' catalog.md, so a new row
// there shows up here. The gallery only adds the grouping and the demos.
import catalog from "@poiesis/catalog.md?raw";

export type Entry = { slug: string; name: string; for: string; file: string; rules: string[] };

export const entries: Entry[] = catalog
  .split("\n")
  .filter((l) => l.startsWith("|") && !l.startsWith("|---") && !l.startsWith("| Component"))
  .map((l) => l.split("|").slice(1, -1).map((c) => c.trim()))
  .map(([name, what, file, rules]) => ({
    slug: name.split(",")[0].trim().toLowerCase(),
    name,
    for: what.replace(/`/g, "").replace(/^./, (c) => c.toUpperCase()),
    file,
    rules: rules.split(",").map((r) => r.trim()),
  }));

/** How the gallery arranges them. A catalog row in no group lands in "Other". */
const GROUPS: [string, string[]][] = [
  ["Actions", ["button", "iconbutton"]],
  ["Choices", ["tabs", "segmented", "switch", "disclosure"]],
  ["Input", ["field"]],
  ["Feedback", ["notice", "loading", "statusdot", "tip"]],
  ["Data", ["meter", "progress"]],
  ["Layout", ["tile", "section", "hint", "empty"]],
];

export const groups: [string, Entry[]][] = (() => {
  const placed = new Set(GROUPS.flatMap(([, s]) => s));
  const out: [string, Entry[]][] = GROUPS.map(([g, slugs]) => [
    g,
    slugs.map((s) => entries.find((e) => e.slug === s)).filter((e): e is Entry => !!e),
  ]);
  const rest = entries.filter((e) => !placed.has(e.slug));
  if (rest.length) out.push(["Other", rest]);
  return out.filter(([, list]) => list.length);
})();
