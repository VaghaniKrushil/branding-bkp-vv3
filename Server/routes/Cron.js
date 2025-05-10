const express = require("express");
const router = express.Router();
const TodayAndTomorrowCategory = require("../modals/TodayAndTomorrow_Category");
const moment = require("moment");
const Register = require("../modals/Register");
const cron = require("node-cron");
const FCM = require("fcm-node");

// Your FCM server key
const serverKey =
  "AAAAXgzFw7c:APA91bHrfSg8LtQga4EALoJteMaV2GHuh3PHuLCi9hWjFXJLlu72jwMT7DIOr87WXD-T9mGaOA42G13ymTnOoIKVSgjPx3TB0gcUxmOTXOto4daQYQfFG-qN7TGHcrnfygIrS4-ZvQo_";
const fcm = new FCM(serverKey);

const dailyNotificationTime = "07:00"; // Daily notification time (24 hours format)
const additionalDelayForMultipleCategories = 5; // Multiple notification time set
const notification_title = "Today is"; // Notification Title

// Cron job definition
// Schedule the cron job to run every day at the specified time
cron.schedule(
  `0 ${dailyNotificationTime.split(":")[1]} ${
    dailyNotificationTime.split(":")[0]
  } * * *`,
  async () => {
    try {
      const currentDate = moment().format("YYYY-MM-DD");

      // Fetch data from the database where imageDate matches the current date
      const categories = await TodayAndTomorrowCategory.find({
        imageDate: currentDate,
      });

      // Fetch tokens from the Register collection
      const tokens = await Register.find({}, { token: 1, _id: 0 });

      // If more than one category is found, send notifications with additional delay
      if (categories.length > 1) {
        categories.forEach((category, index) => {
          const message = {
            registration_ids: tokens.map((token) => token.token), // Changed to registration_ids
            notification: {
              title: notification_title,
              body: category.categoryName,
            },
          };

          // Send notification with additional delay for each category
          setTimeout(() => {
            fcm.send(message, function (err, response) {
              if (err) {
                console.log("Error sending notification:", err);
              } else {
                console.log("Notification sent successfully:", response);
              }
            });
          }, index * additionalDelayForMultipleCategories * 60 * 1000); // Delay each notification by index * additional delay minutes
        });
      } else if (categories.length === 1) {
        // If only one category is found, send notification at the specified daily notification time
        const message = {
          registration_ids: tokens.map((token) => token.token), // Changed to registration_ids
          notification: {
            title: notification_title,
            body: categories[0].categoryName,
          },
        };

        fcm.send(message, function (err, response) {
          if (err) {
            console.log("Error sending notification:", err);
          } else {
            console.log("Notification sent successfully:", response);
          }
        });
      } else {
        console.log("No categories found for today.");
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  }
);

module.exports = router;
