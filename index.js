const parse = require('gemini-to-html/parse')
var fs = require("fs")
const render = require('gemini-to-html/render')
const jsdom = require('jsdom')

const { JSDOM } = jsdom

const fileName = process.argv[2]

fs.readFile(fileName + ".gmi", function(err, buf) {
  const page = buf.toString()

  const tokens = parse(page)
  let content = render(tokens)

  const html = `
  <!doctype html>

  <html lang="en">
  <head>
    <title>Maya Karabula-Stysiak</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="Jakub Karabula-Stysiak portfolio.">
    <meta name="author" content="Jakub Karabula-Stysiak">

    <meta property="og:title" content="Jakub Karabula-Stysiak">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://jakubkarabula.github.io/mysite/">
    <meta property="og:description" content="Notes on my projects.">
    <meta property="og:image" content="image.png">

    <link rel="icon" href="/favicon.ico">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="stylesheet" href="css/styles.css?v=1.0">

  </head>

  <body>
   ${content}
   <link href="./style.css" rel="stylesheet" />
  </body>
  </html>
`
  let processedHTML = html;

  const dom = new JSDOM(processedHTML)

  const imgRegex = /.*(png|jpg|gif)+$/

  /* Add index number to every link */
  dom.window.document.querySelectorAll('a').forEach((a, index) => {
    /* change image links to inline */
    if (imgRegex.test(a.href)) {
      const img = dom.window.document.createElement('img');
      img.setAttribute('src', a.href)
      img.setAttribute('alt', a.innerHTML)
      img.setAttribute('title', a.innerHTML)
      a.replaceWith(img)

      return
    }

    if (a.href.startsWith('http')) {
      a.setAttribute('target', '_blank')
    }

    a.innerHTML = `[${index + 1}] ${a.innerHTML}`
  })

  fs.writeFile(fileName + ".html", dom.window.document.documentElement.outerHTML, (err) => {
    if (err) console.log(err)
    console.log('Success')
  })
});
 
