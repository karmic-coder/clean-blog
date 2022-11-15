const fileUpload = require("express-fileupload");
const BlogPost = require("../models/BlogPost");
const path = require("path");

const fieldsNotNull = (req, res, next) => {
  if (req.files == null || req.body.title == null || req.body.body == null) {
    return res.redirect("/posts/new");
  }
  next();
};

const home = async (req, res) => {
  const blogposts = await BlogPost.find({}).populate(
    "userid",
    "displayname admin"
  );
  // .select("displayname email admin");
  // console.log(blogposts);
  res.render("index", { blogposts });
};

const getPost = async (req, res) => {
  try {
    const blogpost = await BlogPost.findOne({ slug: req.params.slug }).populate(
      "userid",
      "displayname admin"
    );
    // console.log({ blogpost });
    if (blogpost) {
      return res.render("post", { blogpost });
    } else {
      res.status(404).render("404");
    }
  } catch {
    res.status(404).render("404");
  }
};

const storePost = (req, res) => {
  //   try {
  let image = req.files.image;
  //   } catch {
  //     res.redirect("/posts/new");
  //   }
  image.mv(
    path.resolve(__dirname, "../public/upload/img", image.name),
    async (error) => {
      await BlogPost.create({
        ...req.body,
        image: "/upload/img/" + image.name,
        userid: req.session.userId,
      });
      res.redirect("/");
    }
  );
};

module.exports = {
  home,
  getPost,
  storePost,
  fileUpload,
  fieldsNotNull,
};
