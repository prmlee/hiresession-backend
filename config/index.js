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
  tokenExpiration: {
    doc: 'Token exp. date',
    default: 1,
    arg: 'tokenExpiration',
    env: 'tokenExpiration'
  },
  jwtSecret: {
    doc: 'JWT token secret',
    default: 'DEFAULT_TOKEN',
    arg: 'jwtSecret',
    env: 'JWT_TOKEN'
  },
  emailHost: {
    doc: 'Host of email',
    default: 'smtp.office365.com',
    arg: 'emailHost',
    env: 'EMAIL_HOST'
  },
  email: {
    doc: 'Email for sending emails',
    default: 'DEFAULT_EMAIL',
    arg: 'email',
    env: 'EMAIL'
  },
  emailPass: {
    doc: 'Email password',
    default: 'DEFAULT_EMAIL_PASS',
    arg: 'emailPass',
    env: 'EMAIL_PASS'
  },
  zoomEmail:{
    doc: 'Zoom account Email',
    default: 'razmikbortorian188@gmail.com',
    arg: 'zoomEmail',
    env: 'zoom_email'
  },
  zoomTimezone:{
    doc: 'Zoom timezone',
    default: 'NewYork',
    arg: 'zoomTimezone',
    env: 'zoom_timezone'
  },
  zoomApiKey:{
    doc: 'zoom Api Key',
    default: '',
    arg: 'zoomApiKey',
    env: 'zoomApiKey'
  },
  zoomApiSecret:{
    doc: 'zoom Api Secret',
    default: '',
    arg: 'zoomApiSecret',
    env: 'zoomApiSecret'
  },
  bcc: {
    doc: 'employer activation email bcc',
    default: 'DEFAULT_BCC',
    arg: 'bcc',
    env: 'bcc'
  },
});

const env = config.get('env');

console.log(1111111, env);

config.loadFile(path.join(__dirname, `environments/${env}.json`));

config.validate();

module.exports = config.getProperties();
