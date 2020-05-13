const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const nodeoutlook = require('nodejs-nodemailer-outlook')
const handlebars = require('handlebars');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const configs = require('../config');

const isProduction = configs.env === 'production';

function send(to, tmp, replacements = {}, subject = `Welcome to ${configs.appName}`, from = configs.email) {
  const templatePath = `../templates/${tmp}/index.html`;
  return fs.readFileAsync(`${__dirname}/${templatePath}`, {encoding: 'utf-8'})
    .then(file => {
      const template = handlebars.compile(file);

      const mailOptions = {
          host: configs.emailHost,
          port:  587,
          secure: true,
          tls: true,
          auth: {
              user: configs.email,
              pass: configs.emailPass
          },
        to,
        from: `${configs.appName} <${from}>`,
        subject,
        html: template(replacements),
          onError: (e) => console.log(e),
          onSuccess: (i) => console.log(i)
      };


      return nodeoutlook.sendEmail(mailOptions);
    });
}



module.exports = {send};

