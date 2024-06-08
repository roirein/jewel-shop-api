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

module.exports = {
  baseUserSchema,
  employeeSchema,
};
