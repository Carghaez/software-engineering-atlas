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

## How it's built

- Plain HTML + JavaScript — **no backend, no build step, no API keys.**
- Concept data lives as ES modules in [`data/`](./data); [`concepts.js`](./concepts.js) and [`pages.js`](./pages.js) assemble it.
- The UI renders through a lightweight component runtime ([`support.js`](./support.js)) that loads React from a public CDN at runtime, so the live page needs network access on first load.

## Project structure

```
index.html        Entry point (served by GitHub Pages)
Atlas.dc.html     Source design (same content; index.html is generated from it)
support.js        Component runtime
concepts.js       Domain/level metadata + assembles all concept data
pages.js          Atlas Maps infographic definitions
data/             Concept cards, split by domain group (a.js … e4.js)
```

## License

- **Code** (everything that runs the app) — [MIT](./LICENSE).
- **Content** (the concept data in `data/`, `concepts.js`, `pages.js`) — [CC BY 4.0](./CONTENT-LICENSE.md). Reuse it freely with attribution.
