import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Preserve separate animation-timeline declarations for browsers that support
  // scroll timelines but do not yet parse timelines inside animation shorthand.
  vite: { build: { cssMinify: true, cssTarget: 'chrome105' } }
});
