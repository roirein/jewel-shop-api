const HTTPError = require("../../../errors/http-error");
const RESOURCES_TYPES = require("../../../resource-manager/definitions");
const ResourceManager = require("../../../resource-manager/resource-manager");

/**
 *
 * @param {ResourceManager} rm
 * @param {string} email
 * @param {string} phoneNumber
 * @param {Record<string, string>} excludeSelf - optional, if provided, it contains
 * resource(business or user) type, and their id, and the validation will be applied to any record apart from the record with the given id
 * should be used in updated when we provide record with email or
 * phone number that wasn't change, by this prevent failure due duplication when we actually keeping the same email and phone number
 */
const checkContactInfoExists = async (
  rm,
  email,
  phoneNumber,
  excludeSelf = {}
) => {
  let userQuery = {
    $or: [{ email }, { phoneNumber }],
  };
  let businessQuery = {
    $or: [{ businessEmail: email }, { businessPhoneNumber: phoneNumber }],
  };
  if (excludeSelf.resource === RESOURCES_TYPES.USER) {
    userQuery = {
      ...userQuery,
      _id: { $ne: excludeSelf.resourceId },
    };
  }
  if (excludeSelf.resource === RESOURCES_TYPES.BUSINESS) {
    businessQuery = {
      ...businessQuery,
      _id: { $ne: excludeSelf.resourceId },
    };
  }

  const results = await Promise.all([
    rm.findOne(RESOURCES_TYPES.USER, userQuery),
    rm.findOne(RESOURCES_TYPES.BUSINESS, businessQuery),
  ]);
  if (results.some((item) => item)) {
    throw new HTTPError(
      "Some of the contact info you provided already exists",
      "fail",
      409
    );
  }
};

module.exports = {
  checkContactInfoExists,
};
