const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

tokenSchema.pre("save", function (next) {
  this.expiresIn = new Date(Date.now() + 5 * 60 * 1000);
  next();
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
