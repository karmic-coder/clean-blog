const about = (req, res) => {
  res.render("about");
};
const contact = (req, res) => {
  res.render("contact");
};
const create = (req, res) => {
  res.render("create");
};
const loginForm = (req, res) => {
  const badLogin = req.flash("badLogin");
  // console.log(badLogin);
  res.render("login", { badLogin });
};
const registerForm = (req, res) => {
  var displayname = "";
  var email = "";
  const data = req.flash("data")[0];
  if (typeof data != "undefined") {
    displayname = data.displayname;
    email = data.email;
  }
  res.render("register", {
    errors: req.flash("validationErrors"),
    displayname,
    email,
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
  loginForm,
  registerForm,
  resetForm,
  notfound,
  maint,
};
