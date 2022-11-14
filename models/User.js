const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  displayname: {
    type: String,
    unique: [true, "Display name already in use, please try another"],
    required: [true, "A displayname is required"],
  },
  email: {
    type: String,
    unique: [true, "This email is already registered, choose another"],
    required: [true, "Email address is required"],
  },
  password: {
    type: String,
    required: [true, "You must enter a password"],
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

UserSchema.plugin(uniqueValidator, {
  message: "{PATH} already in use, please select another.",
});

UserSchema.pre("save", function (next) {
  const user = this;

  bcrypt.hash(user.password, 12, (error, hash) => {
    user.password = hash;
    next();
  });

  if (user.email == `${process.env.ADMIN_EMAIL}`) {
    user.admin = true;
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
