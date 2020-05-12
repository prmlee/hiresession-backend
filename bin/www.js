const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('../app');
const config = require('../config');

const isProduction = config.env === 'production';

const sslOptions =  {
  key: fs.readFileSync('config/sslcert/cerificate.key'),
  cert: fs.readFileSync('config/sslcert/e296519865852cb9.crt')
};



const server = https.createServer(sslOptions, app)



server.listen(config.port, onListening);

function onListening() {
  console.log(`Server listenning on port: ${config.port}!`);
}
