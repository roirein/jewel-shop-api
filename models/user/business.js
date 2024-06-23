const mongoose = require("mongoose");
const { isEmail } = require("validator");

const businessSchema = new mongoose.Schema({
  businessNumber: {
    type: String,
    unique: true,
    required: [true, "business number is required"],
    match: [/^\d{9}$/, "business number must be 9 digits string"],
  },
  businessName: {
    type: String,
    required: [true, "business name is required"],
    minLength: [2, "business name must include at least 2 characters"],
  },
  businessEmail: {
    type: String,
    required: [true, "business name is required"],
    unique: true,
    validate: {
      validator: function (value) {
        return isEmail(value);
      },
      message: (props) => `${props.value} is invalid email address`,
    },
  },
  businessPhoneNumber: {
    type: String,
    required: [true, "phone number is required"],
    unique: [true, "Phone number already exists"],
    match: [
      /^05[023458]\d{7}$/,
      "Phone number should start with valid prefix and contain 10 digits",
    ],
  },
  address: {
    city: {
      type: String,
      required: [true, "City is required"],
      minLength: [2, "City must be at least 2 characters long"],
    },
    street: {
      type: String,
      required: [true, "Street is required"],
      minLength: [2, "Street must be at least 2 characters long"],
    },
    streetNumber: {
      type: Number,
      required: [true, "Street number is required"],
      min: [1, "Street number must be positive number"],
    },
    zipcode: {
      type: String,
      required: [true, "Zipcode is required"],
      match: [/^\d{7}$/, "zipcode must be 7 digits string"],
    },
  },
  customers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  ],
});

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
