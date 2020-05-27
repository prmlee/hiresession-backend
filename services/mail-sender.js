const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const nodeoutlook = require('nodejs-nodemailer-outlook')
const handlebars = require('handlebars');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const configs = require('../config');

const isProduction = configs.env === 'production';

const transport = Promise.promisifyAll(
  nodeMailer.createTransport(
    smtpTransport({
      host: configs.emailHost,
      port:587,
      secure: false,
      tls: {
          rejectUnauthorized: false
      },
      auth: {
        user: configs.email,
        pass: configs.emailPass
      }
    })
  )
);

function send(to, tmp, replacements = {}, subject = `Welcome to ${configs.appName}`, from = configs.email) {
  const templatePath = `../templates/${tmp}/index.html`;
  return fs.readFileAsync(`${__dirname}/${templatePath}`, {encoding: 'utf-8'})
    .then(file => {
      const template = handlebars.compile(file);

      const mailOptions = {
        to,
        from: `${configs.appName} <${from}>`,
        subject,
        html: template(replacements)
      };


      return transport.sendMailAsync(mailOptions);
    });
}



module.exports = {send};

