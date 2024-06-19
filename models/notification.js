const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    notificationType: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ["RegistrationRequest", "Order", "Model"],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "resourceType",
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
