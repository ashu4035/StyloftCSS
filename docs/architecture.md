# Architecture and MVP

StyloftCSS 0.1 is a small, original CSS framework inspired by Tailwind's composability,
Bootstrap's everyday components, Bulma's CSS-only approach, and Open Props' tokens.
It does not copy or depend on those projects. The name is user-selected; no trademark,
package registry, or domain availability claim is made.

## MVP boundary

- A self-contained core: tokens, reset, fluid typography, automatic and scoped themes,
  grid/flex layouts, a bounded utility vocabulary, buttons, cards, fields, alerts,
  badges, native disclosures, and a skip link.
- Separate prose and table modules. No optional module is included in the core.
- No runtime JavaScript, external fonts, CDN dependencies, preprocessor, or utility scanner.
- Plain HTML examples, reproducible builds, contrast/size checks, and browser regression tests.
- Decimal gzip budget: strictly below 10,000 bytes for `dist/styloft.min.css`.

Not in the MVP: modal dialogs, menus, custom selects, tabs, tooltips, carousels,
runtime theme toggles, arbitrary-value classes, or framework adapters. Those need
additional interaction design or application code; CSS visibility tricks are not substitutes.

## Cascade contract

Every distribution file declares this order before adding rules:

```css
@layer sl.tokens, sl.reset, sl.base, sl.layout, sl.components, sl.utilities;
```

Tokens define choices; reset removes a small set of defaults; base styles semantic
HTML; layouts compose geometry; components supply recognizable controls; utilities
win over component defaults regardless of selector specificity. App CSS outside
layers wins over normal layered rules. The `hidden` attribute and reduced-motion
guard are the only deliberate `!important` exceptions. Important declarations
reverse layer precedence; avoid using important as an override strategy.

`src/` holds handwritten modules. `scripts/build.cjs` generates utilities from
explicit spacing and breakpoint lists, concatenates the core, conservatively
compresses whitespace, and measures UTF-8 and gzip bytes. It uses Node built-ins
only. It never scans application source or emits JavaScript into `dist/`.

## Extension contract

Prefix public classes and properties with `sl-` and `--sl-`. Use logical properties.
New optional modules should repeat the layer prelude and contribute to an existing
layer. Keep experimental selectors outside the stable core. Add real behavior tests
and rerun the budget before changing generated variants.

Theme hooks: `--sl-gap` defaults to 1rem in layouts; `--sl-cols` defaults to 1;
`--sl-card-min` defaults to 16rem. Theme attributes establish all semantic colors
so nested light/dark scopes can override inherited colors. Primitive tokens are
root-scoped and inherit. The operating-system dark preference applies only at the
root, when it has no explicit light override. Theme switches require an attribute
change by the host application or server; this package ships no switching script.

## Browser and accessibility scope

Requires cascade layers, custom properties, logical properties, Grid, Flexbox,
`clamp()`, `min()`, `:where()`, and `:focus-visible`. Baseline target: Chrome/Edge 105+,
Firefox 103+, Safari 15.4+. This is a feature target, not a claim that every listed
version has been tested. `text-wrap: balance` is an optional enhancement.

Use native HTML for keyboard and assistive-technology behavior. CSS provides focus
indicators, reduced-motion overrides, forced-color borders, and contrast-checked
semantic colors. Labels, errors, live announcements, reading order, and appropriate
roles remain the author's responsibility. Theme customization must recheck contrast.

Reference: [MDN cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers),
[MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion),
[MDN forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors).
