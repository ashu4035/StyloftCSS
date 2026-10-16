# Current validation — 16 October 2026

Astro 7.4.0, Node 22.22.2, Playwright 1.62.1, Edge 155.0.4283.45 (Chromium), Windows.

The catalog contains 103 examples across 18 categories; 48 static pages cover both
dark and light modes. All 6 framework structural checks and 25 website
browser check groups pass. Framework distributions remain CSS-only. Documentation pages include one approved playground module; no inline event-handler attributes are used.
All local links/assets resolve. Framework browser checks also passed in the previous
expansion; the core source remains unchanged for this slider/button update.

## Measured sizes

Gzip level 9, decimal bytes. Server settings may produce different transfer sizes.

| File | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| styloft.min.css | 12544 | 3313 |
| prose.min.css | 543 | 310 |
| tables.min.css | 1547 | 618 |
| variants.min.css | 2045 | 697 |
| responsive.min.css | 1224 | 331 |
| motion.min.css | 4526 | 1516 |
| button-fx.min.css | 3990 | 1137 |
| slider.min.css | 2180 | 853 |
| editor.min.css | 2678 | 897 |
| header.min.css | 3573 | 1090 |
| cursor.min.css | 3572 | 956 |
| select.min.css | 3104 | 984 |

Largest production-page CSS: 9414 gzip bytes; original single-bundle
baseline: 12,604. Development intentionally keeps full source styles. Framework
distribution files remain self-contained, unpruned, and independent of the website.

## Website checks

- every public page renders with one h1, unique IDs and no browser errors.
- all routes reflow without horizontal overflow at 320, 375, 768 and 1440px.
- mobile navigation opens by keyboard and its destinations work.
- native accordions and exact source-code disclosures work.
- theme previews are real independent color scopes.
- dark default, same-page theme switch, and light navigation without scripts.
- hover lift works and reduced motion removes the movement.
- responsive demo uses actual StyloftCSS columns.
- mobile tables stack every field with accessible labels and no clipped content.
- scroll reveals follow viewport entry; hover transitions animate in and out.
- skip link and root font-size reflow.
- exclusive, independent and multiple-open accordion behaviors.
- button sizes, ghost/fill/icon variants, and reusable hover transitions.
- page CSS selection reduces transfer without runtime code.
- standalone optional modules and all requested pixel boundaries.
- slider navigation, keyboard scrolling and native range controls.
- signature button effects animate distinctive states and respect reduced motion.

New checks verify dark/light carousel fragment navigation and target focus, horizontal
and vertical arrow-key scrolling, native range step changes and disabled controls,
and no page overflow. Signature effects verify door pseudo-element translation,
the changing typed orbit angle and conic border, sliding label, spotlight scaling,
keyboard-visible focus and reduced-motion static states. Standalone slider and
button modules also render with the core outside the website styles.

Screenshots and a short browser-recorded hover video support visual QA. No autoplay,
fake pagination state, hidden-radio carousel, or runtime animation library is used.
Firefox/Safari and screen-reader testing, a full WCAG audit, remote CI and production
deployment remain unperformed. Changes are local and uncommitted.

Accordion update: right-side rotating chevrons, stable content spacing, and CSS-only intrinsic-height transitions in the motion module. Browser regression checks cover opening, closing, rapid reversal, mobile dark/light themes, and reduced motion. Unsupported browsers retain native instant disclosures.

Testimonial patterns: see /components/testimonials/ (or /light/components/testimonials/) for a featured quote card, a responsive 1/2/3-column grid, a single-quote slider, and a card rail. Related examples are also included in Cards and Sliders. Copy HTML from each preview. Core CSS supplies the cards and grid; slider.min.css enables scroll snapping and motion.min.css adds optional hover lift. Demo names and quotes are fictional. No extra CSS was added to the framework core.

WYSIWYG presentation: editor.min.css adds a wrapping toolbar, native editable canvas, compact/error/read-only states, and themed rich-text typography. Four examples are available at /components/editor/ and /light/components/editor/. Formatting controls are inactive integration templates; application code owns formatting, saving, and sanitization. See docs/editor.md for usage. The optional module measures 2,678 raw / 897 gzip bytes; the core remains 3,313 gzip bytes.

Header layouts: load header.min.css after the core for left-logo/right-menu, right-logo/left-menu, centered-logo/split-menu, logo/menu/CTA, and top-information-bar examples. Find them first at /components/headers/ and /light/components/headers/. sl-header is the inline-size query container; menus stack below 44rem of available header width. Standard links retain native keyboard navigation. This optional module measures 2,146 raw / 696 gzip bytes. The core remains 3,313 gzip bytes.

Cursor effects: load cursor.min.css after the core and add sl-cursor-site sl-cursor-pulse to body for the site-wide ring and action-pointer treatment. This is enabled on the demo website. See /components/cursors/ and /light/components/cursors/ for section-specific ring, crosshair, text, grab, pulsing, and hover-glow examples. The optional module measures 3,572 raw / 956 gzip bytes; core remains 3,313 gzip bytes. Pulsing swaps three cursor images discretely. Touch and forced-color modes retain native cursors; reduced motion keeps the custom ring static. Pointer trails and mouse-drag scrolling require application JavaScript and are not implemented by this CSS.

Interactive documentation playground: open View HTML under any example to edit HTML and StyloftCSS classes, use automatic preview or Run (Ctrl/Command+Enter), reset the example, copy HTML, and select mobile/tablet/full preview widths. The documentation script initializes each editor only when opened. Native textareas preserve normal keyboard navigation; highlighted read-only HTML remains available without JavaScript. Results run in a sandboxed iframe with scripts, forms and external network resources blocked by sandbox/CSP policy; framework CSS and demo extensions are preloaded. Edits are temporary and do not change files or persist after reload. Text editing uses native textareas; syntax highlighting is provided in the no-JavaScript source view. Framework packages remain CSS-only.

Playground formatting: initial HTML is formatted at build time with Prettier (two-space indentation, 88-column target). Format or Alt+Shift+F formats the current HTML; invalid syntax leaves edits unchanged. The browser HTML formatter/parser modules load only when formatting is requested. The parent page fetches and caches framework CSS, then embeds it into the script-blocked sandbox; this avoids Astro development-server 403 responses to opaque-origin stylesheet requests. Regression checks cover formatted source, formatting errors, and actual framework styling inside the preview in addition to editing/reset/copy behavior.

The playground now has one full-width HTML editor. The CSS editor, Copy CSS control, and browser CSS formatting parser have been removed. Framework and demo CSS load automatically; change classes to explore component styles. Focused checks passed for HTML-only layout, class-driven styling, formatting/errors, run/reset/copy, responsive widths and sandbox protection in both themes.

Control polish: field focus uses a 1px outline with a 1px offset, general keyboard focus uses 2px, and control colors transition over 180ms. Optional select.min.css (3,104 raw / 984 gzip bytes) provides Select2-inspired native select styling, grouped options, multiple/disabled states and animated customizable popups where supported. Older browsers retain their native option picker. Load select.min.css after core; examples are in Forms and the playground preview-width control uses the same styling. Reduced motion disables transitions. Core measures 3,313 gzip bytes.

Standalone components: download self-contained CSS from /downloads/components/ (buttons.min.css, cards.min.css, forms.min.css, headers.min.css and other families), or use the component-only link above each gallery. Required tokens and dependencies are included; no core file is needed. See docs/component-packs.md for usage and measured sizes. Header examples now collapse into native keyboard-operated Menu disclosures on narrow containers, with desktop/reverse/center logo arrangements retained on wide layouts. Standalone buttons and headers were verified in isolated pages loading one stylesheet each.
