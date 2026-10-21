# Google Analytics

Production website builds include the user-approved asynchronous Google tag and GA4 configuration for G-FXJQZFLQF5 in the shared Base layout. Astro development mode omits the tag. Framework CSS files and sandboxed playground previews contain no Analytics code. Automated website tests block Google Analytics/Tag Manager requests so they do not contribute test visits.

Deploy website/dist through your existing hosting workflow. Visit the public site and check GA4 Realtime to confirm reception; an ad blocker may prevent collection. Validation checks tag presence and initialization, not receipt in the Google account. No credentials or environment variables are required for this public measurement ID.

## Useful action events

The website-only site-tools script sends css_download (file_path without query/fragment), repository_click (fixed destination), playground_open (component slug) and playground_action (run, format, reset, copy-html). It never sends edited HTML, clipboard contents, search terms or form values. Search works without any analytics connection. Custom names avoid duplicating GA4 enhanced-measurement event names; review both reports before comparing counts.

In GA4, use Realtime/DebugView to confirm reception after deployment. Custom parameter reporting may need custom dimension registration in the GA4 property. Mark css_download as a key event if downloads are your conversion goal. No changes were made inside the Google account. A production homepage fetch on 21 October confirmed the configured tag appears once, but account-side event reception is unverified.
