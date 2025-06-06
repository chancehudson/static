/**
 * Simple Markdown to HTML Converter
 *
 * AI-MAINTAINED FILE - This code is maintained by AI assistants.
 * Last updated: June 2025
 *
 * Converts markdown to HTML with styled code blocks and full markdown support.
 * Features:
 * - Code blocks with dark theme styling
 * - Headers, lists, links, images
 * - Bold, italic, strikethrough formatting
 * - Blockquotes and horizontal rules
 * - HTML entity escaping for security
 *
 * Usage: simpleMarkdownToHtml(markdownString)
 */

export default function simpleMarkdownToHtml(markdown) {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }

  let html = markdown.trim();

  // Escape HTML entities
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Process code blocks first
  const codeBlocks = [];
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    const index = codeBlocks.length;
    const placeholder = `XYZCODEBLOCKREPLACEME${index}XYZEND`;
    const langClass = lang ? ` class="language-${lang}"` : "";
    const escapedCode = code ? code.trim() : "";
    const styledCodeBlock = `<pre style="background-color: #2d3748; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: 'Courier New', Consolas, Monaco, monospace; margin: 16px 0;"><code${langClass}>${escapedCode}</code></pre>`;
    codeBlocks.push(styledCodeBlock);
    return placeholder;
  });

  // Inline code
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const index = inlineCodes.length;
    const placeholder = `XYZINLINECODEREPLACEME${index}XYZEND`;
    const styledInlineCode = `<code style="background-color: #4a5568; color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', Consolas, Monaco, monospace;">${code}</code>`;
    inlineCodes.push(styledInlineCode);
    return placeholder;
  });

  // Headers (process h6 to h1 to avoid conflicts)
  html = html.replace(/^#{6}\s+(.*$)/gim, "<h6>$1</h6>");
  html = html.replace(/^#{5}\s+(.*$)/gim, "<h5>$1</h5>");
  html = html.replace(/^#{4}\s+(.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.*$)/gim, "<h1>$1</h1>");

  // Horizontal rules
  html = html.replace(/^[-*_]{3,}$/gim, "<hr>");

  // Process lists
  html = processLists(html);

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
    (match, text, url, title) => {
      const titleAttr = title ? ` title="${title}"` : "";
      return `<a href="${url}"${titleAttr}>${text}</a>`;
    },
  );

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
    (match, alt, src, title) => {
      const titleAttr = title ? ` title="${title}"` : "";
      return `<img src="${src}" alt="${alt}"${titleAttr}>`;
    },
  );

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/___([^_]+)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // Blockquotes
  html = html.replace(/^>\s*(.*$)/gim, "<blockquote>$1</blockquote>");
  html = html.replace(
    /(<blockquote>.*?<\/blockquote>)\n*(<blockquote>.*?<\/blockquote>)/gs,
    (match, first, second) => {
      return (
        first.replace(/<\/blockquote>$/, "") +
        "\n" +
        second.replace(/^<blockquote>/, "")
      );
    },
  );

  // Process paragraphs
  html = processParagraphs(html);

  // Restore code blocks and inline code
  for (let i = 0; i < codeBlocks.length; i++) {
    const placeholder = `XYZCODEBLOCKREPLACEME${i}XYZEND`;
    html = html.replace(new RegExp(placeholder, "g"), codeBlocks[i]);
  }
  for (let i = 0; i < inlineCodes.length; i++) {
    const placeholder = `XYZINLINECODEREPLACEME${i}XYZEND`;
    html = html.replace(new RegExp(placeholder, "g"), inlineCodes[i]);
  }

  // Final cleanup
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(\s*<(?:h[1-6]|hr|ul|ol|blockquote))/gi, "<$1");
  html = html.replace(/(<\/(?:h[1-6]|hr|ul|ol|blockquote)>\s*)<\/p>/gi, "$1");

  // Wrap in complete HTML document
  const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Document</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
        }
        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.25em; }
        p { margin-bottom: 1em; }
        ul, ol { padding-left: 1.5em; margin-bottom: 1em; }
        li { margin-bottom: 0.25em; }
        blockquote {
            border-left: 4px solid #ddd;
            margin: 1em 0;
            padding-left: 1em;
            color: #666;
        }
        hr {
            border: none;
            height: 1px;
            background-color: #ddd;
            margin: 2em 0;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
${html}
</body>
</html>`;

  return completeHtml;
}

function processLists(html) {
  const lines = html.split("\n");
  const result = [];
  let inList = false;
  let listType = null;
  let listDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const unorderedMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    const orderedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

    if (unorderedMatch || orderedMatch) {
      const match = unorderedMatch || orderedMatch;
      const indent = match[1].length;
      const content = match[2];
      const currentListType = unorderedMatch ? "ul" : "ol";

      if (!inList) {
        result.push(`<${currentListType}>`);
        inList = true;
        listType = currentListType;
        listDepth = indent;
      } else if (indent > listDepth) {
        result.push(`<${currentListType}>`);
        listDepth = indent;
      } else if (indent < listDepth) {
        result.push(`</${listType}>`);
        listDepth = indent;
      }

      result.push(`<li>${content}</li>`);
    } else if (inList && line.trim() === "") {
      continue;
    } else {
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = null;
        listDepth = 0;
      }
      result.push(line);
    }
  }

  if (inList) {
    result.push(`</${listType}>`);
  }

  return result.join("\n");
}

function processParagraphs(html) {
  const blocks = html.split(/\n\s*\n/);
  const processedBlocks = blocks.map((block) => {
    block = block.trim();
    if (!block) return "";

    // Don't wrap certain block elements in paragraphs
    if (
      block.match(/^<(?:h[1-6]|hr|ul|ol|blockquote|pre)/i) ||
      block.includes("XYZCODEBLOCKREPLACEME") ||
      block.includes("XYZINLINECODEREPLACEME")
    ) {
      return block;
    }

    // Convert single newlines to line breaks within paragraphs
    block = block.replace(/\n/g, "<br>");
    return `<p>${block}</p>`;
  });

  return processedBlocks.filter((block) => block).join("\n\n");
}
