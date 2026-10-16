# Validation record

Validated on 16 October 2026 with Node.js development tooling and Microsoft Edge
155.0.4283.45 (Chromium) on Windows. The CSS and examples ship no scripts.

## Measured distribution sizes

Gzip level 9, deterministic header, decimal bytes. Measured from actual artifacts.

| Artifact | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| Core, readable | 13,808 | 3,330 |
| Core, compact | 12,204 | **3,189** |
| Prose, compact | 559 | 313 |
| Tables, compact | 486 | 302 |

The core budget is strictly below 10,000 gzip bytes. Optional modules and example
styles are excluded. See `dist/size-report.json` for machine-readable measurements.

## Automated checks

`npm test`: all **5 tests pass**. Checks cover stale artifacts, actual gzip budget,
self-contained CSS and script-free examples, module boundaries, responsive variants,
token references, and AA contrast of default text/semantic color pairs (4.5:1) plus
input borders (3:1). Contrast tests cover default palette combinations, not every
possible consumer composition or custom theme.

Browser suite: all **13 checks pass**:

1. Example styles load, with no script elements or browser errors.
2. Keyboard skip link becomes visible and moves focus to main.
3. Native disclosure opens/closes with Enter.
4. Correct grid columns and no document overflow at 320, 375, 640, 767, 768, 1024 and 1440px.
5. Explicit light/dark scopes override OS preference; automatic root theme follows it.
6. Fluid headings scale between bounds.
7. RTL and doubled root font size do not cause document overflow.
8. Utilities override component defaults; hidden attribute stays authoritative.
9. All three breakpoint boundaries respect cascade order.
10. Nested grids start independently at one column.
11. Reduced-motion settings shorten motion; forced colors retain solid button borders.
12. Readable and compact core produce the same tested grid layout.
13. Optional prose module styles the minimal starter.

Desktop and mobile screenshots were visually reviewed. Reproduce with
`npm run build`, `npm test`, and `npm run test:browser`. On Windows PowerShell with
restricted script execution, invoke `npm.cmd` instead of `npm`.

## Remaining manual release checks

Firefox and Safari have not been run. Browser zoom was not tested: doubling the
root font size is a separate reflow check. Screen-reader testing, real OS high
contrast mode, touch-device use, and full WCAG auditing remain manual release tasks.
The feature baseline in the architecture document is a target, not a verified
cross-browser compatibility certification. CI is configured but has not run remotely.

This repository is local. It has not been published or deployed. Its existing
Git metadata was preserved when moving to `D:\sites\StyloftCSS`.
