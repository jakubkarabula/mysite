const { marked } = require('marked')
const fs = require('fs')
var copyfiles = require('copyfiles')
const { execSync } = require('node:child_process')

const pages = [
  'documents-were-not-supposed-to-be',
  'flora-fauna',
  'jswm-javascript-window-manager',
  'poland-still-breaks-my-heart',
  'reading-list',
  'donica-semiautomated-farming',
  'index',
  'listening-list',
  'posthuman-condition',
  'szklo-3d-engine',
]

const indexPage = 'index'

const map = {}

const get = async (id) => {
  const md = fs.readFileSync('md/' + id + '.md').toString()

  const { links } = getLinks(md)

  const html = marked.parse(md)
  const title = getTitle(md)
  const description = getDescription(html)

  console.log('\t' + title)

  if (!map[id]) {
    map[id] = {
      links: [],
    }
  }

  map[id].html = html
  map[id].title = title
  map[id].description = description

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
      template(
        content.html,
        content.links,
        id,
        content.title,
        content.description,
      ),
      (err) => {
        if (err) {
          console.error(err)
        }
      },
    )

    if (id === indexPage) {
      fs.writeFile(
        './docs/index.html',
        template(
          content.html,
          content.links,
          id,
          content.title,
          content.description,
        ),
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

  //   console.log('\nWill generate gemini...')

  //   gemini()

  console.log('Generated gemini...')

  console.log('\nEnding. Kthbai')
}

const getTitle = (md = '') => {
  const header = md.match(/\#\s.*/)?.[0]
  return header?.slice(2)
}

const getDescription = (html = '') => {
  const firstParagraph =
    html.match(/<p>.*/)?.[0]?.replace(/<\/?[^>]+(>|$)/g, '') || ''

  return firstParagraph.split(' ').slice(0, 30).join(' ') + '...'
}

const getLinks = (md = '') => {
  const links = []

  md.match(/\[.*\]\([a-z0-9-]+.html\)/g)?.forEach((link) => {
    const name = link.match(/\[.*\]/)?.[0]?.slice(1, -1)
    const id = link.match(/[a-z0-9-]+.html/)?.[0]?.replace('.html', '')

    links.push([name, id])
  })

  return { links }
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

const template = (page, backLinks, id, title, description) => `
    <head>
        <title>${title}</title>
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@MayaKarabula" />
        <meta name="twitter:creator" content="@MayaKarabula" />
        <meta property="og:image" content="https://raw.githubusercontent.com/mayakarabula/mysite/notion-prebuild/images/mmm.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
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
                      `<li><a href='${linkId}.html'>~ ${linkTitle}</a></li>`,
                  )
                  .join('')}
            </ul>
        `
            : ''
        }
        </div>
        ${page}
        <hr/>

        <footer>
          <a href="https://webring.xxiivv.com/#your-id-here" target="_blank" rel="noopener">
            <img src="https://webring.xxiivv.com/icon.black.svg" alt="XXIIVV webring"/>
          </a>
          <a href="https://dzygaspaw.com/support/">
            Support Ukraine 🇺🇦 Dzyga's Paw Charity Fund
          </a>
        </footer>

      <link rel="stylesheet" href="style.css" media="print" onload="this.media='all'" />
      <noscript><link rel="stylesheet" href="style.css"></noscript>
    </body>
`

run()
