// Website search and action measurement only; never shipped in the framework CSS.
const analytics=(name:string,params:Record<string,string|number>)=>{const tag=(window as any).gtag;if(typeof tag==='function')tag('event',name,params);};
document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target:null;if(!target)return;
 const a=target.closest<HTMLAnchorElement>('a[href]');
 if(a){const url=new URL(a.href,location.href);if(url.origin===location.origin&&url.pathname.startsWith('/downloads/'))analytics('css_download',{file_path:url.pathname});else if(url.hostname==='github.com'&&url.pathname.startsWith('/ashu4035/StyloftCSS'))analytics('repository_click',{destination:'StyloftCSS'});}
 const action=target.closest('[data-run],[data-format],[data-reset],[data-copy-html]');
 if(action){const key=['run','format','reset','copy-html'].find(k=>action.hasAttribute('data-'+k));analytics('playground_action',{action:key||'unknown',component:location.pathname.replace(/^\/light/,'').split('/')[2]||'guide'});}
});
document.addEventListener('toggle',event=>{const el=event.target;if(el instanceof HTMLDetailsElement&&el.matches('.example-source')&&el.open)analytics('playground_open',{component:location.pathname.replace(/^\/light/,'').split('/')[2]||'guide'});},true);
for(const root of document.querySelectorAll<HTMLElement>('[data-search]')){
 const input=root.querySelector<HTMLInputElement>('input[type="search"]')!,status=root.querySelector<HTMLElement>('[data-search-status]')!,items=[...root.querySelectorAll<HTMLElement>('[data-search-item]')],reset=root.querySelector<HTMLButtonElement>('[data-search-clear]')!;
 reset.hidden=false;
 const filter=()=>{const terms=input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);let count=0;for(const item of items){const haystack=item.dataset.terms||'';item.hidden=!terms.every(term=>haystack.includes(term));if(!item.hidden)count++;}status.textContent=count+' results'+(terms.length?' match your search':'. Search by component, class or CSS property.');};
 input.addEventListener('input',filter);root.addEventListener('submit',event=>{event.preventDefault();filter();});reset.addEventListener('click',()=>{input.value='';filter();input.focus();});filter();
}
