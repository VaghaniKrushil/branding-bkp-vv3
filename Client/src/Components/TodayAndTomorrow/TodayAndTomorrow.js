import * as React from "react";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import UserSidebar from "../UserSidebar";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import swal from "sweetalert";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { RotatingLines } from "react-loader-spinner";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import Collapse from "@mui/material/Collapse";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import { imagePath } from "../ImageVariableGlobal/ImageVariableGlobal";
import Switch from "@mui/material/Switch";
import { convertLength } from "@mui/material/styles/cssUtils";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Image/Video Name",
  },
  {
    label: "Image/Video",
  },
  {
    label: "Video/Image",
  },
  {
    label: "Language",
  },
  {
    label: "Category Name",
  },

  {
    label: "Date",
  },
];

function Row(props) {
  const { row, handleClick, isItemSelected, labelId, seletedEditData } = props;
  const [open, setOpen] = React.useState(false);
  let cookies = new Cookies();
  let navigate = useNavigate();
  // let navigate = useNavigate();

  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let config = {
        headers: {
          token: cookies.get("token"),
        },
      };
      // auth post method
      let res = await axios.post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/admin/auth",
        { purpose: "validate access" },
        config
      );
      if (res.data.statusCode !== 200) {
        cookies.remove("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  React.useEffect(() => {
    // chackAuth();
  }, [cookies.get("token")]);

  const [accessType, setAccessType] = React.useState(null);

  React.useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setAccessType(decodedToken);
      } catch (error) {
        // Handle error if token decoding fails
        console.error("Failed to decode token:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <React.Fragment>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row._id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.machineTypeId}
        selected={isItemSelected}
      >
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="center" padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>

        {/* <TableCell align="center">{ row + 1}</TableCell> */}
        <TableCell align="center">
          {row.todayAndTomorrowImageOrVideoName}
        </TableCell>
        {/* <TableCell align="center">{row.bannerImage}</TableCell> */}
        {/* <TableCell align="center">
          <img
            src={imagePath + row.todayAndTomorrowImageOrVideo}
            alt={row.todayAndTomorrowImageOrVideo}
            width="50px"
            height="50px"
          />
        </TableCell> */}
        <TableCell align="center">
          {row.isVideo ? (
            <a
              href={imagePath + row.todayAndTomorrowImageOrVideo}
              target="_blank"
            >
              Video
            </a>
          ) : (
            <img
              src={imagePath + row.todayAndTomorrowImageOrVideo}
              alt={row.todayAndTomorrowImageOrVideo}
              width="50px"
              height="50px"
            />
          )}
        </TableCell>

        {/* <TableCell align="center">
          <div>
            <Switch {...label} checked={row.businessTypeSwitch} />
          </div>
        </TableCell> */}

        <TableCell align="center">
          {row.isVideo === true ? "Video" : "Image"}
        </TableCell>

        <TableCell align="center">{row.languageName}</TableCell>
        <TableCell align="center">{row.categoryName}</TableCell>
        <TableCell align="center">{row.updateDate}</TableCell>

        <TableCell align="center">
          <button class="btn btn-default" onClick={() => seletedEditData(row)}>
            <EditIcon />
          </button>
        </TableCell>
      </TableRow>
      <TableRow></TableRow>
    </React.Fragment>
  );
}

export default function TodayAndTomorrow() {
  let navigate = useNavigate();

  const [image, setImage] = useState("");
  const [compImage, setCompImage] = useState(false);
  const [imgLoader, setImgLoader] = useState(false);

  // Single Image Uplode
  const fileData = (file) => {
    setImgLoader(true);
    const dataArray = new FormData();
    dataArray.append("b_video", file);

    const url = "https://cdn.brandingprofitable.com/image_upload.php";

    axios
      .post(url, dataArray, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setImgLoader(false);
        const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
        const copressedImagePath = res?.data?.comp_iamge_path;
        setCompImage(copressedImagePath);
        setImage(imagePath);
      })
      .catch((err) => {
        setImgLoader(false);
        console.log("Error uploading image:", err);
      });
  };

  const [multiImage, setMultiImage] = useState();
  const [multipleCompressedImage, setmultipleCompressedImage] = useState();

  // Multiple Image Uplode
  // const fileDataMultiple = (files) => {
  //   const maxImages = 25;

  //   if (files.length > maxImages) {
  //     swal("", `You can select a maximum of ${maxImages} images.`, "error");
  //     return;
  //   }

  //   setImgLoader(true);

  //   const imagesPath = [];
  //   const compImage = [];
  //   const url = "https://cdn.brandingprofitable.com/image_upload.php/";

  //   const uploadNextImage = (index) => {
  //     if (index >= files.length) {
  //       // All images uploaded
  //       setImgLoader(false);
  //       setMultiImage(imagesPath);
  //       setmultipleCompressedImage(compImage);

  //       return;
  //     }

  //     const file = files[index];
  //     const dataArray = new FormData();
  //     dataArray.append("b_video", file);

  //     axios
  //       .post(url, dataArray, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((res) => {
  //         const imagePath = res?.data?.iamge_path; // Correct the key to "imagePath"
  //         const compImagePath = res?.data?.comp_iamge_path;
  //         imagesPath.push(imagePath);
  //         console.log(imagePath, "imagePath")
  //         compImage.push(compImagePath);
  //         uploadNextImage(index + 1);
  //       })
  //       .catch((err) => {
  //         console.log("Error uploading image:", err);
  //         uploadNextImage(index + 1);
  //       });
  //   };

  //   // Start uploading the first image
  //   uploadNextImage(0);
  // };

  const fileDataMultiple = async (files) => {
    const maxImages = 25;

    if (files.length > maxImages) {
      swal("", `You can select a maximum of ${maxImages} images.`, "error");
      return;
    }

    setImgLoader(true);

    const imagesPath = [];
    const compImage = [];
    const url = "https://cdn.brandingprofitable.com/image_upload.php/";

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      try {
        // Upload the image
        await uploadImage(file, index);

        // Move to the next image
      } catch (error) {
        // Handle the error (e.g., retry or proceed to the next image)
        console.error("Error during image upload:", error);
      }
    }

    // All uploads completed
    setMultiImage(imagesPath);
    setmultipleCompressedImage(compImage);
    setImgLoader(false);

    async function uploadImage(file, index) {
      return new Promise((resolve, reject) => {
        const dataArray = new FormData();
        dataArray.append("b_video", file);

        axios
          .post(url, dataArray, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            const imagePath = res?.data?.iamge_path;
            const compImagePath = res?.data?.comp_iamge_path;
            imagesPath.push(imagePath);
            compImage.push(compImagePath);
            resolve(); // Resolve the promise to indicate successful upload
          })
          .catch((err) => {
            console.log("Error uploading image:", err);
            reject(); // Reject the promise to indicate upload failure
          });
      });
    }
  };

  // Add Timeout
  // const fileDataMultiple = (files) => {
  //   const maxImages = 25;
  //   const uploadDelay = 1000; // Set your desired timeout in milliseconds

  //   if (files.length > maxImages) {
  //     swal("", `You can select a maximum of ${maxImages} images.`, "error");
  //     return;
  //   }

  //   setImgLoader(true);

  //   const imagesPath = [];
  //   const compImage = [];
  //   const url = "https://cdn.brandingprofitable.com/image_upload.php";

  //   const uploadNextImage = (index) => {
  //     if (index >= files.length) {
  //       // All images uploaded
  //       setImgLoader(false);
  //       setMultiImage(imagesPath);
  //       console.log(imagesPath, "imagesPath==============")
  //       setmultipleCompressedImage(compImage);
  //       return;
  //     }

  //     const file = files[index];
  //     const dataArray = new FormData();
  //     dataArray.append("b_video", file);

  //     axios
  //       .post(url, dataArray, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((res) => {
  //         const imagePath = res?.data?.iamge_path; // Correct the key to "imagePath"
  //         const compImagePath = res?.data?.comp_iamge_path;
  //         imagesPath.push(imagePath);
  //         console.log(imagePath, "imagePath");
  //         compImage.push(compImagePath);

  //         // Continue with the next image after the specified delay
  //         setTimeout(() => {
  //           uploadNextImage(index + 1);
  //         }, uploadDelay);
  //       })
  //       .catch((err) => {
  //         console.log("Error uploading image:", err);

  //         // Continue with the next image after the specified delay
  //         setTimeout(() => {
  //           uploadNextImage(index + 1);
  //         }, uploadDelay);
  //       });
  //   };

  //   // Start uploading the first image
  //   uploadNextImage(0);
  // };

  // Add for loop and delay 10 second
  // const fileDataMultiple = (files) => {
  //   const maxImages = 25;
  //   const maxRetries = 3;

  //   if (files.length > maxImages) {
  //     swal("", `You can select a maximum of ${maxImages} images.`, "error");
  //     return;
  //   }

  //   setImgLoader(true);

  //   const imagesPath = [];
  //   const compImage = [];
  //   const url = "https://cdn.brandingprofitable.com/image_upload.php";

  //   const uploadImageWithRetry = async (file, retryCount = 0) => {
  //     try {
  //       const dataArray = new FormData();
  //       dataArray.append("b_video", file);

  //       const res = await axios.post(url, dataArray, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });

  //       console.log("Response:", res);

  //       if (res.data && res.data.iamge_path && res.data.comp_iamge_path) {
  //         const imagePath = res.data.iamge_path;
  //         const compImagePath = res.data.comp_iamge_path;
  //         imagesPath.push(imagePath);
  //         console.log(imagePath, "imagePath");
  //         compImage.push(compImagePath);
  //       } else {
  //         console.log("Invalid response format:", res.data);
  //       }
  //     } catch (err) {
  //       console.error("Error uploading video:", err);

  //       // Retry if the maximum retry count is not reached
  //       if (retryCount < maxRetries) {
  //         console.log(`Retrying upload (${retryCount + 1}/${maxRetries})...`);
  //         await new Promise((resolve) => setTimeout(resolve, 10000)); // Increase to 10 seconds
  //         await uploadImageWithRetry(file, retryCount + 1);
  //       } else {
  //         console.error("Maximum retries reached. Upload failed.");
  //       }
  //     }
  //   };

  //   const uploadImages = async () => {
  //     for (let index = 0; index < files.length; index++) {
  //       const file = files[index];

  //       await uploadImageWithRetry(file);

  //       // Continue with the next image without a delay
  //     }

  //     // All images uploaded
  //     setImgLoader(false);
  //     setMultiImage(imagesPath);
  //     console.log(imagesPath, "imagesPath==============");
  //     setmultipleCompressedImage(compImage);
  //   };

  //   // Start uploading images
  //   uploadImages();
  // };

  //   let [getCategoryData, setGetCategoryData] = useState([]);
  let [todayAndTommorow, setTodayAndTommorow] = useState([]);
  const [totalImage, setTotalImage] = useState();
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  let getData = async () => {
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/get_today_tomorrow",
      {
        pageSize: rowsPerPage,
        pageNumber: page,
      }
    );
    setLoader(false);
    setTodayAndTommorow(res.data.data);
    setTotalImage(res.data.TodayAndTommorowDataCount);
    setCountData(res.data.TodayAndTommorowDataCount);
  };

  React.useEffect(() => {
    getData();
  }, [rowsPerPage, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = todayAndTommorow.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Delete selected
  var handleDelete = () => {
    swal("Are You Sure You Want To Delete ?", {
      buttons: ["No", "Yes"],
    }).then(async (buttons) => {
      if (buttons === true) {
        axios
          .post(
            "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/delete_today_tomorrow",
            selected
          )
          .then((response) => {
            if (response.data.statusCode === 200) {
              getData();
              setSelected([]);
              swal("", response.data.message, "success");
            }
          });
      }
    });
  };

  // Searchbar
  let handleSearchData = async (values) => {
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/search_today_tomorrow",
      {
        search: values,
      }
    );
    if (res.data.statusCode === 200) {
      if (values !== "") {
        setTodayAndTommorow(res.data.data);
      } else {
        getData();
      }
    }
  };

  //  var handleSubmitMultiImage = async (values) => {
  //     values["todayAndTomorrowImageOrVideo"] = multiImage;
  //     const imageUrls = Array.isArray(values.todayAndTomorrowImageOrVideo)
  //       ? values.todayAndTomorrowImageOrVideo
  //       : [values.todayAndTomorrowImageOrVideo];

  //     for (const imageUrl of imageUrls) {
  //       const dataToSend = {
  //         todayAndTomorrowImageOrVideoName:
  //           values.todayAndTomorrowImageOrVideoName,
  //         categoryName: values.categoryName,
  //         todayAndTomorrowImageOrVideo: imageUrl,
  //         isVideo: false, // Update this as needed
  //         languageName: values.languageName,
  //       };

  //       try {
  //         const res = await axios.post(
  //           "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/today_tomorrow",
  //           dataToSend
  //         );

  //         if (res.data.statusCode === 200) {
  //           swal("", res.data.message, "success");
  //         } else {
  //           swal("", res.data.message, "error");
  //         }
  //       } catch (error) {
  //         console.error("Error:", error);
  //         swal("Error", "An error occurred while saving data.", "error");
  //       }
  //     }

  //     setModalShowForPopupForm(false);
  //     getData();
  //   };

  //   edit machine-type here

  var handleSubmitMultiImage = async (values) => {
    values["todayAndTomorrowImageOrVideo"] = multiImage;
    values["comp_iamge"] = multipleCompressedImage;
    values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
    values["createTime"] = moment(new Date()).format("HH:mm:ss");
    values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
    const imageUrls = Array.isArray(values.todayAndTomorrowImageOrVideo)
      ? values.todayAndTomorrowImageOrVideo
      : [values.todayAndTomorrowImageOrVideo];

    const imageUrlsCompresse = Array.isArray(values.comp_iamge)
      ? values.comp_iamge
      : [values.comp_iamge];
    let successShown = false;
    for (let i = 0; i < imageUrls.length; i++) {
      const dataToSend = {
        todayAndTomorrowImageOrVideoName:
          values.todayAndTomorrowImageOrVideoName,
        categoryName: values.categoryName,
        todayAndTomorrowImageOrVideo: imageUrls[i], // Store only the filename
        comp_iamge: imageUrlsCompresse[i],
        // todayAndTomorrowImageOrVideo: filename, // Store only the filename
        // isVideo: false, // Update this as needed
        isVideo: values.isVideo,
        languageName: values.languageName,
        createDate: values.createDate,
        createTime: values.createTime,
        updateDate: values.updateDate,
      };

      try {
        dataToSend["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
        dataToSend["createDate"] = moment(new Date()).format("DD-MM-YYYY");
        dataToSend["createTime"] = moment(new Date()).format("HH:mm:ss");
        dataToSend["addDate"] = moment()
          .add(2, "seconds")
          .format("YYYY-MM-DD HH:mm:ss");
        const res = await axios.post(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/today_tomorrow",
          dataToSend
        );

        if (res.data.statusCode === 200 && !successShown) {
          setMultipleDataSendModal(false);
          // swal("", res.data.message, "success");
          swal("", res.data.message, "success");
          successShown = true;
        } else if (!successShown) {
          swal("", res.data.message, "error");
          successShown = true; // Set to true after showing the error message
        }
      } catch (error) {
        console.error("Error:", error);
        swal("Error", "An error occurred while saving data.", "error");
      }
    }

    setModalShowForPopupForm(false);
    getData();
  };

  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [multipleDataSendModal, setMultipleDataSendModal] = useState(false);
  // const [postLoader, setPostLoader] = React.useState(false);

  let [id, setId] = React.useState();
  // if (!id) {
  //   var handleSubmit = async (values) => {
  //     setPostLoader(true);
  //     values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
  //     values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
  //     values["createTime"] = moment(new Date()).format("HH:mm:ss");
  //     values["todayAndTomorrowImageOrVideo"] = image;
  //     values["comp_iamge"] = compImage;
  //     values["addDate"] = moment()
  //       .add(2, "seconds")
  //       .format("YYYY-MM-DD HH:mm:ss");
  //     let res = await axios.post(
  //       "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/today_tomorrow",
  //       values
  //     );
  //     if (res.data.statusCode === 200) {
  //       setModalShowForPopupForm(false);
  //       setPostLoader(false);
  //       getData();
  //       swal("", res.data.message, "success");
  //     } else {
  //       swal("", res.data.message, "error");
  //       setPostLoader(false);
  //     }
  //   };
  // } else {
  //   handleSubmit = async (values) => {
  //     values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
  //     values["updateTime"] = moment(new Date()).format("HH:mm:ss");
  //     values["todayAndTomorrowImageOrVideo"] = image;
  //     values["comp_iamge"] = compImage;
  //     values["addDate"] = moment()
  //       .add(2, "seconds")
  //       .format("YYYY-MM-DD HH:mm:ss");
  //     let response = await axios.put(
  //       "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/today_tomorrow/" +
  //         id,
  //       values
  //     );

  //     if (response.data.statusCode === 200) {
  //       setModalShowForPopupForm(false);
  //       getData();
  //       swal("", response.data.message, "success");
  //     }
  //   };
  // }

  if (!id) {
    var handleSubmit = async (values) => {
      // setPostLoader(true);

      values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["createTime"] = moment(new Date()).format("HH:mm:ss");
      values["todayAndTomorrowImageOrVideo"] = image;
      values["comp_iamge"] = compImage;
      values["addDate"] = moment()
        .add(2, "seconds")
        .format("YYYY-MM-DD HH:mm:ss");

      try {
        setImgLoader(true); // Set img loader to true before processing the image

        // Make the POST API call
        let res = await axios.post(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/today_tomorrow",
          values
        );

        if (res.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          swal("", res.data.message, "success");
        } else {
          swal("", res.data.message, "error");
        }
      } catch (error) {
        // Handle error
        console.error("Error while making POST API call:", error);
        swal("", "Error occurred while processing the request", "error");
      }
      // finally {
      //   setPostLoader(false);
      //   setImgLoader(false);
      // }
    };
  } else {
    handleSubmit = async (values) => {
      // setPostLoader(true);

      values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["updateTime"] = moment(new Date()).format("HH:mm:ss");
      values["todayAndTomorrowImageOrVideo"] = image;
      values["comp_iamge"] = compImage;
      values["addDate"] = moment()
        .add(2, "seconds")
        .format("YYYY-MM-DD HH:mm:ss");

      try {
        setImgLoader(true); // Set img loader to true before processing the image

        // Make the PUT API call
        let response = await axios.put(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/today_tomorrow/" +
            id,
          values
        );

        if (response.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          swal("", response.data.message, "success");
        }
      } catch (error) {
        // Handle error
        console.error("Error while making PUT API call:", error);
        swal("", "Error occurred while processing the request", "error");
      }
      // finally {
      //   setPostLoader(false);
      //   setImgLoader(false);
      // }
    };
  }

  //    // "add fom logic"
  let [editData, setEditData] = React.useState({});

  //   auto form fill up in edit
  let seletedEditData = async (datas) => {
    setModalShowForPopupForm(true);
    setId(datas._id);
    setEditData(datas);
    setImage(datas.todayAndTomorrowImageOrVideo);
  };

  // Formik
  let [ProductDetailsFormik, setProductDetailsFormik] = useState({});
  const FormikValues = () => {
    const formik = useFormikContext();
    React.useEffect(() => {
      setProductDetailsFormik(formik.values);
    }, [formik.values]);
    return null;
  };

  const [accessType, setAccessType] = React.useState(null);
  let cookies = new Cookies();

  React.useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setAccessType(decodedToken);
      } catch (error) {
        // Handle error if token decoding fails
        console.error("Failed to decode token:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  let [todayTomorrowCategoryName, setTodayTomorrowCategoryName] = useState();

  let getCategoryNameData = async () => {
    let responce = await axios.get(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/today/category_name"
    );
    setTodayTomorrowCategoryName(responce.data.data);
  };

  React.useEffect(() => {
    getCategoryNameData();
  }, []);

  let [getLanguageName, setGetLanguageName] = useState();

  let getLanguageNameData = async () => {
    const token = cookies.get("token");
    let responce = await axios.get(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/language/languages",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setGetLanguageName(responce.data.data);
  };

  React.useEffect(() => {
    getLanguageNameData();
  }, []);

  let [searchData, setSearchData] = useState({ categoryName: "" });

  const [data, setData] = useState({
    startingDate: "",
    endingDate: "",
  });

  const updateInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setSearchData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  var filterDate = async () => {
    let response = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/filter_category",
      {
        categoryName: searchData.categoryName,
      }
    );
    if (response.data.statusCode === 200) {
      setTodayAndTommorow(response.data.data);
      setCountData(response.data.totalCount);
    }
  };
  React.useEffect(() => {
    if (searchData) {
      filterDate();
    }
  }, [searchData]);

  const [values, setValues] = useState({
    todayAndTomorrowImageOrVideoName: "",
  });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   // Update the state with the user's input
  //   setValues({
  //     ...values,
  //     [name]: value,
  //   });
  // };

  // ------------------------------------------------------------------------------------------------
  const updateDateInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  const [dateLoader, setDateLoader] = useState(false);
  var filterDateWiseData = async () => {
    setDateLoader(true);
    if (data.startingDate && data.endingDate) {
      const startingDateFormatted = moment(data.startingDate).format(
        "DD-MM-YYYY"
      );
      const endingDateFormatted = moment(data.endingDate).format("DD-MM-YYYY");

      let response = await axios.post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/todayandtomorrow/filterData",
        {
          startingDate: startingDateFormatted,
          endingDate: endingDateFormatted,
        }
      );
      if (response.data.statusCode === 200) {
        setDateLoader(false);
        setTodayAndTommorow(response.data.findByDateWisenData);
        setCountData(response.data.totalCount);
      }
    }
  };

  React.useEffect(() => {
    if (data.startingDate && data.endingDate) {
      filterDateWiseData();
    }
  }, [data.startingDate, data.endingDate]);

  return (
    <>
      <UserSidebar />

      <Box sx={{ width: "100%", pb: "2%", pl: "2%", pr: "2%" }}>
        <div id="main-btn-add-machinetype">
          <div className="d-flex flex-row justify-content-end mb-2 gap-2">
            <Button
              className="text-capitalize"
              size="small"
              onClick={() => {
                setMultipleDataSendModal(true);
                setId(null);
                setEditData({});
                setImage({});
                setSelectedCategoryName({});
              }}
            >
              Add Multiple
            </Button>

            <Button
              className="text-capitalize"
              size="small"
              onClick={() => {
                setModalShowForPopupForm(true);
                setId(null);
                setEditData({});
                setImage({});
                setSelectedCategoryName({});
              }}
            >
              Add Item
            </Button>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3 mb-3">
            <TextField
              value={data.startingDate}
              onChange={updateDateInputs}
              type="date"
              size="small"
              label="Starting Date"
              name="startingDate"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              value={data.endingDate}
              onChange={updateDateInputs}
              type="date"
              size="small"
              name="endingDate"
              label="Ending Date"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Button
              onClick={() => {
                getData();
                setData({
                  startingDate: "",
                  endingDate: "",
                });
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="d-flex justify-content-start">
          <div>Total Image: {totalImage}</div>
        </div>

        <Paper sx={{ width: "100%" }} className="table_bg_img">
          <Toolbar
            className="border-top border-bottom"
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              ...(selected.length > 0 && {
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.activatedOpacity
                  ),
              }),
            }}
          >
            {selected.length > 0 ? (
              <Typography
                sx={{ flex: "1 1 100%" }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {selected.length} selected
              </Typography>
            ) : (
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Today & Tomorrow
              </Typography>
            )}
            <div className="d-flex gap-3">
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Category Name</InputLabel>
                <Select
                  label="CategoryName"
                  name="categoryName"
                  value={searchData?.categoryName}
                  onChange={updateInputs}
                  MenuProps={{
                    style: {
                      maxHeight: 210,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      getData();
                      setSearchData({
                        categoryName: "",
                      });
                    }}
                  >
                    All
                  </MenuItem>
                  {todayTomorrowCategoryName?.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e.categoryName}>
                        {e.categoryName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <form className="form-inline">
                <input
                  id="serchbar-size"
                  className="form-control mr-sm-2"
                  type="search"
                  onChange={(e) => handleSearchData(e.target.value)}
                  placeholder="Search"
                  aria-label="Search"
                />
              </form>
            </div>

            <>
              {selected.length > 0 ? (
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete()}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </>
            {/* );
              })()} */}
          </Toolbar>
          {loader || dateLoader ? (
            <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="50"
                visible={loader || dateLoader}
              />
            </div>
          ) : (
            <TableContainer>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"></TableCell>

                    {/* {accessType &&
                      (() => {
                        if (!accessType.includes("Allow To Delete")) {
                          return null;
                        }
                        return ( */}
                    <TableCell align="center" padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < todayAndTommorow?.length
                        }
                        checked={
                          todayAndTommorow?.length > 0 &&
                          selected.length === todayAndTommorow?.length
                        }
                        onChange={handleSelectAllClick}
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                      />
                    </TableCell>
                    {/* );
                      })()} */}

                    {headCells.map((headCell, id) => {
                      return (
                        <TableCell key={id} className="fw-bold" align="center">
                          {headCell.label}
                        </TableCell>
                      );
                    })}

                    <TableCell className="fw-bold" align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayAndTommorow?.map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <Row
                        key={row.machineTypeId}
                        row={row}
                        isItemSelected={isItemSelected}
                        labelId={labelId}
                        handleClick={handleClick}
                        selected={selected}
                        index={index}
                        seletedEditData={seletedEditData}
                      />
                    );
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={countData}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </Paper>
      </Box>
      <Dialog
        fullWidth
        open={modalShowForPopupForm}
        onClose={() => setModalShowForPopupForm(false)}
      >
        <DialogTitle>{"Today&Tomorrow Form"}</DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              todayAndTomorrowImageOrVideoName:
                editData && editData.todayAndTomorrowImageOrVideoName
                  ? editData.todayAndTomorrowImageOrVideoName
                  : "",
              categoryName:
                editData && editData.categoryName ? editData.categoryName : "",
              categoryName:
                editData && editData.categoryName ? editData.categoryName : "",

              isVideo: editData && editData.isVideo ? editData.isVideo : "",
              languageName:
                editData && editData.languageName ? editData.languageName : "",
            }}
            validationSchema={Yup.object().shape({
              // todayAndTomorrowImageOrVideoName:
              //   Yup.string().required("Required"),
              categoryName: Yup.string().required("Required"),
              isVideo: Yup.boolean().required("Required"),
              languageName: Yup.string().required("Required"),
            })}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm(values);
            }}
          >
            {({ values, errors, touched, handleBlur, handleChange }) => (
              <Form>
                {/* <FormikValues /> */}
                <div>
                  <div className="mt-3">
                    <TextField
                      type="text"
                      size="small"
                      fullWidth
                      placeholder="Image/Video Name *"
                      label="Image/Video Name *"
                      name="todayAndTomorrowImageOrVideoName"
                      value={values.todayAndTomorrowImageOrVideoName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {/* {touched.todayAndTomorrowImageOrVideoName &&
                    errors.todayAndTomorrowImageOrVideoName ? (
                      <div className="text-danger">
                        {errors.todayAndTomorrowImageOrVideoName}
                      </div>
                    ) : null} */}
                  </div>

                  <div className="mb-3 mt-3">
                    <label>Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => fileData(e.target.files[0])}
                      required
                    />
                    <div className="text-danger">
                      {!id || imgLoader === false
                        ? null
                        : "Please Select Image again"}
                    </div>
                  </div>

                  {image && ( // Display the image if image URL is available
                    <div>
                      <img
                        src={imagePath + image} // Use the image state value here
                        alt="Banner Image"
                        width="50px"
                        height="50px"
                      />
                    </div>
                  )}

                  <div className="w-100 mb-3 mt-3">
                    <TextField
                      fullWidth
                      size="small"
                      select
                      label="Image or Video"
                      name="isVideo"
                      value={values.isVideo}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Video</MenuItem>
                      <MenuItem value={false}>Image</MenuItem>
                    </TextField>
                    {touched.isVideo && errors.isVideo ? (
                      <div className="text-danger">{errors.isVideo}</div>
                    ) : null}
                  </div>

                  <div className="mt-3">
                    <FormControl fullWidth>
                      <InputLabel size="small">Select Language</InputLabel>
                      <Select
                        size="small"
                        label="Select Language"
                        name="languageName"
                        value={values.languageName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {getLanguageName?.map((option) => (
                          <MenuItem
                            key={option?.languageName}
                            value={option?.languageName}
                          >
                            {option.languageName}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.languageName && errors.languageName ? (
                        <div className="text-danger">{errors.languageName}</div>
                      ) : null}
                    </FormControl>
                  </div>

                  {/* <div className="mt-3">
                    <FormControl fullWidth>
                      <InputLabel size="small">Category Name</InputLabel>
                      <Select
                        size="small"
                        label="Category Name"
                        name="categoryName"
                        value={values.categoryName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {todayTomorrowCategoryName?.map((option) => (
                          <MenuItem
                            key={option?.categoryName}
                            value={option?.categoryName}
                          >
                            {option.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.categoryName && errors.categoryName ? (
                        <div className="text-danger">{errors.categoryName}</div>
                      ) : null}
                    </FormControl>
                  </div> */}

                  <div className="mt-3">
                    <FormControl fullWidth>
                      <Autocomplete
                        options={todayTomorrowCategoryName || []}
                        getOptionLabel={(option) => option.categoryName || ""}
                        value={selectedCategoryName || null}
                        onChange={(_, newValue) => {
                          setSelectedCategoryName(newValue);
                          handleChange({
                            target: {
                              name: "categoryName",
                              value: newValue ? newValue.categoryName : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category Name"
                            name="categoryName"
                            size="small"
                            onBlur={handleBlur}
                          />
                        )}
                        filterOptions={(options, state) => {
                          return options.filter((option) =>
                            option.categoryName
                              .toLowerCase()
                              .includes(state.inputValue.toLowerCase())
                          );
                        }}
                        noOptionsText="No matching Category Name"
                      />
                    </FormControl>
                    {touched.categoryName && errors.categoryName ? (
                      <div className="text-danger field-error">
                        {errors.categoryName}
                      </div>
                    ) : null}
                    {/* </div> */}
                    {/* {ProductDetailsFormik.categoryName ? (
<div className="mt-4">
  <TextField fullWidth size="small" id="outlined-select-currency" label="Party City" name="partyCity" disabled
    value={showPartyCity} />
</div>
) : null} */}
                  </div>

                  {/* {!id ? (
                    <Button className="mt-3" type="submit" variant="primary">
                      Add Category
                    </Button>
                  ) : (/*
                    <Button className="mt-3" type="submit" variant="warning">
                      Update Category
                    </Button>
                  )} */}

                  {/* <div className="mt-3">
                    {!id ? (
                      <>
                        {imgLoader ? (
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Loading...
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary float-right"
                          >
                            Submit
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {imgLoader ? (
                          <button
                            className="btn btn-warning"
                            type="button"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Loading...
                          </button>
                        ) : (
                          <button type="submit" className="btn btn-warning">
                            Update
                          </button>
                        )}
                      </>
                    )}
                  </div> */}

                  <div className="mt-3">
                    {!id ? (
                      <>
                        {imgLoader ? (
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Loading...
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary float-right"
                          >
                            Submit
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {imgLoader ? (
                          <button
                            className="btn btn-warning"
                            type="button"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Loading...
                          </button>
                        ) : (
                          <button type="submit" className="btn btn-warning">
                            Update
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      {/* ======================================================================================================================== */}

      <Dialog
        fullWidth
        open={multipleDataSendModal}
        onClose={() => setMultipleDataSendModal(false)}
      >
        <DialogTitle>{"Add Multiple item"}</DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              todayAndTomorrowImageOrVideoName:
                editData && editData.todayAndTomorrowImageOrVideoName
                  ? editData.todayAndTomorrowImageOrVideoName
                  : "",
              categoryName:
                editData && editData.categoryName ? editData.categoryName : "",

              isVideo: editData && editData.isVideo ? editData.isVideo : "",
              languageName:
                editData && editData.languageName ? editData.languageName : "",
            }}
            validationSchema={Yup.object().shape({
              // todayAndTomorrowImageOrVideoName:
              //   Yup.string().required("Required"),
              categoryName: Yup.string().required("Required"),
              isVideo: Yup.boolean().required("Required"),
              languageName: Yup.string().required("Required"),
            })}
            onSubmit={(values, { resetForm }) => {
              handleSubmitMultiImage(values);
              resetForm(values);
            }}
          >
            {({ values, errors, touched, handleBlur, handleChange }) => (
              <Form>
                {/* <FormikValues /> */}
                <div>
                  <div className="mt-3">
                    <TextField
                      type="text"
                      size="small"
                      fullWidth
                      placeholder="Image/Video Name *"
                      label="Image/Video Name *"
                      name="todayAndTomorrowImageOrVideoName"
                      value={values.todayAndTomorrowImageOrVideoName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {/* {touched.todayAndTomorrowImageOrVideoName &&
                    errors.todayAndTomorrowImageOrVideoName ? (
                      <div className="text-danger">
                        {errors.todayAndTomorrowImageOrVideoName}
                      </div>
                    ) : null} */}
                  </div>

                  <div className="mb-3 mt-3">
                    <label>Multi Images</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => fileDataMultiple(e.target.files)}
                      multiple
                      required
                    />
                    <div className="text-danger">
                      {!id || imgLoader === false
                        ? null
                        : "Please Select Images again"}
                    </div>
                  </div>

                  <div className="w-100 mb-3 mt-3">
                    <TextField
                      fullWidth
                      size="small"
                      select
                      label="Image or Video"
                      name="isVideo"
                      value={values.isVideo}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Video</MenuItem>
                      <MenuItem value={false}>Image</MenuItem>
                    </TextField>
                    {touched.isVideo && errors.isVideo ? (
                      <div className="text-danger">{errors.isVideo}</div>
                    ) : null}
                  </div>

                  <div className="mt-3">
                    <FormControl fullWidth>
                      <InputLabel size="small">Select Language</InputLabel>
                      <Select
                        size="small"
                        label="Select Language"
                        name="languageName"
                        value={values.languageName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {getLanguageName?.map((option) => (
                          <MenuItem
                            key={option?.languageName}
                            value={option?.languageName}
                          >
                            {option.languageName}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.languageName && errors.languageName ? (
                        <div className="text-danger">{errors.languageName}</div>
                      ) : null}
                    </FormControl>
                  </div>

                  {/* <div className="mt-3">
                    <FormControl fullWidth>
                      <InputLabel size="small">Category Name</InputLabel>
                      <Select
                        size="small"
                        label="Category Name"
                        name="categoryName"
                        value={values.categoryName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {todayTomorrowCategoryName?.map((option) => (
                          <MenuItem
                            key={option?.categoryName}
                            value={option?.categoryName}
                          >
                            {option.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.categoryName && errors.categoryName ? (
                        <div className="text-danger">{errors.categoryName}</div>
                      ) : null}
                    </FormControl>
                  </div> */}

                  <div className="mt-3">
                    <FormControl fullWidth>
                      <Autocomplete
                        options={todayTomorrowCategoryName || []}
                        getOptionLabel={(option) => option.categoryName || ""}
                        value={selectedCategoryName || null}
                        onChange={(_, newValue) => {
                          setSelectedCategoryName(newValue);
                          handleChange({
                            target: {
                              name: "categoryName",
                              value: newValue ? newValue.categoryName : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category Name"
                            name="categoryName"
                            size="small"
                            onBlur={handleBlur}
                          />
                        )}
                        filterOptions={(options, state) => {
                          return options.filter((option) =>
                            option.categoryName
                              .toLowerCase()
                              .includes(state.inputValue.toLowerCase())
                          );
                        }}
                        noOptionsText="No matching Category Name"
                      />
                    </FormControl>
                    {touched.categoryName && errors.categoryName ? (
                      <div className="text-danger field-error">
                        {errors.categoryName}
                      </div>
                    ) : null}
                    {/* </div> */}
                    {/* {ProductDetailsFormik.categoryName ? (
<div className="mt-4">
  <TextField fullWidth size="small" id="outlined-select-currency" label="Party City" name="partyCity" disabled
    value={showPartyCity} />
</div>
) : null} */}
                  </div>

                  <div className="mt-3">
                    {!id ? (
                      <>
                        {imgLoader ? (
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Loading...
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary float-right"
                          >
                            Submit
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {imgLoader ? (
                          <button
                            className="btn btn-warning"
                            type="button"
                            disabled
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Loading...
                          </button>
                        ) : (
                          <button type="submit" className="btn btn-warning">
                            Update
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}
