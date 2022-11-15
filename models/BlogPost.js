const makeSlug = require("../utilities/slug");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BlogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    // default: makeSlug(this.title),
  },
  subheading: String,
  body: {
    type: String,
    required: true,
  },
  // username: String,
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  datePosted: {
    type: Date,
    default: new Date(),
  },
  image: String,
});

BlogPostSchema.pre("save", function (next) {
  const blog = this;
  blog.slug = makeSlug(blog.title);
  next();
});

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
module.exports = BlogPost;
