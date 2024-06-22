const express = require("express");
const ControllerFactory = require("../controller/controller-factory");
const validateRequest = require("../middlewares/validation");
const {
  resetPasswordSchema,
  updatePasswordSchema,
} = require("../validations/password");

const router = express.Router();

const controller = ControllerFactory.createAuthController();
router.post("/login", (req, res, next) => controller.loginUser(req, res, next));

router.post("/reset-password/request", (req, res, next) =>
  controller.generateResetPasswordToken(req, res, next)
); //for sending email for password change after forgot password

router.post("/reset-password/verify/:token", (req, res, next) =>
  controller.verifyToken(req, res, next)
); //verifying token

router.patch(
  "/reset-password/change",
  validateRequest(resetPasswordSchema),
  (req, res, next) => controller.resetPassword(req, res, next)
); //actual reset password

router.patch(
  "/update-password",
  validateRequest(updatePasswordSchema),
  (req, res, next) => controller.updatePassword(req, res, next)
); //change password for logged in user

router.post("/reset-token", (req, res, next) =>
  controller.resteAccessToken(req, res, next)
); //refresh access token

router.post("/logout", (req, res, next) => controller.logout(req, res, next)); //logout
module.exports = router;
