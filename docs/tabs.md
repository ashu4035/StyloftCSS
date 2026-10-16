# CSS-only tabs and responsive accordions

Load dist/tabs.min.css after the core, or use dist/components/tabs.min.css as a self-contained component pack. Optional tabs CSS: 898 gzip bytes; standalone pack including tokens/layout helpers: 2969 gzip bytes.

```html
<link rel="stylesheet" href="/css/components/tabs.min.css">
<div class="sl-tabs-container">
  <div class="sl-tabs sl-tabs--responsive" style="--sl-tabs-count: 2">
    <details class="sl-tab" name="product-sections" open>
      <summary>Overview <span aria-hidden="true">⌄</span></summary>
      <div class="sl-tab__panel"><p>Your overview content.</p></div>
    </details>
    <details class="sl-tab" name="product-sections">
      <summary>Details <span aria-hidden="true">⌄</span></summary>
      <div class="sl-tab__panel"><p>Your detailed content.</p></div>
    </details>
  </div>
</div>
```

The sl-tabs-container wrapper measures available component width. sl-tabs--responsive uses horizontal tab presentation at 48rem or wider, and stacked native disclosures below it. sl-tabs--always keeps the horizontal presentation at all sizes in supporting browsers. Set --sl-tabs-count to the actual number of sections; the default is three.

Use one shared, unique name per group. Native named details permit at most one open section; readers may also close the active section. Resizing retains the same DOM and open state. Native keyboard interaction is Tab plus Enter/Space; these components do not claim the custom ARIA tablist arrow-key interaction model. Ordinary links or form controls inside panels retain their normal behavior.

Current browsers animate intrinsic block size and retain content during closing through ::details-content and allow-discrete transitions. Unsupported browsers keep readable native disclosures. Reduced motion removes the movement. No JavaScript is used by this component; the documentation playground is a separate, optional site feature.

Four copyable examples are available at /components/tabs/. Browser tests exercise the native interactions and intermediate closing heights with JavaScript disabled, independent group state, responsive widths, and reduced motion in both themes.
