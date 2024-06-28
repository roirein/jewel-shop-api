const mongoose = require("mongoose");

const goldSchema = new mongoose.Schema({
  color: {
    type: String,
    required: [true, "Color is required"],
    enum: {
      values: ["yellow", "white", "rose", "purple", "green"],
      message: "Gold color must be either yellow, white, rose, purple or green",
    },
  },
  size: {
    type: String,
    required: [true, "Size is required"],
    enum: {
      values: ["10k", "14k", "18k", "22k"],
      message: "Gold size must be either 10k, 14k, 18k, 22k",
    },
  },
  pricePerUnit: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price must be a positive number"],
  },
});

goldSchema.index({ color: 1, size: 1 }, { unique: true });

const Gold = mongoose.model("Gold", goldSchema);

module.exports = Gold;
