import {posts} from './blog';
import {tutorials} from './tutorials';
import {components} from './components';
export const sitemapRoutes=['/blog/',...posts.map(post=>'/blog/'+post.slug+'/'),'/','/getting-started/','/components/','/layouts/','/themes/','/guides/','/search/','/tutorials/',...tutorials.map(t=>'/tutorials/'+t.slug+'/'),...components.map(c=>'/components/'+c.slug+'/')];
// Public release examples are crawlable pages even though they are not Astro routes.
sitemapRoutes.push(
  '/light/',
  '/downloads/releases/0.1.0/examples/landing',
  '/downloads/releases/0.1.0/examples/contact'
);
