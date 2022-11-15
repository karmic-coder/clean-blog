const { makePreAuthCode } = require("../middleware/hashcodes");
const flash = require("connect-flash");
const { sendMail } = require("../utilities/nmailer");

const mailOut = {};
// const { MAIL_TO, MAIL_SUBJECT, MAIL_HTML } = mailOut;

// mailOut.MAIL_SUBJECT = "";
// mailOut.MAIL_HTML = `
// <html>
// <head></head>
// <body>
//   <h1>Your Karmatronix Blog PreAuth Link</h1>
//   <code>
//   ${newPreauth.email}
//   ${newPreauth.expires}
//   ${newPreauth.preauth}
//   </code>
//   <a href="">https://blahblah</a>
// </body>
// </html>
// `;

const makeAuth = async (req, res) => {
  const { email, sendEmail } = req.body;
  // console.log(req.body);
  const newPreauth = makePreAuthCode(email);
  // console.log(`req.body.sendEmail: ${sendEmail}`);
  if (sendEmail !== undefined) {
    // console.log(`**Send registration email to: ${email}`);
    newPreauth.url = getUrl(req, res, newPreauth);
    mailOut.MAIL_SUBJECT = "Your preauth link to register at Karmatronix blog";
    mailOut.MAIL_HTML = `
<html>
<head>
<style>
.main{
  margin-left:2rem;
}
table{
  border:1px solid white;
  background:black;
}
</style>
</head>
<body>
<div class="main">
<h1>Your Karmatronix Blog PreAuth Link</h1>
<code>
<table>
<tr>
<th>Your information:</th>
</tr>
<tr><td>Email</td><td>${newPreauth.email}</td></tr>
<tr><td>Preauth</td><td>${newPreauth.preauth}</td></tr>
</table>
${newPreauth.msg}<br/>
</code>
<h4>
<a href="${newPreauth.url}">${newPreauth.url}</a>
</h4>
</div>
</body>
</html>
`;

    mailOut.MAIL_TO = email;
    // mailOut.MAIL_FROM = '"Karmatronix Mailer ☯" <no-reply@karmatronix.com>';
    // const transporter = main();
    const result = await sendMail(mailOut);
    newPreauth.result = result;
  }
  // console.log(newPreauth);
  return res.render("preauth", { newPreauth });
};

const getUrl = (req, res, newPreauth) => {
  return `${req.protocol}://${req.headers.host}/register/?email=${newPreauth.email}&preauth=${newPreauth.preauth}`;
};

module.exports = { makeAuth };
