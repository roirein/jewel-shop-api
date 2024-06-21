const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resourceManager = require("../../resource-manager");
const RESOURCES_TYPES = require("../../resource-manager/definitions");
const Service = require("../service");
const HTTPError = require("../../errors/http-error");

class AuthService extends Service {
  #resourceManager;

  constructor() {
    super();
    this.#resourceManager = resourceManager;
  }

  get resourceManager() {
    return this.#resourceManager;
  }

  #generateToken(data, secret, expiresIn) {
    const token = jwt.sign({ ...data }, secret, { expiresIn });
    return token;
  }

  async loginUser({ email, password, rememberMe }) {
    try {
      const user = await this.resourceManager.findOne(RESOURCES_TYPES.USER, {
        email,
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HTTPError("Email or password incorrect", "fail", 401);
      }
      if (!user.isFirstLogin) {
        throw new HTTPError(
          "You have to reset your password before login",
          "fail",
          403
        );
      }
      const accessToken = this.#generateToken(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        "15m"
      );
      const refreshToken = this.#generateToken(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        rememberMe ? "180d" : "3h"
      );
      user.password = undefined;
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AuthService;
