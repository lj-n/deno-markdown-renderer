# deno-markdown-renderer

Deno server-side markdown rendering. Including HTML sanitization & GitHub Flavored Markdown per default.

This is a fork of [deno-gfm](https://github.com/lucacasonato/deno-gfm) giving the user more control over the HTML sanitization and styling of components.

## Usage

```js
import { renderMarkdown } from "https://deno.land/x/markdown_renderer/mod.ts";

const markdown = await Deno.readTextFile('my-markdown.md')

const html = renderMarkdown(markdown);
```

## Customize sanitization

[Sanitize-html](https://github.com/apostrophecms/sanitize-html) is used for the sanitization. By default things to render markdown and syntax highlighting are enabled:

```js
allowedTags: [
  "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
  "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
  "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
  "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
  "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
  "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
  "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
],
allowedAttributes: {
  a: ["href", "title", "rel", "tabindex", "aria-hidden", "class"],
  h1: ["id", "class"],
  h2: ["id", "class"],
  h3: ["id", "class"],
  h4: ["id", "class"],
  h5: ["id", "class"],
  h6: ["id", "class"]
},
allowedClasses: {
  a: ["anchor"],
  pre: ["highlight", "language-*"],
  span: [
    "atrule-id", "attr-name", "boolean", "cdata",
    "class-name", "comment", "control", "doctype",
    "function", "keyword", "namespace", "number",
    "operator", "plain-text", "prolog", "property",
    "punctuation", "regex", "regex-delimiter", "script",
    "script-punctuation", "selector", "statement", "string",
    "tag", "tag-id", "token", "unit"
  ]
}
```

To allow your own rules pass some options to the render function:

```js
const options = {
  allowedTags: ["img", "svg"],
  allowedAttributes: {
    img: ["height", "width", "alt"],
  },
  allowedClasses: {
    div: ["my-class"],
  },
  disableDefaults: true // to disable all default rules
};

const html = renderMarkdown(markdown, options);
```

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

## Syntax Highlighting Languages

[Prism](https://github.com/PrismJS/prism) is used for syntax highlighting. It highlightes JavaScript and HTML per default. To highlight [more languages](https://unpkg.com/browse/prismjs@1.28.0/components/) import them like so:

```js
import { renderMarkdown } from "https://deno.land/x/markdown_renderer/mod.ts";

// Add TypeScript syntax highlighting
import "https://esm.sh/prismjs@1.28.0/components/prism-typescript?no-check";
```

## Styling

By default no styling is included.
Code blocks will have the classes `highlight` and `language-{lang}`, so any [PrismJS Themes](https://github.com/PrismJS/prism-themes) should work. Or you can make your own.
