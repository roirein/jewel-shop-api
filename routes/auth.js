const express = require("express");
const ControllerFactory = require("../controller/controller-factory");

const router = express.Router();

const controller = ControllerFactory.createAuthController();
router.post("/login", (req, res, next) => controller.loginUser(req, res, next));

router.post("/reset-password/request", (req, res, next) => {}); //for sending email for password change after forgot password

router.post("/reset-password/verify", (req, res, next) => {}); //verifying token

router.patch("/reset-password/change", (req, res, next) => {}); //actual reset password

router.patch("/update-password", (req, res, next) => {}); //change password for logged in user

router.post("/reset-token", (req, res, next) => {}); //refresh access token

router.post("/logout", (req, res, next) => {}); //logout
module.exports = router;
