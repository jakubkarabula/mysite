const exporter = require('notion-exporter').default
const { marked } = require('marked')
const fs = require('fs')
var copyfiles = require('copyfiles')
const { execSync } = require('node:child_process')

const pages = [
  'e0b7bffb41bc4716ba7510bb2d9accf3',
  '2b84148d7fc1464b90b7bb87c1a9a2ea',
  '15331f3aad9145cabaa4f573f94311de',
  '2b76c247269b4abbadf3f942380b00d2',
  '7dee961690054538826e2ad28e782b68',
  '029402285c0c423789fff51ea74909bf',
  '7dee961690054538826e2ad28e782b68',
  '42d32031c36e420f97279e7819fe4d83',
  'c382d3ef84f34e92b57f0315d5f72f07',
  'a0d53d3cfd66469187bea1841b1a2823',
  'f591348bc9134fd9a5ccbdbfed992810',
]

const indexPage = '2b84148d7fc1464b90b7bb87c1a9a2ea'

const map = {}

const get = async (id) => {
  const token =
    '6caffaef39e3db00955eb03686c5d99869f666ba2a25ae87961497cd67d675b4cb5ced304584ad12d940d44bb4646dc826087b4424db91a91cbec3c505e38004702add4a9bd899038c085e3ef650'

  const md = await new exporter(token).getMdString(id)
  const { mdLocal, links } = updateLinks(md, 'html')
  const { mdLocal: mdLocalGMI } = updateLinks(md, 'gmi')

  fs.writeFileSync('md/' + id + '.md', mdLocalGMI)

  const html = marked.parse(mdLocal).replace(/\<a /g, '<a target="_blank" ')
  const title = getTitle(md)

  console.log('\t' + title)

  if (!map[id]) {
    map[id] = {
      links: [],
    }
  }

  map[id].html = html
  map[id].title = title

  links.forEach(([, linkId]) => {
    if (!map[linkId]) {
      map[linkId] = {
        links: [],
        title: '',
        html: '',
      }
    }

    map[linkId].links.push({ id, title })
  })
}

const run = async () => {
  console.log('Starting the page generation\n')

  console.log('Will download pages...')
  await Promise.all(pages.map((page) => get(page)))
  console.log('Downloaded all pages\n')

  console.log('Will save pages...')

  Object.entries(map).forEach(([id, content]) => {
    if (content.html === '') {
      console.log(id, content.title, 'this page had no content')
    }

    fs.writeFile(
      './docs/' + id + '.html',
      template(content.html, content.links, id, content.title),
      (err) => {
        if (err) {
          console.error(err)
        }
      },
    )

    if (id === indexPage) {
      fs.writeFile(
        './docs/index.html',
        template(content.html, content.links, id, content.title),
        (err) => {
          if (err) {
            console.error(err)
          }
        },
      )
    }

    console.log('\t' + content.title)
  })
  console.log('Saved all pages\n')

  console.log('Will copy images...')

  copyfiles(['images/*', 'docs/'], {}, () => {})
  copyfiles(['images/*', 'gemini/'], {}, () => {})

  console.log('Copied images...')

  console.log('\nWill generate gemini...')

  gemini()

  console.log('Generated gemini...')

  console.log('\nEnding. Kthbai')
}

const getTitle = (md = '') => {
  const header = md.match(/\#\s.*/)?.[0]
  return header?.slice(2)
}

const updateLinks = (md = '', extension = 'html') => {
  const links = []

  const mdLocal = md.replace(/\[.*\]\(.*notion\.so.*\)/g, (link) => {
    const name = link.match(/\[.*\]/g)?.[0]?.slice(1, -1)
    const id = link
      .match(/\(.*\)/g)?.[0]
      ?.slice(1, -1)
      ?.split('-')
      .pop()

    links.push([name, id])

    return `[${name}](${id}.${extension})`
  })

  return { links, mdLocal }
}

const getImage = (id, title) => {
  if (!fs.existsSync('images/' + id + '.png')) {
    return ''
  }

  return `<img class='cover-image' src='images/${id}.png' alt='${title} cover' /> `
}

const gemini = () => {
  Object.keys(map).forEach((id) => {
    const gem = execSync(`md2gemini md/${id}.md`).toString()

    fs.writeFileSync(`gemini/${id}.gmi`, gem)

    if (id === indexPage) {
      fs.writeFileSync(`gemini/index.gmi`, gem)
    }
  })
}

const template = (page, backLinks, id, title) => `
    <head>
        <title>${title}</title>
        <meta property="og:title" content="${title}" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@MayaKarabula" />
        <meta name="twitter:creator" content="@MayaKarabula" />
        <meta property="og:image" content="https://raw.githubusercontent.com/mayakarabula/mysite/notion-prebuild/images/mmm.png" />        
    </head>
    <body>
        ${getImage(id, title)}
        <div class='backlinks'>
        ${
          backLinks?.length > 0
            ? `
            <span>backlinks:</span>
            <ul>
                ${backLinks
                  .map(
                    ({ title: linkTitle, id: linkId }) =>
                      `<li><a href='${linkId}.html'>${linkTitle}</a></li>`,
                  )
                  .join('')}
            </ul>
        `
            : ''
        }
        </div>
        ${page}

      <link rel="stylesheet" href="style.css" media="print" onload="this.media='all'" />
      <noscript><link rel="stylesheet" href="style.css"></noscript>
    </body>
`

run()
