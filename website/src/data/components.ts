import {extendReference} from './reference-components';
import {extendTabs} from './tabs';
import {extendCursors} from './cursors';
import {extendHeaders} from './headers';
import {extendEditor} from './editor';
import {extendTestimonials} from './testimonials';
import {extendSliderAndFX} from './slider-signatures';
import {extendLibrary} from './expanded';
// Trusted, hand-authored demo markup. Each preview renders the exact code shown.
export const components = [
  {
    slug:'buttons', name:'Buttons', group:'Essentials', icon:'arrow', description:'Clear actions, comfortable targets, and visible keyboard focus.',
    examples:[
      {title:'Everyday actions', description:'Use buttons for actions and anchors for navigation. Outline is a modifier on sl-btn.', html:`<div class="sl-cluster sl-gap-4">
  <button class="sl-btn" type="button">Primary action</button>
  <button class="sl-btn sl-btn--outline" type="button">Secondary action</button>
  <button class="sl-btn" type="button" disabled>Unavailable</button>
  <a class="sl-btn" href="/getting-started/">Read the guide ↗</a>
</div>`},
      {title:'An action in context', description:'Give the primary action a clear destination. This is a static example, not a checkout.', html:`<article class="sl-card sl-stack demo-narrow">
  <span class="sl-badge">Your next step</span>
  <h3 class="sl-text-xl">Make a little room.</h3>
  <p class="sl-text-muted">Start with a small CSS foundation, then add your own ideas.</p>
  <a class="sl-btn sl-w-full" href="/getting-started/">Get started →</a>
</article>`}
    ], note:'A disabled anchor still navigates. Use the native disabled attribute on buttons; avoid disabled links. Standalone demo buttons do not perform application actions.'
  },
  {
    slug:'cards', name:'Cards', group:'Essentials', icon:'layers', description:'Composable surfaces for ideas, projects, plans, and everyday content.',
    examples:[
      {title:'Feature cards', description:'Combine card, stack, badge, and grid primitives. The cover is a website-specific CSS illustration.', html:`<div class="sl-grid sl-md:cols-2 sl-gap-6">
  <article class="sl-card sl-stack demo-feature-card">
    <div class="demo-art demo-art-lavender" aria-hidden="true"><span></span><span></span><span></span></div>
    <span class="sl-badge">Foundation</span>
    <h3 class="sl-text-xl">Designed to compose.</h3>
    <p class="sl-text-muted">Good defaults. Simple classes. Plenty of room to make it yours.</p>
    <a href="/layouts/">Explore layouts ↗</a>
  </article>
  <article class="sl-card sl-stack demo-feature-card">
    <div class="demo-art demo-art-peach" aria-hidden="true"><span></span><span></span><span></span></div>
    <span class="sl-badge">Expression</span>
    <h3 class="sl-text-xl">A palette of possibility.</h3>
    <p class="sl-text-muted">Semantic tokens bring the same visual language to every surface.</p>
    <a href="/themes/">Meet the tokens ↗</a>
  </article>
</div>`},
      {title:'A compact project card', html:`<article class="sl-card sl-stack demo-narrow">
  <div class="sl-cluster sl-justify-between"><span class="demo-avatar">S</span><span class="sl-badge">Example project</span></div>
  <h3 class="sl-text-xl">Studio notebook</h3>
  <p class="sl-text-muted">A place for the things you want to build next.</p>
  <hr />
  <div class="sl-cluster sl-justify-between"><span class="sl-help">CSS · HTML · Possibility</span><a href="/getting-started/">Open guide ↗</a></div>
</article>`}
    ], note:'Cards are presentation. Choose article, section, or div according to the content. Avoid making a whole card interactive when it contains multiple links.'
  },
  {
    slug:'headers', name:'Headers', group:'Page sections', icon:'layers', description:'Navigation that wraps gracefully and lets native HTML do the work.',
    examples:[
      {title:'A simple site header', html:`<header class="demo-header sl-cluster sl-justify-between sl-gap-6">
  <a class="demo-wordmark" href="/">Studio<span>®</span></a>
  <nav class="sl-cluster sl-gap-6" aria-label="Studio example navigation">
    <a href="/components/cards/">Work</a><a href="/getting-started/">About</a>
    <a class="sl-btn" href="/getting-started/">Let's build ↗</a>
  </nav>
</header>`},
      {title:'Native disclosure navigation', description:'A disclosure menu that opens with pointer or keyboard, without a script.', html:`<header class="demo-header sl-cluster sl-justify-between">
  <a class="demo-wordmark" href="/">Notebook.</a>
  <details class="demo-menu">
    <summary>Explore the site</summary>
    <nav class="sl-stack" aria-label="Notebook example navigation">
      <a href="/components/">Components</a>
      <a href="/layouts/">Layout patterns</a>
      <a href="/themes/">Theme gallery</a>
    </nav>
  </details>
</header>`}
    ], note:'The native details menu is a disclosure, not an ARIA menu widget. Keep ordinary links and natural tab order. The website header uses the same pattern on small screens.'
  },
  {
    slug:'heroes', name:'Hero sections', group:'Page sections', icon:'spark', description:'Give an idea a strong introduction with responsive type and clear next steps.',
    examples:[
      {title:'The centered introduction', html:`<section class="demo-hero-section sl-stack sl-text-center sl-py-12 sl-px-6">
  <p class="demo-kicker">A new place to begin</p>
  <h2>Small start.<br />Big possibilities.</h2>
  <p class="sl-text-lg sl-text-muted sl-measure sl-mx-auto">Build a thoughtful home for your next idea. Start with good defaults and make every detail your own.</p>
  <div class="sl-cluster sl-justify-center sl-gap-4"><a class="sl-btn" href="/getting-started/">Start creating ↗</a><a class="sl-btn sl-btn--outline" href="/components/">See the pieces</a></div>
</section>`},
      {title:'A split hero', html:`<section class="sl-grid sl-md:cols-2 sl-gap-8 sl-items-center">
  <div class="sl-stack"><span class="sl-badge">Built for your ideas</span><h2 class="sl-text-xl">A considered foundation.<br />A fresh perspective.</h2><p class="sl-text-muted">Let your content lead. Keep the structure simple.</p><a class="sl-btn" href="/layouts/">Explore layouts ↗</a></div>
  <div class="demo-art demo-art-lavender demo-art-large" aria-hidden="true"><span></span><span></span><span></span></div>
</section>`}
    ], note:'Use one page-level h1. These embedded examples use h2 so the component page retains a meaningful heading hierarchy.'
  },
  {
    slug:'footers', name:'Footers', group:'Page sections', icon:'layers', description:'Close the page with a clear path to the next useful place.',
    examples:[
      {title:'A complete footer', html:`<footer class="demo-footer-block sl-stack sl-gap-8">
  <div class="sl-grid sl-md:cols-3 sl-gap-8">
    <div class="sl-stack"><a href="/" class="demo-wordmark">Studio.</a><p class="sl-text-muted">A little structure.<br />A lot of possibility.</p></div>
    <nav class="sl-stack" aria-label="Example resource links"><h3 class="sl-text-lg">Resources</h3><a href="/getting-started/">Documentation</a><a href="/components/">Components</a><a href="/layouts/">Layouts</a></nav>
    <nav class="sl-stack" aria-label="Example theme links"><h3 class="sl-text-lg">Make it yours</h3><a href="/themes/">Design tokens</a><a href="/downloads/styloft.min.css" download>Get the CSS</a></nav>
  </div>
  <hr /><div class="sl-cluster sl-justify-between sl-help"><span>Illustrative footer · StyloftCSS</span><a href="#main">Back to top ↑</a></div>
</footer>`},
      {title:'The minimal sign-off', html:`<footer class="demo-footer-block sl-cluster sl-justify-between sl-gap-6">
  <a href="/" class="demo-wordmark">Notebook.</a>
  <p class="sl-help">Made for the web. Yours to shape.</p>
  <a href="/getting-started/">Start building ↗</a>
</footer>`}
    ], note:'Give multiple navigation regions distinct labels. This preview footer is nested within a section, separate from the website’s page footer.'
  },
  {
    slug:'forms', name:'Forms', group:'Essentials', icon:'code', description:'Real labels, native controls, helpful descriptions, and clear error states.',
    examples:[
      {title:'Project details', description:'A static form layout: fields are interactive; there is no submission endpoint.', html:`<fieldset class="demo-fieldset sl-stack demo-narrow">
  <legend class="sl-text-xl sl-bold">Tell us about your idea</legend>
  <div class="sl-field"><label class="sl-label" for="project-name">Project name</label><input class="sl-input" id="project-name" name="project" placeholder="My next big idea" /></div>
  <div class="sl-field"><label class="sl-label" for="project-email">Email address</label><input class="sl-input" id="project-email" type="email" autocomplete="email" aria-describedby="email-note" placeholder="you@example.com" /><p class="sl-help" id="email-note">Use the address you check most often.</p></div>
  <div class="sl-field"><label class="sl-label" for="project-type">Project type</label><select class="sl-input" id="project-type"><option>Personal website</option><option>Documentation</option><option>Design system</option></select></div>
  <label class="sl-check"><input type="checkbox" /> Include optional modules</label>
</fieldset>`},
      {title:'Helpful validation', html:`<div class="sl-stack demo-narrow">
  <div class="sl-field"><label class="sl-label" for="workspace">Workspace name</label><input class="sl-input" id="workspace" aria-invalid="true" aria-describedby="workspace-error" /><p id="workspace-error" class="sl-error">Enter a workspace name to continue.</p></div>
  <div class="sl-field"><label class="sl-label" for="notes">Anything else?</label><textarea class="sl-input" id="notes" rows="3" placeholder="A few words about your project…"></textarea></div>
</div>`}
    ], note:'StyloftCSS does not validate or submit forms. Your application sets aria-invalid, supplies error text, and handles submission. Never use placeholder text as the only label.'
  },
  {
    slug:'accordions', name:'Accordions', group:'Essentials', icon:'layers', description:'Native disclosures with familiar keyboard interaction. No state library required.',
    examples:[
      {title:'Frequently asked questions', description:'Independent details elements allow several answers to remain open.', html:`<div class="sl-stack sl-gap-4">
  <details class="sl-details" open><summary>Do I need JavaScript?</summary><p>No. The framework is CSS only. This accordion uses the browser’s native details and summary elements.</p></details>
  <details class="sl-details"><summary>Can I customize the design?</summary><p>Yes. Override design tokens, combine utility classes, or add your own stylesheet after StyloftCSS.</p></details>
  <details class="sl-details"><summary>Can I use it in commercial projects?</summary><p>Yes. StyloftCSS is MIT licensed. Include its copyright and license notice in copies of the software.</p></details>
</div>`},
      {title:'A single disclosure', html:`<details class="sl-details demo-narrow">
  <summary>A little more detail</summary>
  <div class="sl-stack"><p>Some information is useful when you need it, and quieter when you don't.</p><a href="/getting-started/">Read the complete guide ↗</a></div>
</details>`}
    ], note:'Keep summary as the first child of details. The chevron sits on the right; preserve the native focus indicator. Load motion.min.css for smooth opening and closing in supported browsers; reduced motion and older browsers use instant toggling. These are disclosures, not a custom ARIA accordion implementation.'
  },
  {
    slug:'tables', name:'Tables', group:'Data & feedback', icon:'grid', description:'Readable rows and columns, with captions, header relationships, and scrollable boundaries.',
    examples:[
      {title:'A clear data table', description:'Rows become labelled cards below 40rem, so every field stays visible without sideways scrolling. Entries are illustrative.', html:`<div class="sl-table-wrap" role="region" aria-labelledby="projects-caption" tabindex="0">
  <table class="sl-table sl-table--responsive" role="table">
    <caption id="projects-caption">Example project directory</caption>
    <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Project</th><th scope="col" role="columnheader">Category</th><th scope="col" role="columnheader">Status</th><th scope="col" role="columnheader">Owner</th></tr></thead>
    <tbody role="rowgroup">
      <tr role="row"><th scope="row" role="rowheader">Studio notebook</th><td role="cell"><span class="sl-table-label" aria-hidden="true">Category</span><span>Portfolio</span></td><td role="cell"><span class="sl-table-label" aria-hidden="true">Status</span><span><span class="sl-badge">Ready</span></span></td><td role="cell"><span class="sl-table-label" aria-hidden="true">Owner</span><span>Alex</span></td></tr>
      <tr role="row"><th scope="row" role="rowheader">Field notes</th><td role="cell"><span class="sl-table-label" aria-hidden="true">Category</span><span>Editorial</span></td><td role="cell"><span class="sl-table-label" aria-hidden="true">Status</span><span><span class="sl-badge">Draft</span></span></td><td role="cell"><span class="sl-table-label" aria-hidden="true">Owner</span><span>Sam</span></td></tr>
      <tr role="row"><th scope="row" role="rowheader">The component garden</th><td role="cell"><span class="sl-table-label" aria-hidden="true">Category</span><span>Documentation</span></td><td role="cell"><span class="sl-table-label" aria-hidden="true">Status</span><span><span class="sl-badge">In progress</span></span></td><td role="cell"><span class="sl-table-label" aria-hidden="true">Owner</span><span>Jordan</span></td></tr>
    </tbody>
  </table>
</div>`},
      {title:'Module comparison', html:`<div class="sl-table-wrap" role="region" aria-labelledby="modules-caption" tabindex="0">
  <table class="sl-table sl-table--responsive" role="table"><caption id="modules-caption">Choose your building blocks</caption>
    <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Module</th><th scope="col" role="columnheader">Purpose</th><th scope="col" role="columnheader">Required</th></tr></thead>
    <tbody role="rowgroup"><tr role="row"><th scope="row" role="rowheader">Core</th><td role="cell"><span class="sl-table-label" aria-hidden="true">Purpose</span><span>Tokens, base, layouts, utilities, components</span></td><td role="cell"><span class="sl-table-label" aria-hidden="true">Required</span><span>Yes</span></td></tr><tr role="row"><th scope="row" role="rowheader">Prose</th><td role="cell"><span class="sl-table-label" aria-hidden="true">Purpose</span><span>Long-form text rhythm</span></td><td role="cell"><span class="sl-table-label" aria-hidden="true">Required</span><span>No</span></td></tr><tr role="row"><th scope="row" role="rowheader">Tables</th><td role="cell"><span class="sl-table-label" aria-hidden="true">Purpose</span><span>Data table styling</span></td><td role="cell"><span class="sl-table-label" aria-hidden="true">Required</span><span>No</span></td></tr></tbody>
  </table>
</div>`}
    ], note:'Load tables.min.css after the core. Add sl-table--responsive and aria-hidden sl-table-label spans to stack labelled records below 40rem; retain table roles and header scopes. Without this opt-in, wide tables use the normal labelled horizontal scroll region.'
  },
  {
    slug:'grid', name:'Grid & columns', group:'Layout', icon:'grid', description:'Equal columns, responsive breakpoints, and auto-fit arrangements.',
    examples:[
      {title:'Responsive columns', description:'One column by default, two from 40rem, and three from 64rem. Resize the window to try it.', html:`<div class="sl-grid sl-sm:cols-2 sl-lg:cols-3 sl-gap-4">
  <div class="demo-cell">Column 01</div><div class="demo-cell">Column 02</div><div class="demo-cell">Column 03</div>
  <div class="demo-cell">Column 04</div><div class="demo-cell">Column 05</div><div class="demo-cell">Column 06</div>
</div>`},
      {title:'Auto-fit cards', description:'No breakpoint classes needed. Columns fit the space available.', html:`<div class="sl-auto-grid sl-gap-4" style="--sl-card-min: 12rem">
  <article class="sl-card sl-stack"><h3 class="sl-text-lg">First idea</h3><p class="sl-text-muted">A flexible foundation.</p></article>
  <article class="sl-card sl-stack"><h3 class="sl-text-lg">Next idea</h3><p class="sl-text-muted">Room to grow.</p></article>
  <article class="sl-card sl-stack"><h3 class="sl-text-lg">Another idea</h3><p class="sl-text-muted">A new perspective.</p></article>
</div>`}
    ], note:'Available column counts are 1–12. Breakpoints: sm 40rem, md 48rem, lg 64rem. Layout follows the viewport, not the width of this preview.'
  },
  {
    slug:'flex', name:'Flex & rows', group:'Layout', icon:'grid', description:'Wrapping rows, aligned actions, and responsive sidebar arrangements.',
    examples:[
      {title:'Wrapping rows', description:'Cluster is a wrapping flex row. Items stay usable when space is limited.', html:`<div class="sl-cluster sl-justify-between sl-gap-6">
  <div class="sl-cluster sl-gap-2"><span class="sl-badge">Design</span><span class="sl-badge">Development</span><span class="sl-badge">Good defaults</span></div>
  <a class="sl-btn sl-btn--outline" href="/layouts/">Explore patterns ↗</a>
</div>`},
      {title:'Sidebar and content', description:'The pair stacks naturally when its minimum widths no longer fit.', html:`<div class="sl-sidebar sl-gap-6">
  <aside class="sl-card sl-stack"><h3 class="sl-text-lg">On this page</h3><a href="/getting-started/">The foundation</a><a href="/themes/">Your palette</a></aside>
  <article class="sl-card sl-stack"><h3 class="sl-text-xl">Your content, in focus.</h3><p class="sl-text-muted">A flexible content region beside a comfortable navigation column. No fixed pixel widths.</p></article>
</div>`}
    ], note:'Use sl-flex with sl-column/sl-row for explicit directions, and sl-cluster for wrapping content. Avoid visual order changes that disagree with reading or tab order.'
  },
  {
    slug:'animations', name:'Hover & motion', group:'Expression', icon:'spark', description:'Small CSS enhancements that respect the user’s motion preferences.',
    examples:[
      {title:'Lift on interaction', description:'Hover with a pointer or Tab to the link. Motion is a website extension, not part of the core.', html:`<div class="sl-grid sl-md:cols-2 sl-gap-6">
  <article class="sl-card sl-stack demo-lift"><span class="sl-badge">Hover or focus</span><h3 class="sl-text-xl">A subtle lift.</h3><p class="sl-text-muted">A little feedback can make a surface feel more responsive.</p><a href="/components/cards/">Explore cards ↗</a></article>
  <article class="sl-card sl-stack demo-glow"><span class="sl-badge">Hover or focus</span><h3 class="sl-text-xl">A quiet glow.</h3><p class="sl-text-muted">A border and shadow shift, with no moving content.</p><a href="/themes/">Explore the palette ↗</a></article>
</div>`},
      {title:'An expressive link', html:`<div class="sl-stack demo-narrow">
  <h3 class="sl-text-xl">Follow your next idea.</h3>
  <a class="demo-animated-link" href="/getting-started/">Make something thoughtful <span aria-hidden="true">→</span></a>
  <p class="sl-help">A keyboard focus ring remains visible throughout.</p>
  </div>`},
      {title:'Reveal as you scroll', description:'Scroll this page to reveal the cards. Supported browsers use native CSS view timelines; other browsers show the content normally.', html:`<div class="sl-grid sl-md:cols-2 sl-gap-6">
  <article class="sl-card sl-stack demo-scroll-reveal"><span class="sl-badge">Scroll reveal</span><h3 class="sl-text-xl">A gentle entrance.</h3><p class="sl-text-muted">Opacity and vertical movement follow this card entering the viewport.</p></article>
  <article class="sl-card sl-stack demo-scroll-reveal"><span class="sl-badge">CSS only</span><h3 class="sl-text-xl">Nothing to initialize.</h3><p class="sl-text-muted">Content stays visible if view timelines are unsupported or reduced motion is enabled.</p></article>
</div>`}
    ], note:'Smooth hover transitions and scroll reveals are defined in website/src/styles/motion.css and included in the downloadable demo extension. Effects respect prefers-reduced-motion. Scroll timelines are progressive enhancement; unsupported browsers keep a static, readable layout.'
  },
  {
    slug:'feedback', name:'Alerts & badges', group:'Data & feedback', icon:'check', description:'Context and status that remain understandable without color alone.',
    examples:[
      {title:'Messages with meaning', html:`<div class="sl-stack">
  <div class="sl-alert"><strong>Good to know.</strong> Optional modules can be loaded independently after the core.</div>
  <div class="sl-alert sl-alert--danger"><strong>Example error.</strong> A project name is required before you can continue.</div>
</div>`},
      {title:'A useful little label', html:`<div class="sl-cluster sl-gap-4"><span class="sl-badge">New</span><span class="sl-badge">In progress</span><span class="sl-badge">CSS only</span><span class="sl-badge">Optional module</span></div>`}
    ], note:'Static information does not need role="alert". A dynamically inserted urgent message may need it; nonurgent updates may use role="status". This CSS does not create announcements.'
  },
  {
    slug:'typography', name:'Typography', group:'Expression', icon:'book', description:'Fluid headings and comfortable text, grounded in the reader’s font settings.',
    examples:[
      {title:'A type scale with room to breathe', html:`<div class="sl-stack sl-gap-6">
  <h2>A thoughtful beginning.</h2><h3>A clear next chapter.</h3><h4>The details that matter.</h4>
  <p class="sl-text-lg">A larger introduction sets the tone for the rest of the page.</p>
  <p class="sl-measure">Body text uses the system font and a comfortable line height. Fluid heading sizes are bounded by rem values so they respect user preferences.</p>
  <p class="sl-help">Helpful context, in a quieter voice.</p>
</div>`},
      {title:'Long-form prose', description:'The optional prose module gives editorial content a consistent rhythm.', html:`<article class="sl-prose"><h3>Leave space for the idea.</h3><p>Good foundations make room for the things that matter. A clear rhythm helps readers move through your content.</p><blockquote>Build the structure once. Let the content change.</blockquote><ul><li>Use meaningful headings.</li><li>Keep the measure comfortable.</li><li>Let links look like links.</li></ul></article>`}
    ], note:'The prose module is optional and requires core tokens. Keep a logical heading hierarchy. Typography size utilities change appearance, not document semantics.'
  }
];
extendLibrary(components);
extendSliderAndFX(components);
extendTestimonials(components);
extendEditor(components);
extendHeaders(components);
extendCursors(components);
extendTabs(components);
components.find(c=>c.slug==='forms')!.examples.push(
  {title:'Styled dropdown with grouped options',description:'A native select with a clean trigger, themed options and an animated popup in supporting browsers. No search plugin is required.',html:'<div class="sl-stack"><div class="sl-field"><label class="sl-label" for="select-library">Choose a module</label><select class="sl-select" id="select-library"><option value="">Select a module…</option><optgroup label="Essentials"><option value="core">Core framework</option><option value="forms">Forms and selects</option></optgroup><optgroup label="Expression"><option value="motion">Motion</option><option value="cursor">Cursor effects</option></optgroup></select></div><div class="sl-field"><label class="sl-label" for="select-unavailable">Unavailable module</label><select class="sl-select" id="select-unavailable" disabled><option>Coming soon</option></select></div></div>'},
  {title:'Multiple selection',description:'Use Ctrl/Command to choose separate options or Shift for a range. Native multiple-selection behavior is preserved.',html:'<div class="sl-field"><label class="sl-label" for="select-modules">Optional modules</label><select class="sl-select" id="select-modules" multiple size="4" aria-describedby="select-modules-help"><option value="motion">Motion</option><option value="tables">Tables</option><option value="editor">Editor styles</option><option value="header">Headers</option></select><p class="sl-help" id="select-modules-help">Choose one or more modules with your keyboard or pointer.</p></div>'}
);
extendReference(components);
export const groups = ['Essentials','Page sections','Layout','Data & feedback','Expression','Collections','Controls','Colors','Date & time','Overlays','Media'];
