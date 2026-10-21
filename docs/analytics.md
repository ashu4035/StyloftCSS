# Google Analytics

Production website builds include the user-approved asynchronous Google tag and GA4 configuration for G-FXJQZFLQF5 in the shared Base layout. Astro development mode omits the tag. Framework CSS files and sandboxed playground previews contain no Analytics code. Automated website tests block Google Analytics/Tag Manager requests so they do not contribute test visits.

Deploy website/dist through your existing hosting workflow. Visit the public site and check GA4 Realtime to confirm reception; an ad blocker may prevent collection. Validation checks tag presence and initialization, not receipt in the Google account. No credentials or environment variables are required for this public measurement ID.

## Useful action events

The website-only site-tools script sends css_download (file_path without query/fragment), repository_click (fixed destination), playground_open (component slug) and playground_action (run, format, reset, copy-html). It never sends edited HTML, clipboard contents, search terms or form values. Search works without any analytics connection. Custom names avoid duplicating GA4 enhanced-measurement event names; review both reports before comparing counts.

In GA4, use Realtime/DebugView to confirm reception after deployment. Custom parameter reporting may need custom dimension registration in the GA4 property. Mark css_download as a key event if downloads are your conversion goal. No changes were made inside the Google account. A production homepage fetch on 21 October confirmed the configured tag appears once, but account-side event reception is unverified.

## All website buttons and links

The delegated click handler now emits exactly one classified custom click event per activation:

| Control | Event |
| --- | --- |
| Ordinary internal/external links, theme navigation | link_click |
| Ordinary buttons, input action buttons, role=button | button_click |
| Details/summary controls | disclosure_click |
| Download links (including ZIPs and CSS) | css_download |
| StyloftCSS repository links | repository_click |
| Playground Run/Format/Reset/Copy | playground_action |

playground_open remains a separate disclosure state event. Events include control_label, control_type, area (header, footer, sidebar, demo, playground, content), page_path and activation (primary/middle). Link destinations omit query strings and fragments; mailto/tel destinations and labels are replaced with generic categories. Contenteditable regions, code, textareas, disabled controls and data-analytics-ignore regions are excluded. No input values or edited markup are collected. Add data-analytics-label for a stable custom label. Native navigation, downloads and browser keyboard behavior are not prevented or delayed.

Clicks inside script-free sandboxed playground iframes do not bubble to the parent and remain untracked. Original live component previews on the documentation page are tracked. GA4 enhanced measurement may independently emit click/file_download; use the custom event names above consistently rather than summing both series.

After deployment, open GA4 Realtime and click several website controls. For breakdown reports, register event-scoped custom dimensions for control_label, area and link_path in the GA4 property. Do not register high-cardinality paths indiscriminately. Account configuration and event reception are not verified locally. See https://developers.google.com/analytics/devguides/collection/ga4/events.
