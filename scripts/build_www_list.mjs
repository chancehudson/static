import { promises as fs } from 'fs'


// get our existing index source code
const index_src = (await fs.readFile('./www/index.html')).toString()

// look for insertion comments
const files = await fs.readdir('./www')
const marker_regex = /<!--build_www_list-->.*<!--build_www_list-->/gm
const marker = '<!--build_www_list-->'
const new_index_src = index_src.replace(marker_regex, `${marker}
${files.map(name => `<a href="/${name}" target="_blank">${name.split('.')[0]}</a>`
).join('\n')}
${marker}`);

console.log(new_index_src)
