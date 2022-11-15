const { makePreAuthCode } = require("../middleware/hashcodes");
const flash = require("connect-flash");

const makeAuth = (req, res) => {
  const { email, sendEmail } = req.body;
  // console.log(req.body);
  const newPreauth = makePreAuthCode(email);
  // console.log(`req.body.sendEmail: ${sendEmail}`);
  if (sendEmail !== undefined) {
    console.log(`**Send registration email to: ${email}`);
  }
  console.log(newPreauth);
  return res.render("preauth", { newPreauth });
};

module.exports = { makeAuth };
