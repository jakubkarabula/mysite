const express = require('express')
var http = require('http');
var https = require('https');
const readFileSync = require('fs').readFileSync

const privateKey = readFileSync('/etc/letsencrypt/live/mayaks.eu/privkey.pem', 'utf8');
const certificate = readFileSync('/etc/letsencrypt/live/mayaks.eu/cert.pem', 'utf8');
const ca = readFileSync('/etc/letsencrypt/live/mayaks.eu/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const app = express()

app.use('/seis', express.static('seis'))

app.use('/', express.static('public'))

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, () => console.log('running http'));
httpsServer.listen(443, () => console.log('running https'));
