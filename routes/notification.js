const express = require("express");
const passport = require("passport");
const { ControllerFactory } = require("../factories");
const { RESOURCES_TYPES } = require("../definitions");

const router = express.Router();
const controller = ControllerFactory.createController(
  RESOURCES_TYPES.NOTIFICATION
);

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", (req, res, next) =>
  controller.retrieveNotifications(req, res, next)
);

router.get("/:notificationId", (req, res, next) => {
  controller.getNotificationById(req, res, next);
});

router.patch("/:notificationId", (req, res, next) =>
  controller.readNotification(req, res, next)
);

router.delete("/:notificationId", (req, res, next) => {
  controller.deleteNotification(req, res, next);
});

module.exports = router;
