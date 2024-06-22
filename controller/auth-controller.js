const Controller = require("./controller");
const { Request, Response, NextFunction } = require("express");
class AuthController extends Controller {
  constructor(service) {
    super(service);
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async loginUser(req, res, next) {
    try {
      const { email, password, rememberMe } = req.body;
      const { user, accessToken, refreshToken } = await this.service.loginUser({
        email,
        password,
        rememberMe,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
      });
      res.status(200).json({
        status: "success",
        token: accessToken,
        data: {
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async generateResetPasswordToken(req, res, next) {
    try {
      await this.service.genertaeResetPasswordToken(req.body.email);
      res.status(200).json({
        status: "success",
        message:
          "Email with instruction for resetting your password was sent to your email",
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyToken(req, res, next) {
    try {
      await this.service.verifyToken(req.params.token);
      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      await this.service.resetPassword({
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        token: req.body.token,
      });
      res.status(200).json({
        status: "success",
        message: "Password changed successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async logout(req, res, next) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        path: "/",
      });
      res.status(200).json({
        status: "success",
        message: "User logged out successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
