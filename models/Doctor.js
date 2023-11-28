const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // doctorInfo: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Doctor",
    //   required: true,
    // },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

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
    reviews: [ReviewSchema],
    totalReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

DoctorSchema.methods.calculateReviewsAndRating = function () {
  const totalReviews = this.reviews.length;

  if (totalReviews === 0) {
    this.totalReviews = 0;
    this.averageRating = 0;
  } else {
    const sumOfRatings = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.totalReviews = totalReviews;
    this.averageRating = sumOfRatings / totalReviews;
  }

  // Save the updated doctor document
  return this.save();
};

module.exports = mongoose.model("Doctor", DoctorSchema);
