const yup = require("yup");

const basePasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(24, "Password maximum length is 24 characters")
    .test(
      "isValid",
      "Password must staisfy 3 out of the 4 rules: lowercase letters, uppercase letters, digits, or special characters",
      (value) => {
        const rules = [/[a-z]/, /[A-Z]/, /[0-9]/, /[@#$&%?!]/];
        return rules.filter((rule) => rule.test(value)).length >= 3;
      }
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf(
      [yup.ref("password"), null],
      "password must match the confirm password field"
    ),
});

const resetPasswordSchema = basePasswordSchema.shape({
  token: yup.string().required("token is required"),
});

const updatePasswordSchema = basePasswordSchema.shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
});

module.exports = {
  resetPasswordSchema,
  updatePasswordSchema,
};
