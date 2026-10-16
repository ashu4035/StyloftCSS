/* Standalone component distribution builder. No third-party build dependency. */
const fs=require('node:fs'),path=require('node:path');
// Select complete CSS rules, retaining their layer/media/supports context.
function subset(css,pattern){
  function scan(text){let out='',start=0,quote='',comment=false,depth=0,head='',bodyStart=0;
    for(let i=0;i<text.length;i++){const c=text[i],next=text[i+1];
      if(comment){if(c==='*'&&next==='/'){comment=false;i++;}continue;}
      if(quote){if(c==='\\'){i++;continue;}if(c===quote)quote='';continue;}
      if(c==='/'&&next==='*'){comment=true;i++;continue;}if(c==='"'||c==="'"){quote=c;continue;}
      if(c==='{'){if(depth++===0){head=text.slice(start,i).replace(/\/\*[\s\S]*?\*\//g,'').trim();bodyStart=i+1;}}
      if(c==='}'&&--depth===0){const body=text.slice(bodyStart,i);if(/^@(layer|media|supports|container|starting-style)\b/.test(head)){const selected=scan(body);if(selected)out+=head+'{'+selected+'}\n';}else if(!head.startsWith('@')&&pattern.test(head))out+=head+'{'+body+'}\n';start=i+1;}
    }return out;
  }return scan(css);
}
module.exports=function(root,banner,order,utilities){
 const read=name=>fs.readFileSync(path.join(root,'src',name+'.css'),'utf8');
 const components=read('components'),variants=read('modules/variants'),motion=read('modules/motion');
 const rules=names=>new RegExp('\\.sl-(?:'+names.join('|')+')(?![a-zA-Z0-9_])');
 const component=names=>subset(components,rules(names));
 const variant=names=>subset(variants,rules(names));
 const hover=subset(motion,rules(['hover-lift','hover-tilt','hover-glow','hover-zoom','hover-fill','hover-sheen']));
 const buttons=component(['btn'])+variant(['btn','spinner'])+hover+subset(motion,rules(['spinner']))+'@keyframes sl-spin { to { rotate:1turn; } }'+read('modules/button-fx');
 const helpers=read('layout')+utilities;
 const specs={
  buttons:{roots:['btn'],css:buttons,dependencies:['tokens','button variants','button effects']},
  cards:{roots:['card'],css:component(['card'])+variant(['card'])+hover+helpers,dependencies:['tokens','layout helpers','hover effects']},
  forms:{roots:['field','input','select','check'],css:component(['field','label','input','help','error','check'])+read('modules/select')+helpers,dependencies:['tokens','select','layout helpers']},
  accordions:{roots:['details'],css:component(['details'])+variant(['details'])+subset(motion,rules(['details']))+helpers,dependencies:['tokens','layout helpers','disclosure motion']},
  testimonials:{roots:['card','slider'],css:component(['card','badge'])+hover+read('modules/slider')+helpers,dependencies:['tokens','cards','sliders','layout helpers']},
  feedback:{roots:['alert','badge'],css:component(['alert','badge']),dependencies:['tokens']},
  links:{roots:['link'],css:variant(['link'])+subset(motion,rules(['link--underline'])),dependencies:['tokens','link motion']},
  alerts:{roots:['alert'],css:component(['alert']),dependencies:['tokens']},
  badges:{roots:['badge'],css:component(['badge']),dependencies:['tokens']},
  heroes:{roots:['hero','stack','grid'],css:buttons+component(['card'])+helpers,dependencies:['tokens','buttons','cards','layout helpers']},
  tabs:{roots:['tabs','tabs-container'],css:read('modules/tabs')+helpers,dependencies:['tokens','layout helpers']},
  headers:{roots:['header'],css:read('modules/header')+buttons+helpers,dependencies:['tokens','buttons','layout helpers']},
  footers:{roots:['footer'],css:variant(['footer'])+buttons+helpers,dependencies:['tokens','buttons','layout helpers']},
  sliders:{roots:['slider','range'],css:read('modules/slider')+helpers+component(['badge']),dependencies:['tokens','layout helpers','badges']},
  editor:{roots:['editor'],css:read('modules/editor')+helpers,dependencies:['tokens','layout helpers']},
  selects:{roots:['select','input'],css:read('modules/select'),dependencies:['tokens']},
  tables:{roots:['table','table-wrap'],css:read('modules/tables')+helpers+component(['badge']),dependencies:['tokens','layout helpers','badges']},
  typography:{roots:['prose'],css:read('modules/prose')+helpers,dependencies:['tokens','layout helpers']},
  layout:{roots:['container','grid','cluster','stack','sidebar','switcher'],css:helpers+read('modules/responsive'),dependencies:['tokens','layout helpers','responsive variants']},
  animations:{roots:['scene','reveal','stagger'],css:read('modules/motion')+buttons+component(['card'])+helpers,dependencies:['tokens','buttons','cards','layout helpers']},
  cursors:{roots:['cursor-zone','cursor-site'],css:read('modules/cursor'),dependencies:['tokens']}
 };
 const outputs={},manifest={};
 for(const [name,spec] of Object.entries(specs)){
  const scope=':where('+spec.roots.map(c=>'.sl-'+c).join(',')+')';
  const foundation=`@layer sl.base { ${scope} { box-sizing:border-box; margin:0; font-family:var(--sl-font); line-height:1.6; color:var(--sl-text); } ${scope} *,${scope} *::before,${scope} *::after { box-sizing:border-box; } ${scope} :where(p,h1,h2,h3,h4,figure,blockquote) { margin:0; } ${scope} a { color:var(--sl-accent); } ${scope}:focus-visible,${scope} :focus-visible { outline:2px solid var(--sl-focus);outline-offset:2px; } ${scope}:disabled,${scope} :disabled { opacity:.65;cursor:not-allowed; } @media(prefers-reduced-motion:no-preference){${scope},${scope} :where(a,button,input,select,summary){transition:color 180ms ease,background-color 180ms ease,border-color 180ms ease,outline-color 180ms ease;}} @media(prefers-reduced-motion:reduce){${scope},${scope} *,${scope} *::before,${scope} *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important;}} @media(forced-colors:active){${scope}:focus-visible,${scope} :focus-visible {outline-color:Highlight;}} }\n`;
  outputs['components/'+name+'.css']=banner+order+read('tokens')+'\n'+foundation+spec.css;
  manifest[name]={file:'components/'+name+'.min.css',requiresCore:false,includes:spec.dependencies};
 }
 return {outputs,manifest};
};
