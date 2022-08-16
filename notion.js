const exporter = require('notion-exporter').default
const { marked } = require('marked')
const fs = require('fs');

const pages = [
    'e0b7bffb41bc4716ba7510bb2d9accf3',
    '2b84148d7fc1464b90b7bb87c1a9a2ea',
    '15331f3aad9145cabaa4f573f94311de',
    '2b76c247269b4abbadf3f942380b00d2'
]

const indexPage = '2b84148d7fc1464b90b7bb87c1a9a2ea'

const map = {}

const get = async (id) => {
    const token = '5230d2c1d09bf598e8f9b84b5310d48e4e0fb498d4eafda8a329da33226247bcde56b94c2b45b99c3791e1f1b6ea74172175855f16776d67ff0201541f5c27013e37f717dda03e5e930bfb9375ea'

    const md = await new exporter(token).getMdString(id)
    const { mdLocal, links } = updateLinks(md)
    const html = marked.parse(mdLocal);
    const title = getTitle(md)

    if (!map[id]) {
        map[id] = {
            links: []
        }
    }

    map[id].html = html
    map[id].title = title

    links.forEach(([, linkId]) => {
        if (!map[linkId]) {
            map[linkId] = {
                links: [],
                title: '',
                html: ''
            }
        }

        map[linkId].links.push({ id, title })
    })
}

const run = async () => {
    console.log('Starting the page generation\n')

    console.log('Will download pages...')
    await Promise.all(pages.map(page => get(page)))
    console.log('Downloaded all pages\n')

    console.log('Will save pages...')

    Object.entries(map).forEach(([id, content]) => {
        if (content.html === '') {
            console.log(id, content.title, 'this page had no content')
        }

        fs.writeFile('./' + id + '.html', template(content.html, content.links, id, content.title), err => {
            if (err) {
            console.error(err);
            }
        });

        if (id === indexPage) {
            fs.writeFile('./index.html', template(content.html, content.links, id, content.title), err => {
                if (err) {
                console.error(err);
                }
            });
        }
    })
    console.log('Saved all pages\n')

    console.log('Ending. Kthbai')
}

const getTitle = (md = '') => {
    const header = md.match(/\#\s.*/)?.[0]
    return header?.slice(2)
}

const updateLinks = (md = '') => {
    const links = []

    const mdLocal = md.replace(/\[.*\]\(.*notion\.so.*\)/g, (link) => {
       const name = link.match(/\[.*\]/g)?.[0]?.slice(1, -1)
       const id = link.match(/\(.*\)/g)?.[0]?.slice(1, -1)?.split('-').pop()

       links.push([name, id])

        return `[${name}](${id}.html)`
    })

    return { links, mdLocal }
}

const template = (page, backLinks, id, title) => `
    <body>

        <img class='cover-image' src='${id}.png' alt='${title} cover' /> 
        <div class='backlinks'>
        ${backLinks?.length > 0 ? `
            <span>backlinks:</span>
            <ul>
                ${backLinks.map(({ title: linkTitle, id: linkId }) => `<li><a href='${linkId}.html'>${linkTitle}</a></li>`).join('')}
            </ul>
        ` : ''}
        </div>
        ${page}

      <link rel="stylesheet" href="style.css" media="print" onload="this.media='all'" />
      <noscript><link rel="stylesheet" href="style.css"></noscript>
    </body>
`

run()

