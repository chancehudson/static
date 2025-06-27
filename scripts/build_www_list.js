const fs = require('fs')
const path = require('path')

const TIMESTAMPS_PATH = path.join(__dirname, 'timestamps.json')

const last_edited = require(TIMESTAMPS_PATH)

// get our existing index source code
const index_src = (fs.readFileSync("./www/index.html")).toString();

// look for insertion comments
let files = fs.readdirSync("./www")
  .map((name) => {
    if (!last_edited[name]) {
      last_edited[name] = fs.statSync('./www/' + name).mtime.getTime() 
    }
    return { name, time: last_edited[name], name }
  })

// sort the files by oldest first
files.sort((a, b) => b.time - a.time);

// put index.html at the bottom
const index_html_entry = files.find(({ name }) => name === "index.html")
files = files.filter(
  ({ name }) => name != "index.html" && !name.endsWith(".md"),
)
files.push(index_html_entry)

const marker = "<!--build_www_list-->"
const marker_regex = /<!--build_www_list-->[\s\S]*?<!--build_www_list-->/g
const match = index_src.match(marker_regex)
if (!match) {
  console.log("did not find script delimeter in html")
}

const out_html = `${marker}
<h3><strong>contents of /</strong></h3>

${files
  .map(
    ({ name, time }) => `
<br />
<a href="/${name}" target="_blank">${name}</a> - <span>${new Date(time).toDateString()}</span>
</a>`,
  )
  .join("\n")}

${marker}`

const new_index_src = index_src.replace(match, out_html)

fs.writeFileSync("./www/index.html", new_index_src)
fs.writeFileSync(TIMESTAMPS_PATH, JSON.stringify(last_edited, null, 2))
