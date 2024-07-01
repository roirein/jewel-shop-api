const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  mainStone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gemstone",
    required: [true, "Main stone is required"],
  },
  mainStoneSize: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v > 0 && v <= 1,
      message: "main stone size must be between 0 and 1 ",
    },
  },
  sideStone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gemstone",
  },
  sideStoneSize: {
    type: Number,
    validate: [
      {
        validator: function (v) {
          return this.sideStone ? v != null : true;
        },
        message: "side stone is required if side stone is specified",
      },
      {
        validator: (v) => v > 0 && v <= 1,
        message: "side stone size must be between 0 and 1 ",
      },
    ],
  },
});

module.exports = settingSchema;
