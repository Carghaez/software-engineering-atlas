# Contributing

Thanks for helping improve the **Software Engineering Techniques Atlas**! It's a static site with no
backend and no runtime dependencies — only Node's built-ins for the build and tests.

## Prerequisites

- **Node.js 18+** (for `npm run build` and `npm test`; uses only built-in modules)
- Any static file server (the app loads ES modules, so it must be served over HTTP)

## Run it locally

```bash
npm run build                  # generate the data bundle + static pages
python3 -m http.server 8000    # or any static server
# open http://localhost:8000
```

Opening `index.html` directly from disk (`file://`) won't work — ES modules need HTTP.

## Tests

```bash
npm test    # node --test
```

All tests must pass before a PR. They check data integrity, build output, drift between the concept
files and the generated bundle, the syntax highlighter, and that `index.html` and `Atlas.dc.html`
stay byte-identical.

## Editing content

Concepts live in `concepts/<id>/`:

- Edit **`concepts/<id>/concept.json`** — your editor validates it live against
  `schema/concept.schema.json` (via the file's `$schema` key).
- Add **code examples** by dropping real files in the same folder: `pseudocode.txt`, `rust.rs`,
  `cpp.cpp`, `c.c`, `cs.cs`, `java.java` (any subset). Keep snippets short, idiomatic, and correct.
  Two rules CI enforces: add a runnable file for a language **only where the concept is idiomatic**
  in it (`concept.json` `langs[L].id >= 2`), and make each one a complete, std-lib-only program with
  a `main` and **at least one assertion** that aborts non-zero on failure — `code-verify.yml`
  compiles *and runs* every snippet. Check one locally with `node verify-code.mjs <lang>`
  (`pseudocode.txt` is language-agnostic and is never compiled).
- To add a **new concept**, create `concepts/<new-id>/concept.json` (use an existing one as a
  template; the `id` must equal the folder name).
- Then run `npm run build` to refresh the generated bundle and `npm test`.

## Two rules that are easy to trip on

1. **`index.html` and `Atlas.dc.html` must stay byte-identical.** If you change one, copy it to the
   other: `cp index.html Atlas.dc.html`. A test enforces this.
2. **Don't edit generated files:** `support.js` (the runtime) and `concepts.data.js` (the data
   bundle — it's rebuilt by `npm run build`).

For the deeper architecture and the reasons behind these rules, see **[AGENT.md](./AGENT.md)**.

## Pull requests

- Keep changes focused and match the existing code style.
- Run `npm test`, and for UI changes verify in a browser.
- Briefly describe what changed and why.

## License

By contributing, you agree your contributions are licensed under the repository's terms: **code**
under [MIT](./LICENSE), and **content** (the concept data in `concepts/`) under
[CC BY 4.0](./CONTENT-LICENSE.md).
