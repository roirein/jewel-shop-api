const yup = require("yup");
const { ROLES } = require("../consts/employees");

const baseUserSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters long")
    .matches(/[a-zA-Z]/, "First name msut be letters only"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters long"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^05[023458]\d{7}$/,
      "Phone number should start with valid prefix and contain 10 digits"
    ),
});

const employeeSchema = baseUserSchema.shape({
  role: yup
    .string()
    .required("role is required")
    .oneOf(Object.values(ROLES), "role should be a valid role in the system"),
});

const customerSchema = baseUserSchema.shape({
  permissionLevel: yup
    .number()
    .required("permission level is required")
    .positive("permission level must be a positive number")
    .max(5, "permission level cannot be higher than 5"),
});

module.exports = {
  baseUserSchema,
  employeeSchema,
  customerSchema,
};
