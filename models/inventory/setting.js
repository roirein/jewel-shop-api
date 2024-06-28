const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  mainStone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gemstone",
    required: [true, "Main stone is required"],
  },
  sideStone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gemstone",
  },
});

settingSchema.index({ mainStone: 1, sideStone: 1 }, { unique: true });

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
