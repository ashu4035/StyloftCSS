import {sitemapRoutes} from '../data/sitemap-routes';
import {siteUrl} from '../../site.config.mjs';
export const prerender=true;

const lastmod='2026-10-21T13:40:17+00:00';

function priority(route:string){
  if(route==='/') return '1.0000';
  if(route.startsWith('/downloads/')) return '0.5120';
  if(route.startsWith('/components/') || route.startsWith('/tutorials/')) return '0.6400';
  return '0.8000';
}

export function GET(){
  const routes=sitemapRoutes;
  const escape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+routes.map(route=>'<url><loc>'+escape(new URL(route,siteUrl).href)+'</loc><lastmod>'+lastmod+'</lastmod><priority>'+priority(route)+'</priority></url>').join('')+'</urlset>';
  return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
