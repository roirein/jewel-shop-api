const mongoose = require("mongoose");
const User = require("./user");

const employeeSchema = new mongoose.Schema({
  role: {
    type: String,
    required: ["true", "Role is required"],
    enum: {
      values: ["manager", "designer", "employee", "production manager"],
      message: "role must be a valid role in the shop",
    },
  },
});

const Employee = User.discriminator("employee", employeeSchema);

module.exports = Employee;
