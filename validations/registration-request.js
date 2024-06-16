const yup = require("yup");
const { baseUserSchema } = require("./user");
const businessSchema = require("./business");

const registrationRequestSchema = yup.object({
  contactData: baseUserSchema,
  businessData: businessSchema,
  description: yup
    .string()
    .required("Description is required")
    .min(50, "Request description must be at least 50 characters")
    .max(500, "Request Description maximum length is 500 characters"),
});

module.exports = registrationRequestSchema;
