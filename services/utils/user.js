const HTTPError = require("../../errors/http-error");
const RESOURCES_TYPES = require("../../resource-manager/definitions");
const ResourceManager = require("../../resource-manager/resource-manager");

/**
 *
 * @param {ResourceManager} resourceManager
 * @param {object} data
 * @throws {HTTPError} - throws error if user exist
 */
const checkUserExists = async (resourceManager, data) => {
  const query = {
    $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
  };
  if (!!(await resourceManager.findOne(RESOURCES_TYPES.USER, query))) {
    throw new HTTPError(
      "User email or phone number already exists in the system",
      "fail",
      409
    );
  }
};

const generatePassword = () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const special = "@#$&%?!";

  const charsets = [lowercase, uppercase, digits, special];
  let password = "";
  const randomCharacter = (set) => set[Math.floor(Math.random() * set.length)];
  charsets.forEach((set) => {
    password += randomCharacter(set);
  });

  for (let i = 0; i < 4; i++) {
    const randomCharset = charsets[Math.floor(Math.random() * charsets.length)];
    password += randomCharacter(randomCharset);
  }

  return password;
};

module.exports = {
  checkUserExists,
  generatePassword,
};
