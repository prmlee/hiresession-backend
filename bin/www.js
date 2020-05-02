const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('../app');
const config = require('../config');

const server = http.createServer(app);


server.listen(config.port, onListening);

function onListening() {
  console.log(`Server listenning on port: ${config.port}!`);
}
