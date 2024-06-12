const mongoose = require("mongoose");
const User = require("./user");

const customerSchema = new mongoose.Schema({
  permissionLevel: {
    type: Number,
    required: ["true", "permission level is required"],
    min: [1, "permission level must be a positive number"],
    max: [5, "permission level cannot be more than 5"],
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: [true, "Business id is required"],
  },
});

const Customer = User.discriminator("customer", customerSchema);

module.exports = Customer;
