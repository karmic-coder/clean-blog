"use strict";
const nodemailer = require("nodemailer");
const { SMTPSERVER, SMTP_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM } = process.env;

// async..await is not allowed in global scope, must use a wrapper
let transporter;
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //   let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  //   let transporter = nodemailer.createTransport({
  transporter = nodemailer.createTransport({
    host: SMTPSERVER, //"smtp.ethereal.email",
    port: SMTP_PORT, //587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: MAIL_USER, //testAccount.user, // generated ethereal user
      pass: MAIL_PASS, //testAccount.pass, // generated ethereal password
    },
  });
}
main().catch(console.error);

async function sendMail(options) {
  if (options == undefined) return;
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: MAIL_FROM, //'"Fred Foo 👻" <foo@example.com>', // sender address
    to: options.MAIL_TO, //"bar@example.com, baz@example.com", // list of receivers
    subject: options.MAIL_SUBJECT, //"Hello ✔", // Subject line
    // text: "Hello world?", // plain text body
    html: options.MAIL_HTML, //"<b>Hello world?</b>", // html body
  });

  //   console.log("Message sent: %s", info.messageId);
  return `Message sent: ${info.messageId}`;
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

// Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

sendMail().catch(console.error);

module.exports = { sendMail };
