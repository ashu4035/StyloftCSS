// Website search and action measurement only; never shipped in the framework CSS.
const analytics=(name:string,params:Record<string,string|number>)=>{const tag=(window as any).gtag;if(typeof tag==='function'){try{tag('event',name,params);}catch{/* Measurement must never interrupt a control. */}}};
// Delegate once so existing and dynamically created documentation controls work.
function trackActivation(event:MouseEvent){
 if(event.type==='auxclick'&&event.button!==1)return;
 const target=event.target instanceof Element?event.target:null;
 if(!target||target.closest('[contenteditable]:not([contenteditable="false"]),textarea,pre,code,[data-analytics-ignore]'))return;
 const control=target.closest<HTMLElement>('a[href],button,summary,[role="button"],input[type="button"],input[type="submit"],input[type="reset"]');
 if(!control||control.matches(':disabled,[aria-disabled="true"]'))return;
 const label=(control.dataset.analyticsLabel||control.getAttribute('aria-label')||control.textContent||control.tagName).replace(/\s+/g,' ').trim().slice(0,80);
 const area=control.closest('footer')?'footer':control.closest('header')?'header':control.closest('aside')?'sidebar':control.closest('.example-source')?'playground':control.closest('.example-canvas')?'demo':'content';
 const params:Record<string,string|number>={control_label:label,control_type:control.tagName.toLowerCase(),page_path:location.pathname,area,activation:event.type==='auxclick'?'middle':'primary'};
 const a=control instanceof HTMLAnchorElement?control:null;
 if(a){
  let url:URL;try{url=new URL(a.href,location.href);}catch{return;}
  // Strip query/hash; never send email addresses, phone numbers or typed code.
  params.link_path=url.protocol==='mailto:'?'email':url.protocol==='tel:'?'telephone':url.protocol==='http:'||url.protocol==='https:'?(url.origin===location.origin?url.pathname:url.hostname+url.pathname):url.protocol;
  if(url.protocol==='mailto:')params.control_label='Email link';
  if(url.protocol==='tel:')params.control_label='Telephone link';
  if(a.hasAttribute('download')||(url.origin===location.origin&&url.pathname.startsWith('/downloads/'))){analytics('css_download',{...params,file_path:String(params.link_path)});return;}
  if(url.hostname==='github.com'&&url.pathname.startsWith('/ashu4035/StyloftCSS')){analytics('repository_click',{...params,destination:'StyloftCSS'});return;}
  analytics('link_click',params);return;
 }
 const action=control.closest('[data-run],[data-format],[data-reset],[data-copy-html]');
 if(action){const key=['run','format','reset','copy-html'].find(k=>action.hasAttribute('data-'+k));analytics('playground_action',{...params,action:key||'unknown',component:location.pathname.replace(/^\/light/,'').split('/')[2]||'guide'});return;}
 analytics(control.tagName==='SUMMARY'?'disclosure_click':'button_click',params);
}
document.addEventListener('click',trackActivation);
document.addEventListener('auxclick',trackActivation);
document.addEventListener('toggle',event=>{const el=event.target;if(el instanceof HTMLDetailsElement&&el.matches('.example-source')&&el.open)analytics('playground_open',{component:location.pathname.replace(/^\/light/,'').split('/')[2]||'guide'});},true);
for(const root of document.querySelectorAll<HTMLElement>('[data-search]')){
 const input=root.querySelector<HTMLInputElement>('input[type="search"]')!,status=root.querySelector<HTMLElement>('[data-search-status]')!,items=[...root.querySelectorAll<HTMLElement>('[data-search-item]')],reset=root.querySelector<HTMLButtonElement>('[data-search-clear]')!;
 reset.hidden=false;
 const filter=()=>{const terms=input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);let count=0;for(const item of items){const haystack=item.dataset.terms||'';item.hidden=!terms.every(term=>haystack.includes(term));if(!item.hidden)count++;}status.textContent=count+' results'+(terms.length?' match your search':'. Search by component, class or CSS property.');};
 input.addEventListener('input',filter);root.addEventListener('submit',event=>{event.preventDefault();filter();});reset.addEventListener('click',()=>{input.value='';filter();input.focus();});filter();
}
