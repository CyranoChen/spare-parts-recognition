/* jshint esversion: 6 */
const express = require("express");
const app = express();

// ssl cert
const fs = require('fs');
const http = require('http');
const https = require('https');
const credentials = {
    key: fs.readFileSync('./cert/private.pem', 'utf8'),
    cert: fs.readFileSync('./cert/client.crt', 'utf8')
};

// photo library file path
app.use('/spr_img', express.static('../server/label/b1_items'));

// http / https server
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

const PORT = 8080;
const SSLPORT = 8090;

httpServer.listen(PORT, () => {
    console.log('HTTP Server is running on port %s', PORT);
});
httpsServer.listen(SSLPORT, () => {
    console.log('HTTPS Server is running on port %s', SSLPORT);
});