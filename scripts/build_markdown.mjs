import { promises as fs, statSync } from "fs";

import MarkdownIt from "markdown-it";
const markdown = new MarkdownIt({
  html: true,
});

// interesting
// import markdownToHtml from "./ai/md_to_markdown.mjs";

const markdown_files = (await fs.readdir("./www")).filter((name) =>
  name.endsWith(".md"),
);

const html_template = (html) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>🙈</title>
</head>
<body style="max-width: 500px; margin: auto; font: sans-serif; margin-top: 20px;">
${html}
</body>
</html>
`;

for (const markdown_file of markdown_files) {
  const filepath = "./www/" + markdown_file;
  const markdown_src = (await fs.readFile(filepath)).toString();
  const markdown_html = markdown.render(markdown_src);
  let outpath = filepath.split("");
  outpath.splice(-3, 3, ...".html".split(""));
  outpath = outpath.join("");
  console.log(outpath);
  await fs.writeFile(outpath, html_template(markdown_html));
}
