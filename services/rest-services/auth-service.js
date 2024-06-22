const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resourceManager = require("../../resource-manager");
const RESOURCES_TYPES = require("../../resource-manager/definitions");
const Service = require("../service");
const HTTPError = require("../../errors/http-error");
const crypto = require("crypto");

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

  async #fetchAndValidateToken(token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const tokenRecord = await this.resourceManager.findOne(
      RESOURCES_TYPES.TOKEN,
      { token: hashedToken }
    );
    try {
      if (!tokenRecord) {
        throw new HTTPError("Invalid token", "fail", 400);
      }
      if (tokenRecord.expiresIn < Date.now()) {
        throw new HTTPError("Token has expired", "fail", 400);
      }
      return tokenRecord;
    } catch (err) {
      if (tokenRecord) {
        await this.#deleteToken(tokenRecord);
      }
      throw err;
    }
  }

  async #fetchUserByToken(tokenRecord) {
    try {
      const user = await this.resourceManager.findById(
        RESOURCES_TYPES.USER,
        tokenRecord.user
      );
      if (!user) {
        throw new HTTPError("No user attached this token", "fail", 400);
      }
      return user;
    } catch (err) {
      await this.#deleteToken(tokenRecord);
      throw err;
    }
  }

  async #deleteToken(tokenRecord) {
    await this.resourceManager.delete(RESOURCES_TYPES.TOKEN, tokenRecord._id);
  }

  async loginUser({ email, password, rememberMe }) {
    try {
      const user = await this.resourceManager.findOne(RESOURCES_TYPES.USER, {
        email,
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HTTPError("Email or password incorrect", "fail", 401);
      }
      if (user.firstLogin) {
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

  async genertaeResetPasswordToken(email) {
    try {
      const user = await this.resourceManager.findOne(RESOURCES_TYPES.USER, {
        email,
      });
      if (!user) {
        throw new HTTPError("No user attached to this email", "fail", 404);
      }
      const token = crypto.randomBytes(32).toString("hex");
      await this.resourceManager.createResource(RESOURCES_TYPES.TOKEN, {
        user: user._id,
        token,
      });
      this.eventEmitter.emitEvent({
        event: "send-mail",
        data: {
          type: "reset-password",
          email,
          token,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async verifyToken(token) {
    try {
      const tokenRecord = await this.#fetchAndValidateToken(token);
      await this.#fetchUserByToken(tokenRecord);
    } catch (err) {
      throw err;
    }
  }

  async resetPassword({ password, token }) {
    try {
      const tokenRecord = await this.#fetchAndValidateToken(token);
      const user = await this.#fetchUserByToken(tokenRecord);
      const updatedUser = { ...user, password };
      if (user.firstLogin) {
        updatedUser.firstLogin = false;
      }
      await this.resourceManager.update(RESOURCES_TYPES.USER, user._id, {
        ...updatedUser,
      });
      await this.#deleteToken(tokenRecord);
    } catch (err) {
      throw err;
    }
  }

  async updatePassword({ email, password }) {
    try {
      const user = await this.resourceManager.findOne(RESOURCES_TYPES.USER, {
        email,
      });
      if (!user) {
        throw new HTTPError("No user attached to this email", "fail", 404);
      }
      await this.resourceManager.update(RESOURCES_TYPES.USER, user._id, {
        ...user,
        password,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async resetAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const accessToken = this.#generateToken(
        { _id: decoded._id },
        process.env.ACCESS_TOKEN_SECRET,
        "15m"
      );
      return accessToken;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new HTTPError("Token has expired", "fail", 401);
      }
      if (err.name === "JsonWebTokenError") {
        throw new HTTPError("Invalid token", "fail", 401);
      }
    }
  }
}

module.exports = AuthService;
