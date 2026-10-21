# Google Analytics

Production website builds include the user-approved asynchronous Google tag and GA4 configuration for G-FXJQZFLQF5 in the shared Base layout. Astro development mode omits the tag. Framework CSS files and sandboxed playground previews contain no Analytics code. Automated website tests block Google Analytics/Tag Manager requests so they do not contribute test visits.

Deploy website/dist through your existing hosting workflow. Visit the public site and check GA4 Realtime to confirm reception; an ad blocker may prevent collection. Validation checks tag presence and initialization, not receipt in the Google account. No credentials or environment variables are required for this public measurement ID.
