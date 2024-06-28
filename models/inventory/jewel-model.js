const mongoose = require("mongoose");
const { isAlpha } = require("validator");

const jewelModelSchema = new mongoose.Schema({
  jewelType: {
    type: String,
    required: [true, "Jewel type is required"],
    enum: {
      values: ["ring", "earring", "bracelet", "necklace"],
      message: "Jewel type must be either ring, earring, bracelet or necklace",
    },
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: true,
  },
  sketch: {
    type: String,
    required: [true, "Sketch of a model is required"],
  },
  internal: {
    type: Boolean, //internal-will be exposed only to the employees if true, otherwise will be for client. relevant for models in progress or personal designs
    default: true,
  },
  images: [
    {
      type: String,
    },
  ],
  setting: {
    //if setting is set, allowed settings should be null
    type: mongoose.Schema.Types.ObjectId,
    ref: "Setting",
  },
  allowedSettings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Setting",
    },
  ],
  gold: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gold",
  },
  allowedGoldTypes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gold",
    },
  ],
  status: {
    type: String,
    default: "created",
    enum: [
      "created",
      "waiting for review",
      "in review",
      "needs work",
      "rejected",
      "approved",
    ],
  },
});

const JewelModel = mongoose.model("Jewel Model", jewelModelSchema);

module.exports = JewelModel;
