# Component catalog coverage

The [HeroUI component catalog](https://heroui.com/en/docs/react/components) supplied the 72 component names used for coverage. StyloftCSS provides its own HTML/CSS examples and native alternatives; it does not depend on HeroUI, React or Tailwind and does not reproduce the React API. Open `/components/component-reference/` for all 72 mappings.

The expansion adds 21 documentation sections, 9 optional CSS modules and 20 standalone packs. Existing buttons and disclosures also receive examples. Each component page includes copyable HTML, a live playground and links to the relevant CSS downloads. Use a standalone pack alone or load the optional module after the core; see `component-packs.md` for measured sizes.

## Native interactions

Checkboxes, radios, switches, numeric fields, date/time fields and range controls use native inputs. Autocomplete and ComboBox examples use native datalist suggestions. Modals and drawers use dialog invoker commands (`commandfor`); popovers use `popovertarget`. These examples need modern browser support. Escape, focus containment and focus return are supplied by the browser for modal dialogs. Disclosures use details/summary. Hover and state effects have transitions and reduced-motion alternatives. Tooltips are noninteractive hover/focus hints rather than full application tooltip controllers.

## Application integration boundaries

- Calendar shows a fixed October 2026 example with native day selection. Month navigation, localization, arbitrary date arithmetic and range coordination need application code. Native date inputs provide real date entry.
- ColorArea is a visual gradient, not a functioning two-dimensional color editor. ColorSlider uses a native range input; conversion, synchronization and theme updates need application code. Native color input provides the working picker alternative.
- Autocomplete suggestions are static. Remote search, filtering rules and full ARIA combobox behavior need an application integration.
- Pagination links demonstrate navigation styling; fetching or slicing data belongs to the application.
- Toast examples demonstrate presentation and native dismissal; queues, timers and announcements require application logic.
- OTP uses a single native input with autocomplete/pattern constraints. Sending and verification require backend integration.
- Forms demonstrate labels, help, validation semantics and layout; submission, persistence and server validation belong to the consuming site.
- Toolbar and listbox-like collections retain normal native keyboard behavior; custom composite-widget arrow-key interaction is not claimed.

These boundaries are stated beside the corresponding examples. The CSS framework remains free of runtime JavaScript.
