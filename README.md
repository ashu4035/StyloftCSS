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

## Astro documentation website

The complete demo website is in `website/`: a landing page, getting-started guide,
19 component categories with 107 live previews and matching HTML, layout patterns,
and a theme/token gallery. It uses StyloftCSS plus a documented brand/demo extension
stylesheet, with no Bootstrap, Tailwind, or runtime JavaScript.

Requires Node 22.22.0+ for Astro (the CSS package's development build needs Node 20+).
Install website tooling once with `cd website` then `npm ci`; return to the root.

- `npm run site:dev`: local Astro development server.
- `npm run site:build`: rebuild the CSS and generate `website/dist/`.
- `npm run site:preview`: preview the built site.
- `npm run site:test`: test built pages and browser behavior (root Playwright required).

See `website/README.md` for source structure and deployment notes. Production hosting
uses `website/dist/`; root `dist/` remains the CSS framework package.

### Responsive table records

The optional tables module supports sl-table--responsive. Below 40rem it stacks
each record into a labelled card; desktop keeps the original table. Use explicit
table roles when changing table display, retain header scopes, and add visible
mobile labels hidden from assistive technology to avoid duplicate announcements:

~~~html
<table class="sl-table sl-table--responsive" role="table">
  <caption>Projects</caption>
  <thead role="rowgroup"><tr role="row">
    <th scope="col" role="columnheader">Project</th>
    <th scope="col" role="columnheader">Owner</th>
  </tr></thead>
  <tbody role="rowgroup"><tr role="row">
    <th scope="row" role="rowheader">Studio notebook</th>
    <td role="cell"><span class="sl-table-label" aria-hidden="true">Owner</span><span>Alex</span></td>
  </tr></tbody>
</table>
~~~

Keep a labelled sl-table-wrap around wider tables. Without the responsive
modifier, the original horizontal scroll behavior is preserved.

## Expanded variants, responsive module and motion

Load optional stylesheets after the core. The core remains self-contained; no
optional module is automatically included in its size measurement.

| File | Public patterns |
| --- | --- |
| variants.min.css | sl-btn--sm/md/lg/fill/outline/ghost/soft/pill/icon, sl-nav, sl-footer, card modifiers, sl-link |
| responsive.min.css | sl-down-1200:*, sl-down-1023:*, sl-down-991:*, sl-down-767:* |
| motion.min.css | sl-hover-lift/tilt/glow/zoom/fill/sheen, sl-link--underline, sl-reveal/-left/-scale/-text, sl-split, sl-stagger, sl-scene |

Pixel breakpoints are **inclusive max-width** queries, ordered 1200, 1023, 991,
767px. Each offers cols-1 through cols-4, column, hidden and block. Existing
sm/md/lg minimum-width utilities remain unchanged. Example:

~~~html
<div class="sl-grid sl-cols-4 sl-down-1200:cols-3 sl-down-1023:cols-2 sl-down-991:cols-1 sl-down-767:cols-1">
  ...
</div>
~~~

Native exclusive accordions share a details name; multiple-open accordions omit
name. Omit open for initially closed items. Unrelated groups need unique names.
The native pattern allows zero open items and does not enforce an always-open
answer. Unsupported older browsers retain independent disclosures.

Motion primitives are CSS-only progressive enhancement, not a GSAP scripting API.
They provide scroll-linked reveals, stagger, masked headings, sticky scenes and
bounded parallax. Use --sl-i on staggered children. Split text must be marked up
at build time: use sl-word / sl-char spans, hide decorative fragments with
aria-hidden and give the heading one complete accessible name. No runtime splitter
or animation library ships. Reduced-motion users and unsupported browsers get
static readable content. Hover effects also support keyboard focus; use links or
buttons inside interactive cards. Compact button size is 36px high; medium and
large are 44px and 52px respectively.

## Sliders and signature button effects

Two additional opt-in modules load after the core:

- slider.min.css: sl-slider, sl-slider__track, sl-slide, sl-slider__nav,
  sl-slider--cards, sl-slider--vertical, and sl-range.
- button-fx.min.css: sl-fx-doors/orbit/swap/runway/spotlight/diagonal/depth/frame.

The signature gallery is first on /components/buttons/ and directly reachable at
/components/buttons/#signature-buttons. Hover or keyboard-focus each button;
these are interaction effects, not automatically playing demos. The orbit border
rotates only while hovered/focused; all eight treatments have static reduced-motion
states. They use explicit transitions and typed custom properties, with no runtime
JavaScript. A text-swap button needs the documented sl-fx-label wrapper with two
aria-hidden visual spans and a single complete aria-label on the button.

Sliders are documented at /components/sliders/. The five examples cover a featured
carousel, responsive card rail, illustrative quotes, vertical chapters, and native
range inputs. Carousels use scroll snapping, a focusable labelled track, and real
fragment links for navigation. They support touch scrolling, keyboard arrow keys,
and numbered/Previous/Next navigation. They do not autoplay or claim live active-slide
announcements. Reuse unique slide IDs per carousel. Range input values and business
actions belong to the consuming application.

~~~html
<link rel="stylesheet" href="styloft.min.css">
<link rel="stylesheet" href="slider.min.css">
<link rel="stylesheet" href="button-fx.min.css">

<button class="sl-btn sl-fx-doors" type="button">Split doors</button>
<section class="sl-slider" aria-label="Example chapters">
  <div class="sl-slider__track" tabindex="0" role="group" aria-label="Chapters. Use arrow keys or swipe.">
    <article class="sl-slide" id="chapter-a" tabindex="-1"><h2>First chapter</h2><a href="#chapter-b">Next →</a></article>
    <article class="sl-slide" id="chapter-b" tabindex="-1"><h2>Next chapter</h2><a href="#chapter-a">← Previous</a></article>
  </div>
</section>
~~~

Testimonial patterns: see /components/testimonials/ (or /light/components/testimonials/) for a featured quote card, a responsive 1/2/3-column grid, a single-quote slider, and a card rail. Related examples are also included in Cards and Sliders. Copy HTML from each preview. Core CSS supplies the cards and grid; slider.min.css enables scroll snapping and motion.min.css adds optional hover lift. Demo names and quotes are fictional. No extra CSS was added to the framework core.

WYSIWYG presentation: editor.min.css adds a wrapping toolbar, native editable canvas, compact/error/read-only states, and themed rich-text typography. Four examples are available at /components/editor/ and /light/components/editor/. Formatting controls are inactive integration templates; application code owns formatting, saving, and sanitization. See docs/editor.md for usage. The optional module measures 2,678 raw / 897 gzip bytes; the core remains 3,313 gzip bytes.

Header layouts: load header.min.css after the core for left-logo/right-menu, right-logo/left-menu, centered-logo/split-menu, logo/menu/CTA, and top-information-bar examples. Find them first at /components/headers/ and /light/components/headers/. sl-header is the inline-size query container; menus stack below 44rem of available header width. Standard links retain native keyboard navigation. This optional module measures 2,146 raw / 696 gzip bytes. The core remains 3,313 gzip bytes.

Cursor effects: load cursor.min.css after the core and add sl-cursor-site sl-cursor-pulse to body for the site-wide ring and action-pointer treatment. This is enabled on the demo website. See /components/cursors/ and /light/components/cursors/ for section-specific ring, crosshair, text, grab, pulsing, and hover-glow examples. The optional module measures 3,572 raw / 956 gzip bytes; core remains 3,313 gzip bytes. Pulsing swaps three cursor images discretely. Touch and forced-color modes retain native cursors; reduced motion keeps the custom ring static. Pointer trails and mouse-drag scrolling require application JavaScript and are not implemented by this CSS.

Interactive documentation playground: open View HTML under any example to edit HTML and StyloftCSS classes, use automatic preview or Run (Ctrl/Command+Enter), reset the example, copy HTML, and select mobile/tablet/full preview widths. The documentation script initializes each editor only when opened. Native textareas preserve normal keyboard navigation; highlighted read-only HTML remains available without JavaScript. Results run in a sandboxed iframe with scripts, forms and external network resources blocked by sandbox/CSP policy; framework CSS and demo extensions are preloaded. Edits are temporary and do not change files or persist after reload. Text editing uses native textareas; syntax highlighting is provided in the no-JavaScript source view. Framework packages remain CSS-only.

Playground formatting: initial HTML is formatted at build time with Prettier (two-space indentation, 88-column target). Format or Alt+Shift+F formats the current HTML; invalid syntax leaves edits unchanged. The browser HTML formatter/parser modules load only when formatting is requested. The parent page fetches and caches framework CSS, then embeds it into the script-blocked sandbox; this avoids Astro development-server 403 responses to opaque-origin stylesheet requests. Regression checks cover formatted source, formatting errors, and actual framework styling inside the preview in addition to editing/reset/copy behavior.

The playground now has one full-width HTML editor. The CSS editor, Copy CSS control, and browser CSS formatting parser have been removed. Framework and demo CSS load automatically; change classes to explore component styles. Focused checks passed for HTML-only layout, class-driven styling, formatting/errors, run/reset/copy, responsive widths and sandbox protection in both themes.

Control polish: field focus uses a 1px outline with a 1px offset, general keyboard focus uses 2px, and control colors transition over 180ms. Optional select.min.css (3,104 raw / 984 gzip bytes) provides Select2-inspired native select styling, grouped options, multiple/disabled states and animated customizable popups where supported. Older browsers retain their native option picker. Load select.min.css after core; examples are in Forms and the playground preview-width control uses the same styling. Reduced motion disables transitions. Core measures 3,313 gzip bytes.

Standalone components: download self-contained CSS from /downloads/components/ (buttons.min.css, cards.min.css, forms.min.css, headers.min.css and other families), or use the component-only link above each gallery. Required tokens and dependencies are included; no core file is needed. See docs/component-packs.md for usage and measured sizes. Header examples now collapse into native keyboard-operated Menu disclosures on narrow containers, with desktop/reverse/center logo arrangements retained on wide layouts. Standalone buttons and headers were verified in isolated pages loading one stylesheet each.

## Credits

StyloftCSS created by **Ashish Verma** ([GitHub](https://github.com/ashu4035)).

Source repository: [ashu4035/StyloftCSS](https://github.com/ashu4035/StyloftCSS).

Tabs: /components/tabs/ and /light/components/tabs/ include four CSS-only examples. Use tabs.min.css after the core or components/tabs.min.css by itself. The responsive variant becomes native accordions below a 48rem container width, preserves open state across resizing, supports keyboard activation and smooth closing in current browsers, and respects reduced motion. Independent groups use unique details names. No tab component JavaScript is needed; full details are in docs/tabs.md. Website body typography now uses Switzer (400/500/600/700) from Fontshare; headings retain Clash Display and code retains its monospace stack. Framework distributions remain font-independent.
