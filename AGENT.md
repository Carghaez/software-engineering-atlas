# AGENT.md

Notes for AI agents (and humans) working in this repository. Read this before editing — most of
the rules below are non-obvious and have a test that fails loudly if you break them.

## What this is

The **Software Engineering Techniques Atlas** — a static, client-rendered reference of ~342
software-engineering concepts across 13 domains and 5 languages. Plain HTML + JavaScript, **no
runtime dependencies**, no backend. A small component runtime (`support.js`) renders the UI, loading
React from a CDN at runtime. Deployed on GitHub Pages.

## Invariants — do not break these

1. **`index.html` and `Atlas.dc.html` are byte-identical.** `Atlas.dc.html` is the source design;
   `index.html` is what's served. Apply every edit to both, then run `diff index.html Atlas.dc.html`
   (the parity test enforces it). Simplest: edit `index.html`, then `cp index.html Atlas.dc.html`.
2. **Never edit `support.js`.** It is generated from an out-of-repo runtime and cannot be rebuilt
   here. All app logic lives in `index.html`'s inline `<script type="text/x-dc">` component and the
   `<x-dc>` template above it.
3. **The template escapes all `{{ }}` text — there is no raw-HTML directive.** To render markup
   (e.g. syntax-highlighted code) emit **colored token spans**
   (`<span style="color:{{ tok.color }}">{{ tok.text }}</span>` — text is escaped, color rides the
   style attribute) or build React elements in the component. HTML strings in a `{{ }}` hole render
   as visible text, not markup.
4. **`componentDidUpdate` receives only `prevProps`** (no `prevState`). Track previous values
   yourself (see `_lastSelected`).
5. **Zero runtime/build dependencies.** No npm packages. Tests use Node's built-in `node --test`.
   Keep it that way.
6. **Never hand-edit `concepts.data.js`.** It is generated from the concept files (below).

## Data is the source of truth

Each concept is one folder, `concepts/<id>/`:

- `concept.json` — the metadata, validated live in-editor against `schema/concept.schema.json`
  (referenced via its `$schema` key). The `id` must equal the folder name.
- `pseudocode.txt`, `c.c`, `cpp.cpp`, `cs.cs`, `java.java`, `rust.rs` — optional code examples (any
  subset). Real files, so editors highlight them and CI can compile-check them later.

`assemble.mjs` reads every `concept.json` into the committed bundle `concepts.data.js` (sorted
alphabetically by id), which the app imports in one request. **After editing any `concept.json`, run
`npm run build`** or the drift test (`test/assemble.test.mjs`) fails.

## Commands

```
npm run build   # assemble.mjs -> concepts.data.js, then build.mjs -> static pages + sitemap + code-index.json
npm test        # node --test : data gates, build output, bundle drift, highlighter, index/Atlas parity
```

Serve over HTTP — ES modules don't load from `file://`: `python3 -m http.server 8000`. Run the build
first if you want the static pages or the in-app Code section locally (`c/`, `sitemap.xml`,
`code-index.json` are generated and git-ignored).

## Layout

```
index.html / Atlas.dc.html  App shell + template + inline component   (keep byte-identical)
support.js                  Generated runtime                          (DO NOT EDIT)
concepts/<id>/              Source of truth: concept.json + code files
schema/concept.schema.json  Data contract (live editor validation)
assemble.mjs                concept.json files -> concepts.data.js bundle
concepts.data.js            Generated, committed                        (DO NOT EDIT)
concepts.js                 Global metadata/helpers; re-exports CONCEPTS from the bundle
pages.js                    Atlas Maps infographic definitions
build.mjs                   Static per-concept SEO pages + sitemap + embedded code
lib/highlight.js            Zero-dep tokenizer shared by app + static pages
test/                       node --test suite
migrate.mjs                 One-time data/*.js -> concepts/ migration (historical record)
```

## Adding or changing content

- **New concept:** create `concepts/<id>/concept.json` (copy a sibling for shape; the editor
  validates it against the schema), then `npm run build` and `npm test`. The data gates require: a
  `type` present in `TEMPLATE_MAP` (`concepts.js`), a unique id, resolving `related`/`competing`
  ids, a `note` on any language idiomaticity score ≥ 2, ≥ 1 evidence source, complexity only on
  ds/algo/hardware types, etc.
- **Code examples:** drop real files in the concept folder. Keep them short, idiomatic, and
  correct. The highlighter (`lib/highlight.js`) is shared, so the app and static pages match.

## Quality

Match the surrounding style (inline styles, IBM Plex fonts, the existing block/handler patterns).
Prefer the smallest change that fits. Don't add dependencies or a heavier build step. Verify with
`npm test`; for UI changes also check in a real browser — the runtime needs one, and there is no
headless browser in CI.
