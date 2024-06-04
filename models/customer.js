const mongoose = require("mongoose");
const User = require("./user");

const customerSchema = new mongoose.Schema({
  permissionLevel: {
    type: Number,
    required: ["true", "permission level is required"],
    min: [1, "permission level must be a positive number"],
    max: [5, "permission level cannot be more than 5"],
  },
});

const Customer = User.discriminator("customer", customerSchema);

module.exports = Customer;
