# Documentation and launch improvements

New routes: /search/ and /guides/, each with a matching /light/ route. Search covers 40 component families and 349 extracted CSS classes. Declarations are grouped by class, with source modules and disclosure-based details. The index regenerates during website preparation from the actual core and optional CSS modules.

Guides include installation via local CSS downloads, choosing standalone packs, two tutorials, complete landing/contact templates, release-candidate downloads and checksums, browser support and accessibility limitations. No unverified npm package command is advertised. CHANGELOG.md and docs/releasing.md describe the local release candidate. docs/launch-kit.md contains ready-to-review promotion copy; nothing has been posted externally.

Action events and GA4 validation are documented in docs/analytics.md. The local checks validate events without sending automated visits to Google. The live site already contains the GA4 tag, but the new features require deployment. GA4 reception and key-event configuration require access to the account and are not claimed complete.
