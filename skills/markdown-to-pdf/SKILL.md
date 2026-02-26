---
name: markdown-to-pdf
description: >
  Convert Markdown files to beautifully styled PDF documents using Node.js (markdown-it + Puppeteer).
  Use this skill whenever the user wants to convert .md files to .pdf, generate a PDF from Markdown content,
  create a styled PDF report/document from Markdown, or export Markdown as PDF. Also trigger when the user
  mentions "markdown to pdf", "md to pdf", "render markdown as pdf", "export markdown", or asks to
  "make a PDF from this markdown". Supports GFM tables, syntax-highlighted code blocks, math (KaTeX),
  table of contents generation, custom CSS themes, headers/footers with page numbers, and full Unicode
  including diacritics (Czech, Slovak, German, etc.).
---

# Markdown to PDF Skill

Convert Markdown to professionally styled PDF using Node.js with `markdown-it` and `puppeteer`.

All commands below assume the current directory is the directory containing this file (`skills/markdown-to-pdf`).

## Quick Start

1. Install dependencies (locally in the skill directory):
   ```bash
   pnpm install
   ```

2. Run the conversion script:
   ```bash
    mkdir -p ./build
    node ./scripts/md-to-pdf.js \
     --input <path-to-markdown> \
       --output ./build/<output-name>.pdf
   ```

3. The output PDF will be in `./build/`. Present the path to the user.

## Full Usage

```bash
node ./scripts/md-to-pdf.js [options]

Options:
  --input, -i       Path to input .md file (required)
  --output, -o      Path to output .pdf file (default: input name with .pdf)
   --style, -s       Path to custom CSS file (default: ./assets/default-style.css)
  --format, -f      Page format: A4, Letter, A3, Legal (default: A4)
  --landscape, -l   Use landscape orientation (default: false)
  --toc             Generate table of contents from headings (default: false)
  --header-footer   Enable page numbers in footer (default: true)
  --header-text     Custom header text (default: empty)
  --margin-top      Top margin (default: "25mm")
  --margin-bottom   Bottom margin (default: "25mm")
  --margin-left     Left margin (default: "20mm")
  --margin-right    Right margin (default: "20mm")
```

## Features

### Supported Markdown Extensions
- **GFM tables** — GitHub-flavored Markdown tables with alignment
- **Syntax highlighting** — Code blocks with language-specific highlighting via highlight.js
- **Task lists** — `- [x]` checkboxes
- **Strikethrough** — `~~text~~`
- **Footnotes** — `[^1]` style footnotes
- **Table of Contents** — Auto-generated from headings with `--toc` flag
- **Emoji** — `:emoji_name:` shortcodes
- **Math** — KaTeX inline `$...$` and block `$$...$$` (if katex is installed)

### PDF Features
- Page numbers in footer (configurable)
- Custom headers and footers
- Configurable margins and page size
- Automatic page breaks before `h1` headings
- Full Unicode/diacritics support (uses system fonts)
- Print-optimized CSS with proper break rules

## Workflow

When a user asks to convert Markdown to PDF:

1. **Identify the input** — Is it a file path, or inline Markdown content? If inline, save it to a temp `.md` file first.

2. **Install dependencies** (locally in the skill directory):
   ```bash
   pnpm install
   ```

3. **Run the script** with appropriate options. Choose options based on context:
   - For reports/docs: `--toc --header-footer`
   - For simple notes: defaults are fine
   - For code-heavy docs: defaults with syntax highlighting (automatic)
   - For non-English content: no special config needed, Unicode works out of the box

4. **Save output** to `./build/` — always create the directory first with `mkdir -p ./build`, then pass `--output ./build/<name>.pdf`. Present the resulting path to the user.

## Custom Styling

Users can provide a custom CSS file via `--style`. The default style (`./assets/default-style.css`) provides a clean, professional look. Key CSS classes available:

- `body` — Main content area
- `h1, h2, h3...` — Headings
- `table` — GFM tables
- `pre > code` — Code blocks (highlight.js themes apply here)
- `.task-list-item` — Checkbox items
- `.table-of-contents` — TOC wrapper
- `.footnotes` — Footnotes section

To create a custom theme, copy `./assets/default-style.css` and modify it.

## Troubleshooting

- **Puppeteer launch fails**: Run `pnpm dlx puppeteer browsers install chrome` or use `--no-sandbox` (the script already includes `--no-sandbox` for container environments).
- **Missing fonts/diacritics**: Install fonts with `apt-get install fonts-noto` if characters render as boxes.
- **Large files slow**: For very large Markdown files (>100 pages), consider splitting into chunks.
- **Code blocks overflow**: The default CSS includes `word-wrap: break-word` for code blocks. For very long lines, consider adding `--style` with custom overflow rules.
