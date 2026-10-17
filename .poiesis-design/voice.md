# Voice

How the product speaks, at `.poiesis-design/voice.md`, used by the `copy` skill and checked by
`poiesis-copy:copy-reviewer`. Rules: the `copy` skill's `rules.md`; decisions here override them, except the
Claims rules (Q).

## Reader
Designers and developers looking at the Poiesis components and theme before using them, and George checking his
own system. They know interfaces and design tokens; they come to see how each component looks and behaves, which
token does what, and where to get it. Their words: component, state, variant, token, theme.

## Languages
- English only.
- Romanian address: not used yet.

## Traits
- **Plain, not promotional.** Say what a thing is and does; no selling.
- **Exact, not approximate.** Names and values as the code has them; the page reads values from the theme.
- **Quiet, not loud.** One call to action (Get); everything else informs.

## Glossary
| Idea | English | Romanian | Not |
|---|---|---|---|
| A value a theme sets | atom | | setting, variable |
| A value derived from atoms | cell, token | | variable |
| A set of layers and atoms | theme | | skin |
| A status color | role | | tone (except on Meter, where `tone` is the prop) |
| How a component looks in a situation | state | | mode |
| One part of the page | section | | block, chapter |
| Spelling | color, behavior (US) | | colour, behaviour |

## Avoid
Hype (powerful, beautiful, seamless, magic), "simply", "just", and filler text in demos ("Lorem ipsum",
"… content.").

## Tone
- **Demos:** realistic product copy that itself follows the copy rules, since the gallery shows good practice.
- **Errors and failure (in demos):** plain, calm, says what to do (M1).
- **Descriptions:** one sentence, what the component is for.

## Inspiration
None chosen yet.

## Decisions
- B1, B2 · The call to action is "Get" alone (George, 2026-10-17): short and the only action on the page; the
  description line above it says what Poiesis is, and it links to the poiesis-design repository.

## To confirm
- The reader (designers and developers) and US spelling were guessed from the code.
