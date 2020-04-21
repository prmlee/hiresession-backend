const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('./routes');

const app = express();
app.use(logger('dev'));

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());

app.use('/api', cors(), apiRoutes);

module.exports = app;

