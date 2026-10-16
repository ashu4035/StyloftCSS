# WYSIWYG editor presentation

Load `dist/styloft.min.css`, then `dist/editor.min.css`. The editor module is optional: 2,678 raw bytes / 897 gzip bytes (gzip level 9). It uses the core semantic theme tokens and supports dark and light scopes.

```html
<link rel="stylesheet" href="/css/styloft.min.css">
<link rel="stylesheet" href="/css/editor.min.css">
<p id="draft-label" class="sl-label">Draft content</p>
<p id="draft-help" class="sl-help">Edit your draft. Changes are not saved in this example.</p>
<div class="sl-editor">
  <div class="sl-editor__toolbar" role="group" aria-label="Formatting controls (inactive example)">
    <button class="sl-editor__tool" type="button" aria-label="Bold" disabled><strong>B</strong></button>
    <button class="sl-editor__tool" type="button" aria-label="Italic" disabled><em>I</em></button>
  </div>
  <div class="sl-editor__content" contenteditable="true" role="textbox"
       aria-multiline="true" aria-labelledby="draft-label" aria-describedby="draft-help" spellcheck="true">
    <p>Start writing here.</p>
  </div>
  <div class="sl-editor__footer">Local editing example</div>
</div>
```

Native `contenteditable` supports text editing. This CSS styles the toolbar, canvas, formatted content and footer. Formatting commands, selection management, pressed states, undo history, validation, uploads, persistence and sanitization belong to your application's editor logic. Keep the demo buttons disabled until those behaviors are connected. Use `aria-pressed` only for real toggle states. Controls use normal button semantics and tab order; no custom ARIA toolbar keyboard model is claimed.

`contenteditable` is not a form control: collect and serialize its content explicitly in your application. Sanitize untrusted pasted/stored HTML before rendering. Do not use CSS placeholders as the field's only label.

Modifiers:

- `sl-editor--compact`: shorter canvas for comments.
- `sl-editor--invalid`: error border; also set `aria-invalid="true"` and link real error text using `aria-describedby` on the editable field.
- `sl-editor--readonly`: compact published preview; omit `contenteditable`, textbox roles and formatting controls for static output.

Copy complete examples at `/components/editor/` or `/light/components/editor/`. All four previews show the exact HTML used. The toolbar wraps on narrow screens, tools have 44px minimum dimensions, and hover transitions honor reduced motion.
