const HTTPError = require("../../errors/http-error");
const RESOURCES_TYPES = require("../../resource-manager/definitions");

const isBusinessExists = async (resourceManager, data) => {
  const query = {
    $or: [
      { businessEmail: data.businessEmail },
      { businessPhoneNumber: data.businessPhoneNumber },
      { businessNumber: data.businessNumber },
    ],
  };
  if (!!(await resourceManager.findOne(RESOURCES_TYPES.BUSINESS, query))) {
    throw new HTTPError(
      "Business email or phone number already exists in the system",
      "fail",
      409
    );
  }
};

module.exports = {
  isBusinessExists,
};
