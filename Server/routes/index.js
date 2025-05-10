var express = require("express");
var router = express.Router();
var TodayAndTomorrow = require("../modals/TodayAndTomorrow");
var TodayAndTomorrowCategory = require("../modals/TodayAndTomorrow_Category");
var CDS_Category = require("../modals/CDS_Category");
var CDS_CustomeDynamicSection = require("../modals/CDS_CustomeDynamicSection");
var DynamicSection_Item = require("../modals/DynamicSection_Data");
var DynamicSection_Title = require("../modals/DynamicSection_Title");
var AddBusinessType = require("../modals/MyBusiness_AddBusinessType");
var MyBusiness = require("../modals/MyBusiness");
var TrendingAndNews_Category = require("../modals/TrendingAndNews_Category");
var TrendingAndNews_Data = require("../modals/TrendingAndNews_Data");
var UserRegister = require("../modals/User_Register");
var AddDefaultDaysForCategory = require("../modals/AddDefaultDaysForCategory");
var MlmRegister = require("../modals/MlmRegister");
const nodemailer = require("nodemailer");

var CompanyWallet = require("../modals/CompanyWallet");

const MongoClient = require("mongodb").MongoClient;
const archiver = require("archiver");
const dbName = "Branding-Profitable-kuber"; // Replace with your database name
const url =
  "mongodb+srv://brandingprofitable:CinnSsjx3sY4ftS2@brandingprofitable.25jye.mongodb.net"; // Replace with your MongoDB connection string
const client = new MongoClient(url, { useUnifiedTopology: true });
/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/abc", async (req, res) => {
  try {
    res.json({
      statusCode: 200,
      message: "Ok",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/downloadCollections", async (req, res) => {
  try {
    // Connect to MongoDB
    console.log("start");
    await client.connect();
    const db = client.db(dbName);

    // Fetch all collections in the database
    const collections = await db.listCollections().toArray();

    // Create a zip file
    const zip = archiver("zip");

    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=collections.zip"
    );
    res.setHeader("Content-Type", "application/zip");

    // Pipe the zip file to the response
    zip.pipe(res);

    // Process each collection
    for (const collection of collections) {
      const collectionName = collection.name;

      // Fetch data from the current collection
      const collectionData = await db
        .collection(collectionName)
        .find({})
        .toArray();

      // Modify the _id field in each document
      const modifiedData = collectionData.map((item) => {
        const modifiedItem = { ...item };
        if (item._id && typeof item._id === "object" && item._id.$oid) {
          modifiedItem._id = { $oid: item._id.$oid };
        }
        return modifiedItem;
      });

      // Convert data to JSON string
      const jsonData = JSON.stringify(modifiedData, null, 2);

      // Append the JSON data to the zip file
      zip.append(jsonData, { name: `${dbName}.${collectionName}.json` });
    }

    // Finalize the zip file
    zip.finalize();
  } catch (error) {
    console.error("Error fetching collections data:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

router.get("/treeview/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const userData = await MlmRegister.findOne({ mobileNumber }).lean();

    if (!userData) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    async function populateChildren(userId) {
      const children = [];
      const userData = await MlmRegister.findOne({ _id: userId }).lean();

      if (userData?.leftUser) {
        const leftChild = await MlmRegister.findOne({
          _id: userData.leftUser,
        }).lean();
        const leftChildNode = {
          name: leftChild?.fullName,
          referralId: leftChild?.referralCode,
          treeId: leftChild?.treeId,
          side: "left",
          redWallet: leftChild?.redWallet,
          greenWallet: leftChild?.greenWallet,
          children: await populateChildren(leftChild?._id),
        };
        children.push(leftChildNode);
      }

      if (userData?.rightUser) {
        const rightChild = await MlmRegister.findOne({
          _id: userData.rightUser,
        }).lean();
        const rightChildNode = {
          name: rightChild?.fullName,
          referralId: rightChild?.referralCode,
          treeId: rightChild?.treeId,
          side: "right",
          redWallet: rightChild?.redWallet,
          greenWallet: rightChild?.greenWallet,
          children: await populateChildren(rightChild?._id),
        };
        children.push(rightChildNode);
      }

      return children;
    }

    const mainData = {
      statusCode: 200,
      name: userData?.fullName,
      referralId: userData?.referralCode,
      treeId: userData?.treeId,
      redWallet: userData?.redWallet,
      greenWallet: userData?.greenWallet,
      children: await populateChildren(userData?._id),
    };

    res.json(mainData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// router.get("/", function (req, res, next) {
//   res.json({ title: "compliant server is online" });
// });

// Search Category and show All Category and Item (Aplication)
// router.get("/search/:query", async (req, res) => {
//   const { query } = req.params; // Access the 'query' parameter from the URL

//   try {
//     // Search in the first collection (TodayAndTomorrowCategory)
//     const results1 = await TodayAndTomorrowCategory.find({
//       categoryName: { $regex: query, $options: "i" },
//     });

//     // Search in the second collection (TodayAndTomorrow)
//     const results2 = await TodayAndTomorrow.find({
//       categoryName: { $regex: query, $options: "i" },
//     });
//     // const results3 = await CDS_Category.find({
//     //   cds_categoryName: { $regex: query, $options: "i" },
//     // });
//     // const results4 = await CDS_CustomeDynamicSection.find({
//     //   cds_categoryName: { $regex: query, $options: "i" },
//     // });
//     // const results5 = await DynamicSection_Title.find({
//     //   ds_category: { $regex: query, $options: "i" },
//     // });
//     const results6 = await DynamicSection_Item.find({
//       ds_category: { $regex: query, $options: "i" },
//     });
//     // const results7 = await AddBusinessType.find({
//     //   businessTypeName: { $regex: query, $options: "i" },
//     // });
//     // const results8 = await MyBusiness.find({
//     //   businessTypeName: { $regex: query, $options: "i" },
//     // });
//     const results9 = await TrendingAndNews_Category.find({
//       trendingAndNews_CategoryName: { $regex: query, $options: "i" },
//     });
//     const results10 = await TrendingAndNews_Data.find({
//       categoryName: { $regex: query, $options: "i" },
//     });

//     // Add 'isCategory' field with value 'true' to each result from TodayAndTomorrowCategory
//     const results1WithIsCategory = results1.map((item) => ({
//       ...item.toObject(),
//     }));

//     // Add 'isCategory' field with value 'false' to each result from TodayAndTomorrow
//     const results2WithIsCategory = results2.map((item) => ({
//       ...item.toObject(),
//       isCategory: false,
//       image: item.todayAndTomorrowImageOrVideo, // Rename todayAndTomorrowImageOrVideo to image
//     }));

//     // const results3WithIsCategory = results3.map((item) => ({
//     //   ...item.toObject(),
//     //   isCategory: true,
//     //   image: item.cds_image,
//     // }));

//     // Canva Image
//     // const results4WithIsCategory = results4.map((item) => ({
//     //   ...item.toObject(),
//     //   isCategory: false,
//     // }));
//     // const results5WithIsCategory = results5.map((item) => ({
//     //   ...item.toObject(),
//     //   isCategory: true,
//     // }));

//     const results6WithIsCategory = results6.map((item) => ({
//       ...item.toObject(),
//       image: item.ds_itemImage,
//       categoryName: item.ds_category,
//     }));
//     // const results7WithIsCategory = results7.map((item) => ({
//     //   ...item.toObject(),
//     //   isCategory: true,
//     //   image: item.businessTypeImage,
//     // }));
//     // const results8WithIsCategory = results8.map((item) => ({
//     //   ...item.toObject(),
//     //   isCategory: false,
//     //   image: item.myBusinessImageOrVideo,
//     // }));

//     const results9WithIsCategory = results9.map((item) => ({
//       ...item.toObject(),
//       isCategory: true,
//       image: item.trendingAndNews_CategoryImage,
//       categoryName: item.trendingAndNews_CategoryName,
//     }));
//     const results10WithIsCategory = results10.map((item) => ({
//       ...item.toObject(),
//       isCategory: false,
//       image: item.todayAndTomorrowImageOrVideo,
//     }));

//     // Combine the results from both collections into a single array
//     const combinedResults = [
//       ...results1WithIsCategory,
//       ...results2WithIsCategory,
//       // ...results3WithIsCategory,
//       // ...results4WithIsCategory,
//       // ...results5WithIsCategory,
//       ...results6WithIsCategory,
//       // ...results7WithIsCategory,
//       // ...results8WithIsCategory,
//       ...results9WithIsCategory,
//       ...results10WithIsCategory,
//     ];

//     res.json(combinedResults);
//   } catch (error) {
//     console.log(error); // Log the specific error to the console for debugging
//     res
//       .status(500)
//       .json({ error: "An error occurred while searching for items." });
//   }
// });

router.get("/search/:query", async (req, res) => {
  const { query } = req.params; // Access the 'query' parameter from the URL

  try {
    // Fetch general day settings
    const generalDay = await AddDefaultDaysForCategory.findOne(
      {},
      "showCategoryDays"
    );
    const iGeneralDays = generalDay.get("showCategoryDays");

    const results1 = await TodayAndTomorrowCategory.find({
      categoryName: { $regex: query, $options: "i" },
    });

    const results2 = await TodayAndTomorrow.find({
      categoryName: { $regex: query, $options: "i" },
    });

    const results6 = await DynamicSection_Item.find({
      ds_category: { $regex: query, $options: "i" },
    });

    const results9 = await TrendingAndNews_Category.find({
      trendingAndNews_CategoryName: { $regex: query, $options: "i" },
    });

    const results10 = await TrendingAndNews_Data.find({
      categoryName: { $regex: query, $options: "i" },
    });

    const results1WithIsCategory = results1.map((item) => ({
      ...item.toObject(),
    }));

    const results2WithIsCategory = results2.map((item) => ({
      ...item.toObject(),
      isCategory: false,
      image: item.todayAndTomorrowImageOrVideo,
    }));

    const results6WithIsCategory = results6.map((item) => ({
      ...item.toObject(),
      image: item.ds_itemImage,
      categoryName: item.ds_category,
    }));

    const results9WithIsCategory = results9.map((item) => ({
      ...item.toObject(),
      isCategory: true,
      image: item.trendingAndNews_CategoryImage,
      categoryName: item.trendingAndNews_CategoryName,
    }));

    const results10WithIsCategory = results10.map((item) => ({
      ...item.toObject(),
      isCategory: false,
      image: item.todayAndTomorrowImageOrVideo,
    }));

    // Filter results based on general day settings
    const currentDate = new Date();
    const outputresult = [];

    const filterResultsByDate = (data) => {
      data.forEach((element) => {
        const imageDate = new Date(element.imageDate);
        const startOfImageDate = new Date(
          imageDate.getFullYear(),
          imageDate.getMonth(),
          imageDate.getDate()
        );
        const startOfNextDay = new Date(imageDate);
        startOfNextDay.setDate(imageDate.getDate() + 1);

        if (
          element.showCategoryDaysSwitch &&
          element.showCategoryToDays !== null
        ) {
          const daysDifference = element.showCategoryToDays;
          const dStartDate = new Date(imageDate);
          dStartDate.setDate(imageDate.getDate() - daysDifference);

          if (currentDate >= dStartDate && currentDate < startOfNextDay) {
            outputresult.push(element);
          }
        } else {
          const dStartDate = new Date(imageDate);
          dStartDate.setDate(imageDate.getDate() - iGeneralDays);

          if (currentDate >= dStartDate && currentDate < startOfNextDay) {
            outputresult.push(element);
          }
        }
      });
    };

    filterResultsByDate(results1WithIsCategory);
    // filterResultsByDate(results2WithIsCategory);
    // filterResultsByDate(results6WithIsCategory);
    // filterResultsByDate(results9WithIsCategory);
    // filterResultsByDate(results10WithIsCategory);

    // Combine the results from all collections into a single array
    const combinedResults = [
      ...outputresult,
      ...results2WithIsCategory,
      ...results6WithIsCategory,
      ...results9WithIsCategory,
      ...results10WithIsCategory,
    ];

    res.json(combinedResults);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for items." });
  }
});

// Search Category and show All Item (Aplication)
router.get("/category/:query", async (req, res) => {
  const { query } = req.params; // Access the 'query' parameter from the URL

  try {
    // Search in the second collection (TodayAndTomorrow)
    const category2 = await TodayAndTomorrow.find({
      categoryName: { $regex: query, $options: "i" },
    });

    const category6 = await DynamicSection_Item.find({
      ds_category: { $regex: query, $options: "i" },
    });

    const category8 = await MyBusiness.find({
      businessTypeName: { $regex: query, $options: "i" },
    });

    const category10 = await TrendingAndNews_Data.find({
      categoryName: { $regex: query, $options: "i" },
    });

    // Add 'isCategory' field with value 'false' to each result from TodayAndTomorrow
    const results2WithIsCategory = category2.map((item) => ({
      ...item.toObject(),
      image: item.todayAndTomorrowImageOrVideo, // Rename todayAndTomorrowImageOrVideo to image
    }));

    const results6WithIsCategory = category6.map((item) => ({
      ...item.toObject(),
      image: item.ds_itemImage,
    }));

    const results8WithIsCategory = category8.map((item) => ({
      ...item.toObject(),
      image: item.myBusinessImageOrVideo,
    }));

    const results10WithIsCategory = category10.map((item) => ({
      ...item.toObject(),
      image: item.todayAndTomorrowImageOrVideo,
    }));

    // Combine the results from both collections into a single array
    const combinedResults = [
      ...results2WithIsCategory,
      ...results6WithIsCategory,
      ...results8WithIsCategory,
      ...results10WithIsCategory,
    ];

    res.json(combinedResults);
  } catch (error) {
    console.log(error); // Log the specific error to the console for debugging
    res
      .status(500)
      .json({ error: "An error occurred while searching for items." });
  }
});

// Premium Purchase or not (For Application)
router.get("/premium/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;

    const data = await UserRegister.findOne({ mobileNumber });

    if (!data) {
      return res.status(203).json({
        statusCode: 203,
        message: "Data not found",
      });
    }

    let statusCode, message;

    if (data.isPayment === true) {
      statusCode = 200;
      message = "Your Subscription has been purchased";
    } else {
      statusCode = 202;
      message = "Payment not made";
    }

    res.status(statusCode).json({
      statusCode,
      message,
      // data,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// router.get("/searchdataarray", async (req, res) => {
//   try {
//     const categories = await TodayAndTomorrowCategory.find().select({
//       _id: 0,
//       categoryName: 1,
//     });

//     const categoryNames = categories.map((category) => category.categoryName);
//     const categoryCount = categoryNames.length;

//     res.json({
//       data: {
//         categoryCount,
//         categories: categoryNames,
//       },
//       statusCode: 200,
//       message: "Read All Language",
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

// router.get("/searchdataarray", async (req, res) => {
//   try {
//     const generalDay = await AddDefaultDaysForCategory.findOne(
//       {},
//       "showCategoryDays"
//     );
//     const iGeneralDays = generalDay.get("showCategoryDays");

//     const data = await TodayAndTomorrowCategory.find();

//     // Sort data based on imageDate in ascending order
//     data.sort((a, b) => {
//       const dateA = new Date(a.imageDate);
//       const dateB = new Date(b.imageDate);
//       return dateA - dateB;
//     });

//     const outputresult = [];

//     const currentDate = new Date(); // Current date

//     data.forEach((element) => {
//       const imageDate = new Date(element.imageDate);
//       const startOfImageDate = new Date(
//         imageDate.getFullYear(),
//         imageDate.getMonth(),
//         imageDate.getDate()
//       );
//       const startOfNextDay = new Date(imageDate);
//       startOfNextDay.setDate(imageDate.getDate() + 1);

//       if (
//         element.showCategoryDaysSwitch &&
//         element.showCategoryToDays !== null
//       ) {
//         const daysDifference = element.showCategoryToDays;
//         const dStartDate = new Date(imageDate);
//         dStartDate.setDate(imageDate.getDate() - daysDifference);

//         if (currentDate >= dStartDate && currentDate < startOfNextDay) {
//           outputresult.push(element);
//         }
//       } else {
//         const dStartDate = new Date(imageDate);
//         dStartDate.setDate(imageDate.getDate() - iGeneralDays);

//         if (currentDate >= dStartDate && currentDate < startOfNextDay) {
//           outputresult.push(element);
//         }
//       }
//     });

//     const categoryNames = outputresult.map((element) => element.categoryName);
//     const categoryCount = categoryNames.length;

//     res.json({
//       statusCode: 200,
//       data: {
//         categoryCount,
//         categories: categoryNames,
//       },
//       message: "Read All Language",
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.get("/searchdataarray", async (req, res) => {
  try {
    const generalDay = await AddDefaultDaysForCategory.findOne(
      {},
      "showCategoryDays"
    );
    const iGeneralDays = generalDay.get("showCategoryDays");

    const data = await TodayAndTomorrowCategory.find();

    // Sort data based on imageDate in ascending order
    data.sort((a, b) => {
      const dateA = new Date(a.imageDate);
      const dateB = new Date(b.imageDate);
      return dateA - dateB;
    });

    const outputresult = [];
    const currentDate = new Date(); // Current date

    data.forEach((element) => {
      const imageDate = new Date(element.imageDate);
      const startOfImageDate = new Date(
        imageDate.getFullYear(),
        imageDate.getMonth(),
        imageDate.getDate()
      );
      const startOfNextDay = new Date(imageDate);
      startOfNextDay.setDate(imageDate.getDate() + 1);

      if (
        element.showCategoryDaysSwitch &&
        element.showCategoryToDays !== null
      ) {
        const daysDifference = element.showCategoryToDays;
        const dStartDate = new Date(imageDate);
        dStartDate.setDate(imageDate.getDate() - daysDifference);

        if (currentDate >= dStartDate && currentDate < startOfNextDay) {
          outputresult.push(element);
        }
      } else {
        const dStartDate = new Date(imageDate);
        dStartDate.setDate(imageDate.getDate() - iGeneralDays);

        if (currentDate >= dStartDate && currentDate < startOfNextDay) {
          outputresult.push(element);
        }
      }
    });

    const categoryNames = outputresult.map((element) => element.categoryName);
    const categoryCount = categoryNames.length;

    // ---------------------TrendingAndNews Category----------------------------------
    const responseData2 = await TrendingAndNews_Category.find({
      trendingAndNews_switch: true,
    });

    // ---------------------Dynamic Section Category----------------------------------
    const responseData3 = await DynamicSection_Title.find({ ds_switch: true });

    // Combine categories from both APIs
    const combinedCategories = [
      ...categoryNames,
      ...responseData2.map((item) => item.trendingAndNews_CategoryName),
      ...responseData3.map((item) => item.ds_category),
    ];

    // Calculate the total category count
    const totalCategoryCount =
      categoryCount + responseData2.length + responseData3.length;

    // Prepare the response object
    const response = {
      statusCode: 200,
      data: {
        categoryCount: totalCategoryCount,
        categories: combinedCategories,
      },
      message: "Read All Category",
    };

    res.json(response);
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

var transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  secure: true,
  port: 465,
  auth: {
    user: "admin@brandingprofitable.com",
    pass: "AApp@00.com@admin",
  },
});

router.post("/mail", async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      username: req.body.username,
      reason: req.body.reason,
    };

    var mailOptions = {
      from: "admin@brandingprofitable.com",
      to: data.email,
      subject: "Account Deletion Request",
      html: `
        Hello ${data.username},<br>
        <br>
        We have received your account deletion request.<br>
        Reason for deletion: ${data.reason}<br>
        <br>
        Our team is now processing the request, and it involves the following steps:<br>
        <ul>
          <li>Verifying the account details.</li>
          <li>Reviewing the requested changes.</li>
          <li>Initiating the account deletion process.</li>
        </ul>
        Please note that this process may take some time, and we will notify you once the account deletion is completed.<br>
        <br>
        Thank you for your understanding and patience.<br>
        <br>
        Best regards,<br>
        Branding Profitable
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          statusCode: 500,
          message: "Error sending email",
          errorDetails: error,
        });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          statusCode: 200,
          message: "Email sent successfully",
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);

    const errorMessage = error.message || "Internal Server Error";

    return res.status(500).json({
      statusCode: 500,
      message: errorMessage,
      errorDetails: error,
    });
  }
});

module.exports = router;
