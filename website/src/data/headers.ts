import {getImage} from 'astro:assets';
import mark from '../assets/brand-mark.png';
const logo=await getImage({src:mark,width:64,height:64,format:'webp'});
const brand=()=>`<a class="sl-header__brand" href="/" aria-label="StyloftCSS home"><img src="${logo.src}" alt="" width="32" height="32"/><span>Styloft<span>CSS</span></span></a>`;
const links=()=>'<a href="/components/">Components</a><a href="/layouts/">Layouts</a><a href="/themes/">Themes</a>';
const menu=(name:string,content=links(),extra='')=>`<nav class="sl-header__menu ${extra}" aria-label="${name}">${content}</nav>`;
const mobile=(content:string)=>{const items=[...content.matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)].map(m=>m[1]).join('');return `<details class="sl-header__mobile"><summary>Menu <span aria-hidden="true">☰</span></summary><nav class="sl-header__mobile-nav" aria-label="${(content.match(/<nav[^>]*aria-label="([^"]+)"/)||[])[1]||'Example'} mobile navigation">${items}</nav></details>`;};
const header=(content:string,extra='')=>`<header class="sl-header ${extra}"><div class="sl-header__row">${content}${mobile(content)}</div></header>`;
export function extendHeaders(components:any[]){
  const c=components.find(c=>c.slug==='headers');
  c.examples.unshift(
    {title:'Left logo, right menu',description:'A familiar horizontal header with the brand at the start and navigation aligned to the end.',html:header(brand()+menu('Left-logo example navigation'))},
    {title:'Right logo, left menu',description:'The navigation comes first, with the logo aligned to the right on wide layouts.',html:header(menu('Right-logo example navigation')+brand(),'sl-header--reverse')},
    {title:'Center logo, menus on both sides',description:'Equal-width side columns keep the logo truly centered. Narrow containers combine both menus into a native Menu disclosure.',html:header(brand()+menu('Centered example primary navigation','<a href="/components/">Components</a><a href="/layouts/">Layouts</a>','sl-header__menu--start')+menu('Centered example secondary navigation','<a href="/themes/">Themes</a><a href="/getting-started/">Documentation</a>','sl-header__menu--end'),'sl-header--center')},
    {title:'Left logo, right menu and CTA',description:'Navigation and a prominent action share the right side. The action is a normal link to the getting-started guide.',html:header(brand()+menu('CTA example navigation',links()+'<a class="sl-btn sl-hover-sheen" href="/getting-started/">Start building ↗</a>'))},
    {title:'Top information bar with navigation header',description:'A utility bar adds release information and useful links above the logo, main menu, and CTA.',html:`<header class="sl-header"><div class="sl-header__top"><p>StyloftCSS · CSS only, made for your next idea.</p><nav aria-label="Information bar links"><a href="/getting-started/">Quick start</a><a href="/components/">Browse examples</a></nav></div><div class="sl-header__row">${brand()}${menu('Information-bar example main navigation',links()+'<a class="sl-btn sl-hover-sheen" href="/getting-started/">Get started ↗</a>')}${mobile(menu('Mobile info navigation',links()+'<a class="sl-btn" href="/getting-started/">Get started ↗</a>'))}</div></header>`}
  );
  c.note+=' The five sl-header patterns require header.min.css after the core. Container queries replace desktop links with a keyboard-operable native Menu disclosure when the header itself is narrow, including embedded previews. Split navigation uses equal side columns to keep the logo centered. The mobile menu uses ordinary links and needs no runtime scripts.';
}
