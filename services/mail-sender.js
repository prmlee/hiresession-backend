const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const handlebars = require('handlebars');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const configs = require('../config');

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

function sendWithBcc(to, tmp, replacements, bcc) {
  //console.log('SMTP credential: ', configs);
  //return;
  return send(to, tmp, replacements, `Welcome to ${configs.appName}`, configs.email, bcc);
}

function send(to, tmp, replacements = {}, subject = `Welcome to ${configs.appName}`, from = configs.email, bcc) {
  //console.log('SMTP credential: ', configs);
  const templatePath = `../templates/${tmp}/index.html`;
  //return;
  return fs.readFileAsync(`${__dirname}/${templatePath}`, {encoding: 'utf-8'})
    .then(file => {
      const template = handlebars.compile(file);

      const bccProps = bcc ? {bcc} : {};

      const mailOptions = {
        to,
        from: `${configs.appName} <${from}>`,
        subject,
        html: template(replacements),
        ...bccProps,
      };


      return transport.sendMailAsync(mailOptions);
    });
}



module.exports = {send, sendWithBcc};

