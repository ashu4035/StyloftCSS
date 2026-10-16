// Build-time snippets; all names and quotes are fictional demo content.
const people=[
  {name:'Maya Chen',role:'Product designer · North Studio',initials:'MC',quote:'The spacing and typography gave our prototype a clear rhythm from the very first screen.'},
  {name:'Alex Morgan',role:'Frontend developer · Fieldwork',initials:'AM',quote:'I could compose a clean interface with familiar HTML and just the CSS modules I needed.'},
  {name:'Priya Shah',role:'Creative lead · Paper & Form',initials:'PS',quote:'The same cards feel considered in both themes, with room for our own visual identity.'}
];
const attribution=(p:any)=>`<figcaption class="sl-cluster sl-gap-4"><span class="sl-badge" aria-hidden="true">${p.initials}</span><div><p><strong>${p.name}</strong></p><p class="sl-help">${p.role}</p></div></figcaption>`;
const card=(p:any,classes='sl-card',id='')=>`<figure class="${classes} sl-stack sl-gap-6" ${id?`id="${id}" tabindex="-1" role="group" aria-roledescription="slide" aria-label="${people.indexOf(p)+1} of 3"`:''}><p class="sl-help">Sample testimonial</p><blockquote><p>“${p.quote}”</p></blockquote>${attribution(p)}</figure>`;
const grid=()=>`<div class="sl-grid sl-md:cols-2 sl-lg:cols-3 sl-gap-6">${people.map(p=>card(p,'sl-card sl-hover-lift')).join('')}</div>`;
const slider=(prefix:string,rail=false)=>`<section class="sl-slider ${rail?'sl-slider--cards':''}" aria-label="Sample testimonials" aria-roledescription="carousel"><div class="sl-slider__track" tabindex="0" role="group" aria-label="Testimonial slides. Swipe or focus here and use arrow keys.">${people.map((p,i)=>card(p,'sl-slide',prefix+'-'+(i+1))).join('')}</div><nav class="sl-slider__nav" aria-label="Choose a testimonial">${people.map((p,i)=>`<a href="#${prefix}-${i+1}" aria-label="Read sample testimonial from ${p.name}">${i+1}</a>`).join('')}</nav></section>`;
export function extendTestimonials(components:any[]){
  components.push({slug:'testimonials',name:'Testimonials',group:'Page sections',icon:'book',description:'Quote cards, responsive grids, and swipeable testimonial sliders. Ready to compose with CSS only.',examples:[
    {title:'Featured testimonial card',description:'An editorial quote with a clear attribution. All names and quotes on this page are fictional examples.',html:card(people[0])},
    {title:'Normal testimonial card grid',description:'One column on phones, two from 768px, and three from 1024px. Optional motion adds a gentle hover lift.',html:grid()},
    {title:'Testimonial slider',description:'One quote per slide. Swipe, use the numbered links, or focus the track and use the arrow keys. There is no autoplay.',html:slider('testimonial')},
    {title:'Testimonial card rail',description:'A horizontal card collection with a peek at the next card on mobile and two cards visible on larger screens.',html:slider('testimonial-rail',true)}
  ],note:'These names, organizations, and quotes are fictional placeholders. Replace them with approved customer content before publishing. Figures, blockquotes, and figcaptions preserve quote attribution. Grids use core CSS; sliders require slider.min.css, and hover lift requires motion.min.css. Native scroll snapping and real links work without runtime JavaScript. The slider does not autoplay or announce an active slide.'});
  components.find(c=>c.slug==='cards').examples.push({title:'Testimonial cards in a normal grid',description:'A responsive quote-card layout. Fictional sample content; replace with approved testimonials.',html:grid()});
  components.find(c=>c.slug==='sliders').examples.push({title:'Customer testimonial slider',description:'Fictional sample testimonials, with touch scrolling and keyboard-accessible numbered navigation.',html:slider('customer-testimonial')});
}
