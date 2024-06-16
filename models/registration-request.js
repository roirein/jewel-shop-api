const mongoose = require("mongoose");
const { isAlpha, isEmail } = require("validator");

const registrationRequestSchema = new mongoose.Schema({
  businessData: {
    businessNumber: {
      type: String,
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
  },
  contactData: {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      minLength: [2, "first name must be at least 2 characters long"],
      validate: {
        validator: function (value) {
          return isAlpha(value);
        },
        message: "first name must contain only alphabetic characters",
      },
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      minLength: [2, "last name must be at least 2 charactere long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function (value) {
          return isEmail(value);
        },
        message: (props) => `${props.value} is invalid email address`,
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
      match: [
        /^05[023458]\d{7}$/,
        "Phone number should start with valid prefix and contain 10 digits",
      ],
    },
  },
  status: {
    type: String,
    required: [true, "status is required"],
    enum: {
      values: ["pending", "approved", "rejected"],
      message: "status must be either approved, pending or rejected",
    },
    default: "pending",
  },
  description: {
    type: String,
    required: [true, "Request description is required"],
    minLength: [50, "Request description must be at least 50 characters"],
    maxLength: [500, "Request Description maximum length is 500 characters"],
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

const RegistrationRequest = mongoose.model(
  "RegistrationRequest",
  registrationRequestSchema
);

module.exports = RegistrationRequest;
