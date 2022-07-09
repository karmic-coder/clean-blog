const bcrypt = require("bcrypt");
const User = require("../models/User");
const path = require("path");

const storeUser = (req, res) => {
  //   console.log(req.body);
  User.create(req.body, (error, user) => {
    if (error) {
      console.log(error);
      return res.redirect("/register");
    }
    console.log(user);
    res.redirect("/");
  });
};

const loginUser = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, (error, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          //store user session
          req.session.userId = user._id;
          //   console.log("login successful", req.session.userId);
          res.redirect("/");
        } else {
          console.log("login FAILED", error);
          res.status(401).render("401");
        }
      });
    }
  });
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
