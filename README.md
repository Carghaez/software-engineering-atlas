# Software Engineering Atlas

An interactive, self-auditing reference map of software-engineering concepts — data structures, algorithms, paradigms, type systems, concurrency, hardware execution, memory, reliability, architecture, testing, security and observability — across **13 domains** and **5 systems languages** (C, C++, C#, Java, Rust).

Each concept card captures what problem it solves, how it works, its benefits and limits, common failure modes, myths, complexity, related/competing concepts, and a per-language support level (native / std-lib / ecosystem / encodable / awkward / unsuitable).

## Views

- **Explorer** — browse and search every concept, filtered by domain.
- **Relationship Map** — cross-domain chains showing how concepts compose (e.g. functional core → fearless concurrency).
- **Language Heatmap** — per-concept support across the five languages.
- **Atlas Maps** — curated infographic pages (paradigm family tree, FP & monad map, concurrency comparison, data-layout guide, design-patterns catalogue, and more), plus a live coverage/QA audit that runs over the data on load.

## Running locally

This is a static site, but it loads its data as ES modules, so it must be served over HTTP — opening `index.html` directly from the filesystem (`file://`) will not work.

```bash
# from the project root
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static file server works.

## SEO: static concept pages

The interactive app is client-rendered, so search engines can't index individual concepts from it. To make each concept findable on Google, [`build.mjs`](./build.mjs) pre-renders **one static HTML page per concept** (with real text, metadata and JSON-LD) from the same data the app uses. It generates:

- `c/<id>/index.html` — a crawlable page per concept (e.g. `/c/hash-table/`), linking into the interactive app at `/?c=<id>`.
- `c/index.html` — a glossary hub listing every concept.
- `sitemap.xml` — home + glossary + every concept page.

**This output is generated at deploy time, not committed.** The source of truth is `data/*.js` (content) + `build.mjs` (template). [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) runs `build.mjs` and publishes the result on every push to `main`, so changing a concept or the page template needs **no manual rebuild step** — just push. (`c/` and `sitemap.xml` are git-ignored for this reason.)

> **Prerequisite:** the repo's Pages source must be set to **"GitHub Actions"** (Settings → Pages), not "Deploy from a branch" — otherwise only committed files are served and the generated pages won't appear.

Run the build yourself only to **preview locally**:

```bash
node build.mjs                                  # or: npm run build
BASE_URL=https://example.com node build.mjs     # override the production origin
```

The interactive app also supports **deep links** — opening a concept updates the URL to `?c=<id>`, so concepts are shareable and bookmarkable.

## Tests & CI

The data and build output are covered by a small test suite using Node's built-in runner — **no dependencies**:

```bash
node --test        # or: npm test
```

- [`test/data.test.mjs`](./test/data.test.mjs) — data-integrity gates (unique ids, valid types, related/competing & chip references resolve, idiomaticity notes, every concept cited, …) — the CI counterpart of the app's live QA audit.
- [`test/build.test.mjs`](./test/build.test.mjs) — `build.mjs` output: required SEO tags, parseable JSON-LD, and a complete sitemap.
- [`test/code.test.mjs`](./test/code.test.mjs) — keeps code coverage honest: a snippet may exist for a language only where the concept is idiomatic (`concept.json` `langs[L].id >= 2`).
- [`test/parity.test.mjs`](./test/parity.test.mjs) — guards that `index.html` and `Atlas.dc.html` stay byte-identical.

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs the suite on every push and pull request; the Pages deploy ([`pages.yml`](./.github/workflows/pages.yml)) runs the tests first, so broken data never ships.

### Code-example verification

The per-language code examples under `concepts/<id>/` are not just compiled — they're **compiled and run**, so only correct, self-verifying code merges. [`verify-code.mjs`](./verify-code.mjs) builds and executes every snippet for one language and checks the **exit code** (each snippet asserts and aborts non-zero on failure):

```bash
node verify-code.mjs cs      # or: c | cpp | java | rust
```

[`.github/workflows/code-verify.yml`](./.github/workflows/code-verify.yml) runs this as a **per-language matrix** (each job installs only its own toolchain) on pushes/PRs that touch `concepts/**`. These compilers/runtimes (`gcc`, `g++`, `rustc`, `javac`/`java`, `dotnet`) are **CI-only** and do **not** change the app's zero-runtime-dependency stance — the deployed site stays static HTML + JS with no backend.

## Concept data (source of truth)

Each concept is **one folder**, `concepts/<id>/`, holding its metadata and any code examples together:

```
concepts/dynamic-array/
  concept.json      Metadata — validated live in your editor against schema/concept.schema.json
  pseudocode.txt    Optional code examples (any subset of the languages)
  rust.rs
  c.c  cpp.cpp  cs.cs  java.java
```

To **edit a concept**, edit its `concept.json` (the `"$schema"` reference makes VS Code validate it as you type), then rebuild:

```bash
npm run build     # = node assemble.mjs && node build.mjs
```

`assemble.mjs` reads every `concepts/<id>/concept.json` into the committed bundle `concepts.data.js`, which `concepts.js` imports (the app needs all concepts in one request, so it can't fetch 342 files). The bundle is committed so the site runs with no build; a CI **drift test** ([`test/assemble.test.mjs`](./test/assemble.test.mjs)) fails if it ever falls out of sync with the JSON. **Don't hand-edit `concepts.data.js`** — it's generated.

> The data migrated here from an earlier `data/*.js` layout via [`migrate.mjs`](./migrate.mjs) (kept as a record).

## How it's built

- Plain HTML + JavaScript — no backend, no API keys, no runtime dependencies.
- The UI renders through a lightweight component runtime ([`support.js`](./support.js)) that loads React from a public CDN at runtime, so the live page needs network access on first load.

> **Editing note:** `index.html` and `Atlas.dc.html` are kept **byte-identical** (`Atlas.dc.html` is the source design, `index.html` the served copy). Apply every edit to both, then verify with `diff index.html Atlas.dc.html`. `support.js` is generated and must not be hand-edited.

## Project structure

```
index.html        Entry point (served by GitHub Pages)
Atlas.dc.html     Source design (kept byte-identical to index.html)
support.js        Component runtime
concepts/         Source of truth: one folder per concept (concept.json + code files)
schema/           concept.schema.json — the data contract (live editor validation)
assemble.mjs      Builds concepts.data.js from concepts/<id>/concept.json
concepts.data.js  Generated, committed: the bundle the app imports (do not edit)
concepts.js       Global metadata/helpers; re-exports CONCEPTS from the bundle
pages.js          Atlas Maps infographic definitions
build.mjs         Generates static per-concept SEO pages + sitemap (+ embeds code)
verify-code.mjs   Compiles AND runs every code snippet for one language (CI gate)
lib/highlight.js  Zero-dep syntax tokenizer (shared by app + static pages)
robots.txt        Points crawlers at the sitemap
test/             Test suite (node --test)
.github/workflows/
  ci.yml          Runs tests on every push / PR
  code-verify.yml Compiles + runs code snippets (per-language matrix, CI-only toolchains)
  pages.yml       Assembles + builds + deploys to GitHub Pages

# generated at deploy time, git-ignored (not in the repo):
c/                Static concept pages + glossary
sitemap.xml       All crawlable URLs
code-index.json   Which concepts/languages have code (the SPA fetches this)
```

## Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** to run it locally and add concepts or code, and
**[AGENT.md](./AGENT.md)** for the architecture invariants (useful for both humans and AI agents).

## License

- **Code** (everything that runs the app) — [MIT](./LICENSE).
- **Content** (the concept data in `concepts/`, `pages.js`) — [CC BY 4.0](./CONTENT-LICENSE.md). Reuse it freely with attribution.
