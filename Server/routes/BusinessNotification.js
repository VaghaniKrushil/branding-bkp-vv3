var express = require("express");
var router = express.Router();
var AddLanguage = require("../modals/AddLanguage");
var Notification = require("../modals/BusinessNotification");
var { verifyToken } = require("../authentication");
var Register = require("../modals/Register");
var BusinessNotification = require("../modals/BusinessNotification");
var moment = require("moment");

var FCM = require("fcm-node");
var serverKey =
  "AAAAXgzFw7c:APA91bHrfSg8LtQga4EALoJteMaV2GHuh3PHuLCi9hWjFXJLlu72jwMT7DIOr87WXD-T9mGaOA42G13ymTnOoIKVSgjPx3TB0gcUxmOTXOto4daQYQfFG-qN7TGHcrnfygIrS4-ZvQo_";
var fcm = new FCM(serverKey);

// router.post("/notification", verifyToken, async (req, res) => {
//   try {
//     const count = await Notification.count();
//     function pad(num) {
//       num = num.toString();
//       while (num.length < 2) num = "0" + num;
//       return num;
//     }
//     req.body["businessNotificationId"] = pad(count + 1);
//     const data = await Notification.create(req.body);

//     // Get all tokens from the Register collection
//     const users = await Register.find({}, "token").lean();

//     // Extract tokens
//     const tokens = users.map((user) => user.token);

//     // Construct the notification payload
//     const message = {
//       registration_ids: tokens,
//       notification: {
//         title: data.notificationTitle,
//         body: data.notificationContent,
//       },
//     };

//     // Send the push notification
//     fcm.send(message, function (err, response) {
//       if (err) {
//         console.log("Error sending push notification:", err);
//       } else {
//         console.log("Push notification sent:", response);
//       }
//     });

//     res.json({
//       statusCode: 200,
//       data: data,
//       message: "Add Notification Successfully",
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.post("/notification", verifyToken, async (req, res) => {
  try {
    const count = await Notification.count();
    function pad(num) {
      num = num.toString();
      while (num.length < 2) num = "0" + num;
      return num;
    }
    req.body["businessNotificationId"] = pad(count + 1);
    req.body["date"] = moment().format("DD-MM-YYYY");

    const data = await Notification.create(req.body);

    // Get tokens only for users with "isPersonal" true from the Register collection
    const users = await Register.find({ isPersonal: true }, "token").lean();

    // Extract tokens
    const tokens = users.map((user) => user.token);

    // Construct the notification payload
    const message = {
      registration_ids: tokens,
      notification: {
        title: data.notificationTitle,
        body: data.notificationContent,
      },
    };

    // Send the push notification
    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Error sending push notification:", err);
      } else {
        console.log("Push notification sent:", response);
      }
    });

    res.json({
      statusCode: 200,
      data: data,
      message: "Add Notification Successfully",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/notification/business", verifyToken, async (req, res) => {
  try {
    const count = await Notification.count();
    function pad(num) {
      num = num.toString();
      while (num.length < 2) num = "0" + num;
      return num;
    }
    req.body["businessNotificationId"] = pad(count + 1);
    req.body["date"] = moment().format("DD-MM-YYYY");

    const data = await Notification.create(req.body);

    // Get tokens only for users with "isPersonal" true from the Register collection
    const users = await Register.find({ isPersonal: false }, "token").lean();

    // Extract tokens
    const tokens = users.map((user) => user.token);

    // Construct the notification payload
    const message = {
      registration_ids: tokens,
      notification: {
        title: data.notificationTitle,
        body: data.notificationContent,
      },
    };

    // Send the push notification
    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Error sending push notification:", err);
      } else {
        console.log("Push notification sent:", response);
      }
    });

    res.json({
      statusCode: 200,
      data: data,
      message: "Add Notification Successfully",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/notification", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided
    var pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

    var data = await BusinessNotification.aggregate([
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    var count = await BusinessNotification.countDocuments();

    // Optionally reverse the data array
    data.reverse();

    res.json({
      statusCode: 200,
      data: data,
      LanguageCount: count,
      message: "Read All Language",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.delete("/notification", async (req, res) => {
  try {
    let result = await BusinessNotification.deleteMany({
      _id: { $in: req.body },
    });
    res.json({
      statusCode: 200,
      data: result,
      message: "Notification Deleted Successfully",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});

// Application
const currentDate = moment().format("DD-MM-YYYY");
router.get("/notification/get", async (req, res) => {
  try {
    var data = await BusinessNotification.find({ date: currentDate });
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All Language",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

module.exports = router;
