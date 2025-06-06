import { promises as fs, statSync } from "fs";
import markdownToHtml from "./ai/md_to_markdown.mjs";

const markdown_files = (await fs.readdir("./www")).filter((name) =>
  name.endsWith(".md"),
);

for (const markdown_file of markdown_files) {
  const filepath = "./www/" + markdown_file;
  const markdown_src = (await fs.readFile(filepath)).toString();
  const markdown_html = markdownToHtml(markdown_src);
  let outpath = filepath.split("");
  outpath.splice(-3, 3, ...".html".split(""));
  outpath = outpath.join("");
  console.log(outpath);
  await fs.writeFile(outpath, markdown_html);
}
