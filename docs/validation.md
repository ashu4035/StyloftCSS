# Current validation — 16 October 2026

Astro 7.4.0, Node 22.22.2, Playwright 1.62.1, Edge 155.0.4283.45 on Windows.

The catalog contains 168 examples across 40 categories, with 92 static pages in dark and light modes. All 6 framework structural checks and 27 website browser check groups pass. All local links and assets resolve.

The 72-name HeroUI reference index resolves every entry to an example. New controls were tested with JavaScript disabled: dialog opening/closing and focus return, popovers, selection controls, date inputs, swatches, numeric validation and reduced-motion loading states. Every public route reflows without horizontal overflow at 320, 375, 768 and 1440 pixels. Existing playground, tabs, header, accordion and animation regressions pass.

## Measured sizes

Gzip level 9, decimal bytes: core `styloft.min.css` is 12,544 raw / 3,313 gzip bytes. Largest production page stylesheet is 9,961 gzip bytes. Optional modules and standalone packs have independent measurements in `dist/size-report.json`; they are excluded from the core budget.

## Scope

Framework distributions are CSS-only. The documentation playground uses its approved script; it does not become a component dependency. Native HTML interactions depend on browser support, including dialog invoker commands, popovers and newer CSS transitions. Advanced application behavior is explicitly identified in `docs/component-reference.md`. Validation was performed in Chromium; cross-browser and assistive-technology review remains recommended before production use.

## Reproduce

```sh
npm ci
npm --prefix website ci
npm test
npm run site:build
npm run site:test
```
