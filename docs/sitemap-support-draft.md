# Search Console support post — draft for owner review

Title: Both XML and text sitemaps report Couldn't fetch, but live inspection succeeds and homepage is indexed

Site: https://styloftcss.pages.dev/
Sitemaps: https://styloftcss.pages.dev/sitemap.xml and https://styloftcss.pages.dev/sitemap.txt

Both submitted sitemaps are shown as Unknown / Couldn't fetch with no last-read date. The files return HTTP 200 without a redirect, have application/xml and text/plain content types respectively, and contain matching absolute canonical URLs. robots.txt allows crawling and advertises the XML sitemap. The property is verified and reports no manual action.

Google's URL Inspection live test successfully fetches the XML and displays its contents. The homepage is already indexed, fetched by Googlebot smartphone, with the expected canonical URL. This does not establish that the separate sitemap fetch succeeded. Changing from XML to a text-format alternative did not resolve the report error.

Could someone advise which additional diagnostics can distinguish a sitemap crawler access failure from a Search Console processing issue? We have not established a Cloudflare block and do not want to disable protections without evidence.

Attachments to include: the failed sitemap report, the successful live-test XML fetch, and the indexed homepage result. Remove account identifiers before sharing screenshots. The latest live checks are in docs/sitemap-evidence.md. The upcoming local content build adds four canonical tutorial routes; it must be deployed before quoting its updated URL count.

If request evidence is available from Cloudflare, correlate the exact submission time and sitemap path with status/challenge results. Lack of an event in sampled or unavailable logs is not proof that Google made no request. Verify crawler identity through Google's published verification process before treating a user-agent string as genuine Googlebot.

Prepared only. This report has not been sent or posted to any external service.
