const { RESOURCES_TYPES } = require("../definitions");
const Controller = require("./controller");

class NotificationController extends Controller {
  constructor(service) {
    super(service);
  }

  async retrieveNotifications(req, res, next) {
    try {
      const notifications = await this.service.retrieveNotifications(req.query);
      res.status(200).json({
        status: "success",
        data: {
          notifications,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getNotificationById(req, res, next) {
    try {
      const notification = await this.service.getNotificationById(
        req.params.notificationId
      );
      res.status(200).json({
        status: "success",
        data: {
          notification,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async readNotification(req, res, next) {
    try {
      const notification = await this.service.markNotificationAsRead(
        req.params.notificationId
      );
      res.status(200).json({
        status: "success",
        data: {
          notification,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      await this.service.deleteNotification(req.params.notificationId);
      res.status(204).json({
        status: "success",
        message: "Notification deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotificationController;
