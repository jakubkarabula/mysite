const express = require('express')
var http = require('http');
var https = require('https');
const readFileSync = require('fs').readFileSync
const router = require('./seis/api').router

const app = express()

app.use('/seis', express.static('seis'))

app.use('/api', router);

app.use('/', express.static('public'))

try { 
    const privateKey = readFileSync('/etc/letsencrypt/live/mayaks.eu/privkey.pem', 'utf8');
    const certificate = readFileSync('/etc/letsencrypt/live/mayaks.eu/cert.pem', 'utf8');
    const ca = readFileSync('/etc/letsencrypt/live/mayaks.eu/chain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => console.log('running https'));
    var httpServer = http.createServer(app);
    httpServer.listen(80, () => console.log('running http'));
} catch (err) {
    var httpServer = http.createServer(app);
    httpServer.listen(80, () => console.log('running http'));
}
