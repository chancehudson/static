import { promises as fs, statSync } from 'fs'

// get our existing index source code
const index_src = (await fs.readFile('./www/index.html')).toString()

// look for insertion comments
const files = (await fs.readdir('./www'))
  .map(name => ({
    name,
    time: statSync('./www/' + name).mtime.getTime()
  }))
// sort the files by oldest first
files
  .sort((a, b) => b.time - a.time)

// put index.html at the bottom
files.push(files[0])
files.shift()

const marker = '<!--build_www_list-->'
const marker_regex = /<!--build_www_list-->[\s\S]*?<!--build_www_list-->/g
const match = index_src.match(marker_regex)
if (!match) {
  console.log('did not find script delimeter in html')
}

const out_html = 
`${marker}
<h3><strong>contents of /</strong></h3>

${files.map(({name, time}) => `
<br />
<a href="/${name}" target="_blank">${name}</a> - <span>${new Date(time).toDateString()}</span>
</a>`
).join('\n')}

${marker}`

const new_index_src = index_src.replace(match, out_html)

await fs.writeFile('./www/index.html', new_index_src)

