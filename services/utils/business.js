const HTTPError = require("../../errors/http-error");
const RESOURCES_TYPES = require("../../resource-manager/definitions");
const { checkContactInfoExists } = require("./contact-info");

const isBusinessExists = async (
  resourceManager,
  data,
  isUpdate = false,
  businessId = null
) => {
  const excludeSelf = isUpdate
    ? { resource: RESOURCES_TYPES.BUSINESS, resourceId: businessId }
    : {};
  await checkContactInfoExists(
    resourceManager,
    data.businessEmail,
    data.businessNumber,
    excludeSelf
  );
  let query = {
    businessNumber: data.businessNumber,
  };
  if (isUpdate) {
    query = {
      ...query,
      _id: { $ne: businessId },
    };
  }
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
