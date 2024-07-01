const yup = require("yup");

const settingSchema = yup
  .object({
    mainStone: yup.string().required("main stone is required"),
    mainStoneSize: yup
      .number()
      .required("main stone size")
      .positive("main stone size must be positive value")
      .max(1, "main stone cannot be more than 1 ct"),
    sideStone: yup.string().nullable(),
    sideStoneSize: yup
      .number()
      .positive("main stone size must be positive value")
      .max(1, "main stone cannot be more than 1 ct")
      .when("sideStone", {
        is: (val) => val !== null,
        then: yup
          .number()
          .required("Side stone size is required if side stone is specified"),
        otherwise: yup.number().nullable(),
      }),
  })
  .nullable()
  .default(null);

const modelSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  jewelType: yup
    .string()
    .required("jewel type is required")
    .oneOf(
      ["ring", "earring", "bracelet", "necklace"],
      "Jewel type must be either ring, earring, bracelet or necklace"
    ),
  designer: yup.string().required("designer is required"),
  setting: settingSchema,
  allowedGoldTypes: yup
    .array()
    .required("Allowed gold types is required")
    .min(1, "You must specify at least 1 gold type"),
});

module.exports = modelSchema;
