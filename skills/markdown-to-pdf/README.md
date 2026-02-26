# Markdown to PDF Skill

Convert Markdown (`.md`) to styled PDF using Node.js, `markdown-it`, and `puppeteer`.

## Features

- GFM tables
- Syntax-highlighted code blocks (`highlight.js`)
- Task lists
- Footnotes
- Optional table of contents (`--toc`)
- Header/footer with page numbers
- Unicode and diacritics support

## Directory

All commands below assume current directory is:

```bash
skills/markdown-to-pdf
```

## Requirements

- Node.js 18+
- `pnpm`

## Install

```bash
pnpm install
```

## Usage

```bash
node ./scripts/md-to-pdf.js --input <path-to-file.md> --output ./build/<name>.pdf
```

Common options:

- `--style, -s` custom CSS (default: `./assets/default-style.css`)
- `--format, -f` page format (`A4`, `Letter`, `A3`, `Legal`)
- `--landscape, -l` landscape orientation
- `--toc` generate table of contents
- `--header-footer` enable/disable page numbers in footer (default: enabled)
- `--header-text` custom header text
- `--margin-top`, `--margin-bottom`, `--margin-left`, `--margin-right`

## Test Example

Run this exact test with the included sample Markdown:

```bash
mkdir -p ./build
node ./scripts/md-to-pdf.js --input ./test/sample.md --output ./build/sample.pdf --toc --header-footer --header-text "Markdown to PDF Test"
```

Expected result:

- File `./build/sample.pdf` is created.
- PDF contains tables, code highlighting, task list, diacritics, and footnotes from `./test/sample.md`.

## Troubleshooting

- If Chromium is missing for Puppeteer:

```bash
pnpm dlx puppeteer browsers install chrome
```

- If some characters render as empty boxes, install fonts with broad Unicode coverage (for example Noto fonts).
