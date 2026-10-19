# Mobile performance update — 19 October 2026

Removed the two external render-blocking Fontshare CSS requests. The website now serves the original seven small WOFF2 files locally, retaining Clash Display headings and Switzer body text. Only Switzer 400 and Clash Display 600 are preloaded, with font-display: swap for all weights. Files have content hashes; Cloudflare Pages _headers config enables one-year immutable caching for fonts and generated assets. Downloads retain a shorter revalidating cache policy because their names are stable. No framework CSS or component JavaScript dependency was added.

Validation: production build, SEO/font asset assertions, and all 92 pages at 320/375/768/1440 pixels pass. Browser font checks confirm both families render. Local mobile simulation used a 390x844 viewport, 150ms network latency, 200KB/s download and 4x CPU slowdown; two optimized runs reported FCP/LCP of 1.44s and 1.724s, zero external requests and six actually used fonts. These are local diagnostics, not a published Lighthouse score. An initial external-font baseline did not load its font files in the test environment, so it is not a valid comparison and no percentage improvement is claimed.

Deploy these changes, then rerun PageSpeed Insights on the public homepage (mobile) multiple times. Compare the median FCP, LCP and CLS, not just the score. Cloudflare Pages must apply the included _headers file. Confirm fonts are served as font/woff2 and remain cacheable. The previously uploaded Google verification file is retained unchanged and excluded from page metadata checks.

Fonts remain subject to Fontshare licensing rather than the framework MIT license. Sources and attribution are in website/public/fonts/README.txt and manifest.json.
