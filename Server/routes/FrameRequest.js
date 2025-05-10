var express = require("express");
var router = express.Router();
var FrameRequest = require("../modals/FrameRequest");
var FrameUserCollection = require("../modals/Frame-User");
var { verifyToken } = require("../authentication");
var moment = require("moment");

// router.post("/framerequest", async (req, res) => {
//   try {
//     const userId = req.body.userId;

//     // Check if there is a frame request with the same userId
//     const existingFrameRequest = await FrameRequest.findOne({ userId });

//     if (existingFrameRequest) {
//       if (existingFrameRequest.isFrameCreated) {
//         // If isFrameCreated is true, don't allow creating a new frame request
//         return res.json({
//           statusCode: 400,
//           message: "You already have an active frame request.",
//         });
//       } else {
//         // If isFrameCreated is false, update the existing frame request
//         await FrameRequest.updateOne({ userId }, req.body);
//         return res.json({
//           statusCode: 200,
//           message: "Updated existing frame request.",
//         });
//       }
//     } else {
//       // If no frame request exists for the user, create a new one
//       var count = await FrameRequest.count();
//       function pad(num) {
//         num = num.toString();
//         while (num.length < 2) num = "0" + num;
//         return num;
//       }
//       req.body["frameRequestId"] = pad(count + 1);
//       req.body["addDate"] = moment()
//       .add(1, "seconds")
//       .format("YYYY-MM-DD HH:mm:ss");
//       var data = await FrameRequest.create(req.body);
//       return res.json({
//         statusCode: 200,
//         data: data,
//         message: "Added Frame-request Successfully.",
//       });
//     }
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.post("/framerequest", verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId;

    // Check if there is any frame request with the same userId
    const existingFrameRequests = await FrameRequest.find({ userId });

    if (existingFrameRequests.length > 0) {
      // If there are existing frame requests for the user
      const hasActiveRequest = existingFrameRequests.some(
        (userData) => userData.isFrameCreated === false
      );

      if (hasActiveRequest) {
        // If there is an existing frame request with isFrameCreated set to false, don't allow creating a new frame request
        return res.json({
          statusCode: 400,
          message: "You already have an active frame request.",
        });
      } else {
        // If all existing frame requests have isFrameCreated set to true, create a new frame request
        var count = await FrameRequest.count();
        function pad(num) {
          num = num.toString();
          while (num.length < 2) num = "0" + num;
          return num;
        }
        req.body["frameRequestId"] = pad(count + 1);
        req.body["addDate"] = moment()
          .add(1, "seconds")
          .format("YYYY-MM-DD HH:mm:ss");
        var data = await FrameRequest.create(req.body);
        return res.json({
          statusCode: 200,
          data: data,
          message: "Added Frame-request Successfully.",
        });
      }
    } else {
      // If no frame request exists for the user, create a new one
      var count = await FrameRequest.count();
      function pad(num) {
        num = num.toString();
        while (num.length < 2) num = "0" + num;
        return num;
      }
      req.body["frameRequestId"] = pad(count + 1);
      req.body["addDate"] = moment()
        .add(1, "seconds")
        .format("YYYY-MM-DD HH:mm:ss");
      var data = await FrameRequest.create(req.body);
      return res.json({
        statusCode: 200,
        data: data,
        message: "Added Frame-request Successfully.",
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.delete("/framerequest", async (req, res) => {
  try {
    let result = await FrameRequest.deleteMany({
      _id: { $in: req.body },
    });
    res.json({
      statusCode: 200,
      data: result,
      message: "FrameRequest Deleted Successfully",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});

router.get("/user/framerequest", async (req, res) => {
  try {
    var data = await FrameRequest.find({ isFrameCreated: false }).select({
      _id: 1,
      userName: 1,
      userId: 1,
      userMobileNumber: 1,
    });
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All Frame-Request User",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Post Canva-Fram (User Send Request To Create Frame and Store in Frame_Collection)
// router.post("/frame/user", async (req, res) => {
//   try {
//     var count = await FrameUserCollection.count();
//     function pad(num) {
//       num = num.toString();
//       while (num.length < 2) num = "0" + num;
//       return num;
//     }
//     req.body["frame_userId"] = pad(count + 1);
//     var data = await FrameUserCollection.create(req.body);
//     res.json({
//       statusCode: 200,
//       data: data,
//       message: "Create Frame Successfully",
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// Post Canva-Fram (User Send Request To Create Frame and Store in Frame_Collection)
router.post("/frame/user", async (req, res) => {
  try {
    // Your existing code to create a new frame user
    var count = await FrameUserCollection.count();
    function pad(num) {
      num = num.toString();
      while (num.length < 2) num = "0" + num;
      return num;
    }
    req.body["frame_userId"] = pad(count + 1);
    req.body["addDate"] = moment()
      .add(1, "seconds")
      .format("YYYY-MM-DD HH:mm:ss");
    var data = await FrameUserCollection.create(req.body);

    // Update FrameRequest isFrameCreated for the specified userId
    await FrameRequest.updateOne(
      { userId: req.body.userId },
      { $set: { isFrameCreated: true } }
    );

    res.json({
      statusCode: 200,
      data: data,
      message: "Create Frame Successfully",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/filterData", async (req, res) => {
  try {
    let pipeline = [];

    // Match documents based on starting date
    if (req.body.startingDate) {
      pipeline.push({
        $match: {
          frameRequestDate: { $gte: req.body.startingDate },
        },
      });
    }

    // Match documents based on ending date
    if (req.body.endingDate) {
      pipeline.push({
        $match: {
          frameRequestDate: { $lte: req.body.endingDate },
        },
      });
    }

    // Add a $count stage to count the documents
    pipeline.push({
      $count: "totalCount",
    });

    // Execute the aggregation pipeline
    let results = await FrameRequest.aggregate(pipeline);

    if (results.length > 0) {
      const totalCount = results[0].totalCount;
      pipeline.pop(); // Remove the $count stage to get the actual data
      const findByDateWisenData = await FrameRequest.aggregate(pipeline);

      res.json({
        statusCode: 200,
        totalCount: totalCount,
        findByDateWisenData: findByDateWisenData,
        message: "Find SelectDate Data Successfully",
      });
    } else {
      // No matching documents
      res.json({
        statusCode: 200,
        totalCount: 0,
        findByDateWisenData: [],
        message: "No data found for the selected date range",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

router.get("/ownframe/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await FrameUserCollection.find({ userId });

    res.json({
      data,
      statusCode: 200,
      message: `Read Frame-Request for user with ID: ${userId}`,
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.delete("/ownframe_remove/:id", async (req, res) => {
  try {
    const requestId = req.params.id;

    if (!requestId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Missing request ID in the URL parameters",
      });
    }

    let result = await FrameUserCollection.deleteOne({ _id: requestId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Frame not found",
      });
    }

    res.json({
      statusCode: 200,
      data: result,
      message: "Frame Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
});

router.post("/framerequest/complete", async (req, res) => {
  try {
    const pageSize = req.body.pageSize;
    const pageNumber = req.body.pageNumber;

    const data = await FrameUserCollection.aggregate([
      {
        $project: {
          frame_userId: 1,
          userId: 1,
          fullName_user: 1,
          savedFrame_user: 1,

          addDate: {
            $dateFromString: {
              dateString: "$addDate",
              format: "%Y-%m-%d %H:%M:%S",
            },
          },
        },
      },
      {
        $sort: { addDate: -1 }, // Sort by addDate in descending order
      },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    const count = await FrameUserCollection.count();

    res.json({
      statusCode: 200,
      data: data,
      CompleteFrameCount: count,
      message: "Read All Complete Frame-Request",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/framerequest/get", async (req, res) => {
  try {
    const pageSize = req.body.pageSize;
    const pageNumber = req.body.pageNumber;

    const data = await FrameRequest.aggregate([
      {
        $project: {
          frameRequestId: 1,
          frameRequestDate: 1,
          userId: 1,

          userName: 1,
          userMobileNumber: 1,
          isFrameCreated: 1,
          frameRequestImage: 1,
          frameRequestMessage: 1,

          addDate: {
            $dateFromString: {
              dateString: "$addDate",
              format: "%Y-%m-%d %H:%M:%S",
            },
          },
        },
      },
      {
        $sort: { addDate: -1 }, // Sort by addDate in descending order
      },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    const count = await FrameRequest.count();

    res.json({
      statusCode: 200,
      data: data,
      FrameRequestCount: count,
      message: "Read All Complete Frame-Request",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.delete("/complete/framerequest", async (req, res) => {
  try {
    let result = await FrameUserCollection.deleteMany({
      _id: { $in: req.body },
    });
    res.json({
      statusCode: 200,
      data: result,
      message: "Frame Deleted Successfully",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});


// Search Frame
router.post("/framerequest/search", async (req, res) => {
  try {
    let newArray = [];
    newArray.push({
      userName: !isNaN(req.body.search)
        ? req.body.search
        : { $regex: req.body.search, $options: "i" },
    });

    var data = await FrameRequest.find({ $or: newArray }).select('userName frameRequestImage frameRequestDate isFrameCreated  frameRequestMessage');

    var count = await FrameRequest.countDocuments({ $or: newArray });

    res.json({
      statusCode: 200,
      data: data,
      count: count,
      message: "Read All Custome-Category",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Search Frame
router.post("/comp_framerequest/search", async (req, res) => {
  try {
    let newArray = [];
    newArray.push({
      fullName_user: !isNaN(req.body.search)
        ? req.body.search
        : { $regex: req.body.search, $options: "i" },
    });

    var data = await FrameUserCollection.find({ $or: newArray }).select('fullName_user savedFrame_user addDate');

    var count = await FrameUserCollection.countDocuments({ $or: newArray });

    res.json({
      statusCode: 200,
      data: data,
      count: count,
      message: "Read All Custome-Category",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

module.exports = router;
