# Search visibility and launch

Primary URL: https://styloftcss.pages.dev. Change website/site.config.mjs and rebuild if the primary domain changes.

Implemented: static per-page titles/descriptions, absolute canonical URLs, light-theme canonical consolidation, 404 noindex, Open Graph/Twitter metadata, PNG social image, WebSite/WebPage/source-code JSON-LD, sitemap.xml and robots.txt. JSON-LD is inert data, not component runtime JavaScript. The sitemap includes only canonical public content, not theme copies or errors. No fabricated reviews, ratings or rankings are used.

Build and check: npm run site:build, then node website/tests/seo.mjs. These checks validate all built metadata and sitemap coverage. Framework core is unchanged.

After publishing:
1. Sign in at https://search.google.com/search-console and add the URL-prefix property https://styloftcss.pages.dev/.
2. Verify ownership using Google's HTML file option: place the exact downloaded verification file in website/public/ and deploy again. A custom domain can alternatively use DNS verification. Do not invent a verification token.
3. Submit https://styloftcss.pages.dev/sitemap.xml in Sitemaps.
4. Inspect the homepage and important component URLs with URL Inspection, run the live test, and request indexing.
5. Review indexing reports and Search Performance after Google recrawls the site. Publish useful original component guidance and promote the project through relevant legitimate communities and the repository.

The local build does not update the public site. Deploy the changes through the existing Git/Cloudflare workflow. Preview deployments should be access-protected or receive an X-Robots-Tag: noindex response header in their hosting configuration.

Google controls indexing and ranking; neither is guaranteed. Avoid paid backlink schemes and keyword stuffing. See https://developers.google.com/search/docs/fundamentals/seo-starter-guide.
