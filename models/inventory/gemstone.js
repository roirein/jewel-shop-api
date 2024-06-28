const mongoose = require("mongoose");

const gemstoneSchema = new mongoose.Schema({
  stoneType: {
    type: String,
    required: [true, "Stone type is required"],
    enum: {
      values: ["diamond", "sapphire", "ruby", "emerald"],
      message:
        "Stone type must be either diamond, sapphire, ruby, purple or emerald",
    },
  },
  color: {
    type: String,
    required: [true, "Color is required"], //add validation of color according to stone type
  },
  size: {
    type: Number,
    required: [true, "Size is required"],
    min: [0.1, "Size must be at least 0.1ct"],
    max: [1.0, "Size maximum value is 1ct"],
    validate: {
      validator: (v) => (v * 10) % 10 === 0,
      message: "size must be multiple of 0.1(0.1, 0.2 etc...)",
    },
  },
  pricePerUnit: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price must be a positive number"],
  },
});

gemstoneSchema.index({ stoenType: 1, color: 1, size: 1 }, { unique: true });

const Gemstone = mongoose.model("Gemstone", gemstoneSchema);

module.exports = Gemstone;
