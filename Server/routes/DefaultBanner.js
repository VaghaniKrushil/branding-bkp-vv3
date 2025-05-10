var express = require("express");
var router = express.Router();
var DefaultBanner = require("../modals/DefaultBanner");
var moment = require("moment");

router.post("/default_banner", async (req, res) => {
  try {
    var data = await DefaultBanner.create(req.body);
    res.json({
      statusCode: 200,
      data: data,
      message: "Add DefaultBanner Successfully",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// router.post("/default_banner", async (req, res) => {
//   try {
//     var data = await DefaultBanner.create(req.body);
//     res.json({
//       statusCode: 200,
//       data: data,
//       message: "Add DefaultBanner Successfully",
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.put("/default_banner/:id", async (req, res) => {
  try {
    let result = await DefaultBanner.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      statusCode: 200,
      data: result,
      message: "DefaultBanner Updated Successfully",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});

// ----------------------
router.get("/main_banner_default", async (req, res) => {
  try {
    var data = await DefaultBanner.find({
      defaultBannerType: "Main Banner",
    });
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All DefaultBanner",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/popup_banner_default", async (req, res) => {
  try {
    var data = await DefaultBanner.find({
      defaultBannerType: "Popup Banner",
    });
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All DefaultBanner",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/business_banner_default", async (req, res) => {
  try {
    var data = await DefaultBanner.find({
      defaultBannerType: "Business Banner",
    });
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All DefaultBanner",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});
router.get("/advertise_banner_default", async (req, res) => {
  try {
    var data = await DefaultBanner.find({
      defaultBannerType: "Advertise Banner",
    });
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All DefaultBanner",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/custome_banner_default", async (req, res) => {
  try {
    var data = await DefaultBanner.find({
      defaultBannerType: "Custome Banner",
    });
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All DefaultBanner",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});


router.get("/splash_screen_default", async (req, res) => {
  try {
    var data = await DefaultBanner.find({
      defaultBannerType: "Splash Screen",
    });
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All DefaultBanner",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

module.exports = router;
