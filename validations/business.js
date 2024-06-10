const yup = require("yup");
const addressSchema = require("./address");

const businessSchema = yup.object({
  businessNumber: yup
    .string()
    .required("Business number is required")
    .matches(/^\d{9}$/, "business number must be 9 digits string"),
  businessName: yup
    .string()
    .required("Business name is required")
    .min(2, "business name must include at least 2 characters"),
  businessEmail: yup
    .string()
    .required("Business email is required")
    .email("Invalid email format"),
  businessPhoneNumber: yup
    .string()
    .required("Business phone number is required")
    .matches(
      /^05[023458]\d{7}$/,
      "Phone number should start with valid prefix and contain 10 digits"
    ),
  address: addressSchema,
});

module.exports = businessSchema;
