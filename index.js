require("dotenv").config();

global.loggedIn = null;
global.preauth = process.env.ENABLE_PREAUTH;
const express = require("express");
const helmet = require("helmet");
const app = new express();
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const users = require("./controllers/users");
const posts = require("./controllers/posts");
const pages = require("./controllers/pages");

const {
  authRequired,
  redirectIfAuthenticated,
  checkPreauth,
} = require("./middleware/auth");

app.use(helmet.hidePoweredBy());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    // cookie: { secure: true },
  })
);
app.use(flash());
app.set("trust proxy", 1);
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });

if (process.env.MAINTENANCE_MODE == "true") {
  app.use(pages.maint);
}

// global.loggedIn = null;

app.get("/about", pages.about);
app.get("/contact", authRequired, pages.contact);
app.get("/posts/new", authRequired, pages.create);

app.get("/", posts.home);
app.get("/post/:id", posts.getPost);
app.post("/posts/store", authRequired, posts.fieldsNotNull, posts.storePost);

app.get("/register", redirectIfAuthenticated, pages.registerForm);
if (process.env.ENABLE_PREAUTH == "true") {
  app.post("/register", redirectIfAuthenticated, checkPreauth, users.storeUser);
} else {
  app.post("/register", redirectIfAuthenticated, users.storeUser);
}

app.get("/login", redirectIfAuthenticated, pages.loginForm);
app.post("/login", redirectIfAuthenticated, users.loginUser);
app.get("/logout", users.logoutUser);

app.get("/reset", pages.resetForm);
app.post("/reset", (req, res) => {
  res.json(req.body);
});

app.use(pages.notfound);

// app.use("*", (req, res, next) => {
//   loggedIn = req.session.Id;
//   next();
// });

const { PORT, INTERFACE } = process.env;
app.listen(PORT, INTERFACE, () => {
  console.log(`App "Your blog" listening on ${INTERFACE}:${PORT}`);
});
