const { RESOURCES_TYPES } = require("../../../definitions");
const BaseEntityService = require("./base-entity-service");

class NotificationsService extends BaseEntityService {
  constructor() {
    super(RESOURCES_TYPES.NOTIFICATION);
  }

  async retrieveNotifications(query = {}) {
    const fields = query.fields ? query.fields.replaceAll(",", " ") : undefined;
    const limit = query.limit ? parseInt(query.limit) : undefined;
    const skip = query.limit ? parseInt(query.skip) : undefined;
    const notifications = await this.searchResources({
      ...query,
      fields,
      limit,
      skip,
    });
    return notifications;
  }

  async getNotificationById(notificationId) {
    const notification = await this.searchResourceById(
      notificationId,
      fields.replaceAll(",", " ")
    );
    return notification;
  }

  async markNotificationAsRead(notificationId) {
    const updatedNotification = await this.updateResource(notificationId, {
      read: true,
    });
    return updatedNotification;
  }

  async deleteNotification(notificationId) {
    await this.deleteResource(notificationId);
  }
}

module.exports = NotificationsService;
