const yup = require("yup");

const modelSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .matches(/[a-zA-z]/, "Must include alphabetical characters only"),
  description: yup.string().required("Description is required"),
});

module.exports = modelSchema;
