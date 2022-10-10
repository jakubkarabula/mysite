const gemini = require('gemini-server').default
const readFileSync = require('fs').readFileSync

const options = {
  cert: readFileSync('cert.pem'),
  key: readFileSync('key.pem'),
}

const app = gemini(options)

app.on('/', (_req, res) => {
  res.file('gemini/index.gmi')
})

module.exports = app.listen(1965, () => {
  console.log('Listening...')
})
