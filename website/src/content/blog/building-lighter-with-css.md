---
title: "Building lighter websites with CSS and native HTML"
description: "A practical starting point for choosing native browser controls, loading less CSS and keeping interactions accessible."
date: "2026-10-22"
author: "Ashish Verma"
category: "CSS & HTML"
readingTime: "3 min read"
draft: false
---
A useful interface does not always need a JavaScript component. Before adding a dependency, look at what the browser already provides. Semantic HTML and a small amount of CSS can cover many everyday patterns, while leaving room for JavaScript where it makes an interaction better.

## Start with the right element

For a section that opens and closes, start with native disclosure elements. A summary supplies the control's visible name, and the browser manages its open state. You can style the result without writing a click handler.

```html
<details>
  <summary>What do I need to get started?</summary>
  <p>A stylesheet and a little semantic HTML.</p>
</details>
```

Keep the summary meaningful. Someone navigating by keyboard should understand what will open before activating it. Test the actual example with a keyboard and on a small screen; using a native element is a starting point, rather than a replacement for checking the finished design.

## Load the styles you use

A small stylesheet is easier to reason about when its responsibilities are clear. Start with a foundation for typography, spacing and layout. Add specialized styles only when a page needs them.

StyloftCSS follows this approach with a core stylesheet and optional modules. The [getting started guide](/getting-started/) explains installation, while the [component library](/components/) shows which styles each example needs. Check those dependencies before copying an example into your own project.

## Make motion optional

Movement can communicate a change, but the content should remain understandable without it. Respect reduced-motion preferences and avoid making an animation the only signal that something happened. Keep a visible focus indicator, make controls large enough to activate and check that text still fits when a visitor zooms in.

## Choose JavaScript when the behavior needs it

CSS-only is a design constraint, not a reason to remove useful behavior. Complex keyboard navigation, application state and asynchronous updates may need JavaScript. Start with the interaction people need, then choose the simplest implementation that supports it reliably.

For your next small project, try a native disclosure, a responsive grid and a clear navigation header. Measure the result, test it on a phone and add complexity only where it solves a concrete problem. The [practical tutorials](/tutorials/) provide working examples to help you take that first step.
