const RESOURCES_TYPES = require("../../resource-manager/definitions");

const isUserExists = async (resourceManager, data) => {
  const query = { $or: [{ email: data.email, phoneNumber: data.phoneNumber }] };
  return !!(await resourceManager.findOne(RESOURCES_TYPES.USER, query));
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
  isUserExists,
  generatePassword,
};
