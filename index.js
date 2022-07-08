require("dotenv").config();

const express = require("express");
const app = new express();
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const posts = require("./controllers/posts");
const pages = require("./controllers/pages");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });

// app.use(pages.maint);

app.get("/about", pages.about);
app.get("/contact", pages.contact);
app.get("/posts/new", pages.create);

app.get("/", posts.home);
app.get("/post/:id", posts.getPost);
app.post("/posts/store", posts.fieldsNotNull, posts.storePost);

app.get("/register", pages.registerForm);
app.post("/register", (req, res) => {
  res.json(req.body);
});

app.get("/login", pages.loginForm);
app.post("/login", (req, res) => {
  res.json(req.body);
});

app.get("/reset", pages.resetForm);
app.post("/reset", (req, res) => {
  res.json(req.body);
});

app.use(pages.notfound);

const { PORT, INTERFACE } = process.env;
app.listen(PORT, INTERFACE, () => {
  console.log(`App "Your blog" listening on ${INTERFACE}:${PORT}`);
});
