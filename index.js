require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });
const app = new express();
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const BlogPost = require("./models/BlogPost");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// console.log(process.env.LINKEDIN);

const notfound = (req, res, next) => {
  // res.status(404).send("Not found");
  res.redirect("/");
};

const maint = (req, res) => {
  res.send("Site Under Maintenance, please try back later!");
};

// app.use(maint);

app.get("/", async (req, res) => {
  const blogposts = await BlogPost.find({});
  // console.log(blogposts);
  res.render("index", { blogposts });
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
app.get("/post/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    const blogpost = await BlogPost.findById(req.params.id);
    // console.log({ blogpost });
    if (blogpost) {
      return res.render("post", { blogpost });
    } else {
      res.redirect("/");
    }
  } catch {
    res.redirect("/");
  }
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

app.use(notfound);

app.listen(3000, "0.0.0.0", () => {
  console.log("App listening on localhost:3000");
});
