const path = require('path')

const gemini = require('gemini-server').default
const readFileSync = require('fs').readFileSync

const options = {
  cert: readFileSync(path('cert.pem')),
  key: readFileSync(path('key.pem')),
}

const app = gemini(options)

app.on('/', (_req, res) => {
  res.file(path('gemini', 'index.gmi'))
})

module.exports = app.listen(1965, () => {
  console.log('Listening...')
})
