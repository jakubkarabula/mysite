const path = require('path')

const gemini = require('gemini-server').default
const readFileSync = require('fs').readFileSync

const options = {
  cert: readFileSync(path.resolve('cert.pem')),
  key: readFileSync(path.resolve('key.pem')),
}

const app = gemini(options)

app.on('/', (_req, res) => {
  res.file(path.resolve('gemini', 'index.gmi'))
})

module.exports = app
