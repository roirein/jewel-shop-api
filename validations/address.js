const yup = require("yup");

const addressSchema = yup.object({
  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters long"),
  street: yup
    .string()
    .required("Street is required")
    .min(2, "Street must be at least 2 characters long"),
  streetNumber: yup
    .number()
    .required("Street number is required")
    .positive("Street number must be a positive value"),
  zipcode: yup
    .string()
    .required("Zip code is required")
    .matches(/^\d{7}$/, "zipcode must be 7 digits string"),
});

module.exports = addressSchema;
