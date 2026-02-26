# Sample Document

This is a test document for the **Markdown to PDF** skill.

## Features Demo

### Text Formatting

This paragraph demonstrates *italic*, **bold**, ~~strikethrough~~, and `inline code`.

> This is a blockquote. It should have a nice blue left border and light background.
>
> — Some Author

### Code Block

```javascript
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

greet("World");
```

### Table

| Feature        | Status | Notes                     |
| -------------- | ------ | ------------------------- |
| GFM Tables     | ✅     | Full support              |
| Code Highlight | ✅     | via highlight.js          |
| Task Lists     | ✅     | Checkbox rendering        |
| Diacritics     | ✅     | čšžťďňľáéíóúý ČŠŽŤĎŇĽ   |
| Math (KaTeX)   | ⚠️     | Requires extra plugin     |

### Task List

- [x] Parse Markdown
- [x] Apply CSS styles
- [x] Generate PDF
- [ ] Add KaTeX support
- [ ] Add Mermaid support

### Diacritics Test

Príliš žluťoučký kůň úpěl ďábelské ódy. Zvláštní žluťoučký kůň.

Slovenčina: ľúbiť, šťastie, vŕba, dážď, kôň.

Čeština: příliš, žluťoučký, ďábelské, říční.

---

## Second Section

This section demonstrates that `h1` headings trigger page breaks automatically (except the first one).

### Footnotes

This text has a footnote[^1].

[^1]: This is the footnote content.

### Nested Blockquote

> Level 1
>
> > Level 2 — nested blockquote

That's all! 🎉
