// Trusted project markup only. Never run this helper over arbitrary user HTML.
export function lightNavigation(html: string) {
  return html.replace(/<a\b[^>]*>/g,tag=>{
    if(tag.includes('data-theme-switch'))return tag;
    return tag.replace(/href="(\/[^"?#]*)([^\"]*)"/,(_,pathname,suffix)=>{
      if(pathname.startsWith('/light/')||/^\/(?:downloads|_astro)\//.test(pathname)||/\.[a-z0-9]+$/i.test(pathname))return `href="${pathname}${suffix}"`;
      return `href="/light${pathname}${suffix}"`;
    });
  });
}
