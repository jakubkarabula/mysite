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

  content = content.replace(/\<a/g, '<a target="_blank"')

  const html = `
  <!doctype html>

  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="Jakub Karabula-Stysiak portfolio.">
    <meta name="author" content="Jakub Karabula-Stysiak">

    <meta property="og:title" content="A Basic HTML5 Template">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.sitepoint.com/a-basic-html5-template/">
    <meta property="og:description" content="A simple HTML5 Template for new projects.">
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

  /* Change all [image.png] to <img src="image.png" /> */
  (html.match(/\[.+\]/g) || []).forEach(image => {
    const imageUrl = image.slice(1, -1)
	  processedHTML = processedHTML.replaceAll(image, `<img src="${imageUrl}" />`)
  })

  const dom = new JSDOM(processedHTML)

  /* Add index number to every link */
  dom.window.document.querySelectorAll('a').forEach((a, index) => {
	  a.innerHTML = `[${index + 1}] ${a.innerHTML}`
  })

  fs.writeFile(fileName + ".html", dom.window.document.documentElement.outerHTML, (err) => {
    if (err) console.log(err)
    console.log('Success')
  })
});
 
