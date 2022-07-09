# deno-markdown-renderer

Deno server-side markdown rendering. Including HTML sanitization & GitHub Flavored Markdown per default.

This is a fork of [deno-gfm](https://github.com/lucacasonato/deno-gfm) giving the user more control over the HTML sanitization and styling of components.

---

## Usage

```js
import { renderMarkdown } from "https://deno.land/x/markdown_renderer/mod.ts";

const markdown = `
    # Hi there

    [GitHub](https://github.com)
`;

const html = renderMarkdown(markdown);
```

will render

```html
<h1>Hi there</h1>
<a href="https://github.com">GitHub</a>
```

---

## Customize sanitization

[Sanitize-html](https://github.com/apostrophecms/sanitize-html) is used for the sanitization and you can find the default allowed tags and attributes [here](https://github.com/apostrophecms/sanitize-html#default-options).

To allow your own rules pass some options to the render function:

```js
const options = {
  sanitizeAllowTags: ["img", "svg"],
  sanitizeAllowAttributes: {
    a: ["href", "rel"],
  },
  sanitizeAllowClasses: {
    div: ["my-class"],
  },
};

const html = renderMarkdown(markdown, options);
```

---

## Customize rendering

### Anchor tag for headings

You can render a custom anchor tag for your headings, for example an svg:

```js

const svg = '
    <svg height="16" width="16"><circle cx="50" cy="50" r="40" stroke="black"/></svg>
';

const options = {
  sanitizeAllowTags: ["svg", "circle"],
  sanitizeAllowAttributes: {
    a: ["id", "href", "aria-hidden", "rel", "tabindex"],
    svg: ["height", "width"],
    circle: ["cx", "cy", "r", "stroke"],
  },
  render: {
    anchorElement: svg,
  },
};

const html = renderMarkdown(markdown, options);
```

this would render

```html
<h1 id="#my-heading">
  <a class="anchor" aria-hidden="true" tabindex="-1" href="#my-heading">
    <svg height="16" width="16">
      <circle cx="50" cy="50" r="40" stroke="black" />
    </svg>
  </a>
  My Heading
</h1>
```

### Custom class

Currently you can give headings, links and code a custom class:

```js
const options = {
  // ...
  linkClass: "custom-class",
  headingClass: "custom-class",
  codeClass: "custom-class",
};

const html = renderMarkdown(markdown, options);
```

---

## Syntax Highlighting Languages

[Prism](https://github.com/PrismJS/prism) is used for syntax highlighting. It highlightes JavaScript and HTML per default. To highlight [more languages](https://unpkg.com/browse/prismjs@1.28.0/components/) import them like so:

```js
import { renderMarkdown } from "https://deno.land/x/markdown_renderer/mod.ts";

// Add TypeScript syntax highlighting
import "https://esm.sh/prismjs@1.28.0/components/prism-typescript?no-check";
```

## Styling

By default no styling is included.
Code blocks will have the classes `highlight` and `language-{lang}`, so any [PrismJS Themes](https://github.com/PrismJS/prism-themes) should work.