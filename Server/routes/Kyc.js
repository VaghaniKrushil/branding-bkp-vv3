var express = require("express");
var router = express.Router();
var KycDetails = require("../modals/Kyc");
var moment = require("moment");

router.post("/kyc", async (req, res) => {
  try {
    var count = await KycDetails.count();
    function pad(num) {
      num = num.toString();
      while (num.length < 2) num = "0" + num;
      return num;
    }
    req.body["kycId"] = pad(count + 1);
    req.body["addDate"] = moment()
      .add(2, "seconds")
      .format("YYYY-MM-DD HH:mm:ss");
    var data = await KycDetails.create(req.body);
    res.json({
      statusCode: 200,
      data: data,
      message: "Kyc Detais Uploade Successfully",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/kyc", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided
    var pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

    var data = await KycDetails.aggregate([
      { $match: { status: "Pending" } },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    var count = await KycDetails.countDocuments({status: "Pending"});

    // Optionally reverse the data array
    data.reverse();

    res.json({
      statusCode: 200,
      data: data,
      KycCount: count,
      message: "Read All KYC-Details",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/kyc_approval", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10;
    var pageNumber = parseInt(req.query.pageNumber) || 0;

    // Retrieve data and count separately
    var data = await KycDetails.aggregate([
      { $match: { status: "Complete" } }, // Match only 'Complete' status
      { $skip: pageSize * pageNumber },
      { $limit: pageSize }
    ]);

    var count = await KycDetails.countDocuments({ status: "Complete" });

    // Optionally reverse the data array
    data.reverse();

    res.json({
      statusCode: 200,
      data: data,
      KycCompleteCount: count,
      message: "Read All KYC-Details with 'Complete' status",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});



router.get("/kyc_reject", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided
    var pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

    var data = await KycDetails.aggregate([
      { $match: { status: "Reject" } },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    var count = await KycDetails.countDocuments({status: "Reject"});

    // Optionally reverse the data array
    data.reverse();

    res.json({
      statusCode: 200,
      data: data,
      KycRejectCount: count,
      message: "Read All KYC-Details",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});
router.get("/re_kyc", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided
    var pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

    var data = await KycDetails.aggregate([
      { $match: { status: "ReKyc" } },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    var count = await KycDetails.countDocuments({status: "ReKyc"});

    // Optionally reverse the data array
    data.reverse();

    res.json({
      statusCode: 200,
      data: data,
      ReKycCount: count,
      message: "Read All KYC-Details",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// router.get("/kyccheck/:mobileNumber", async (req, res) => {
//   try {
//     const mobileNumber = req.params.mobileNumber;

//     const data = await KycDetails.findOne({ mobileNumber });

//     if (!data) {
//       return res.status(204).json({
//         statusCode: 204,
//         message: "Data not found",
//       });
//     }

//     if (data.status.length === 0) {
//       return res.status(201).json({
//         statusCode: 201,
//         message: "Your KYC is Not Set",
//       });
//     } else if (data.status.includes("Pending")) {
//       return res.status(202).json({
//         statusCode: 202,
//         message: "Your KYC is Under Verification",
//       });
//     } else if (data.status.includes("Reject")) {
//       return res.status(203).json({
//         statusCode: 203,
//         message: "Your KYC is Reject",
//       });
//     } else if (data.status.includes("Complete")) {
//       return res.status(200).json({
//         statusCode: 200,
//         message: "Your KYC is Approved",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.get("/kyccheck/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;

    const data = await KycDetails.findOne({ mobileNumber });

    if (!data) {
      return res.status(200).json({
        statusCode: 204,
        message: "Data not found",
      });
    }

    if (data.status.length === 0) {
      return res.status(200).json({
        statusCode: 201,
        message: "Your KYC is Not Set",
        data: data,
      });
    } else if (data.status.includes("Pending")) {
      return res.status(200).json({
        statusCode: 202,
        message: "Your KYC is Under Verification",
        data: data,
      });
    } else if (data.status.includes("ReKyc")) {
      return res.status(200).json({
        statusCode: 202,
        message: "Your KYC is Under Verification",
        data: data,
      });
    } else if (data.status.includes("Complete")) {
      return res.status(200).json({
        statusCode: 200,
        message: "Your KYC is Approved",
        data: data,
      });
    } else if (data.status.includes("Reject")) {
      // Check specific rejection reasons and return different status
      if (data.deniedReason.includes("Re Uplode Adharcard")) {
        return res.status(200).json({
          statusCode: 401,
          message: "Please re-upload your Adharcard",
          data: data,
        });
      } else if (data.deniedReason.includes("Re Uplode Pancard")) {
        return res.status(200).json({
          statusCode: 402,
          message: "Please re-upload your Pancard",
          data: data,
        });
      } else if (data.deniedReason.includes("Uplode Valid Pancard Number")) {
        return res.status(200).json({
          statusCode: 403,
          message: "Please upload a valid Pancard Number",
          data: data,
        });
      } else if (data.deniedReason.includes("Uplode Valid Adharcard Number")) {
        return res.status(200).json({
          statusCode: 405,
          message: "Please upload a valid Adharcard Number",
          data: data,
        });
      } else {
        // Return a generic reject status if the reason is not specifically handled
        return res.status(200).json({
          statusCode: 203,
          message: "Your KYC is Reject",
          data: data,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.put("/re_kyc/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    req.body["addDate"] = moment()
      .add(2, "seconds")
      .format("YYYY-MM-DD HH:mm:ss");
    const result = await KycDetails.findOneAndUpdate(
      { mobileNumber: mobileNumber },
      req.body,
      { new: true } // To get the updated document as the result
    );

    if (result) {
      return res.json({
        statusCode: 200,
        data: result,
        message: "Employee Profile Updated Successfully",
      });
    } else {
      return res.json({
        statusCode: 404,
        message: "Employee not found",
      });
    }
  } catch (err) {
    return res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});

router.put("/kyc/:id", async (req, res) => {
  try {
    const { status, deniedReason } = req.body;

    if (status === "Complete" || status === "Reject") {
      const updateData = {
        $set: { "status.0": status }, // Replace the first element in the status array
      };

      if (status === "Reject" && deniedReason) {
        updateData.$push = { deniedReason: deniedReason };
      }

      await KycDetails.findByIdAndUpdate(req.params.id, updateData);
    }

    res.json({
      statusCode: 200,
      message: "Status Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
});



router.post("/kyc_complete/search", async (req, res) => {
  try {
    // Convert req.body.search to a string
    const searchString = req.body.search.toString();

    let query = {};

    if (!isNaN(searchString)) {
      query.$or = [
        { mobileNumber: searchString },
        { adharcardNumber: searchString },
      ];
    } else {
      query.$or = [
        { fullName: { $regex: searchString, $options: "i" } },
        { email: { $regex: searchString, $options: "i" } },
        { pancardNumber: { $regex: searchString, $options: "i" } },
      ];
    }

    // Add the condition to filter by status: "Complete"
    query.status = { $in: ["Complete"] };

    var data = await KycDetails.find(query);

    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,
      message: "Read All Kyc-Complete",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});


router.post("/kyc_pending/search", async (req, res) => {
  try {
    // Convert req.body.search to a string
    const searchString = req.body.search.toString();

    let query = {};

    if (!isNaN(searchString)) {
      query.$or = [
        { mobileNumber: searchString },
        { adharcardNumber: searchString },
      ];
    } else {
      query.$or = [
        { fullName: { $regex: searchString, $options: "i" } },
        { email: { $regex: searchString, $options: "i" } },
        { pancardNumber: { $regex: searchString, $options: "i" } },
      ];
    }

    // Add the condition to filter by status: "Complete"
    query.status = { $in: ["Pending"] };

    var data = await KycDetails.find(query);

    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,
      message: "Read All Kyc-Complete",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});


router.post("/kyc_reject/search", async (req, res) => {
  try {
    // Convert req.body.search to a string
    const searchString = req.body.search.toString();

    let query = {};

    if (!isNaN(searchString)) {
      query.$or = [
        { mobileNumber: searchString },
        { adharcardNumber: searchString },
      ];
    } else {
      query.$or = [
        { fullName: { $regex: searchString, $options: "i" } },
        { email: { $regex: searchString, $options: "i" } },
        { pancardNumber: { $regex: searchString, $options: "i" } },
      ];
    }

    // Add the condition to filter by status: "Complete"
    query.status = { $in: ["Reject"] };

    var data = await KycDetails.find(query);

    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,
      message: "Read All Kyc-Complete",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});



router.post("/rekyc/search", async (req, res) => {
  try {
    // Convert req.body.search to a string
    const searchString = req.body.search.toString();

    let query = {};

    if (!isNaN(searchString)) {
      query.$or = [
        { mobileNumber: searchString },
        { adharcardNumber: searchString },
      ];
    } else {
      query.$or = [
        { fullName: { $regex: searchString, $options: "i" } },
        { email: { $regex: searchString, $options: "i" } },
        { pancardNumber: { $regex: searchString, $options: "i" } },
      ];
    }

    // Add the condition to filter by status: "Complete"
    query.status = { $in: ["ReKyc"] };

    var data = await KycDetails.find(query);

    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,
      message: "Read All Kyc-Complete",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});






module.exports = router;
