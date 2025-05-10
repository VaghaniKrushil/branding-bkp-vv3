const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const businessNotificationSchema = new Schema({
  businessNotificationId: { type: String },
  notificationTitle: { type: String },
  notificationContent: { type: String },
  token: { type: String },
  date: { type: String },
  isNotificationRead: { type: Boolean, default: false },
});

module.exports = mongoose.model(
  "business-notification",
  businessNotificationSchema
);
