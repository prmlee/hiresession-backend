const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('../app');
const config = require('../config');

const isProduction = config.env === 'production';

const sslOptions = isProduction ? {
  key: fs.readFileSync('config/sslcert/cerificate.key'),
  cert: fs.readFileSync('config/sslcert/43a130490a326073.crt')
} : null;



const server = isProduction ?
  https.createServer(sslOptions, app)
  :
  http.createServer(app);


server.listen(config.port, onListening);

function onListening() {
  console.log(`Server listenning on port: ${config.port}!`);
}
