const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    image: String,
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfrim: {
      type: String,
      required: [true, "Please confrim your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password are not the same",
      },
      select: false,
    },
    passwordChangedAt: Date,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: { type: Boolean, default: false },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    notification: {
      type: Array,
      default: [],
    },
    seenNotification: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
