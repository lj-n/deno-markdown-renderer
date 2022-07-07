import { He, Marked, Prismjs, sanitizeHTML } from "./depts.ts";

interface CustomRenderOptions {
  anchorElement?: string;
  linkClass?: string;
  headingClass?: string;
  codeClass?: string;
}

class Renderer extends Marked.Renderer {
  customOptions: CustomRenderOptions = {};
  constructor(customOptions: CustomRenderOptions = {}) {
    super();
    this.customOptions = customOptions;
  }

  code(code: string, lang = "") {
    const { codeClass } = this.customOptions;
    const customClass = codeClass ? ` class="${codeClass}"` : "";
    if (!Object.hasOwnProperty.call(Prismjs.languages, lang)) {
      return `<pre${customClass}><code>${He.escape(code)}</code></pre$>`;
    }
    const html = Prismjs.highlight(code, Prismjs.languages[lang], lang);
    return `<div class="highlight language-${lang}"${customClass}><pre>${html}</pre></div>`;
  }

  heading(
    text: string,
    level: 1 | 2 | 3 | 4 | 5 | 6,
    raw: string,
    slugger: Marked.Slugger
  ) {
    const slug = slugger.slug(raw);
    const { anchorElement, headingClass } = this.customOptions;
    const customClass = headingClass ? ` class="${headingClass}"` : "";
    if (!anchorElement) {
      return `<h${level} id="${slug}"${customClass}>${text}</h${level}>`;
    }
    return `<h${level} id="${slug}"${customClass}><a class="anchor" aria-hidden="true" tabindex="-1" href="#${slug}">${anchorElement}</a>${text}</h${level}>`;
  }

  link(href: string, title: string, text: string) {
    const { linkClass } = this.customOptions;
    const customClass = linkClass ? ` class="${linkClass}"` : "";
    if (href.startsWith("#")) {
      return `<a href="${href}"${customClass}>${text}</a>`;
    }
    return `<a href="${href}" title="${title}" rel="noopener noreferrer"${customClass}>${text}</a>`;
  }
}

interface CustomOptions {
  gfm?: boolean;
  renderOptions?: CustomRenderOptions;
  sanitizeAllowTags?: string[];
  sanitizeAllowAttributes?: { [key: string]: string[] };
  sanitizeAllowClasses?: { [key: string]: string[] };
}

export function renderMarkdown(
  markdown: string,
  { gfm = true, ...options }: CustomOptions = {}
) {
  const htmlString = Marked.marked(markdown, {
    renderer: new Renderer(options.renderOptions),
    gfm,
  });

  const allowedTags = sanitizeHTML.defaults.allowedTags.concat(
    options.sanitizeAllowTags || []
  );

  return sanitizeHTML(htmlString, {
    allowedTags,
    allowedAttributes: {
      ...sanitizeHTML.defaults.allowedAttributes,
      ...options.sanitizeAllowAttributes,
    },
    allowedClasses: {
      ...options.sanitizeAllowClasses,
    },
    allowProtocolRelative: false,
  });
}
