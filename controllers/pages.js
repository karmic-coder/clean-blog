const about = (req, res) => {
  res.render("about");
};
const contact = (req, res) => {
  res.render("contact");
};
const create = (req, res) => {
  res.render("create");
};
const preauth = (req, res) => {
  const newPreauth = { email: "", msg: "", preauth: "" };
  res.render("preauth", { newPreauth });
};
const loginForm = (req, res) => {
  const badLogin = req.flash("badLogin");
  const goodLogin = req.flash("goodLogin");
  // console.log(badLogin);
  res.render("login", { badLogin, goodLogin });
};
const registerForm = (req, res) => {
  // console.log(req.query);
  var displayname = "";
  if (req.query.preauth) {
    var preauth = req.query.preauth;
  }
  if (req.query.email) {
    var email = req.query.email;
  } else {
    var email = "";
  }
  const data = req.flash("data")[0];
  if (typeof data != "undefined") {
    displayname = data.displayname;
    email = data.email;
  }
  res.render("register", {
    errors: req.flash("validationErrors"),
    displayname,
    email,
    preauth,
  });
};
const resetForm = (req, res) => {
  res.render("reset");
};

const notfound = (req, res, next) => {
  // res.status(404).send("Not found");
  res.status(404).render("404");
};

const maint = (req, res) => {
  res.render("maint");
};

module.exports = {
  about,
  contact,
  create,
  preauth,
  loginForm,
  registerForm,
  resetForm,
  notfound,
  maint,
};
