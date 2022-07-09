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
  res.render("login");
};
const registerForm = (req, res) => {
  res.render("register");
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
