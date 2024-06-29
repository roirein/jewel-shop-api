const mongoose = require("mongoose");
const { isAlpha } = require("validator");
const { DBError } = require("../../errors");

const jewelModelSchema = new mongoose.Schema({
  jewelType: {
    type: String,
    required: [true, "Jewel type is required"],
    enum: {
      values: ["ring", "earring", "bracelet", "necklace"],
      message: "Jewel type must be either ring, earring, bracelet or necklace",
    },
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
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

jewelModelSchema.pre("save", (next) => {
  if (this.setting && (this.allowedSettings || this.allowedSettings.length)) {
    throw new Error(
      "model has exactly one setting or list of allowed settings, but cannot have both"
    );
  }
  if (this.gold && (this.allowedGoldTypes || this.allowedGoldTypes.length)) {
    throw new Error(
      "model can be available in exactly one varaition of gold or have list of allowed variantions, but not both"
    );
  }
  next();
});

const JewelModel = mongoose.model("Jewel Model", jewelModelSchema);

module.exports = JewelModel;
