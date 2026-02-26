# Advanced Reference

## Custom Themes

### Creating a Theme

Copy `assets/default-style.css` and modify. Pass via `--style`:

```bash
node scripts/md-to-pdf.js -i doc.md --style my-theme.css
```

### Dark Theme Tips

For dark-themed PDFs, override background on `body` and set `print-color-adjust: exact`:

```css
body {
  background-color: #1e1e2e;
  color: #cdd6f4;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
```

## Handling Large Documents

For documents over ~100 pages:
- Use `--no-toc` to skip TOC generation (speeds up processing)
- Consider splitting into chapters and merging the resulting PDFs
- Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=4096" node scripts/md-to-pdf.js ...`

## Adding Custom Fonts

1. Install the font on the system or place `.ttf`/`.woff2` files alongside the CSS
2. Reference in your custom CSS:

```css
@font-face {
  font-family: 'MyFont';
  src: url('path/to/font.woff2') format('woff2');
}
body {
  font-family: 'MyFont', sans-serif;
}
```

## KaTeX Math Support

To enable math rendering, install KaTeX and the markdown-it-katex plugin:

```bash
npm install katex markdown-it-katex
```

Then the script will need modification to add the plugin. A future version may include this out of the box.

## Mermaid Diagram Support

Mermaid diagrams require a browser-based rendering step. One approach:
1. Render Markdown to HTML
2. Include mermaid.js CDN in the HTML
3. Let Puppeteer render the diagrams before generating PDF

This is not included by default due to complexity and CDN dependency.

## Programmatic Usage

The script can also be imported as a module:

```javascript
const { buildHtml, generatePdf } = require('./scripts/md-to-pdf.js');

// Note: you'll need to refactor the script slightly to export these functions
```

## Troubleshooting

### "Could not find Chrome"
Puppeteer needs Chromium. In containers:
```bash
npx puppeteer browsers install chrome
```

### Diacritics render as boxes
Install Noto fonts:
```bash
apt-get install -y fonts-noto-core fonts-noto-extra
```

### PDF is blank
Check that `waitUntil: 'networkidle0'` is working. For offline environments with no external resources, change to `'load'`.

### Page breaks in wrong places
Add CSS to your custom style:
```css
.keep-together {
  page-break-inside: avoid;
}
.page-break {
  page-break-before: always;
}
```

Then use in Markdown with raw HTML:
```html
<div class="keep-together">
  Content that should stay together
</div>

<div class="page-break"></div>
```
