const mongoose = require("mongoose");
const { isAlpha, isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
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
      unique: [true, "Email already exists"],
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
      unique: [true, "Phone number already exists"],
      match: [
        /^05[023458]\d{7}$/,
        "Phone number should start with valid prefix and contain 10 digits",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password should be at least 8 characters"],
      maxLength: [24, "Password length can be maximum of 24 characters"],
      validate: {
        validator: function (value) {
          const rules = [/[a-z]/, /[A-Z]/, /[0-9]/, /[@#$&%?!]/];
          return rules.filter((rule) => rule.test(value)).length >= 3;
        },
        message:
          "Password must staisfy 3 out of the 4 rules: lowercase letters, uppercase letters, digits, or special characters",
      },
    },
    imagePath: {
      type: String,
    },
    firstLogin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "userType",
    toJSON: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 12);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
