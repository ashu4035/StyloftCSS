import {components} from './components';
export const sitemapRoutes=['/','/getting-started/','/components/','/layouts/','/themes/','/guides/','/search/',...components.map(c=>'/components/'+c.slug+'/')];
