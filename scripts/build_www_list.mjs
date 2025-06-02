import { promises as fs } from 'fs'


// get our existing index source code
const index_src = (await fs.readFile('./www/index.html')).toString()

// look for insertion comments
const files = await fs.readdir('./www')

const marker = '<!--build_www_list-->'
const marker_regex = /<!--build_www_list-->[\s\S]*?<!--build_www_list-->/g
const match = index_src.match(marker_regex)
if (!match) {
  console.log('did not find script delimeter in html')
}

const out_html = 
`${marker}
${files.map(name => `<a href="/${name}" target="_blank">${name.split('.')[0]}</a>`
).join('\n')}
${marker}`

const new_index_src = index_src.replace(match, out_html)

await fs.writeFile('./www/index.html', new_index_src)
