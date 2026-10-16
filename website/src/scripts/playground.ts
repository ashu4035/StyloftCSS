// Documentation playground only. Framework distributions never import this file.
const modules=['styloft','prose','tables','variants','responsive','motion','button-fx','slider','editor','header','cursor','select','tabs'];
let sharedStyles:Promise<string>|undefined;
function loadStyles(){
  if(!sharedStyles)sharedStyles=Promise.all([...modules.map(name=>name+'.min.css'),'demo-extensions.css'].map(async name=>{
    const response=await fetch('/downloads/'+name);
    if(!response.ok)throw new Error('Could not load '+name+' ('+response.status+')');
    return response.text();
  })).then(styles=>styles.join('\n')).catch(error=>{sharedStyles=undefined;throw error;});
  return sharedStyles;
}
for(const disclosure of document.querySelectorAll<HTMLDetailsElement>('.example-source')){
  let initialized=false;
  disclosure.addEventListener('toggle',()=>{
    if(!disclosure.open||initialized)return;
    initialized=true;
    const editor=disclosure.querySelector<HTMLElement>('.code-editor')!;
    const template=editor.querySelector<HTMLTemplateElement>('template[data-playground]')!;
    editor.append(template.content.cloneNode(true));
    editor.dataset.ready='true';
    const html=editor.querySelector<HTMLTextAreaElement>('[data-html]')!;
    const frame=editor.querySelector<HTMLIFrameElement>('iframe')!;
    const auto=editor.querySelector<HTMLInputElement>('[data-auto]')!;
    const status=editor.querySelector<HTMLElement>('[data-status]')!;
    const result=editor.querySelector<HTMLElement>('[data-result]')!;
    const initialHTML=html.value;
    let timer:ReturnType<typeof setTimeout>;
    let revision=0;
    const lines=(field:HTMLTextAreaElement)=>{
      const gutter=field.parentElement!.querySelector<HTMLElement>('[data-lines]')!;
      gutter.textContent=Array.from({length:field.value.split('\n').length},(_,i)=>i+1).join('\n');
      gutter.scrollTop=field.scrollTop;
    };
    const run=async()=>{
      clearTimeout(timer);
      const current=++revision;
      let frameworkCSS:string;
      try{frameworkCSS=await loadStyles();}catch(error){status.textContent='Preview styles unavailable. Press Run to retry.';return;}
      if(current!==revision)return;
      const origin=location.origin;
      const theme=document.documentElement.dataset.theme==='light'?'light':'dark';
      const policy=`default-src 'none'; script-src 'none'; style-src 'unsafe-inline' ${origin}; img-src data: ${origin}; font-src ${origin}; connect-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'`;
      // Framework CSS is provided automatically; user HTML stays in a script-free sandbox.
      const customCSS=frameworkCSS.replace(/<\/style/gi,'<\\/style');
      frame.srcdoc=`<!doctype html><html lang="en" data-theme="${theme}"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:1.25rem;overflow-wrap:anywhere} ${customCSS}</style></head><body class="sl-cursor-site sl-cursor-pulse">${html.value}</body></html>`;
      status.textContent='Preview updated · changes stay in this page';
    };
    for(const field of [html]){
      lines(field);
      field.addEventListener('scroll',()=>lines(field));
      field.addEventListener('input',()=>{lines(field);clearTimeout(timer);if(auto.checked)timer=setTimeout(run,400);else status.textContent='Changes pending · press Run';});
      field.addEventListener('keydown',event=>{if(event.altKey&&event.shiftKey&&event.code==='KeyF'){event.preventDefault();void formatCode();return;}if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();run();}});
    }
    const formatButton=editor.querySelector<HTMLButtonElement>('[data-format]')!;
    const formatCode=async()=>{
      clearTimeout(timer);
      formatButton.disabled=true;
      status.textContent='Formatting HTML…';
      try{
        const [{format},htmlPlugin]=await Promise.all([import('prettier/standalone'),import('prettier/plugins/html')]);
        const nextHTML=await format(html.value,{parser:'html',plugins:[htmlPlugin],tabWidth:2,printWidth:88,htmlWhitespaceSensitivity:'css'});
        html.value=nextHTML;
        for(const field of [html]){field.scrollTop=0;field.scrollLeft=0;lines(field);}
        if(auto.checked)await run();
        status.textContent=auto.checked?'Code formatted · preview updated':'Code formatted · press Run to update preview';
      }catch(error){status.textContent='Could not format: '+(error instanceof Error?error.message.split('\n')[0]:'Check your HTML syntax')+' · your edits are unchanged';}
      finally{formatButton.disabled=false;}
    };
    formatButton.addEventListener('click',formatCode);
    editor.querySelector('[data-run]')!.addEventListener('click',run);
    auto.addEventListener('change',()=>{clearTimeout(timer);if(auto.checked)run();});
    editor.querySelector('[data-reset]')!.addEventListener('click',()=>{html.value=initialHTML;html.scrollTop=0;html.scrollLeft=0;lines(html);run();status.textContent='Original example restored';});
    editor.querySelector('[data-copy-html]')!.addEventListener('click',async()=>{
      const field=html;
      try{await navigator.clipboard.writeText(field.value);status.textContent='HTML copied';}catch{field.focus();field.select();status.textContent='Text selected · press Ctrl+C or Command+C to copy';}
    });
    editor.querySelector<HTMLSelectElement>('[data-width]')!.addEventListener('change',event=>{
      const value=(event.target as HTMLSelectElement).value;
      result.style.maxInlineSize=value==='full'?'100%':value+'px';
    });
    frame.addEventListener('load',()=>{frame.dataset.loaded='true';});
    run();
  });
}
