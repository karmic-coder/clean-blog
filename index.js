require("dotenv").config();
const {
  MONGODB,
  MONGO_USER,
  MONGO_PASS,
  PORT,
  INTERFACE,
  SITENAME,
  MAINTENANCE_MODE,
  ENABLE_PREAUTH,
} = process.env;

global.isAdmin = false;
global.loggedIn = null;
global.enablePreauth = ENABLE_PREAUTH;
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
const { makeAuth } = require("./controllers/makepreauth");
const genuuid = require("uid-safe");

// const crypto = require("crypto");
// const genuuid = async () => {
//   console.log(await crypto.randomUUID({ disableEntropyCache: true }));
// };

// genuuid();

const {
  authRequired,
  redirectIfAuthenticated,
  checkPreauth,
  checkAdmin,
} = require("./middleware/auth");

app.use(helmet.hidePoweredBy());
app.use(
  session({
    genid: function (req) {
      return genuuid.sync(18);
    },
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
  isAdmin = req.session.isAdmin;
  // console.log(req.session);
  next();
});
// app.use(checkAdmin);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// mongoose.connect(MONGODB, { useNewUrlParser: true });

if (MONGO_USER && MONGO_PASS !== undefined) {
  mongoose.connect(MONGODB, {
    auth: {
      username: MONGO_USER,
      password: MONGO_PASS,
    },
    authSource: "admin",
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("**MONGO AUTH ENABLED**");
} else {
  mongoose.connect(MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("*MONGO AUTH is DISABLED!*");
}

if (MAINTENANCE_MODE == "true") {
  app.use(pages.maint);
}
// const hashcodes = require("./middleware/hashcodes");
// console.log(hashcodes.makePreAuthCode("user@example.com"));
// global.loggedIn = null;

app.get("/about", pages.about);
app.get("/issuePreauth", checkAdmin, pages.preauth);
app.post("/issuePreauth", checkAdmin, makeAuth);
app.get("/contact", authRequired, pages.contact);
app.get("/posts/new", authRequired, pages.create);

app.get("/", posts.home);
app.get("/post/:slug", posts.getPost);
app.post("/posts/store", authRequired, posts.fieldsNotNull, posts.storePost);

app.get("/register", redirectIfAuthenticated, pages.registerForm);
if (ENABLE_PREAUTH == "true") {
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

app.listen(PORT, INTERFACE, () => {
  console.log(`App "${SITENAME}" listening on ${INTERFACE}:${PORT}`);
});
