import {defineMiddleware} from 'astro:middleware';
import {lightNavigation} from './lib/theme';

// Runs during static generation (and local dev), never in the visitor's browser.
// Light pages keep ordinary navigation in the /light/ tree. Downloads/assets stay shared.
export const onRequest=defineMiddleware(async(context,next)=>{
  const response=await next();
  if(!context.url.pathname.startsWith('/light/')||!response.headers.get('content-type')?.includes('text/html'))return response;
  const html=await response.text();
  const output=lightNavigation(html);
  const headers=new Headers(response.headers);
  headers.delete('content-length');
  return new Response(output,{status:response.status,statusText:response.statusText,headers});
});
