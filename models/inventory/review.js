const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JewelModel",
      required: [true, "Model reference is required"],
    },
    comments: {
      type: String,
      required: [true, "Comments are required"],
      minLength: [50, "Comments should have at least 50 characters"],
    },
    sketch: {
      type: String,
      required: [true, "Sketch is required for reference"],
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
