import {sitemapRoutes} from '../data/sitemap-routes';
import {siteUrl} from '../../site.config.mjs';
export const prerender=true;
export function GET(){
  const routes=sitemapRoutes;
  const escape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(route=>'<url><loc>'+escape(new URL(route,siteUrl).href)+'</loc></url>').join('')+'</urlset>';
  return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
