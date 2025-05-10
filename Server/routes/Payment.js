var express = require("express");
var router = express.Router();
var Payment = require("../modals/Payment");
var moment = require("moment");
var axios = require("axios");

// Function to get dynamic authorization token
async function getDynamicAuthorization() {
  try {
    const phpApiUrl = "https://kubertree.com/MLM/MLM/get_auth.php";
    const phpApiResponse = await axios.get(phpApiUrl);

    if (phpApiResponse.status === 200) {
      const authorizationData = phpApiResponse.data.Authorization;
      return authorizationData[0].time;
    } else {
      console.error(
        "Error while fetching Authorization. Status Code:",
        phpApiResponse.status
      );
      console.error("API Response:", phpApiResponse.data);
      return null;
    }
  } catch (error) {
    console.error("Error while fetching Authorization:", error);
    return null;
  }
}

// Purchase API  (Phone-Pe) and Store Payment Staus Fail/Success and also store phonepe Responce
router.post("/", async (req, res) => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, "0");
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;
    req.body["payment_id"] = uniqueId;

    const data = await Payment.create(req.body);

    let responseData = null;

    if (req.body.status === "Done") {
      console.log("payment Done and call mlm API");

      // Get dynamic authorization token
      const dynamicAuthorization = await getDynamicAuthorization();

      if (dynamicAuthorization) {
        // Configure the Axios instance with the dynamic Authorization value
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${dynamicAuthorization}`,
          },
        });

        // Make the API call using the configured Axios instance
        const { mobileNumber, referredBy, treeId, side, fullName } = req.body;
        const phpApiUrl = `https://kubertree.com/MLM/MLM/register.php?number=${mobileNumber}&reference=${referredBy}&parent_id=${treeId}&side=${side}&fullname=${fullName}`;

        const phpApiResponse = await axiosInstance.get(phpApiUrl);
        responseData = phpApiResponse.data;
        console.log(responseData, "responseData");
      }
    } else if (req.body.status === "Fail") {
      console.log("payment Failed and call else API");
      responseData = { message: "Your Payment is Failed" };
    }

    res.json({
      statusCode: 200,
      data: data,
      message: "Add Payment Successfully",
      responseData: responseData,
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Show All Payment Success Data
router.get("/success", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10;
    var pageNumber = parseInt(req.query.pageNumber) || 0;

    var data = await Payment.aggregate([
      {
        $match: {
          status: "Done",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    var count = await Payment.countDocuments({ status: "Done" });

    res.json({
      statusCode: 200,
      data: data,
      count: count,
      message: "Read All Payments",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Show All Payment Fail Data
router.get("/fail", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10;
    var pageNumber = parseInt(req.query.pageNumber) || 0;

    var data = await Payment.aggregate([
      {
        $match: {
          status: "Fail",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    var count = await Payment.countDocuments({ status: "Fail" });

    res.json({
      statusCode: 200,
      data: data,
      count: count,
      message: "Read All Payments",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Search (Payment Fail )
router.post("/fail_search", async (req, res) => {
  try {
    // Convert req.body.search to a string
    const searchString = req.body.search.toString();

    let query = {
      status: "Fail", // Add this condition to filter by status
    };

    if (!isNaN(searchString)) {
      query.$or = [{ mobileNumber: searchString }];
    } else {
      query.$or = [
        { fullName: { $regex: searchString, $options: "i" } },
        { transaction_id: { $regex: searchString, $options: "i" } },
      ];
    }

    var data = await Payment.find(query);

    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,
      message: "Read All Search",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Search (Payment Success )
router.post("/success_search", async (req, res) => {
  try {
    // Convert req.body.search to a string
    const searchString = req.body.search.toString();

    let query = {
      status: "Done", // Add this condition to filter by status
    };

    if (!isNaN(searchString)) {
      query.$or = [{ mobileNumber: searchString }];
    } else {
      query.$or = [
        { fullName: { $regex: searchString, $options: "i" } },
        { transaction_id: { $regex: searchString, $options: "i" } },
      ];
    }

    var data = await Payment.find(query);

    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,
      message: "Read All Search",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// router.post("/", async (req, res) => {
//   try {
//     const timestamp = Date.now();
//     const randomString = Math.random().toString(36).substr(5, 15);
//     const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
//       .toString()
//       .padStart(10, "0");
//     const uniqueId = `${timestamp}${randomString}${randomNumber}`;
//     req.body["createdAt"] = moment().format("YYYY-MM-DD HH:mm:ss");
//     req.body["payment_date"] = moment().format("YYYY-MM-DD HH:mm:ss");
//     req.body["payment_id"] = uniqueId;

//     const data = await Payment.create(req.body);

//     res.json({
//       statusCode: 200,
//       data: data,
//       message: "Add Payment Successfully",
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.post("/purchase", async (req, res) => {
  try {
    // Get dynamic authorization token
    const dynamicAuthorization = await getDynamicAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${dynamicAuthorization}`,
        },
      });

      // Make the API call to purchase MLM using the configured Axios instance
      const { mobileNumber, referredBy, treeId, side, fullName } = req.body;
      const phpApiUrl = `https://kubertree.com/MLM/MLM/register.php?number=${mobileNumber}&reference=${referredBy}&parent_id=${treeId}&side=${side}&fullname=${fullName}`;

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Respond with the data from the MLM API
      res.json({
        statusCode: 200,
        message: "Purchase MLM Successful",
        data: phpApiResponse.data,
      });
    } else {
      // If dynamic authorization is not available, respond with an error message
      res.json({
        statusCode: 201,
        message: "Dynamic Authorization token not available",
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/check_purchase/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const data = await Payment.find({ mobileNumber });

    if (data.length === 0) {
      return res.status(201).json({
        statusCode: 201,
        message: "No record found for the specified mobileNumber",
        isPayment: false,
      });
    }

    // Check if any payment has a status of 'Done'
    const isPaymentDone = data.some((payment) => payment.status === "Done");

    if (isPaymentDone) {
      return res.status(200).json({
        statusCode: 200,
        isPayment: true,
      });
    } else {
      return res.status(202).json({
        statusCode: 202,
        isPayment: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

module.exports = router;
