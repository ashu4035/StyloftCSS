# Contributing

Edit handwritten styles in `src/`; edit utility/breakpoint lists in
`scripts/build.cjs`. Run `npm run build`, `npm test`, and `npm run test:browser`.
Commit source and regenerated distribution files together. Keep gzip below
10,000 bytes; add less common patterns as optional modules.

Use semantic HTML examples and logical CSS properties. Do not add runtime scripts,
external network imports, hidden-checkbox widget simulations, or blanket outline
removal. Add behavior regressions for cascade, theme, responsive, and accessibility
changes. Manually review keyboard flow, browser zoom, screen-reader output, and
Safari/Firefox before a stable release. Open a PR with the problem, change and
validation results. Package metadata is private until a maintainer opts to publish.
