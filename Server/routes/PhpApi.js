var express = require("express");
var router = express.Router();
var {
  verifyToken,
  hashPassword,
  hashCompare,
  createToken,
} = require("../authentication");
// var Registers = require("../modals/Admin_Register");
var UserRegister = require("../modals/MlmRegister");
var Register = require("../modals/Register");
var JWT = require("jsonwebtoken");
var JWTD = require("jwt-decode");
var nodemailer = require("nodemailer");
var uniqid = require("uniqid");
const cron = require("node-cron");
var CompanyWallet = require("../modals/CompanyWallet");
var Clipping = require("../modals/Clipping");
var moment = require("moment");
const fast2sms = require("fast-two-sms");
var axios = require("axios");
var jsPDF = require("jspdf");
const PDFDocument = require("pdfkit");
const fs = require("fs");
var MlmRegister = require("../modals/MlmRegister");

// const apiUrl = 'http://193.46.243.10/app/smsapi/index.php';
// const apiKey = '46538AFE27083E'; // Replace with your API key
// const campaignId = 13444;
// const routeId = 3;
// const messageType = 'text';
// const contacts = '9106636361'; // Replace with the recipient phone numbers
// const senderId = 'BRAPRO';
// // const templateId = 1707169822246161608; // Replace with your Template ID
// // const peId = 1701169787222711884; // Replace with your PE ID

// // Generate a random 6-digit OTP
// const otp = Math.floor(100000 + Math.random() * 900000);
// let myApi = `http://193.46.243.10/app/smsapi/index.php?key=46538AFE27083E&campaign=13444&routeid=3&type=text&contacts=${contacts}&senderid=BRAPRO&msg=DO%20NOT%20SHARE3${otp}is%20the%20login%20OTP%20for%20your%20Branding%20profitable%20account.%20Keep%20this%20OTP%20to%20yourself%20for%20account%20safety.&template_id=1707169822246161608&pe_id=1701169787222711884`

// // Create the message with the OTP
// const message = `[#] Your OTP is: ${otp}. Use this OTP for your Branding profitable account. Keep it safe.`;

// // const apiUrlWithParams = `${apiUrl}?key=${apiKey}&campaign=${campaignId}&routeid=${routeId}&type=${messageType}&contacts=${contacts}&senderid=${senderId}&msg=${encodeURIComponent(message)}&template_id="1707169822246161608"&pe_id="1701169787222711884"`;
// const apiUrlWithParams = myApi
// axios.get(apiUrlWithParams)
//   .then(response => {
//     console.log('OTP SMS sent successfully.');
//     console.log(response.data); // You can log the response for further details.
//   })
//   .catch(error => {
//     console.error('Error sending OTP SMS:', error);
//   });

async function getAuthorization() {
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

router.get("/sponsor_parent/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });
      const mobileNumber = req.params.mobileNumber;

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_sponsor_parent.php?number=${mobileNumber}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const user_details = phpApiResponse.data.user_details;
        const sponsor = phpApiResponse.data.sponsor;
        const parent = phpApiResponse.data.parent;
        const children = phpApiResponse.data.children;

        // Initialize variables for parent and sponsor records
        let parentRecord = null;
        let sponsorRecord = null;

        // Find the parent record in the Register model if it's not null
        if (parent && parent.number) {
          parentRecord = await Register.findOne({
            mobileNumber: parent.number,
          });
        }

        // Find the sponsor record in the Register model if it's not null
        if (sponsor && sponsor.number) {
          sponsorRecord = await Register.findOne({
            mobileNumber: sponsor.number,
          });
        }

        // Include the parent and sponsor record fields in their respective objects
        if (parentRecord) {
          parent._id = parentRecord._id;
          parent.profileImage = parentRecord.profileImage;
          parent.Designation = parentRecord.Designation;
          parent.gender = parentRecord.gender;
          parent.dob = parentRecord.dob;
          parent.fullName = parentRecord.fullName;
          parent.email = parentRecord.email;
          parent.adress = parentRecord.adress;
          parent.adhaar = parentRecord.adhaar;
          parent.isPersonal = parentRecord.isPersonal;
          parent.otp = parentRecord.otp;
          parent.token = parentRecord.token;
        }

        if (sponsorRecord) {
          sponsor._id = sponsorRecord._id;
          sponsor.profileImage = sponsorRecord.profileImage;
          sponsor.Designation = sponsorRecord.Designation;
          sponsor.gender = sponsorRecord.gender;
          sponsor.dob = sponsorRecord.dob;
          sponsor.fullName = sponsorRecord.fullName;
          sponsor.email = sponsorRecord.email;
          sponsor.adress = sponsorRecord.adress;
          sponsor.adhaar = sponsorRecord.adhaar;
          sponsor.isPersonal = sponsorRecord.isPersonal;
          sponsor.otp = sponsorRecord.otp;
          sponsor.token = sponsorRecord.token;
        }

        // Return the updated data as a response to your Node.js API client
        res.status(200).json({
          statusCode: 200,
          message: "Data retrieved successfully from PHP API",
          user_details,
          sponsor,
          parent,
          children,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/mlm/purchase", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const fullname = req.body.fullName;
      const number = req.body.mobileNumber;
      const reference = req.body.referredBy;
      const parent_id = req.body.treeId;
      const side = req.body.side;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/register.php?number=${number}&reference=${reference}&parent_id=${parent_id}&side=${side}&fullname=${fullname}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      console.log(phpApiResponse.data.message, "phpApiResponse.data.status");
      console.log(phpApiResponse.data, "phpApiResponse.data");

      let responseData;

      if (phpApiResponse.data.http_response_code == "201") {
        responseData = {
          statusCode: 201,
          message: "Left side is already full. Please try the right side.",
        };
      } else if (phpApiResponse.data.http_response_code == 202) {
        responseData = {
          statusCode: 202,
          message: "Right side is already full. Please try the left side.",
        };
      } else if (phpApiResponse.data.status == "203") {
        responseData = {
          statusCode: 203,
          message: "Invalid referral code!",
        };
      } else if (phpApiResponse.data.status === "204") {
        responseData = {
          statusCode: 204,
          message: "Parent user not found!",
        };
      } else if (phpApiResponse.data.status == "205") {
        responseData = {
          statusCode: 205,
          message: "You are Already Registered!",
        };
      } else {
        responseData = {
          statusCode: 200,
          message: "User Register Successfully",
        };
      }

      res.status(responseData.statusCode).json(responseData);
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/wallet/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();
    console.log(dynamicAuthorization, "dynamicAuthorization");

    if (dynamicAuthorization) {
      console.log("if-----------------");
      // Configure the Axios instance with the dynamic Authorization valuess
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user_all_details_pass.php?number=${mobileNumber}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        const dataFromPhpApi = phpApiResponse.data.details;

        if (phpApiResponse.data.message == "User not found") {
          // Set custom status code and message for user not found
          res.status(200).json({
            statusCode: 404,
            message: "User not found",
          });
        } else {
          // Modify the key "number" to "mobileNumber"
          dataFromPhpApi.mobileNumber = dataFromPhpApi.number;
          dataFromPhpApi.redWallet = dataFromPhpApi.red_wallet;
          dataFromPhpApi.greenWallet = dataFromPhpApi.green_wallet;
          dataFromPhpApi.role = dataFromPhpApi.user_leval;
          dataFromPhpApi.totalEarnings = dataFromPhpApi.total_earn;
          dataFromPhpApi.registrationDate = dataFromPhpApi.date;
          dataFromPhpApi.rightSideTodayJoining =
            dataFromPhpApi.today_right_side;
          dataFromPhpApi.leftSideTodayJoining = dataFromPhpApi.today_left_side;
          dataFromPhpApi.rightSideTotalJoining =
            dataFromPhpApi.total_right_side;
          dataFromPhpApi.leftSideTotalJoining = dataFromPhpApi.total_left_side;

          // Calculate the totalTeam by parsing and adding total_left_side and total_right_side
          const leftSide = parseInt(dataFromPhpApi.total_left_side, 10);
          const rightSide = parseInt(dataFromPhpApi.total_right_side, 10);
          dataFromPhpApi.totalTeam = leftSide + rightSide;

          delete dataFromPhpApi.number;
          delete dataFromPhpApi.red_wallet;
          delete dataFromPhpApi.green_wallet;
          delete dataFromPhpApi.user_leval;
          delete dataFromPhpApi.total_earn;
          delete dataFromPhpApi.date;
          delete dataFromPhpApi.today_right_side;
          delete dataFromPhpApi.today_left_side;
          delete dataFromPhpApi.total_right_side;
          delete dataFromPhpApi.total_left_side;

          // Return the extracted "details" array as a response to your Node.js API client
          res.status(200).json({
            statusCode: 200,
            message: "Data retrieved successfully from PHP API",
            details: dataFromPhpApi,
          });
        }
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      console.log("elsef==================");
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Today Purchase MLM User Detail
// with Pagination and slow responce
// router.get("/todayjoin", async (req, res) => {
//   try {
//     const dynamicAuthorization = await getAuthorization();

//     if (dynamicAuthorization) {
//       // Configure the Axios instance with the dynamic Authorization value
//       const axiosInstance = axios.create({
//         headers: {
//           Authorization: dynamicAuthorization,
//         },
//       });
//       // Get the page size and page number from query parameters
//       const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided
//       const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

//       // Make an HTTP request to the PHP API
//       const phpApiUrl = `https://kubertree.com/MLM/MLM/today_join.php`;
//       const phpApiResponse = await axiosInstance.get(phpApiUrl);

//       // Check if the response from the PHP API is successful
//       if (phpApiResponse.status === 200) {
//         // Extract the relevant data from the PHP API response
//         const history = phpApiResponse.data.history;

//         // Create an array to store the updated history items with fullName
//         const updatedHistory = [];

//         // Iterate over the history items and lookup the fullName
//         for (const historyItem of history) {
//           // Find the user by mobileNumber (adjust this based on your data structure)
//           const user = await Register.findOne({
//             mobileNumber: historyItem.number,
//           });

//           // Add the user's fullName to the history item
//           historyItem.fullName = user ? user.fullName : null;
//           historyItem.adress = user ? user.adress : null;
//           historyItem.email = user ? user.email : null;

//           // Add the updated history item to the array
//           updatedHistory.push(historyItem);
//         }

//         // Sort the data by date in descending order
//         const sortedHistory = updatedHistory.sort(
//           (a, b) => new Date(b.date) - new Date(a.date)
//         );

//         // Calculate the starting index based on the page size and number
//         const startIndex = pageSize * pageNumber;

//         // Apply pagination using the slice method
//         const paginatedData = sortedHistory.slice(
//           startIndex,
//           startIndex + pageSize
//         );

//         // Return the extracted and paginated data as a response to your Node.js API client
//         res.status(200).json({
//           statusCode: 200,
//           todayJoinCount: paginatedData.length,
//           totalTodayJoinCount: sortedHistory.length,
//           message: "Data retrieved successfully from PHP API",
//           history: paginatedData,
//         });
//       } else {
//         res.status(401).json({
//           statusCode: 401,
//           message: "Error in retrieving data from PHP API",
//         });
//       }
//     } else {
//       res.status(402).json({
//         statusCode: 402,
//         message: "Error in fetching Authorization data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// Today Purchase MLM User Detail
// Without Pagination and fast responce and get all data
// router.get("/todayjoin", async (req, res) => {
//   try {
//     const dynamicAuthorization = await getAuthorization();

//     if (dynamicAuthorization) {
//       // Configure the Axios instance with the dynamic Authorization value
//       const axiosInstance = axios.create({
//         headers: {
//           Authorization: dynamicAuthorization,
//         },
//       });

//       // Get the page number from query parameters
//       const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided
//       const pageSize = 10; // Show 10 records per page

//       // Calculate the offset based on the page number and page size
//       const offset = pageNumber * pageSize;

//       // Make an HTTP request to the PHP API with pagination parameters
//       const phpApiUrl = `https://kubertree.com/MLM/MLM/today_join.php?offset=${offset}&pageSize=${pageSize}`;
//       const phpApiResponse = await axiosInstance.get(phpApiUrl);

//       if (phpApiResponse.status === 200) {
//         const data = phpApiResponse.data;

//         res.status(200).json({
//           statusCode: 200,
//           todayJoinCount: data.todayJoinCount,
//           totalTodayJoinCount: data.totalTodayJoinCount,
//           message: "Data retrieved successfully from PHP API",
//           history: data.history,
//         });
//       } else {
//         res.status(401).json({
//           statusCode: 401,
//           message: "Error in retrieving data from PHP API",
//         });
//       }
//     } else {
//       res.status(402).json({
//         statusCode: 402,
//         message: "Error in fetching Authorization data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.get("/todayjoin", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Get the page number from query parameters
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided
      const pageSize = 200; // Show 10 records per page

      // Calculate the offset based on the page number and page size
      const offset = pageNumber * pageSize;

      // Make an HTTP request to the PHP API with pagination parameters
      const phpApiUrl = `https://kubertree.com/MLM/MLM/today_join.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const data = phpApiResponse.data.history;
        console.log(data, "data");

        // if (data && Array.isArray(data)) {
        // Check if data is an array before sorting
        const sortedHistory = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalTodayJoinCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
        // } else {
        //   res.status(400).json({
        //     statusCode: 400,
        //     message: "Missing data in the response from PHP API",
        //   });
        // }
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Today MLM Purchase Count
router.get("/todayjoin/count", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/today_join.php`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.history;
        const todayJoinCount = history.length; // Correct the variable name

        // Return the extracted data as a response to your Node.js API client
        res.status(200).json({
          statusCode: 200,
          todayJoinCount, // Include the corrected variable
          message: "Data retrieved successfully from PHP API",
          // history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Total MLM Purchase Count
router.get("/totaljoin/count", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user.php`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.details;
        const totalJoinCount = history.length;

        // Return the extracted data as a response to your Node.js API client
        res.status(200).json({
          statusCode: 200,
          totalJoinCount, // Include the corrected variable
          message: "Data retrieved successfully from PHP API",
          // history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Today Purchase MLM User Detail (Get Name Using For Loop)
// router.get("/totaljoin", async (req, res) => {
//   try {
//     const dynamicAuthorization = await getAuthorization();
//     if (dynamicAuthorization) {
//       // Configure the Axios instance with the dynamic Authorization value
//       const axiosInstance = axios.create({
//         headers: {
//           Authorization: dynamicAuthorization,
//         },
//       });

//       // Get the page size and page number from query parameters
//       const pageSize = 200; // Set the page size to 200 as requested
//       const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

//       console.log(pageNumber);

//       // Make an HTTP request to the PHP API with the specified page number and page size
//       const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user.php?page=${
//         pageNumber + 1
//       }&per_page=${pageSize}`;
//       const phpApiResponse = await axiosInstance.get(phpApiUrl);

//       // Check if the response from the PHP API is successful
//       if (phpApiResponse.status === 200) {
//         // Extract the relevant data from the PHP API response
//         const history = phpApiResponse.data.details;

//         console.log(history, "--------------------");

//         // Create an array to store the updated history items with fullName
//         const updatedHistory = [];

//         // Iterate over the history items and lookup the fullName
//         for (const historyItem of history) {
//           // Find the user by mobileNumber (adjust this based on your data structure)
//           const user = await Register.findOne({
//             mobileNumber: historyItem.number,
//           });

//           // Add the user's fullName to the history item
//           historyItem.fullName = user ? user.fullName : null;
//           historyItem.adress = user ? user.adress : null;
//           historyItem.email = user ? user.email : null;

//           // Add the updated history item to the array
//           updatedHistory.push(historyItem);
//         }

//         // Sort the data by date in descending order
//         const sortedHistory = updatedHistory.sort(
//           (a, b) => new Date(b.date) - new Date(a.date)
//         );

//         // Calculate the total records and total pages count
//         const totalRecords = parseInt(
//           phpApiResponse.data.pagination.total_records
//         );
//         const totalPages = Math.ceil(totalRecords / pageSize);

//         // Calculate the starting index based on the page size and number
//         const startIndex = pageSize * pageNumber;

//         // Apply pagination using the slice method
//         const paginatedData = sortedHistory.slice(
//           startIndex,
//           startIndex + pageSize
//         );

//         // Return the extracted and paginated data along with the total pages count
//         res.status(200).json({
//           statusCode: 200,
//           perPageDataCount: sortedHistory.length,
//           totalJoinCount: totalRecords,
//           total_pages: totalPages, // Include the total pages count
//           message: "Data retrieved successfully from PHP API",
//           history: sortedHistory,
//         });
//       } else {
//         res.status(401).json({
//           statusCode: 401,
//           message: "Error in retrieving data from PHP API",
//         });
//       }
//     } else {
//       res.status(402).json({
//         statusCode: 402,
//         message: "Error in fetching Authorization data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// Today Purchase MLM User Detail (Without Get Name Using For Loop)
router.get("/totaljoin", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();
    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Get the page size and page number from query parameters
      const pageSize = 10; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided
      const limit = parseInt(req.query.limit) || 10; // Default to 0 if not provided

      // Make an HTTP request to the PHP API with the specified page number and page size
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}&limit=${limit}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.details;

        // Create an array to store the updated history items with fullName
        // const updatedHistory = [];

        // // Iterate over the history items and lookup the fullName
        // for (const historyItem of history) {
        //   // Find the user by mobileNumber (adjust this based on your data structure)
        //   const user = await Register.findOne({
        //     mobileNumber: historyItem.number,
        //   });

        //   // Add the user's fullName to the history item
        //   historyItem.fullName = user ? user.fullName : null;
        //   historyItem.adress = user ? user.adress : null;
        //   historyItem.email = user ? user.email : null;

        //   // Add the updated history item to the array
        //   updatedHistory.push(historyItem);
        // }

        // Sort the data by date in descending order
        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate the total records and total pages count
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Calculate the starting index based on the page size and number
        const startIndex = pageSize * pageNumber;

        // Apply pagination using the slice method
        // const paginatedData = sortedHistory.slice(
        //   startIndex,
        //   startIndex + pageSize
        // );

        // Return the extracted and paginated data along with the total pages count
        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalJoinCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/totaljoin/search", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const searchQuery = req.body.search || ""; // Get search query from request body

      // Define function to get data from a specific page
      const getDataFromPage = async (page) => {
        const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user.php?page=${page}`;
        const phpApiResponse = await axiosInstance.get(phpApiUrl);
        return phpApiResponse.data.details;
      };

      let page = 1;
      let found = false;
      let allData = [];

      // Iterate through pages until the record is found or no more pages
      while (!found) {
        const data = await getDataFromPage(page);

        // Filter the records based on any field containing the search query
        const filteredData = data.filter((record) =>
          Object.values(record).some(
            (value) => typeof value === "string" && value.includes(searchQuery)
          )
        );

        // If any matching records found, set found to true and append to allData
        if (filteredData.length > 0) {
          found = true;
          allData = [...allData, ...filteredData];
        }

        // Move to the next page
        page++;

        // If no more data on the page, exit the loop
        if (data.length === 0) {
          break;
        }
      }

      const totalRecords = allData.length;
      const totalPages = Math.ceil(totalRecords / allData.length);

      res.status(200).json({
        statusCode: 200,
        perPageDataCount: allData.length,
        count: totalRecords,
        total_pages: totalPages,
        message: "Data retrieved successfully from PHP API",
        data: allData,
      });
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Today Credit Amount
router.get("/todaycreditamount", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();
    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_today_credit.php`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.history;

        // Calculate the sum of "amount" values
        let todayTotalCreditBalance = 0;
        for (const item of history) {
          // Convert the "amount" value to a number and add it to the total
          todayTotalCreditBalance += parseFloat(item.amount);
        }

        // Return the extracted data as a response to your Node.js API client
        res.status(200).json({
          statusCode: 200,
          todayTotalCreditBalance, // Include the total credit balance
          message: "Today income retrieved successfully",
          // history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Today Credit Amount
router.get("/totalcreditamount", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_total_credit.php`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.history;

        // Calculate the sum of "amount" values
        let totalCreditBalance = 0;
        for (const item of history) {
          // Convert the "amount" value to a number and add it to the total
          totalCreditBalance += parseFloat(item.amount);
        }

        // Return the extracted data as a response to your Node.js API client
        res.status(200).json({
          statusCode: 200,
          totalCreditBalance, // Include the total credit balance
          message: "Overall income retrieved successfully",
          // history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Today Credit Income History
router.get("/todaycredit", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Get the page size and page number from query parameters
      const pageSize = 200; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_today_credit.php`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.history;

        // Create an array to store the updated history items with fullName
        const updatedHistory = [];

        // Iterate over the history items and lookup the fullName
        // for (const historyItem of history) {
        //   // Find the user by mobileNumber (adjust this based on your data structure)
        //   const user = await Register.findOne({
        //     mobileNumber: historyItem.number,
        //   });

        //   // Add the user's fullName to the history item
        //   historyItem.fullName = user ? user.fullName : null;
        //   historyItem.adress = user ? user.adress : null;
        //   historyItem.email = user ? user.email : null;

        //   // Add the updated history item to the array
        //   updatedHistory.push(historyItem);
        // }

        // Sort the data by date in descending order
        // const sortedHistory = updatedHistory.sort(
        //   (a, b) => new Date(b.date) - new Date(a.date)
        // );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Calculate the starting index based on the page size and number
        const startIndex = pageSize * pageNumber;

        // Apply pagination using the slice method
        // const paginatedData = sortedHistory.slice(
        //   startIndex,
        //   startIndex + pageSize
        // );

        // Return the extracted and paginated data as a response to your Node.js API client
        res.status(200).json({
          statusCode: 200,
          // perPageDataCount: sortedHistory.length,
          todayodayCreditCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Total Credit Income Historys
// router.get("/totalcredit", async (req, res) => {
//   try {
//     // Get the page size and page number from query parameters
//     const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided
//     const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

//     // Make an HTTP request to the PHP API
//     const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_total_credit.php`;
//     const phpApiResponse = await axios.get(phpApiUrl);

//     // Check if the response from the PHP API is successful
//     if (phpApiResponse.status === 200) {
//       // Extract the relevant data from the PHP API response
//       const history = phpApiResponse.data.history;

//       // Create an array to store the updated history items with fullName
//       const updatedHistory = [];

//       // Iterate over the history items and lookup the fullName
//       for (const historyItem of history) {
//         // Find the user by mobileNumber (adjust this based on your data structure)
//         const user = await Register.findOne({
//           mobileNumber: historyItem.number,
//         });

//         // Add the user's fullName to the history item
//         historyItem.fullName = user ? user.fullName : null;
//         historyItem.adress = user ? user.adress : null;
//         historyItem.email = user ? user.email : null;

//         // Add the updated history item to the array
//         updatedHistory.push(historyItem);
//       }

//       // Sort the data by date in descending order
//       const sortedHistory = updatedHistory.sort(
//         (a, b) => new Date(b.date) - new Date(a.date)
//       );

//       // Calculate the starting index based on the page size and number
//       const startIndex = pageSize * pageNumber;

//       // Apply pagination using the slice method
//       const paginatedData = sortedHistory.slice(
//         startIndex,
//         startIndex + pageSize
//       );

//       // Return the extracted and paginated data as a response to your Node.js API client
//       res.status(200).json({
//         statusCode: 200,
//         perPageDataCount: paginatedData.length,
//         totalCreditCount: history.length,
//         message: "Data retrieved successfully from PHP API",
//         history: paginatedData,
//       });
//     } else {
//       res.status(500).json({
//         statusCode: 500,
//         message: "Error in retrieving data from PHP API",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// Total Credit Income History (Fast Responce)
router.get("/totalcredit", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_total_credit.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;
        console.log(history, "history");

        // const mobileNumbers = history.map((item) => item.number);
        // const users = await Register.find({
        //   mobileNumber: { $in: mobileNumbers },
        // });

        // const userMap = new Map();
        // users.forEach((user) => {
        //   userMap.set(user.mobileNumber, user);
        // });

        // const updatedHistory = history.map((historyItem) => {
        //   const user = userMap.get(historyItem.number) || {};
        //   return {
        //     ...historyItem,
        //     fullName: user.fullName || null,
        //     address: user.address || null,
        //     email: user.email || null,
        //   };
        // });

        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: paginatedData.length,
          totalCreditCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/totalcredit/search", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const searchQuery = req.body.search || ""; // Get search query from request body

      // Define function to get data from a specific page
      const getDataFromPage = async (page) => {
        const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_total_credit.php?page=${page}`;
        const phpApiResponse = await axiosInstance.get(phpApiUrl);
        return phpApiResponse.data.history;
      };

      let page = 1;
      let found = false;
      let allData = [];

      // Iterate through pages until the record is found or no more pages
      while (!found) {
        const data = await getDataFromPage(page);

        // Filter the records based on any field containing the search query
        const filteredData = data.filter((record) =>
          Object.values(record).some(
            (value) => typeof value === "string" && value.includes(searchQuery)
          )
        );

        // If any matching records found, set found to true and append to allData
        if (filteredData.length > 0) {
          found = true;
          allData = [...allData, ...filteredData];
        }

        // Move to the next page
        page++;

        // If no more data on the page, exit the loop
        if (data.length === 0) {
          break;
        }
      }

      const totalRecords = allData.length;
      const totalPages = Math.ceil(totalRecords / allData.length);

      res.status(200).json({
        statusCode: 200,
        perPageDataCount: allData.length,
        count: totalRecords,
        total_pages: totalPages,
        message: "Data retrieved successfully from PHP API",
        data: allData,
      });
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/todaydebit", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Get the page size and page number from query parameters
      const pageSize = 200; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_today_debit.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.history;

        // Create an array to store the updated history items with fullName
        const updatedHistory = [];

        // Iterate over the history items and lookup the fullName
        for (const historyItem of history) {
          // Find the user by mobileNumber (adjust this based on your data structure)
          const user = await Register.findOne({
            mobileNumber: historyItem.number,
          });

          // Add the user's fullName to the history item
          historyItem.fullName = user ? user.fullName : null;
          historyItem.adress = user ? user.adress : null;
          historyItem.email = user ? user.email : null;

          // Add the updated history item to the array
          updatedHistory.push(historyItem);
        }

        // Sort the data by date in descending order
        const sortedHistory = updatedHistory.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Calculate the starting index based on the page size and number
        const startIndex = pageSize * pageNumber;

        // Apply pagination using the slice method
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        // Return the extracted and paginated data as a response to your Node.js API client
        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalDebitCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: paginatedData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/totaldebit", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 10;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_total_debit.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const updatedHistory = history.map((historyItem) => {
          const user = userMap.get(historyItem.number) || {};
          return {
            ...historyItem,
            fullName: user.fullName || null,
            address: user.address || null,
            email: user.email || null,
          };
        });

        const sortedHistory = updatedHistory.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalDebitCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_debit", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user_credit_debit.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalDebitCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/search_total_debit", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const searchMobileNumber = req.body.search || "";

      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user_credit_debit.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        // Search for mobile number
        const searchResults = history.filter((item) =>
          item.user_number.includes(searchMobileNumber)
        );

        res.status(200).json({
          statusCode: 200,
          message: "Data retrieved successfully from PHP API",
          history: searchResults,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_debit_history/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const pageSize = 200; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user_credit_debit_history.php?number=${mobileNumber}&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;
        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate the total records and total pages count
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // res.json(history);

        // Return the extracted data as a response to your Node.js API clients
        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalUserHistoryCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_binarydebit", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user_pair_income_total.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalDebitCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/search_total_binarydebit", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const searchMobileNumber = req.body.search || "";

      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user_pair_income_total.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        // Search for mobile number
        const searchResults = history.filter((item) =>
          item.user_number.includes(searchMobileNumber)
        );

        res.status(200).json({
          statusCode: 200,
          message: "Data retrieved successfully from PHP API",
          history: searchResults,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_binarydebit_history/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const pageSize = 200; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_pair_income_history.php?number=${mobileNumber}&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;
        console.log(history, "history");
        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate the total records and total pages count
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // res.json(history);

        // Return the extracted data as a response to your Node.js API clients
        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalUserHistoryCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_sponsor", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user_sponsor_total.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalDebitCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/search_total_sponsor", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.body.search || "";
      const type = "Sponsor Income"; // Type to search (consider adjusting this based on your needs)

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_history_search.php?number=${mobileNumber}&type=${type}`;
      console.log("URL:", phpApiUrl); // Log the URL for debugging purposes

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;
        console.log("History:", history);

        res.status(200).json({
          statusCode: 200,
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/search_total_royalty", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.body.search || "";
      const type = "Royalty"; // Type to search (consider adjusting this based on your needs)

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_history_search.php?number=${mobileNumber}&type=${type}`;
      console.log("URL:", phpApiUrl); // Log the URL for debugging purposes

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        res.status(200).json({
          statusCode: 200,
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});
router.post("/search_total_globalroyalty", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.body.search || "";
      const type = "Global Royalty"; // Type to search (consider adjusting this based on your needs)

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_history_search.php?number=${mobileNumber}&type=${type}`;
      console.log("URL:", phpApiUrl); // Log the URL for debugging purposes

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        res.status(200).json({
          statusCode: 200,
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_sponsor_history/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const pageSize = 200; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_sponsor_income_history.php?number=${mobileNumber}&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;
        console.log(history, "history");
        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate the total records and total pages count
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // res.json(history);

        // Return the extracted data as a response to your Node.js API clients
        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalUserHistoryCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_royalty", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_royalty_total.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalDebitCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_royalty_history/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const pageSize = 200; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_royalty.php?number=${mobileNumber}&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;
        console.log(history, "history");
        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate the total records and total pages count
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // res.json(history);

        // Return the extracted data as a response to your Node.js API clients
        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalUserHistoryCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_global_royalty", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_global_royalty_total.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalDebitCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/total_global_royalty_history/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const pageSize = 200; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_global_royalty.php?number=${mobileNumber}&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;
        console.log(history, "history");
        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate the total records and total pages count
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // res.json(history);

        // Return the extracted data as a response to your Node.js API clients
        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalUserHistoryCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/search_pairincome_history", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.body.search || "";
      const type = "Pair Income"; // Type to search (consider adjusting this based on your needs)

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_history_search.php?number=${mobileNumber}&type=${type}`;
      console.log("URL:", phpApiUrl); // Log the URL for debugging purposes

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;
        console.log("History:", history);

        res.status(200).json({
          statusCode: 200,
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// router.get("/totaldebit", async (req, res) => {
//   try {
//     // Get the page size and page number from query parameters
//     const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided
//     const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

//     // Make an HTTP request to the PHP API
//     const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_total_debit.php`;
//     const phpApiResponse = await axios.get(phpApiUrl);

//     // Check if the response from the PHP API is successful
//     if (phpApiResponse.status === 200) {
//       // Extract the relevant data from the PHP API response
//       const history = phpApiResponse.data.history;

//       // Create an array to store the updated history items with fullName
//       const updatedHistory = [];

//       // Iterate over the history items and lookup the fullName
//       for (const historyItem of history) {
//         // Find the user by mobileNumber (adjust this based on your data structure)
//         const user = await Register.findOne({
//           mobileNumber: historyItem.number,
//         });

//         // Add the user's fullName to the history item
//         historyItem.fullName = user ? user.fullName : null;
//         historyItem.adress = user ? user.adress : null;
//         historyItem.email = user ? user.email : null;

//         // Add the updated history item to the array
//         updatedHistory.push(historyItem);
//       }

//       // Sort the data by date in descending order
//       const sortedHistory = updatedHistory.sort(
//         (a, b) => new Date(b.date) - new Date(a.date)
//       );

//       // Calculate the starting index based on the page size and number
//       const startIndex = pageSize * pageNumber;

//       // Apply pagination using the slice method
//       const paginatedData = sortedHistory.slice(
//         startIndex,
//         startIndex + pageSize
//       );

//       // Return the extracted and paginated data as a response to your Node.js API client
//       res.status(200).json({
//         statusCode: 200,
//         perPageDataCount: paginatedData.length,
//         totalDebitCount: history.length,
//         message: "Data retrieved successfully from PHP API",
//         history: paginatedData,
//       });
//     } else {
//       res.status(500).json({
//         statusCode: 500,
//         message: "Error in retrieving data from PHP API",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.get("/todaydebitamount", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_today_debit.php`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.history;

        // Calculate the sum of "amount" values
        let todayDebitBalance = 0;
        for (const item of history) {
          // Convert the "amount" value to a number and add it to the total
          todayDebitBalance += parseFloat(item.amount);
        }

        // Return the extracted data as a response to your Node.js API client
        res.status(200).json({
          statusCode: 200,
          todayDebitBalance, // Include the total credit balance
          message: "Today Debit Amount retrieved successfully",
          // history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/totaldebitamount", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/admin_total_debit.php`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.history;

        // Calculate the sum of "amount" values
        let totalDebitBalance = 0;
        for (const item of history) {
          // Convert the "amount" value to a number and add it to the total
          totalDebitBalance += parseFloat(item.amount);
        }

        // Return the extracted data as a response to your Node.js API client
        res.status(200).json({
          statusCode: 200,
          totalDebitBalance, // Include the total credit balance
          message: "Today Debit Amount retrieved successfully",
          // history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/treeview", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization values
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/parent_child_show.php?user_id=9900000001`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // const parentURL = `https://brandingprofitable-29d465d7c7b1.herokuapp.com/php/wallet/9106636361`
      // const parentResponse = await axiosInstance.get(parentURL);

      // const parentData = parentResponse.data.details
      // console.log(parentData, "parentData")
      // const parentData = {
      //   number: "1",
      //   parent_id: "0",
      //   referral_id: "0",
      //   total_earn: "0",
      //   green_wallet: "0",
      //   red_wallet: "0",
      //   total_member: "0",
      //   right_side: "1",
      //   left_side: "1",
      //   total_right_side: "1",
      //   total_left_side: "3",
      //   add_side: "root",
      //   user_leval: "V",
      //   last_paid_L_count: "0",
      //   last_paid_R_count: "0",
      //   today_right_side: "1",
      //   today_left_side: "3",
      //   last_paid_pair_today: " 1",
      //   royalty_total_count_L: "0",
      //   royalty_total_count_R: "0",
      //   royalty_monthly_count_L: "0",
      //   royalty_monthly_count_R: "0",
      //   royalty_last_paid_L: "0",
      //   royalty_last_paid_R: "0",
      //   royalty_end_count_L: "0",
      //   royalty_end_count_R: "0",
      //   director_monthly_count_R: "0",
      //   director_monthly_count_L: "0",
      //   director_total_count_R: "0",
      //   director_total_count_L: "0",
      //   date: "",
      //   register_date: "",
      //   director_date: "",
      // };

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data;
        console.log(history, "history");

        // const myArray = {
        //   ...parentData,
        //   children: history,
        // };

        // console.log("final output:", myArray);

        // Assuming there's only one item in the response, take the first element

        // Return the extracted data as a response to your Node.js API client
        res.status(200).json(history);
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/tree/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();
    const mobileNumber = req.params.mobileNumber;

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/parent_child_show.php?user_id=${mobileNumber}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data;

        // Return the extracted data as a response to your Node.js API client
        res.status(200).json(history);
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// router.get('/treeview', async (req, res) => {
//   try {
//     // Make an HTTP request to the PHP API
//     const phpApiUrl = 'https://kubertree.com/MLM/MLM/parent_child_show.php?user_id=1';
//     const phpApiResponse = await axios.get(phpApiUrl);

//     // Check if the response from the PHP API is successful
//     if (phpApiResponse.status === 200) {
//       // Extract the relevant data from the PHP API response
//       const history = phpApiResponse.data;

//       // Define a function to find the full name for a given number
//       const findFullName = async (number) => {
//         const user = await Register.findOne({ mobileNumber: number });
//         return user ? user.fullName : null;
//       };

//       const addFullNameToItem = async (item) => {
//         // Add the "fullName" to the item
//         item.fullName = await findFullName(item.number);
//         // If there are children, add "fullName" to them as well
//         if (item.children) {
//           for (const child of item.children) {
//             await addFullNameToItem(child);
//           }
//         }
//       };

//       // Iterate over the history items and add the fullName
//       for (const historyItem of history) {
//         await addFullNameToItem(historyItem);
//       }

//       res.status(200).json(history);
//     } else {
//       res.status(500).json({
//         statusCode: 500,
//         message: 'Error in retrieving data from PHP API',
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.get("/dashboard", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make an HTTP request to the PHP API
      // const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_wallet_count.php`;
      const phpApiUrl = `https://kubertree.com/MLM/MLM/show_all_data.php`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        const data = phpApiResponse.data;

        // Extract the relevant data from the PHP API response and create the desired structure
        // const data = {
        //   Today_Credit: phpApiResponse.data[0].Today_Credit,
        //   All_Credit: phpApiResponse.data[1].All_Credit,
        //   Today_Debit: phpApiResponse.data[2].Today_Debit,
        //   All_Debit: phpApiResponse.data[3].All_Debit,
        // };

        // Return the extracted data in the desired structure as a response to your Node.js API client
        res.status(200).json(data);
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/companywallet", async (req, res) => {
  try {
    // Fetch the Authorization value dynamically using the getAuthorization function
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Make a request using the Axios instance
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_company_wallet_details.php`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.wallet_details[0];
        res.status(200).json(history);
      } else {
        res.status(500).json({
          statusCode: 500,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// router.get("/companywallet", async (req, res) => {
//   try {
//     // Define the static Authorization value
//     const staticAuthorization = '5d2fbdce3eac3c3f294e470dceaf482b3e58e903';

//     // Configure the Axios instance with the Authorization header
//     const axiosInstance = axios.create({
//       headers: {
//         'Authorization': staticAuthorization,
//       },
//     });

//     // Make a request using the Axios instance
//     const phpApiUrl = `https://kubertree.com/MLM/MLM/get_company_wallet_details.php`;
//     const phpApiResponse = await axiosInstance.get(phpApiUrl);

//     if (phpApiResponse.status === 200) {
//       const history = phpApiResponse.data;
//       res.status(200).json(history);
//     } else {
//       res.status(500).json({
//         statusCode: 500,
//         message: "Error in retrieving data from PHP API",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.get("/premium/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_register.php?number=${mobileNumber}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);
      const updateStatus = await MlmRegister.find();
      const filteredUser = updateStatus.find(
        (userData) => userData.mobileNumber == mobileNumber
      );

      // Check if the response from the PHP API is successfully
      let responseData;

      if (filteredUser == undefined) {
        responseData = {
          statusCode: 210,
          message: "not found",
        };
      }

      if (filteredUser && filteredUser.status.includes("Pending")) {
        responseData = {
          statusCode: 202,
          message: "Pending",
        };
      } else if (filteredUser && filteredUser.status.includes("Reject")) {
        responseData = {
          statusCode: 203,
          message: "Reject",
        };
      } else if (phpApiResponse.data.status == 400) {
        responseData = {
          statusCode: 201,
          message: "Payment not made",
        };
      } else if (phpApiResponse.data.status == 200) {
        responseData = {
          statusCode: 200,
          message: "Your Subscription has been purchased",
        };
      }
      res.status(responseData.statusCode).json(responseData);
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// router.get("/mpincheck/:mobileNumber", async (req, res) => {
//   try {
//     const dynamicAuthorization = await getAuthorization();

//     if (dynamicAuthorization) {
//       // Configure the Axios instance with the dynamic Authorization value
//       const axiosInstance = axios.create({
//         headers: {
//           Authorization: dynamicAuthorization,
//         },
//       });

//       const mobileNumber = req.params.mobileNumber;

//       // Make an HTTP request to the PHP API
//       const phpApiUrl = `https://kubertree.com/MLM/MLM/user_register.php?number=${mobileNumber}`;
//       const phpApiResponse = await axiosInstance.get(phpApiUrl);
//       console.log(phpApiResponse.data.status, "phpApiResponse.data.status");

//       // Check if the response from the PHP API is successful
//       let responseData;

//       if (phpApiResponse.data.status == 400) {
//         responseData = {
//           statusCode: 201,
//           message: "Payment not made",
//         };
//       } else if (phpApiResponse.data.status == 200) {
//         responseData = {
//           statusCode: 200,
//           message: "Your Subscription has been purchased",
//         };
//       }
//       res.status(responseData.statusCode).json(responseData);
//     } else {
//       res.status(402).json({
//         statusCode: 402,
//         message: "Error in fetching Authorization data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.get("/mpincheck/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/user_register.php?number=${mobileNumber}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);
      console.log(phpApiResponse.data.status, "phpApiResponse.data.status");

      // Check if the response from the PHP API is successful
      let responseData;

      if (phpApiResponse.data.status == 400) {
        responseData = {
          statusCode: 201,
          message: "Payment not made",
        };
      } else if (phpApiResponse.data.status == 200) {
        // The subscription has been purchased, now check M-Pin
        const user = await Register.findOne({ mobileNumber });
        console.log(user.mPin, "user");

        if (user.mPin == null) {
          console.log("1");
          responseData = {
            statusCode: 201,
            message: "Your M-Pin is Not Set",
          };
        } else {
          console.log("2");
          responseData = {
            statusCode: 200,
            message: "Your M-Pin is Set",
          };
        }
      }

      res.status(responseData.statusCode).json(responseData);
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.put("/mpin/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const updateData = req.body;

    // Update the user based on the mobile number
    let result = await Register.findOneAndUpdate(
      { mobileNumber }, // Search condition based on mobile number
      updateData, // Data to update
      { new: true } // Return the updated document
    );

    res.json({
      statusCode: 200,
      data: result,
      message: "M-Pin Created Successfully",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
});

router.get("/mpinmatch/:mobileNumber/:mPin", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const mPin = req.params.mPin;

    const data = await Register.findOne({ mobileNumber, mPin });

    if (!data) {
      return res.status(202).json({
        statusCode: 202,
        message: "MPIN do not match.",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "MPIN match.",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/findpair/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/left_right_empty.php?number=${mobileNumber}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const users = phpApiResponse.data.history;
        console.log(users, "users");
        // Modify the response to include "side," "parentId," and "referralId"
        const modifiedUsers = await Promise.all(
          users.map(async (user) => {
            // Search for the user in the Register collection and retrieve the fullName
            const registerUser = await Register.findOne({
              mobileNumber: user.number,
            });
            return {
              fullName: user.fullName,
              mobileNumber: user.number,
              parentId: user.parent_id,
              referralId: user.referral_id,
              side: [
                user.right_side === "0" ? "right" : null,
                user.left_side === "0" ? "left" : null,
              ].filter(Boolean), // Remove null values
              // fullName: registerUser ? registerUser.fullName : null,
            };
          })
        );

        res.status(200).json({
          statusCode: 200,
          message: "Data retrieved successfully from PHP API",
          users: modifiedUsers,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Update the M-Pin for a user
router.put("/mpinchange/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const oldMpin = req.body.oldMpin; // Corrected field name
    const newMpin = req.body.newPin; // Corrected field name

    // Find the user based on mobile number
    const user = await Register.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    if (user.mPin !== oldMpin) {
      return res.status(201).json({
        statusCode: 201,
        message: "Old M-Pin does not match",
      });
    }

    // Update the M-Pin to the new value
    user.mPin = newMpin;
    await user.save();

    res.json({
      statusCode: 200,
      message: "M-Pin Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
});

// Generate OTP function
function generateOTP() {
  const min = 1000; // Minimum 4-digit number
  const max = 9999; // Maximum 4-digit number
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

// Send OTP via fast2sms
// async function sendOTP(mobileNumber, otp) {
//   try {
//     const smsOptions = {
//       authorization:
//         "WSk4p31YrN1zGIt8IADgFq9kym3vqUTJaIya0pF0zVE1xolqIVu47iuhuKJk",
//       message: otp,
//       numbers: [mobileNumber],
//     };

//     const response = await fast2sms.sendMessage(smsOptions);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }

// router.post("/mpinreset/sendotp", async (req, res) => {
//   try {
//     const { mobileNumber, newPin } = req.body;

//     // Generate a 4-digit OTP
//     const otp = generateOTP();

//     // Send the OTP to the user's mobile number
//     await sendOTP(mobileNumber, otp);

//     // Store the OTP in the Register collection for the user
//     const user = await Register.findOne({ mobileNumber });

//     if (!user) {
//       return res.status(404).json({
//         statusCode: 404,
//         message: "User not found",
//       });
//     }

//     user.mPinResetOTP = otp;
//     // user.mPin = newPin; // Update the mPin with the newPin
//     await user.save();

//     res.json({
//       statusCode: 200,
//       message:
//         "OTP sent and stored in Register collection successfully. M-Pin reset.",
//     });
//   } catch (err) {
//     res.status(500).json({
//       statusCode: 500,
//       message: err.message,
//     });
//   }
// });

// ---------------------------------------SMS Panel---m-------------------------------------------------------------------------

// function sendOTP(mobileNumber, otp) {
//   const contacts = mobileNumber; // Use the recipient's mobile number
//   const apiUrl = `http://193.46.243.10/app/smsapi/index.php?key=46538AFE27083E&campaign=13444&routeid=3&type=text&contacts=${contacts}&senderid=BRAPRO&msg=%5B%23%5D%20DO%20NOT%20SHARE%20%3A%20${otp}%20is%20the%20login%20OTP%20for%20your%20Branding%20profitable%20account.%20Keep%20this%20OTP%20to%20yourself%20for%20account%20safety.&template_id=1707169822246161608&pe_id=1701169787222711884`;

//   const apiUrlWithParams = apiUrl;

//   return axios.get(apiUrlWithParams);
// }

// router.post("/mpinreset/sendotp", async (req, res) => {
//   try {
//     const { mobileNumber, newPin } = req.body;

//     // Generate a 4-digit OTP
//     const otp = generateOTP();

//     // Send the OTP to the user's mobile number
//     await sendOTP(mobileNumber, otp);

//     // Store the OTP in the Register collection for the user
//     const user = await Register.findOne({ mobileNumber });
//     console.log(user, "user");

//     if (!user) {
//       return res.status(404).json({
//         statusCode: 404,
//         message: "User not found",
//       });
//     }

//     user.mPinResetOTP = otp;
//     // user.mPin = newPin; // Update the mPin with the newPin
//     await user.save();

//     res.json({
//       statusCode: 200,
//       message:
//         "OTP sent and stored in Register collection successfully. M-Pin reset.",
//     });
//   } catch (err) {
//     res.status(500).json({
//       statusCode: 500,
//       message: err.message,
//     });
//   }
// });

router.post("/mpinreset/sendotp", async (req, res) => {
  try {
    const user = await Register.findOne({
      mobileNumber: req.body.mobileNumber,
    });

    if (!user) {
      return res.json({ statusCode: 403, message: "User doesn't exist" });
    }
    const userName = user.fullName + ",";
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP

    user.mPinResetOTP = otp;
    await user.save();

    // Send OTP to the user's mobile number
    try {
      // const apiUrl = `http://193.46.243.10/app/smsapi/index.php?key=46538AFE27083E&campaign=13444&routeid=3&type=text&contacts=${user.mobileNumber}&senderid=BRAPRO&msg=%20Dear%20${userName}%20please%20enter%20${otp}%20code%20to%20reset%20your%20refer%20%26%20earn%20password%20for%20branding%20profitable.&template_id=1707170107181759475&pe_id=1701169787222711884`;
      const apiUrl = `http://193.46.243.10/app/smsapi/index.php?key=46538AFE27083E&campaign=13444&routeid=3&type=text&contacts=${user.mobileNumber}&senderid=BRAPRO&msg=Dear%20${userName}%20please%20enter%20${otp}%20code%20to%20reset%20your%20refer%20%26%20earn%20password%20for%20branding%20profitable.&template_id=1707170168934324762&pe_id=1701169787222711884`;

      const apiUrlWithParams = apiUrl;

      const response = await axios.get(apiUrlWithParams);

      res.json({
        statusCode: 200,
        message: "OTP sent successfully",
        response: response.data, // You might want to handle the response data appropriately
      });
    } catch (error) {
      res.json({ statusCode: 500, message: "Error sending OTP" });
    }
  } catch (error) {
    res.json({ statusCode: 500, message: error.message });
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------

router.put("/mpinreset/verifyotp/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const mPinResetOTP = req.body.mPinResetOTP;
    const newMpin = req.body.newPin;

    // Find the user based on mobile number
    const user = await Register.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    if (user.mPinResetOTP !== mPinResetOTP) {
      return res.status(201).json({
        statusCode: 201,
        message: "Enter Valid OTP",
      });
    }

    // Update the M-Pin to the new value
    user.mPin = newMpin;
    await user.save();

    res.json({
      statusCode: 200,
      message: "M-Pin Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
});

router.get("/userhistory/:mobileNumber/:name", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const name = req.params.name;
      const page = req.params.page;

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_user_history.php?number=${mobileNumber}&name=${name}&page=${page}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data;

        res.json(history);

        // Return the extracted data as a response to your Node.js API client
        // res.status(200).json({
        //   statusCode: 200,
        //   message: "Data retrieved successfully from PHP API",
        //   history,
        // });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// ---------------------------------------------------------------

router.get("/reword", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_admin_show_history.php?name=Reword&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const updatedHistory = history.map((historyItem) => {
          const user = userMap.get(historyItem.number) || {};
          return {
            ...historyItem,
            fullName: user.fullName || null,
            // address: user.address || null,
            // email: user.email || null,
          };
        });

        const sortedHistory = updatedHistory.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalRewardCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/binary", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_admin_show_history.php?name=Binary&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const updatedHistory = history.map((historyItem) => {
          const user = userMap.get(historyItem.number) || {};
          return {
            ...historyItem,
            fullName: user.fullName || null,
            // address: user.address || null,
            // email: user.email || null,
          };
        });

        const sortedHistory = updatedHistory.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalBinarydCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/royalty", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_admin_show_history.php?name=Royalty&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const updatedHistory = history.map((historyItem) => {
          const user = userMap.get(historyItem.number) || {};
          return {
            ...historyItem,
            fullName: user.fullName || null,
            // address: user.address || null,
            // email: user.email || null,
          };
        });

        const sortedHistory = updatedHistory.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalRoyaltyCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/sponsor", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_admin_show_history.php?name=Sponsor&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const updatedHistory = history.map((historyItem) => {
          const user = userMap.get(historyItem.number) || {};
          return {
            ...historyItem,
            fullName: user.fullName || null,
            // address: user.address || null,
            // email: user.email || null,
          };
        });

        const sortedHistory = updatedHistory.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalSponcorCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/globalroyalty", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = parseInt(req.query.pageSize) || 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_admin_show_history.php?name=G_Royalty&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        const userMap = new Map();
        users.forEach((user) => {
          userMap.set(user.mobileNumber, user);
        });

        const updatedHistory = history.map((historyItem) => {
          const user = userMap.get(historyItem.number) || {};
          return {
            ...historyItem,
            fullName: user.fullName || null,
            // address: user.address || null,
            // email: user.email || null,
          };
        });

        const sortedHistory = updatedHistory.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;
        const paginatedData = sortedHistory.slice(
          startIndex,
          startIndex + pageSize
        );

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalSponcorCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/allhistory", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/all_admin_history.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const mobileNumbers = history.map((item) => item.number);
        const users = await Register.find({
          mobileNumber: { $in: mobileNumbers },
        });

        // const userMap = new Map();
        // users.forEach((user) => {
        //   userMap.set(user.mobileNumber, user);
        // });

        // const updatedHistory = history.map((historyItem) => {
        //   const user = userMap.get(historyItem.number) || {};
        //   return {
        //     ...historyItem,
        //     fullName: user.fullName || null,
        //     address: user.address || null,
        //     email: user.email || null,
        //   };
        // });

        // const sortedHistory = updatedHistory.sort(
        //   (a, b) => new Date(b.date) - new Date(a.date)
        // );
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // const startIndex = pageSize * pageNumber;
        // const paginatedData = sortedHistory.slice(
        //   startIndex,
        //   startIndex + pageSize
        // );

        res.status(200).json({
          statusCode: 200,
          totalCreditCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/allhistory/search", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const searchQuery = req.body.search || ""; // Get search query from request body

      // Define function to get data from a specific page
      const getDataFromPage = async (page) => {
        const phpApiUrl = `https://kubertree.com/MLM/MLM/all_admin_history.php?page=${page}`;
        const phpApiResponse = await axiosInstance.get(phpApiUrl);
        return phpApiResponse.data.history;
      };

      let page = 1;
      let found = false;
      let allData = [];

      // Iterate through pages until the record is found or no more pages
      while (!found) {
        const data = await getDataFromPage(page);

        // Filter the records based on any field containing the search query
        const filteredData = data.filter((record) =>
          Object.values(record).some(
            (value) => typeof value === "string" && value.includes(searchQuery)
          )
        );

        // If any matching records found, set found to true and append to allData
        if (filteredData.length > 0) {
          found = true;
          allData = [...allData, ...filteredData];
        }

        // Move to the next page
        page++;

        // If no more data on the page, exit the loop
        if (data.length === 0) {
          break;
        }
      }

      const totalRecords = allData.length;
      const totalPages = Math.ceil(totalRecords / allData.length);

      res.status(200).json({
        statusCode: 200,
        perPageDataCount: allData.length,
        count: totalRecords,
        total_pages: totalPages,
        message: "Data retrieved successfully from PHP API",
        data: allData,
      });
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/passbook", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/all_admin_history.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.history;

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        const startIndex = pageSize * pageNumber;

        res.status(200).json({
          statusCode: 200,
          totalData: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/passbook/search", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const searchQuery = req.body.search || ""; // Get search query from request body

      // Define function to get data from a specific page
      const getDataFromPage = async (page) => {
        const phpApiUrl = `https://kubertree.com/MLM/MLM/all_admin_history.php?page=${page}`;
        const phpApiResponse = await axiosInstance.get(phpApiUrl);
        return phpApiResponse.data.history;
      };

      let page = 1;
      let found = false;
      let allData = [];

      // Iterate through pages until the record is found or no more pages
      while (!found) {
        const data = await getDataFromPage(page);

        // Filter the records based on any field containing the search query
        const filteredData = data.filter((record) =>
          Object.values(record).some(
            (value) => typeof value === "string" && value.includes(searchQuery)
          )
        );

        // If any matching records found, set found to true and append to allData
        if (filteredData.length > 0) {
          found = true;
          allData = [...allData, ...filteredData];
        }

        // Move to the next page
        page++;

        // If no more data on the page, exit the loop
        if (data.length === 0) {
          break;
        }
      }

      const totalRecords = allData.length;
      const totalPages = Math.ceil(totalRecords / allData.length);

      res.status(200).json({
        statusCode: 200,
        perPageDataCount: allData.length,
        count: totalRecords,
        total_pages: totalPages,
        message: "Data retrieved successfully from PHP API",
        data: allData,
      });
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/withdrawal", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.body.mobileNumber;
      const withdrawalAmount = req.body.withdrawalAmount;
      const bankName = req.body.bankName;
      const acNumber = req.body.acNumber;
      const acName = req.body.acName;
      const ifsc = req.body.ifsc;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/withdraw.php?number=${mobileNumber}&withdraw=${withdrawalAmount}&bankName=${bankName}&acNumber=${acNumber}&acName=${acName}&ifsc=${ifsc}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);
      console.log(phpApiResponse.data, "phpApiResponse.data.stats_code");

      let responseData;

      if (phpApiResponse.data.stats_code === "201") {
        responseData = {
          statusCode: 201,
          message: "Minimum Withdrawal Amount is 500!",
        };
      } else if (phpApiResponse.data.stats_code === "202") {
        responseData = {
          statusCode: 202,
          message: "Maximum Withdrawal Amount is 2,00,000!",
        };
      } else if (
        phpApiResponse.data.stats_code == "204" ||
        phpApiResponse.data.message === "Your Wallet Is Low"
      ) {
        responseData = {
          statusCode: 204,
          message: "Your Wallet Balance is Low!",
          walletBalance: phpApiResponse.data["Wallet Balance"], // Assuming this is how you access the wallet balance
        };
      } else {
        responseData = {
          statusCode: 200,
          message: "Withdrawal Request Send Successfully",
        };
      }

      res.status(responseData.statusCode).json(responseData);
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/withdrawal/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/withdraw_history.php?number=${mobileNumber}`;
      console.log(phpApiUrl, "phpApiUrl");
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data;

        res.json(history);

        // Return the extracted data as a response to your Node.js API client
        // res.status(200).json({
        //   statusCode: 200,
        //   message: "Data retrieved successfully from PHP API",
        //   history,
        // });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.put("/withdrawal_reject", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.body.mobileNumber;
      const transaction_id = req.body.transaction_id;
      const amount = req.body.amount;
      const reason = req.body.reason;
      const status = req.body.status;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/update_status.php?number=${mobileNumber}&transaction_id=${transaction_id}&amount=${amount}&reason=${reason}&status=${status}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);
      let responseData;

      if (phpApiResponse.data.stats_code === "204") {
        responseData = {
          statusCode: 201,
          message: "Minimum Withdrawal Amount is 500!",
        };
      } else {
        responseData = {
          statusCode: 200,
          message: "your Transaction Success",
        };
      }

      res.status(responseData.statusCode).json(responseData);
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.put("/withdrawal/success", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const transactionIDs = req.body.transactionIds; // Assuming you receive transaction IDs as an array or a comma-separated string

      if (!transactionIDs) {
        return res.status(400).json({
          statusCode: 400,
          message: "No transaction IDs provided",
        });
      }

      const idsArray = Array.isArray(transactionIDs)
        ? transactionIDs
        : transactionIDs.split(",");

      const successResponses = [];

      for (const transactionId of idsArray) {
        const phpApiUrl = `https://kubertree.com/MLM/MLM/succes_status_change.php?transaction_id=${transactionId}`;

        try {
          const phpApiResponse = await axiosInstance.get(phpApiUrl);
          // Handle the response or log the success if needed
          successResponses.push({
            transactionId: transactionId,
            success: true,
            response: phpApiResponse.data, // Save the response if needed
          });
        } catch (apiError) {
          // Handle API call error if needed
          successResponses.push({
            transactionId: transactionId,
            success: false,
            error: apiError.message, // Save the error if needed
          });
        }
      }

      res.status(200).json({
        statusCode: 200,
        message: "Transaction(s) processed",
        successResponses: successResponses,
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.put("/withdrawal/tobank", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const transactionIDs = req.body.transactionIds;

      if (!transactionIDs) {
        return res.status(400).json({
          statusCode: 400,
          message: "No transaction IDs provided",
        });
      }

      const idsArray = Array.isArray(transactionIDs)
        ? transactionIDs
        : transactionIDs.split(",");

      const successResponses = [];

      for (const transactionId of idsArray) {
        const phpApiUrl = `https://kubertree.com/MLM/MLM/withdraw_bank.php?transaction_id=${transactionId}`;

        try {
          const phpApiResponse = await axiosInstance.get(phpApiUrl);
          // Handle the response or log the success if needed
          successResponses.push({
            transactionId: transactionId,
            success: true,
            response: phpApiResponse.data, // Save the response if needed
          });
        } catch (apiError) {
          // Handle API call error if needed
          successResponses.push({
            transactionId: transactionId,
            success: false,
            error: apiError.message, // Save the error if needed
          });
        }
      }

      res.status(200).json({
        statusCode: 200,
        message: "Widrawal Request Send To Bank processed",
        successResponses: successResponses,
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// // Get Fail Withdrawal Data
// router.get("/withdrawal_request", async (req, res) => {
//   try {
//     const dynamicAuthorization = await getAuthorization();

//     if (dynamicAuthorization) {
//       // Configure the Axios instance with the dynamic Authorization value
//       const axiosInstance = axios.create({
//         headers: {
//           Authorization: dynamicAuthorization,
//         },
//       });

//       const pageSize = 200;
//       const pageNumber = parseInt(req.query.pageNumber) || 0;

//       const phpApiUrl = `https://kubertree.com/MLM/MLM/show_all_transaction.php?status=All&page=${
//         pageNumber + 1
//       }&per_page=${pageSize}`;
//       const phpApiResponse = await axiosInstance.get(phpApiUrl);

//       if (phpApiResponse.status === 200) {
//         const history = phpApiResponse.data.details;

//         const totalRecords = parseInt(
//           phpApiResponse.data.pagination.total_records
//         );
//         const totalPages = Math.ceil(totalRecords / pageSize);

//         // const startIndex = pageSize * pageNumber;
//         // const paginatedData = history.slice(startIndex, startIndex + pageSize);

//         res.status(200).json({
//           statusCode: 200,
//           // perPageDataCount: paginatedData.length,
//           WithdrawalRequestCount: totalRecords,
//           total_pages: totalPages, // Include the total pages count
//           message: "Data retrieved successfully from PHP API",
//           data: history,
//         });
//       } else {
//         res.status(401).json({
//           statusCode: 401,
//           message: "Error in retrieving data from PHP API",
//         });
//       }
//     } else {
//       res.status(402).json({
//         statusCode: 402,
//         message: "Error in fetching Authorization data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// Get All Withdrawal Data
router.get("/withdrawal_request", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/show_all_transaction.php?status=All&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Extract unique numbers from the response
        const uniqueNumbers = [...new Set(history.map((item) => item.number))];

        // Fetch corresponding documents from the Register collection
        const registerData = await Register.find({
          mobileNumber: { $in: uniqueNumbers },
        });

        // Create a map for quick lookup
        const registerMap = new Map(
          registerData.map((item) => [
            item.mobileNumber.toString(),
            item.fullName,
          ])
        );

        // Add the fullName to each item in the response
        const enrichedData = history.map((item) => ({
          ...item,
          fullName: registerMap.get(item.number) || "Unknown", // Default to "Unknown" if not found
        }));

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
          statusCode: 200,
          WithdrawalRequestCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          data: enrichedData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// // Get Fail Withdrawal Data
// router.get("/widrawal_fail_history", async (req, res) => {
//   try {
//     const dynamicAuthorization = await getAuthorization();

//     if (dynamicAuthorization) {
//       // Configure the Axios instance with the dynamic Authorization value
//       const axiosInstance = axios.create({
//         headers: {
//           Authorization: dynamicAuthorization,
//         },
//       });

//       const pageSize = parseInt(req.query.pageSize) || 200;
//       const pageNumber = parseInt(req.query.pageNumber) || 0;

//       const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=fail&page=${
//         pageNumber + 1
//       }&per_page=${pageSize}`;
//       const phpApiResponse = await axiosInstance.get(phpApiUrl);

//       if (phpApiResponse.status === 200) {
//         const history = phpApiResponse.data.details;

//         const totalRecords = parseInt(
//           phpApiResponse.data.pagination.total_records
//         );
//         const totalPages = Math.ceil(totalRecords / pageSize);

//         res.status(200).json({
//           statusCode: 200,
//           perPageDataCount: history.length,
//           totalWidrawalRejectCount: totalRecords,
//           total_pages: totalPages,
//           message: "Data retrieved successfully from PHP API",
//           history: history,
//         });
//       } else {
//         res.status(401).json({
//           statusCode: 401,
//           message: "Error in retrieving data from PHP API",
//         });
//       }
//     } else {
//       res.status(402).json({
//         statusCode: 402,
//         message: "Error in fetching Authorization data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// Get Fail Withdrawal Data
router.get("/widrawal_fail_history", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=fail&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Extract unique numbers from the response
        const uniqueNumbers = [...new Set(history.map((item) => item.number))];

        // Fetch corresponding documents from the Register collection
        const registerData = await Register.find({
          mobileNumber: { $in: uniqueNumbers },
        });

        // Create a map for quick lookup
        const registerMap = new Map(
          registerData.map((item) => [
            item.mobileNumber.toString(),
            item.fullName,
          ])
        );

        // Add the fullName to each item in the response
        const enrichedData = history.map((item) => ({
          ...item,
          fullName: registerMap.get(item.number) || "Unknown", // Default to "Unknown" if not found
        }));

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
          statusCode: 200,
          totalWidrawalRejectCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: enrichedData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// // Get Pending Withdrawal Data
// router.get("/widrawal_pending_history", async (req, res) => {
//   try {
//     const dynamicAuthorization = await getAuthorization();

//     if (dynamicAuthorization) {
//       // Configure the Axios instance with the dynamic Authorization value
//       const axiosInstance = axios.create({
//         headers: {
//           Authorization: dynamicAuthorization,
//         },
//       });

//       const pageSize = parseInt(req.query.pageSize) || 200;
//       const pageNumber = parseInt(req.query.pageNumber) || 0;

//       const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=pending&page=${
//         pageNumber + 1
//       }&per_page=${pageSize}`;
//       const phpApiResponse = await axiosInstance.get(phpApiUrl);

//       if (phpApiResponse.status === 200) {
//         const history = phpApiResponse.data.details;

//         const totalRecords = parseInt(
//           phpApiResponse.data.pagination.total_records
//         );
//         const totalPages = Math.ceil(totalRecords / pageSize);

//         res.status(200).json({
//           statusCode: 200,
//           perPageDataCount: history.length,
//           totalWidrawalPendingCount: totalRecords,
//           total_pages: totalPages,
//           message: "Data retrieved successfully from PHP API",
//           history: history,
//         });
//       } else {
//         res.status(401).json({
//           statusCode: 401,
//           message: "Error in retrieving data from PHP API",
//         });
//       }
//     } else {
//       res.status(402).json({
//         statusCode: 402,
//         message: "Error in fetching Authorization data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// Get Pending Withdrawal Data
router.get("/widrawal_pending_history", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=pending&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Extract unique numbers from the response
        const uniqueNumbers = [...new Set(history.map((item) => item.number))];

        // Fetch corresponding documents from the Register collection
        const registerData = await Register.find({
          mobileNumber: { $in: uniqueNumbers },
        });

        // Create a map for quick lookup
        const registerMap = new Map(
          registerData.map((item) => [
            item.mobileNumber.toString(),
            item.fullName,
          ])
        );

        // Add the fullName to each item in the response
        const enrichedData = history.map((item) => ({
          ...item,
          fullName: registerMap.get(item.number) || "Unknown", // Default to "Unknown" if not found
        }));

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
          statusCode: 200,
          totalWidrawalPendingCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: enrichedData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// // Get Success Withdrawal Data
// router.get("/widrawal_success_history", async (req, res) => {
//   try {
//     const dynamicAuthorization = await getAuthorization();

//     if (dynamicAuthorization) {
//       // Configure the Axios instance with the dynamic Authorization value
//       const axiosInstance = axios.create({
//         headers: {
//           Authorization: dynamicAuthorization,
//         },
//       });

//       const pageSize = parseInt(req.query.pageSize) || 200;
//       const pageNumber = parseInt(req.query.pageNumber) || 0;

//       const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=Success&page=${
//         pageNumber + 1
//       }&per_page=${pageSize}`;
//       const phpApiResponse = await axiosInstance.get(phpApiUrl);

//       if (phpApiResponse.status === 200) {
//         const history = phpApiResponse.data.details;

//         const totalRecords = parseInt(
//           phpApiResponse.data.pagination.total_records
//         );
//         const totalPages = Math.ceil(totalRecords / pageSize);

//         res.status(200).json({
//           statusCode: 200,
//           perPageDataCount: history.length,
//           totalWidrawalSuccessCount: totalRecords,
//           total_pages: totalPages,
//           message: "Data retrieved successfully from PHP API",
//           history: history,
//         });
//       } else {
//         res.status(401).json({
//           statusCode: 401,
//           message: "Error in retrieving data from PHP API",
//         });
//       }
//     } else {
//       res.status(402).json({
//         statusCode: 402,
//         message: "Error in fetching Authorization data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// Get Success Withdrawal Data
router.get("/widrawal_success_history", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=Success&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Extract unique numbers from the response
        const uniqueNumbers = [...new Set(history.map((item) => item.number))];

        // Fetch corresponding documents from the Register collection
        const registerData = await Register.find({
          mobileNumber: { $in: uniqueNumbers },
        });

        // Create a map for quick lookup
        const registerMap = new Map(
          registerData.map((item) => [
            item.mobileNumber.toString(),
            item.fullName,
          ])
        );

        // Add the fullName to each item in the response
        const enrichedData = history.map((item) => ({
          ...item,
          fullName: registerMap.get(item.number) || "Unknown", // Default to "Unknown" if not found
        }));

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
          statusCode: 200,
          totalWidrawalSuccessCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: enrichedData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// // Get Progress Withdrawal Data
// router.get("/widrawal_Progress_history", async (req, res) => {
//   try {
//     const dynamicAuthorization = await getAuthorization();

//     if (dynamicAuthorization) {
//       // Configure the Axios instance with the dynamic Authorization value
//       const axiosInstance = axios.create({
//         headers: {
//           Authorization: dynamicAuthorization,
//         },
//       });

//       const pageSize = parseInt(req.query.pageSize) || 200;
//       const pageNumber = parseInt(req.query.pageNumber) || 0;

//       const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=Progress&page=${
//         pageNumber + 1
//       }&per_page=${pageSize}`;
//       const phpApiResponse = await axiosInstance.get(phpApiUrl);

//       if (phpApiResponse.status === 200) {
//         const history = phpApiResponse.data.details;

//         const totalRecords = parseInt(
//           phpApiResponse.data.pagination.total_records
//         );
//         const totalPages = Math.ceil(totalRecords / pageSize);

//         res.status(200).json({
//           statusCode: 200,
//           perPageDataCount: history.length,
//           totalWidrawalProgressCount: totalRecords,
//           total_pages: totalPages,
//           message: "Data retrieved successfully from PHP API",
//           history: history,
//         });
//       } else {
//         res.status(401).json({
//           statusCode: 401,
//           message: "Error in retrieving data from PHP API",
//         });
//       }
//     } else {
//       res.status(402).json({
//         statusCode: 402,
//         message: "Error in fetching Authorization data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// Get Progress Withdrawal Data
router.get("/widrawal_Progress_history", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=Progress&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Extract unique numbers from the response
        const uniqueNumbers = [...new Set(history.map((item) => item.number))];

        // Fetch corresponding documents from the Register collection
        const registerData = await Register.find({
          mobileNumber: { $in: uniqueNumbers },
        });

        // Create a map for quick lookup
        const registerMap = new Map(
          registerData.map((item) => [
            item.mobileNumber.toString(),
            item.fullName,
          ])
        );

        // Add the fullName to each item in the response
        const enrichedData = history.map((item) => ({
          ...item,
          fullName: registerMap.get(item.number) || "Unknown", // Default to "Unknown" if not found
        }));

        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
          statusCode: 200,
          totalWidrawalProgressCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: enrichedData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/widrawal_progress/search", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const searchQuery = req.body.search || ""; // Get search query from request body

      // Modify the PHP API URL to include the search query
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=Progress`;

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Filter the records based on any field containing the search query
        const filteredData = history.filter((record) =>
          Object.values(record).some(
            (value) => typeof value === "string" && value.includes(searchQuery)
          )
        );

        const totalRecords = filteredData.length;
        const totalPages = Math.ceil(totalRecords / history.length);

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: filteredData.length,
          count: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          data: filteredData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/widrawal_fail/search", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const searchQuery = req.body.search || ""; // Get search query from request body

      // Modify the PHP API URL to include the search query
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=fail`;

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Filter the records based on any field containing the search query
        const filteredData = history.filter((record) =>
          Object.values(record).some(
            (value) => typeof value === "string" && value.includes(searchQuery)
          )
        );

        const totalRecords = filteredData.length;
        const totalPages = Math.ceil(totalRecords / history.length);

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: filteredData.length,
          count: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          data: filteredData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/widrawal_success/search", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const searchQuery = req.body.search || ""; // Get search query from request body

      // Modify the PHP API URL to include the search query
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=Success`;

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Filter the records based on any field containing the search query
        const filteredData = history.filter((record) =>
          Object.values(record).some(
            (value) => typeof value === "string" && value.includes(searchQuery)
          )
        );

        const totalRecords = filteredData.length;
        const totalPages = Math.ceil(totalRecords / history.length);

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: filteredData.length,
          count: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          data: filteredData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/widrawal_pending/search", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const searchQuery = req.body.search || ""; // Get search query from request body

      // Modify the PHP API URL to include the search query
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=pending`;

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Filter the records based on any field containing the search query
        const filteredData = history.filter((record) =>
          Object.values(record).some(
            (value) => typeof value === "string" && value.includes(searchQuery)
          )
        );

        const totalRecords = filteredData.length;
        const totalPages = Math.ceil(totalRecords / history.length);

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: filteredData.length,
          count: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          data: filteredData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/withdrawal_request/search", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const searchQuery = req.body.search || ""; // Get search query from request body

      // Modify the PHP API URL to include the search query
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_tra_history.php?status=All`;

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Filter the records based on any field containing the search query
        const filteredData = history.filter((record) =>
          Object.values(record).some(
            (value) => typeof value === "string" && value.includes(searchQuery)
          )
        );

        const totalRecords = filteredData.length;
        const totalPages = Math.ceil(totalRecords / history.length);

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: filteredData.length,
          count: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          data: filteredData,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/user_wallet", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();
    if (dynamicAuthorization) {
      // Configure the Axios instance with the dynamic Authorization value
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      // Get the page size and page number from query parameters
      const pageSize = 10; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided
      const limit = parseInt(req.query.limit) || 10;

      // Make an HTTP request to the PHP API with the specified page number and page size
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user.php?page=${
        pageNumber + 1
      }&per_page=${pageSize}&limit=${limit}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);
      console.log(phpApiResponse.data.details, "abc");

      // Check if the response from the PHP API is successful
      if (phpApiResponse.status === 200) {
        // Extract the relevant data from the PHP API response
        const history = phpApiResponse.data.details;

        // Create an array to store the updated history items with fullNames
        const updatedHistory = [];

        // // Iterate over the history items and lookup the fullName
        // for (const historyItem of history) {
        //   // Find the user by mobileNumber (adjust this based on your data structure)
        //   const user = await Register.findOne({
        //     mobileNumber: historyItem.number,
        //   });

        //   // Add the user's fullName to the history item
        //   historyItem.fullName = user ? user.fullName : null;
        //   historyItem.adress = user ? user.adress : null;
        //   historyItem.email = user ? user.email : null;

        //   // Add the updated history item to the array
        //   updatedHistory.push(historyItem);
        // }

        // Sort the data by date in descending order
        const sortedHistory = updatedHistory.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate the total records and total pages count
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Calculate the starting index based on the page size and number
        const startIndex = pageSize * pageNumber;

        // Apply pagination using the slice method
        // const paginatedData = sortedHistory.slice(
        //   startIndex,
        //   startIndex + pageSize
        // );

        // Return the extracted and paginated data along with the total pages count
        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalUsernCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/all_userhistory/:mobileNumber/:name", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const name = req.params.name;
      const pageSize = 10; // Set the page size to 200 as requesteds
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided
      const limit = parseInt(req.query.limit) || 10;

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_user_history.php?number=${mobileNumber}&name=${name}&page=${
        pageNumber + 1
      }&per_page=${pageSize}&limit=${limit}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;
        const updatedHistory = [];

        const sortedHistory = updatedHistory.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate the total records and total pages count
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // res.json(history);

        // Return the extracted data as a response to your Node.js API clients
        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalUserHistoryCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/filter_all_userhistory/:mobileNumber/:name", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const name = req.params.name;
      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const { income_type } = req.body; // Extract income_type from the request body

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_user_history.php?number=${mobileNumber}&name=${name}&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        let history = phpApiResponse.data.details;

        // Filter history based on income_type if provided
        if (income_type) {
          history = history.filter((item) => item.income_type === income_type);
        }

        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalUserHistoryCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/search_userhistory/:mobileNumber/:name", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const name = req.params.name;
      const pageSize = 200;
      const pageNumber = parseInt(req.query.pageNumber) || 0;

      const { income_type } = req.body;
      const { search } = req.body; // Extract 'search' from the request body

      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_all_user_history.php?number=${mobileNumber}&name=${name}&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        let history = phpApiResponse.data.details;

        // Filter history based on income_type if provided
        if (income_type) {
          history = history.filter((item) => item.income_type === income_type);
        }

        // Filter history based on 'search' keyword if provided
        if (search) {
          history = history.filter((item) => {
            for (const key in item) {
              if (
                item[key] &&
                item[key]
                  .toString()
                  .toLowerCase()
                  .includes(search.toLowerCase())
              ) {
                return true;
              }
            }
            return false;
          });
        }

        const sortedHistory = history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
          statusCode: 200,
          perPageDataCount: sortedHistory.length,
          totalUserHistoryCount: totalRecords,
          total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: sortedHistory,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/user_withdrawal_history/:mobileNumber", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const mobileNumber = req.params.mobileNumber;
      const pageSize = 10; // Set the page size to 200 as requested
      const pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

      // Make an HTTP request to the PHP API
      const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user_withdraw.php?number=${mobileNumber}&page=${
        pageNumber + 1
      }&per_page=${pageSize}`;
      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        const history = phpApiResponse.data.details;

        // Calculate the total records and total pages count
        const totalRecords = parseInt(
          phpApiResponse.data.pagination.total_records
        );
        const totalPages = Math.ceil(totalRecords / pageSize);

        // res.json(history);

        // Return the extracted data as a response to your Node.js API clients
        res.status(200).json({
          statusCode: 200,
          totalUserHistoryCount: totalRecords,
          total_pages: totalPages, // Include the total pages count
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/search_user_wallet", async (req, res) => {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (dynamicAuthorization) {
      const axiosInstance = axios.create({
        headers: {
          Authorization: dynamicAuthorization,
        },
      });

      const { search } = req.body; // Extract 'search' from the request body

      const phpApiUrl = `https://kubertree.com/MLM/MLM/search_get_user.php`;

      const phpApiResponse = await axiosInstance.get(phpApiUrl);

      if (phpApiResponse.status === 200) {
        let history = phpApiResponse.data.details;

        // Filter history based on 'search' keyword if provided
        if (search) {
          history = history.filter((item) => {
            for (const key in item) {
              if (
                item[key] &&
                item[key]
                  .toString()
                  .toLowerCase()
                  .includes(search.toLowerCase())
              ) {
                return true;
              }
            }
            return false;
          });
        }

        // const sortedHistory = history.sort(
        //   (a, b) => new Date(b.date) - new Date(a.date)
        // );
        // const totalRecords = parseInt(
        //   phpApiResponse.data.pagination.total_records
        // );
        // const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
          statusCode: 200,
          // perPageDataCount: sortedHistory.length,
          // totalUserHistoryCount: totalRecords,
          // total_pages: totalPages,
          message: "Data retrieved successfully from PHP API",
          history: history,
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Error in retrieving data from PHP API",
        });
      }
    } else {
      res.status(402).json({
        statusCode: 402,
        message: "Error in fetching Authorization data",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// Use in Application
router.post("/withrawal/otp", async (req, res) => {
  try {
    const { mobileNumber, amount } = req.body;

    // Fetch user details from the Register collection
    const user = await Register.findOne({ mobileNumber });

    if (!user) {
      return res.json({ statusCode: 403, message: "User doesn't exist" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    const nameAndOtp = user.fullName + ", Your " + otp;

    // Make a separate request to the PHP API to get green_wallet
    try {
      const dynamicAuthorization = await getAuthorization();

      if (dynamicAuthorization) {
        const axiosInstance = axios.create({
          headers: {
            Authorization: dynamicAuthorization,
          },
        });

        const phpApiUrl = `https://kubertree.com/MLM/MLM/get_user_all_details_pass.php?number=${mobileNumber}`;
        console.log(phpApiUrl, "phpApiUrl");
        const phpApiResponse = await axiosInstance.get(phpApiUrl);
        const greenWallet = phpApiResponse.data.details.green_wallet;

        // Save OTP and other details to user document
        user.withdrawalOtp = otp;
        await user.save();

        // Send SMS
        // const apiUrl = `http://193.46.243.10/app/smsapi/index.php?key=46538AFE27083E&campaign=13444&routeid=3&type=text&contacts=${user.mobileNumber}&senderid=BRAPRO&msg=%20Dear%20${nameAndOtp}%20OTP%20For%20withrawal%20amount%20of%20${amount}%20from%20Branding%20Profitable%20wallet%20is%20${greenWallet}%20Please%20do%20not%20share%20this%20OTP%20with%20anyone%20for%20your%20account%20safety.&template_id=1707170168902255537&pe_id=1701169787222711884`;
        const apiUrl = `http://193.46.243.10/app/smsapi/index.php?key=46538AFE27083E&campaign=13444&routeid=3&type=text&contacts=${user.mobileNumber}&senderid=BRAPRO&msg=Dear%20${nameAndOtp}%20OTP%20For%20withrawal%20amount%20of%20${amount}%20from%20Branding%20Profitable%20wallet%20is%20${greenWallet}%20Please%20do%20not%20share%20this%20OTP%20with%20anyone%20for%20your%20account%20safety.&template_id=1707170168902255537&pe_id=1701169787222711884`;

        const apiUrlWithParams = encodeURI(apiUrl);

        const response = await axios.get(apiUrlWithParams);

        res.json({
          statusCode: 200,
          message: "OTP sent successfully",
          response: response.data,
        });
      } else {
        res.status(402).json({
          statusCode: 402,
          message: "Error in fetching Authorization data",
        });
      }
    } catch (error) {
      res.json({
        statusCode: 500,
        message: "Error fetching green_wallet or sending OTP",
      });
    }
  } catch (error) {
    res.json({ statusCode: 500, message: error.message });
  }
});

router.post("/withrawal_otp/verify", async (req, res) => {
  try {
    const user = await Register.findOne({
      mobileNumber: req.body.mobileNumber,
      withdrawalOtp: req.body.withdrawalOtp,
    });

    if (!user) {
      return res.json({
        statusCode: 201,
        message: "OTP is incorrect",
      });
    }
    res.json({
      statusCode: 200,
      message: "Otp Verify",
    });
  } catch (error) {
    res.json({ statusCode: 500, message: error.message });
  }
});

// router.get("/payment_check", async (req, res) => {
//   try {
//     var data = await MlmRegister.find();
//     res.json({
//       data: data,
//       statusCode: 200,
//       message: "Read All Mlm Registers",
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.get("/payment_check", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if
    var pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

    var data = await MlmRegister.aggregate([
      { $match: { status: "Pending" } },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    var count = await MlmRegister.countDocuments({ status: "Pending" });

    // Optionally reverse the data array
    data.reverse();

    res.json({
      statusCode: 200,
      data: data,
      MlmPendingCount: count,
      message: "Read All Mlm Pending History",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/payment_reject", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided
    var pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provideds

    var data = await MlmRegister.aggregate([
      { $match: { status: "Reject" } },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    var count = await MlmRegister.countDocuments({ status: "Reject" });

    // Optionally reverse the data array
    data.reverse();

    res.json({
      statusCode: 200,
      data: data,
      MlmRejectCount: count,
      message: "Read All Mlm Reject History",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/payment_complete", async (req, res) => {
  try {
    var pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided
    var pageNumber = parseInt(req.query.pageNumber) || 0; // Default to 0 if not provided

    var data = await MlmRegister.aggregate([
      { $match: { status: "Complete" } },
      {
        $skip: pageSize * pageNumber,
      },
      {
        $limit: pageSize,
      },
    ]);

    var count = await MlmRegister.countDocuments({ status: "Complete" });

    // Optionally reverse the data array
    data.reverse();

    res.json({
      statusCode: 200,
      data: data,
      MlmCompleteCount: count,
      message: "Read All Mlm Reject History",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/payment_complete/search", async (req, res) => {
  try {
    // Convert req.body.search to a string
    const searchString = req.body.search.toString();

    let query = {};

    if (!isNaN(searchString)) {
      query.$or = [
        { mobileNumber: searchString },
        { referredBy: searchString },
        { treeId: searchString },
      ];
    } else {
      query.$or = [
        { fullName: { $regex: searchString, $options: "i" } },
        // { referredBy: { $regex: searchString, $options: "i" } },
        // { treeId: { $regex: searchString, $options: "i" } },
        { side: { $regex: searchString, $options: "i" } },
      ];
    }

    // Add the condition to filter by status: "Complete"
    query.status = { $in: ["Complete"] };

    var data = await MlmRegister.find(query);

    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,
      message: "Read All Complete-Payment",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/payment_reject/search", async (req, res) => {
  try {
    // Convert req.body.search to a string
    const searchString = req.body.search.toString();

    let query = {};

    if (!isNaN(searchString)) {
      query.$or = [
        { mobileNumber: searchString },
        { referredBy: searchString },
        { treeId: searchString },
      ];
    } else {
      query.$or = [
        { fullName: { $regex: searchString, $options: "i" } },
        // { referredBy: { $regex: searchString, $options: "i" } },
        // { treeId: { $regex: searchString, $options: "i" } },
        { side: { $regex: searchString, $options: "i" } },
      ];
    }

    // Add the condition to filter by status: "Complete"
    query.status = { $in: ["Reject"] };

    var data = await MlmRegister.find(query);

    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,
      message: "Read All Reject-Payment",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/payment_pending/search", async (req, res) => {
  try {
    // Convert req.body.search to a string
    const searchString = req.body.search.toString();

    let query = {};

    if (!isNaN(searchString)) {
      query.$or = [
        { mobileNumber: searchString },
        { referredBy: searchString },
        { treeId: searchString },
      ];
    } else {
      query.$or = [
        { fullName: { $regex: searchString, $options: "i" } },
        // { referredBy: { $regex: searchString, $options: "i" } },
        // { treeId: { $regex: searchString, $options: "i" } },
        { side: { $regex: searchString, $options: "i" } },
      ];
    }

    // Add the condition to filter by status: "Complete"
    query.status = { $in: ["Pending"] };

    var data = await MlmRegister.find(query);

    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,
      message: "Read All Reject-Payment",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// -----------------------------------------------------------------
// async function registerUser(userData) {
//   try {
//     const dynamicAuthorization = await getAuthorization();

//     if (!dynamicAuthorization) {
//       return {
//         statusCode: 500,
//         message: "Error in fetching Authorization data",
//       };
//     }

//     const axiosInstance = axios.create({
//       headers: {
//         Authorization: dynamicAuthorization,
//       },
//     });

//     const { fullName, mobileNumber, referredBy, treeId, side } = userData;

//     const phpApiUrl = `https://kubertree.com/MLM/MLM/register.php?number=${mobileNumber}&reference=${referredBy}&parent_id=${treeId}&side=${side}&fullname=${fullName}`;
//     const phpApiResponse = await axiosInstance.get(phpApiUrl);

//     const responseData = handleRegistrationResponse(phpApiResponse.data);

//     return responseData;
//   } catch (error) {
//     return {
//       statusCode: 500,
//       message: error.message || "Error in registration process",
//     };
//   }
// }

// function handleRegistrationResponse(apiResponse) {
//   const statusCode = parseInt(apiResponse.http_response_code);

//   switch (statusCode) {
//     case 201:
//       return { statusCode: 201, message: "Left side is already full. Please try the right side." };
//     case 202:
//       return { statusCode: 202, message: "Right side is already full. Please try the left side." };
//     case 203:
//       return { statusCode: 203, message: "Invalid referral code!" };
//     case 204:
//       return { statusCode: 204, message: "Parent user not found!" };
//     case 205:
//       return { statusCode: 205, message: "You are Already Registered!" };
//     default:
//       return { statusCode: 200, message: "User Register Successfully" };
//   }
// }

// router.put("/payment_check/:id", async (req, res) => {
//   try {
//     const { status, deniedReason } = req.body;
//     console.log("Received Data:", req.body);

//     if (status === "Complete" || status === "Reject") {
//       const registrationResponse = await registerUser(req.body);

//       if (registrationResponse.statusCode === 200) {
//         const updateData = {
//           $set: { "status.0": status },
//         };

//         if (status === "Reject" && deniedReason) {
//           updateData.$push = { deniedReason: deniedReason };
//         }

//         await MlmRegister.findByIdAndUpdate(req.params.id, updateData);

//         res.status(200).json({
//           statusCode: 200,
//           message: "Status Updated and User Registered Successfully",
//         });
//       } else {
//         res.status(registrationResponse.statusCode).json(registrationResponse);
//       }
//     } else {
//       res.status(400).json({
//         statusCode: 400,
//         message: "Invalid status provided",
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       statusCode: 500,
//       message: err.message,
//     });
//   }
// });

router.put("/payment_check/:mobileNumber", async (req, res) => {
  try {
    const { status, deniedReason } = req.body;
    const mobileNumberx = req.params.mobileNumber; // Fetch mobile number from the route parameter

    if (status === "Complete") {
      const user = await MlmRegister.find({ number: mobileNumberx });
      const filteredUser = user.find(
        (userData) => userData.mobileNumber == mobileNumberx
      );

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: "User not found with the provided mobile number",
        });
      }

      const userDataForRegistration = {
        fullName: filteredUser.fullName,
        mobileNumber: filteredUser.mobileNumber,
        referredBy: filteredUser.referredBy,
        treeId: filteredUser.treeId,
        side: filteredUser.side,
      };

      const registrationResponse = await registerUser(userDataForRegistration);
      if (registrationResponse.statusCode === 200) {
        const updateData = {
          $set: { status: "Complete" },
        };

        if (status === "Reject" && deniedReason) {
          updateData.$push = { deniedReason: deniedReason };
        }

        const updateStatus = await MlmRegister.find();
        const filteredUser = updateStatus.find(
          (userData) => userData.mobileNumber == mobileNumberx
        );
        await MlmRegister.findByIdAndUpdate(filteredUser._id, updateData);

        res.status(200).json({
          statusCode: 200,
          message: "Status Updated and User Registered Successfully",
        });
      } else {
        res.status(registrationResponse.statusCode).json(registrationResponse);
      }
    } else if (status === "Reject") {
      const user = await MlmRegister.find({ number: mobileNumberx });
      const updateData = {
        $set: { status: "Reject" },
      };

      if (status === "Reject" && deniedReason) {
        updateData.$push = { deniedReason: deniedReason };
      }

      const updateStatus = await MlmRegister.find();
      const filteredUser = updateStatus.find(
        (userData) => userData.mobileNumber == mobileNumberx
      );
      await MlmRegister.findByIdAndUpdate(filteredUser._id, updateData);

      res.status(200).json({
        statusCode: 200,
        message: "User Reject Successfully",
      });
    } else {
      res.status(400).json({
        statusCode: 400,
        message: "Invalid status provided",
      });
    }
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
});

async function registerUser(userData, status, deniedReason) {
  try {
    const dynamicAuthorization = await getAuthorization();

    if (!dynamicAuthorization) {
      return {
        statusCode: 500,
        message: "Error in fetching Authorization data",
      };
    }

    const axiosInstance = axios.create({
      headers: {
        Authorization: dynamicAuthorization,
      },
    });

    const { fullName, mobileNumber, referredBy, treeId, side } = userData;

    const phpApiUrl = `https://kubertree.com/MLM/MLM/register.php?number=${mobileNumber}&reference=${referredBy}&parent_id=${treeId}&side=${side}&fullname=${fullName}`;
    const phpApiResponse = await axiosInstance.get(phpApiUrl);

    const responseData = handleRegistrationResponse(phpApiResponse.data);

    return responseData;
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message || "Error in registration process",
    };
  }
}

function handleRegistrationResponse(apiResponse) {
  const statusCode = parseInt(apiResponse.http_response_code);

  switch (statusCode) {
    case 201:
      return {
        statusCode: 201,
        message: "Left side is already full. Please try the right side.",
      };
    case 202:
      return {
        statusCode: 202,
        message: "Right side is already full. Please try the left side.",
      };
    case 203:
      return { statusCode: 203, message: "Invalid referral code!" };
    case 204:
      return { statusCode: 204, message: "Parent user not found!" };
    case 205:
      return { statusCode: 205, message: "You are Already Registered!" };
    default:
      return { statusCode: 200, message: "User Register Successfully" };
  }
}

// router.post("/mlm_register", async (req, res) => {
//   try {
//     var data = await MlmRegister.create(req.body);
//     res.json({
//       statusCode: 200,
//       data: data,
//       message: "Request Send Successfully For MLM Register ",
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.post("/mlm_register", async (req, res) => {
  try {
    const { mobileNumber, status, fullName, referredBy, treeId, side, image } =
      req.body;
    const parsedMobileNumber = parseInt(mobileNumber); // Convert the string to an integer

    const existingRecord = await MlmRegister.findOne({
      mobileNumber: parsedMobileNumber,
    });

    if (existingRecord) {
      if (existingRecord.status.includes("Reject")) {
        // If a record with the provided mobileNumber and status "Reject" exists, update status to "Pending"
        const updatedRecord = await MlmRegister.findOneAndUpdate(
          { mobileNumber: parsedMobileNumber, status: "Reject" },
          {
            $set: {
              status: "Pending",
              fullName,
              referredBy,
              treeId,
              side,
              image,
            },
          },
          { new: true }
        );

        res.json({
          statusCode: 200,
          data: updatedRecord,
          message: "Existing Record Updated from Reject to Pending",
        });
      } else {
        // If the record exists but the status is not "Reject", return a message
        res.json({
          statusCode: 200,
          message: "Record Exists with Status other than Reject",
        });
      }
    } else {
      // If the record does not exist, create a new record
      const newRecord = await MlmRegister.create({
        mobileNumber: parsedMobileNumber,
        status,
        fullName,
        referredBy,
        treeId,
        side,
        image,
      });

      res.json({
        statusCode: 200,
        data: newRecord,
        message: "New Record Created",
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

module.exports = router;
