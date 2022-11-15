const User = require("../models/User");
const {
  verifyCode,
  verifyPreauth,
  makePreAuthCode,
  makeVerificationCode,
} = require("./hashcodes");

const authRequired = (req, res, next) => {
  User.findById(req.session.userId, (error, user) => {
    if (error || !user) {
      return res.status(401).render("401");
      // return res.redirect("/");
      //   next();
    }
    next();
  });
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/");
  }
  next();
};

const checkPreauth = (req, res, next) => {
  // if (req.body.preauth !== process.env.PREAUTH_REGCODE) {
  if (req.body.email == process.env.ADMIN_EMAIL) {
    return next();
  }
  const prechecked = verifyPreauth(req.body.email, req.body.preauth);
  if (!prechecked || !prechecked.valid) {
    return res.status(401).render("401");
  }
  next();
};

const checkAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    isAdmin = false;
    return res.redirect("/");
  }
  next();
};

module.exports = {
  authRequired,
  redirectIfAuthenticated,
  checkPreauth,
  checkAdmin,
};
