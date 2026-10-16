# StyloftCSS

A modular CSS foundation. Zero runtime JavaScript. MIT licensed. Version 0.1.0 MVP.

Copy `dist/styloft.min.css` into your project. No install or build step is needed
to use the CSS. This repository is local and Git-ready; it has not been published
to npm, GitHub, or a hosting provider. The npm package name is metadata only.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/css/styloft.min.css">
<main class="sl-container sl-py-8 sl-stack">
  <h1>Hello, Styloft.</h1>
  <div class="sl-grid sl-md:cols-3 sl-gap-6">
    <article class="sl-card sl-stack">
      <h2 class="sl-text-xl">Make room for your idea</h2>
      <p>One column on small screens. Three from 48rem.</p>
      <a class="sl-btn" href="/guide">Read the guide</a>
    </article>
  </div>
</main>
```

Open [the showcase](examples/index.html) or [minimal starter](examples/starter.html)
directly in a browser. Both work as static files. The showcase's inline CSS belongs
to the example, not to the measured framework core.

## Design tokens and themes

Load your stylesheet after StyloftCSS. Unlayered application styles override normal
framework rules. Override semantic tokens to reskin every component:

```css
:root {
  --sl-accent: #075985;
  --sl-accent-hover: #0c4a6e;
  --sl-on-accent: #fff;
  --sl-focus: #075985;
  --sl-radius: .4rem;
  --sl-container: 80rem;
}
```

Available tokens: spacing `--sl-space-{0,1,2,3,4,6,8,12,16}`; typography
`--sl-text-{sm,base,lg,xl,2xl,3xl}`, `--sl-font`, `--sl-mono`; geometry
`--sl-radius`, `--sl-radius-lg`, `--sl-measure`, `--sl-container`, `--sl-shadow`;
colors `--sl-{bg,surface,text,muted,border,accent,on-accent,accent-hover,soft,danger,success,focus}`.
Sizes lg through 3xl use bounded fluid `clamp()` expressions. Root font size is
not fixed, preserving user font preferences. Headings can use text-size utilities.

Without an explicit root theme, the OS preference selects light/dark. Set
`<html data-theme="light">` or `data-theme="dark"` to force one. A theme can also
scope an individual subtree. Nested explicit themes override their parent palette.
For theme-specific customization use `[data-theme="dark"] { --sl-accent: ...; }`.
Retest contrast for every customized foreground/background combination.

## Layout and utility reference

| Class | Purpose |
| --- | --- |
| `sl-container` | Centered, max-width container with 1rem gutters |
| `sl-stack` | Vertical sibling spacing using `--sl-gap` |
| `sl-cluster` | Wrapping flex row, centered cross-axis alignment |
| `sl-grid` + `sl-cols-1` … `sl-cols-12` | Equal-width grid columns |
| `sl-auto-grid` | Auto-fit cards, default minimum 16rem |
| `sl-flex`, `sl-row`, `sl-column`, `sl-wrap`, `sl-grow` | Flex composition |
| `sl-sidebar` | Wrapping first-child sidebar / last-child content pair |
| `sl-gap-{n}` | Sets both CSS gap and the inherited stack/layout gap token |
| `sl-p-{n}`, `sl-px-{n}`, `sl-py-{n}` | Padding, logical inline/block padding |
| `sl-m-{n}`, `sl-mx-{n}`, `sl-my-{n}` | Margin, logical inline/block margin |
| `sl-items-center`, `sl-items-start` | Cross-axis alignment |
| `sl-justify-center`, `sl-justify-between` | Main-axis alignment |
| `sl-w-full`, `sl-mx-auto`, `sl-measure` | Width and readable measure |
| `sl-block`, `sl-hidden`, `sl-flex`, `sl-grid` | Display |
| `sl-text-sm`, `sl-text-lg`, `sl-text-xl`, `sl-bold` | Type size and weight |
| `sl-text-start`, `sl-text-center` | Logical text alignment |
| `sl-text-muted`, `sl-text-danger`, `sl-text-success` | Semantic foreground colors |
| `sl-surface`, `sl-rounded`, `sl-shadow` | Surface decoration |
| `sl-sr-only` | Visually hidden, available to assistive technology |

Spacing values: 0, .25, .5, .75, 1, 1.5, 2, 3, 4rem for n =
0, 1, 2, 3, 4, 6, 8, 12, 16 respectively. Logical spacing supports RTL.
`sl-stack`'s sibling margins and a child's margin utilities can override each other;
prefer one spacing strategy per container. Gap tokens inherit to nested layouts;
set a new `sl-gap-*` on a nested layout to change its rhythm.

Responsive variants are deliberately limited to `cols-1` … `cols-12`, `block`,
`hidden`, `flex`, `grid`, `row`, and `column`. Prefix with `sl-sm:`, `sl-md:`, or
`sl-lg:` (40, 48, 64rem minimum widths). Example: `sl-hidden sl-md:block`.
Use a class name's literal colon in HTML; CSS source escapes it. Breakpoints use
media-query rem units, which follow the browser's initial font size; changing
`html` font-size is not a breakpoint configuration mechanism.

## Components and accessible markup

Use links for navigation and buttons for actions. `sl-btn--outline` modifies
`sl-btn`; use the native `disabled` attribute on buttons. Avoid disabled links:
CSS cannot suppress their activation or remove them from the tab order.

`sl-card`, `sl-badge`, and `sl-alert` provide presentation only. An alert included
in the initial document is usually ordinary text. Dynamically inserted urgent
messages may need `role="alert"`; nonurgent updates may need `role="status"`.
Do not add live regions indiscriminately.

```html
<div class="sl-field">
  <label class="sl-label" for="email">Email</label>
  <input class="sl-input" id="email" name="email" type="email"
         autocomplete="email" aria-describedby="email-error" aria-invalid="true">
  <p class="sl-error" id="email-error">Enter a valid email address.</p>
</div>
<label class="sl-check"><input type="checkbox" name="terms"> Accept the terms</label>
<details class="sl-details">
  <summary>Shipping information</summary>
  <p>Ships within three business days.</p>
</details>
```

Apply `sl-input` to native text inputs, select, or textarea; use `sl-help` for
associated helper text. Errors need visible text as well as color. The author
sets or clears `aria-invalid` after validation. Do not hide native summary markers.
`sl-skip sl-btn` on a link to your main element supplies a keyboard skip link.
Use `tabindex="-1"` on the target. Do not visually reorder meaningful reading order.

## Optional modules

Load after the core, independently:

```html
<link rel="stylesheet" href="/css/prose.min.css">
<link rel="stylesheet" href="/css/tables.min.css">
<article class="sl-prose"><h2>A longer read</h2><p>Text goes here.</p></article>
<div class="sl-table-wrap" role="region" aria-label="Prices" tabindex="0">
  <table class="sl-table">
    <caption>Monthly prices</caption>
    <thead><tr><th scope="col">Plan</th><th scope="col">Price</th></tr></thead>
    <tbody><tr><th scope="row">Starter</th><td>Free</td></tr></tbody>
  </table>
</div>
```

Modules require core tokens. When hand-selecting `src/` files, put the full layer
order statement from `docs/architecture.md` before any rules and include tokens.
Reset/base affect the document globally; this is not a shadow-DOM scoped reset.

## Development and verification

Node 20+ is development tooling only. The build and structural tests need no npm
installation or third-party libraries:

```sh
npm run build
npm test
# Optional development dependency for browser tests:
npm install
npx playwright install chromium
npm run test:browser
```

On Windows the browser suite defaults to installed Microsoft Edge; elsewhere it
uses Playwright Chromium. Set `BROWSER_PATH` to use a specific Chromium executable.
The browser runner serves only the repository over an ephemeral loopback port and
closes its server/browser on success or failure. `docs/preview.png` is generated
from the showcase; the detailed browser report is ignored in `test-results/`.

`dist/size-report.json` records actual UTF-8 and gzip level-9 byte counts for every
artifact. Core must be **below 10,000 gzip bytes**. Server compression settings
may produce different transfer sizes. The budget excludes examples, docs and
optional modules. `npm test` also rejects stale distribution files, checks token
references, module separation, no-runtime assets, and fixed-palette AA contrast.

See [architecture](docs/architecture.md), [validation](docs/validation.md), and
[contribution guidelines](CONTRIBUTING.md). Browser feature targets are documented
separately from tested engines; this MVP is not a WCAG conformance certification.
