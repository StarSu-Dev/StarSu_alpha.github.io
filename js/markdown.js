// Minimal Markdown → HTML converter for headings, emphasis, code, and lists
const Markdown = (() => {
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderInline(text) {
    // code
    let t = text.replace(
      /`([^`]+)`/g,
      (_, c) => `<code>${escapeHtml(c)}</code>`
    );
    // bold
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // italics
    t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return t;
  }

  function parse(md) {
    const lines = md.replace(/\r\n?/g, "\n").split("\n");
    const out = [];
    let inCode = false;
    let listOpen = false;
    let buf = [];

    function flushParagraph() {
      if (buf.length) {
        out.push(`<p>${renderInline(buf.join(" ").trim())}</p>`);
        buf = [];
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("```")) {
        if (!inCode) {
          flushParagraph();
          inCode = true;
          out.push("<pre><code>");
        } else {
          inCode = false;
          out.push("</code></pre>");
        }
        continue;
      }
      if (inCode) {
        out.push(escapeHtml(line));
        continue;
      }

      const h = line.match(/^(#{1,6})\s+(.+)$/);
      if (h) {
        flushParagraph();
        const level = h[1].length;
        out.push(`<h${level}>${renderInline(h[2].trim())}</h${level}>`);
        continue;
      }

      const li = line.match(/^\s*[-*+]\s+(.+)$/);
      if (li) {
        flushParagraph();
        if (!listOpen) {
          listOpen = true;
          out.push("<ul>");
        }
        out.push(`<li>${renderInline(li[1].trim())}</li>`);
        continue;
      } else if (listOpen && line.trim() === "") {
        // continue list through blank line: close it first
        out.push("</ul>");
        listOpen = false;
        continue;
      }

      if (line.trim() === "") {
        flushParagraph();
      } else {
        buf.push(line.trim());
      }
    }
    if (inCode) out.push("</code></pre>");
    if (listOpen) out.push("</ul>");
    flushParagraph();
    return out.join("\n");
  }

  return { parse };
})();

window.Markdown = Markdown;



