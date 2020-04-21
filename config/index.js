const path = require('path');
const convict = require('convict');

const config = convict({
  env: {
    format: ['production', 'development'],
    default: 'development',
    arg: 'nodeEnv',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8081,
    arg: 'port',
    env: 'PORT'
  },
  appName: {
    doc: 'Name of the application',
    default: 'DEFAULT_APP_NAME',
    arg: 'appName',
    env: 'APP_NAME'
  },
  frontAppUrl: {
    doc: 'URL of the angular application',
    default: 'DEFAULT_FRONT_APP_NAME',
    arg: 'frontAppUrl',
    env: 'FRONT_APP_URL'
  },

  jwtSecret: {
    doc: 'JWT token secret',
    default: 'DEFAULT_TOKEN',
    arg: 'jwtSecret',
    env: 'JWT_TOKEN'
  }
});

const env = config.get('env');

config.loadFile(path.join(__dirname, `environments/${env}.json`));

config.validate();

module.exports = config.getProperties();
