import {sitemapRoutes} from '../data/sitemap-routes';
import {siteUrl} from '../../site.config.mjs';
export const prerender=true;
// Alternative supported format for diagnosing persistent XML fetch failures.
export function GET(){return new Response(sitemapRoutes.map(route=>new URL(route,siteUrl).href).join('\n')+'\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
