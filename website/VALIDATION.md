# Current validation — 21 October 2026

Astro 7.4.0, Node 22.22.2, Playwright 1.62.1 and Edge 155.0.4283.62 on Windows.

All 6 framework structural tests, the core browser suite and 27 website browser groups pass. All 96 documentation pages render and reflow at 320, 375, 768 and 1440 pixels. The catalog has 168 examples across 40 categories; the guides add a responsive tutorial demo. Search includes those categories and 349 real CSS classes.

The additional expansion suite passes search filtering, empty results, reset/focus, download/GitHub/playground event generation, archive SHA-256 and responsive guides. axe-core scans report zero violations on 10 representative pages after light-theme contrast corrections; incomplete checks and screen-reader review remain human tasks. The code editor has a forced-colors native text fallback. ZIP CRC integrity and example class existence were also checked.

SEO checks cover 47 canonical URLs across both sitemap formats, metadata on all pages, local WOFF2 assets and the approved Analytics tag. Google verification files remain unchanged. Browser tests suppress Analytics requests. Framework distributions remain CSS-only.

Core: 12,544 raw / 3,313 gzip bytes. Largest production page CSS: 10,702 gzip bytes (gzip level 9); optional styles and fonts are outside the core budget. Archive version 0.1.0 is a local release candidate, not an npm or GitHub publication.

Reproduce: npm test; npm run test:browser; npm run site:build; npm run site:test; npm run site:test:expansion. See docs/accessibility.md, docs/analytics.md and docs/improvements.md for boundaries and follow-up.
