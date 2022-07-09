const User = require("../models/User");

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
  if (req.body.preauth !== process.env.PREAUTH_REGCODE) {
    return res.status(401).render("401");
  }
  next();
};

module.exports = {
  authRequired,
  redirectIfAuthenticated,
  checkPreauth,
};
