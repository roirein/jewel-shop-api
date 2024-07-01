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
  pricePerCarat: {
    type: Number,
    required: [true, "Price is required"],
    min: [0.01, "Price must be a positive number"],
  },
});

gemstoneSchema.index({ stoenType: 1, color: 1, size: 1 }, { unique: true });

const Gemstone = mongoose.model("Gemstone", gemstoneSchema);

module.exports = Gemstone;
