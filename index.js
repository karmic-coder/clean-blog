const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });
const app = new express();
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const BlogPost = require("./models/BlogPost");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/posts/new", (req, res) => {
  res.render("create");
});
app.get("/post", (req, res) => {
  res.render("post");
});
app.post("/posts/store", async (req, res) => {
  try {
    await BlogPost.create(req.body);
    return res.redirect("/");
  } catch (error) {
    res.send(error);
  }
});
// console.log(req.body);
// });

app.listen(3000, () => {
  console.log("App listening on localhost:3000");
});
