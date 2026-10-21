# Sitemap fetch investigation — 21 October 2026

These are live responses from the public deployment, not proof of what Google’s sitemap crawler received.

{
  "path": "/sitemap.xml",
  "status": 200,
  "type": "application/xml",
  "location": null,
  "challenge": null,
  "bytes": 3355,
  "xmlUrls": 47
}

{
  "path": "/sitemap.txt",
  "status": 200,
  "type": "text/plain; charset=utf-8",
  "location": null,
  "challenge": null,
  "bytes": 2260,
  "xmlUrls": 0
}

{
  "path": "/robots.txt",
  "status": 200,
  "type": "text/plain; charset=utf-8",
  "location": null,
  "challenge": null,
  "bytes": 74,
  "xmlUrls": 0
}

User-supplied Search Console screenshots confirm: homepage indexed and Googlebot fetch successful; XML live inspection successful; no manual actions; sitemap XML and text submissions both report Couldn’t fetch. The current cause is unconfirmed. No authenticated Cloudflare request logs or Google crawler diagnostics were accessed.