#!/usr/bin/env node

/**
 * Markdown to PDF converter
 * Uses markdown-it for parsing and Puppeteer for PDF generation.
 */

const fs = require("fs");
const path = require("path");

// Resolve modules using local project dependencies.
function req(mod) {
  return require(mod);
}

function ensureRelativePath(filePath, optionName) {
  if (path.isAbsolute(filePath)) {
    console.error(`Error: ${optionName} must be a relative path: ${filePath}`);
    process.exit(1);
  }
  return path.normalize(filePath);
}

// --- Argument parsing ---
function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    input: null,
    output: null,
    style: path.join("..", "assets", "default-style.css"),
    format: "A4",
    landscape: false,
    toc: false,
    headerFooter: true,
    headerText: "",
    marginTop: "25mm",
    marginBottom: "25mm",
    marginLeft: "20mm",
    marginRight: "20mm",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];
    switch (arg) {
      case "--input":
      case "-i":
        opts.input = next;
        i++;
        break;
      case "--output":
      case "-o":
        opts.output = next;
        i++;
        break;
      case "--style":
      case "-s":
        opts.style = next;
        i++;
        break;
      case "--format":
      case "-f":
        opts.format = next;
        i++;
        break;
      case "--landscape":
      case "-l":
        opts.landscape = true;
        break;
      case "--toc":
        opts.toc = true;
        break;
      case "--header-footer":
        opts.headerFooter = next !== "false";
        if (next === "false" || next === "true") i++;
        break;
      case "--header-text":
        opts.headerText = next;
        i++;
        break;
      case "--margin-top":
        opts.marginTop = next;
        i++;
        break;
      case "--margin-bottom":
        opts.marginBottom = next;
        i++;
        break;
      case "--margin-left":
        opts.marginLeft = next;
        i++;
        break;
      case "--margin-right":
        opts.marginRight = next;
        i++;
        break;
      default:
        if (!opts.input && !arg.startsWith("-")) {
          opts.input = arg;
        }
    }
  }

  if (!opts.input) {
    console.error("Error: --input is required");
    console.error(
      "Usage: node md-to-pdf.js --input <file.md> [--output <file.pdf>] [options]"
    );
    process.exit(1);
  }

  if (!opts.output) {
    opts.output = opts.input.replace(/\.md$/i, "") + ".pdf";
  }

  return opts;
}

// --- Markdown setup ---
function createMarkdownRenderer() {
  const MarkdownIt = req("markdown-it");
  const hljs = req("highlight.js");

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true })
              .value +
            "</code></pre>"
          );
        } catch (_) {}
      }
      return (
        '<pre class="hljs"><code>' +
        md.utils.escapeHtml(str) +
        "</code></pre>"
      );
    },
  });

  // Enable plugins
  try {
    md.use(req("markdown-it-footnote"));
  } catch (_) {}
  try {
    md.use(req("markdown-it-task-lists"));
  } catch (_) {}
  try {
    md.use(req("markdown-it-emoji"));
  } catch (_) {}

  return md;
}

// --- TOC generation ---
function generateTOC(htmlContent) {
  const headingRegex =
    /<h([2-4])\s*(?:id="([^"]*)")?[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings = [];
  let match;
  let idCounter = 0;

  // First pass: collect headings and assign IDs
  const updatedHtml = htmlContent.replace(headingRegex, (full, level, id, text) => {
    const cleanText = text.replace(/<[^>]+>/g, "").trim();
    const headingId = id || `heading-${idCounter++}`;
    headings.push({ level: parseInt(level), text: cleanText, id: headingId });
    return `<h${level} id="${headingId}">${text}</h${level}>`;
  });

  if (headings.length === 0) return { toc: "", html: updatedHtml };

  let tocHtml = '<div class="table-of-contents">\n<h2>Table of Contents</h2>\n<ul>\n';
  for (const h of headings) {
    const indent = "  ".repeat(h.level - 2);
    tocHtml += `${indent}<li class="toc-level-${h.level}"><a href="#${h.id}">${h.text}</a></li>\n`;
  }
  tocHtml += "</ul>\n</div>\n";

  return { toc: tocHtml, html: updatedHtml };
}

// --- Build HTML document ---
function buildHtml(markdownContent, opts) {
  const md = createMarkdownRenderer();
  let htmlBody = md.render(markdownContent);

  let tocHtml = "";
  if (opts.toc) {
    const result = generateTOC(htmlBody);
    tocHtml = result.toc;
    htmlBody = result.html;
  }

  // Load CSS
  let css = "";
  try {
    css = fs.readFileSync(opts.style, "utf-8");
  } catch (e) {
    console.warn(`Warning: Could not load style file ${opts.style}, using defaults`);
  }

  // highlight.js CSS
  let hljsCss = "";
  try {
    hljsCss = fs.readFileSync(require.resolve("highlight.js/styles/github.min.css"), "utf-8");
  } catch (_) {
    try {
      hljsCss = fs.readFileSync(require.resolve("highlight.js/styles/github.css"), "utf-8");
    } catch (_) {}
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${hljsCss}</style>
  <style>${css}</style>
</head>
<body>
  ${tocHtml}
  ${htmlBody}
</body>
</html>`;
}

// --- Generate PDF ---
async function generatePdf(htmlContent, opts) {
  const puppeteer = req("puppeteer");

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfOptions = {
    path: opts.output,
    format: opts.format,
    landscape: opts.landscape,
    printBackground: true,
    margin: {
      top: opts.marginTop,
      bottom: opts.marginBottom,
      left: opts.marginLeft,
      right: opts.marginRight,
    },
  };

  if (opts.headerFooter) {
    const headerHtml = opts.headerText
      ? `<div style="font-size:9px; color:#888; width:100%; text-align:center; padding:5px 0;">${opts.headerText}</div>`
      : "<span></span>";

    pdfOptions.displayHeaderFooter = true;
    pdfOptions.headerTemplate = headerHtml;
    pdfOptions.footerTemplate = `
      <div style="font-size:9px; color:#888; width:100%; text-align:center; padding:5px 0;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>`;
  }

  await page.pdf(pdfOptions);
  await browser.close();

  console.log(`PDF generated: ${opts.output}`);
}

// --- Main ---
async function main() {
  const opts = parseArgs(process.argv);
  opts.input = ensureRelativePath(opts.input, "--input");
  opts.output = ensureRelativePath(opts.output, "--output");
  opts.style = ensureRelativePath(opts.style, "--style");

  const inputPath = path.resolve(process.cwd(), opts.input);
  const outputPath = path.resolve(process.cwd(), opts.output);
  const stylePath = path.resolve(process.cwd(), opts.style);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${opts.input}`);
    process.exit(1);
  }

  const markdown = fs.readFileSync(inputPath, "utf-8");
  opts.output = outputPath;
  opts.style = stylePath;
  const html = buildHtml(markdown, opts);
  await generatePdf(html, opts);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
