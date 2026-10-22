# Publishing a blog post

Create a Markdown file in website/src/content/blog/. Its filename becomes the URL: my-post.md becomes /blog/my-post/.

Copy the frontmatter from building-lighter-with-css.md and update title, description, date (YYYY-MM-DD), author, category and readingTime. Write the article below the closing --- line. Use draft: true to keep it off the published site; change to false when ready. Do not include private material in drafts committed to a public repository.

Run npm run site:build from the repository root, review the generated page and deploy through your existing Cloudflare Pages workflow. Published posts automatically appear on the blog index and both sitemaps. This is a file-based publishing workflow; there is no browser-based CMS or login.
