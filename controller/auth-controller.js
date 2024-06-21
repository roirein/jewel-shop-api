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
}

module.exports = AuthController;
