const path = require('path')

const gemini = require('gemini-server').default
const readFileSync = require('fs').readFileSync

const options = {
  cert: readFileSync(path.resolve('cert.pem')),
  key: readFileSync(path.resolve('key.pem')),
}

const app = gemini(options)

app.use((req, res) => {
  console.log('Handling path', req.path)

  if (req.path === '/') {
    res.file(path.resolve('gemini', 'index.gmi'))
  }

  res.file('gemini' + req.path)
})

app.listen(1965, () => {
  console.log('listening on port 1965')
})
