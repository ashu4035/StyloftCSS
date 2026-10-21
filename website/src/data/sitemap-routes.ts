import {components} from './components';
export const sitemapRoutes=['/','/getting-started/','/components/','/layouts/','/themes/',...components.map(c=>'/components/'+c.slug+'/')];
