# Accessibility review — 21 October 2026

Automated WCAG 2/2.1/2.2 A/AA rule scans using axe-core were run on the dark/light homepage, search and guides, plus Forms, Headers, Tabs and Modals in Chromium. The scan found 21 low-contrast decorative text instances on the light homepage; their colors were corrected. The follow-up scans report zero violations on these ten pages. Automated scans retain incomplete checks requiring human review and do not certify accessibility.

The framework browser suite covers skip links, visible keyboard focus, native disclosures, reduced motion, forced colors, RTL and enlarged text. Website regressions also cover component keyboard behavior and narrow layouts. Search has a visible label, native typing/Tab order, a polite result count and a clear button returning focus to the input. All entries remain present without JavaScript. The new full-page examples use headings, landmarks, labelled controls and skip links.

This is not a real screen-reader test. Before an official accessibility claim, review the site with NVDA or VoiceOver, multiple browsers and representative users. Verify reading order, announcements, dialog focus and tooltip behavior. Current automated browser coverage is Chromium; Safari and Firefox are not claimed tested.

Reproduce: npm run site:build, npm run site:test:expansion and npm run test:browser. Machine-readable scan detail is generated at website/test-results/accessibility.json.
