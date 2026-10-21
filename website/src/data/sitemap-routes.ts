import {tutorials} from './tutorials';
import {components} from './components';
export const sitemapRoutes=['/','/getting-started/','/components/','/layouts/','/themes/','/guides/','/search/','/tutorials/',...tutorials.map(t=>'/tutorials/'+t.slug+'/'),...components.map(c=>'/components/'+c.slug+'/')];
