const bcrypt = require("bcrypt");
const User = require("../models/User");
const path = require("path");
const flash = require("connect-flash");

const storeUser = (req, res) => {
  //   console.log(req.body);
  if (req.body.password !== req.body.passwordConfirm) {
    req.flash("validationErrors", ["Password / confirmation does not match"]);
    req.flash("data", req.body);
    return res.redirect("register");
  }
  User.create(req.body, (error, user) => {
    if (error) {
      // console.log(error.message);
      const validationErrors = Object.keys(error.errors).map(
        key => error.errors[key].message
      );
      // req.session.validationErrors = validationErrors;
      req.flash("validationErrors", validationErrors);
      req.flash("data", req.body);
      // console.log(req.flash);
      // return res.render("register", { errors: req.flash });
      return res.redirect("register");
      // return res.json(req.session.validationErrors);
    }
    // console.log(user);
    res.redirect("/login");
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  if (!email && !password) {
    req.flash("badLogin", "You must enter an email and password to login");
    return res.redirect("login");
  } else {
    User.findOne({ email }, (error, user) => {
      if (user) {
        bcrypt.compare(password, user.password, (error, same) => {
          if (same) {
            //store user session
            req.session.userId = user._id;
            //   console.log("login successful", req.session.userId);
            res.redirect("/");
          }
          // else {
          //   }
          else {
            req.flash("badLogin", "Invalid email or password");
            // }
            // console.log("login FAILED", error);
            // res.status(401).render("401");
            res.redirect("login");
          }
        });
      }
    });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  storeUser,
  loginUser,
  logoutUser,
};
