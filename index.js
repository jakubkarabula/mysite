var http = require('http')

module.exports = http.createServer((req, res) => {
  res.end('hello')
})
