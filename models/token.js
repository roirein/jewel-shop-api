const mongoose = require("mongoose");
const crypto = require("crypto");

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
  this.token = crypto.createHash("sha256").update(this.token).digest("hex");
  next();
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
