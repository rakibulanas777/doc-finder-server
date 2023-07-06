const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const DoctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
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
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    feesPerConsaltation: {
      type: Number,
      required: [true, "fees is required"],
    },
    timings: {
      type: Object,
      required: [true, "worked time is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
