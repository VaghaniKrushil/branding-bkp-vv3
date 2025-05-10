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
import moment from "moment";
import Switch from "@mui/material/Switch";
import { convertLength } from "@mui/material/styles/cssUtils";
import Autocomplete from "@mui/material/Autocomplete";

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Business-Type Name",
  },
  {
    label: "Image",
  },
  {
    label: "Video/Image",
  },
  {
    label: "Business-Type",
  },
  {
    label: "Category",
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
        <TableCell align="center">{row.myBusinessName}</TableCell>
        {/* <TableCell align="center">{row.bannerImage}</TableCell> */}
        <TableCell align="center">
          <img
            src={imagePath + row.myBusinessImageOrVideo}
            alt={row.myBusinessImageOrVideo}
            width="50px"
            height="50px"
          />
        </TableCell>
        {/* <TableCell align="center">
          <div>
            <Switch {...label} checked={row.businessTypeSwitch} />
          </div>
        </TableCell> */}

        <TableCell align="center">
          {row.isVideo === true ? "Video" : "Image"}
        </TableCell>

        <TableCell align="center">{row.businessTypeName}</TableCell>
        <TableCell align="center">{row.businessCategoryName}</TableCell>
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

export default function AddMyBusinessData() {
  let navigate = useNavigate();

  const [image, setImage] = useState("");
  const [imgLoader, setImgLoader] = useState(false);
  const [compImage, setCompImage] = useState(false);

  // Single Image Uplode
  const fileData = (file) => {
    setImgLoader(true);
    const dataArray = new FormData();
    dataArray.append("b_video", file);

    let url = "https://cdn.brandingprofitable.com/image_upload.php/";

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

  // Multiple Image Uplode
  const [multiImage, setMultiImage] = useState();
  const [multipleCompressedImage, setmultipleCompressedImage] = useState();
  const fileDataMultiple = (files) => {
    const maxImages = 25;

    if (files.length > maxImages) {
      swal("", `You can select a maximum of ${maxImages} images.`, "error");
      return;
    }
    setImgLoader(true);

    const imagesPath = [];
    const compImage = [];

    const url = "https://cdn.brandingprofitable.com/image_upload.php/";

    const uploadNextImage = (index) => {
      if (index >= files.length) {
        // All images uploaded
        setImgLoader(false);
        setMultiImage(imagesPath, "multi");
        setmultipleCompressedImage(compImage);
        return;
      }

      const file = files[index];
      const dataArray = new FormData();
      dataArray.append("b_video", file);

      axios
        .post(url, dataArray, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const imagePath = res?.data?.iamge_path; // Correct the key to "imagePath"
          const compImagePath = res?.data?.comp_iamge_path;
          imagesPath.push(imagePath);
          compImage.push(compImagePath);
          uploadNextImage(index + 1);
        })
        .catch((err) => {
          console.log("Error uploading image:", err);
          uploadNextImage(index + 1);
        });
    };

    // Start uploading the first image
    uploadNextImage(0);
  };

  let [myBusinessData, setMyBusinessData] = useState([]);
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);
  const [totalImage, setTotalImage] = useState()

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  let getData = async () => {
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/my_business/get_business",
      {
        pageSize: rowsPerPage,
        pageNumber: page,
      }
    );
    setLoader(false);
    setMyBusinessData(res.data.data);
    setCountData(res.data.myBusinessCount);
    setTotalImage(res.data.myBusinessCount);
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
      const newSelected = myBusinessData.map((n) => n._id);
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
    axios
      .post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/my_business/delete_business",
        selected
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          getData();
          setSelected([]);
          swal("", response.data.message, "success");
        }
      });
  };

  //
  // Searchbar
  let handleSearchData = async (values) => {
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/my_business/search_business",
      {
        search: values,
      }
    );
    if (res.data.statusCode === 200) {
      if (values !== "") {
        setMyBusinessData(res.data.data);
        setCountData(res.data.count)
      } else {
        getData();
      }
    }
  };


  var handleSubmitMultiImage = async (values) => {
    values["myBusinessImageOrVideo"] = multiImage;
    values["comp_iamge"] = multipleCompressedImage;
    values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
    values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
    values["createTime"] = moment(new Date()).format("HH:mm:ss");
    values["addDate"] = moment().add(2, 'seconds').format("YYYY-MM-DD HH:mm:ss");
    const imageUrls = Array.isArray(values.myBusinessImageOrVideo)
      ? values.myBusinessImageOrVideo
      : [values.myBusinessImageOrVideo];
  
    const imageUrlsCompresse = Array.isArray(values.comp_iamge)
      ? values.comp_iamge
      : [values.comp_iamge];
  
    let successShown = false;
    let errorMessage = null; // Store error message
  
    for (let i = 0; i < imageUrls.length; i++) {
      const dataToSend = {
        myBusinessName: values.myBusinessName,
        businessTypeName: values.businessTypeName,
        myBusinessImageOrVideo: imageUrls[i], // Store only the filename
        comp_iamge: imageUrlsCompresse[i],
        isVideo: values.isVideo,
        businessCategoryName: values.businessCategoryName,
        languageName: values.languageName,
        createDate: values.createDate,
        createTime: values.createTime,
        updateDate: values.updateDate,
        addDate: values.addDate,
      };
  
      try {
        const res = await axios.post(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/my_business/business",
          dataToSend
        );
  
        if (res.data.statusCode !== 200) {
          errorMessage = res.data.message;
        } else {
          successShown = true;
        }
      } catch (error) {
        errorMessage = "An error occurred while saving data.";
      }
    }
  
    if (errorMessage) {
      swal("", errorMessage, "error");
    } else if (successShown) {
      swal("", "Data saved successfully", "success");
    }
  
    setMultipleDataSendModal(false);
    getData();
  };
  

  // var handleSubmitMultiImage = async (values) => {
  //   values["myBusinessImageOrVideo"] = multiImage;
  //   values["comp_iamge"] = multipleCompressedImage;
  //   values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
  //   values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
  //   values["createTime"] = moment(new Date()).format("HH:mm:ss");
  //   values["addDate"] = moment().add(2, 'seconds').format("YYYY-MM-DD HH:mm:ss");
  //   const imageUrls = Array.isArray(values.myBusinessImageOrVideo)
  //     ? values.myBusinessImageOrVideo
  //     : [values.myBusinessImageOrVideo];

  //   const imageUrlsCompresse = Array.isArray(values.comp_iamge)
  //     ? values.comp_iamge
  //     : [values.comp_iamge];

  //   let successShown = false;

  //   for (let i = 0; i < imageUrls.length; i++) {
  //     const dataToSend = {
  //       myBusinessName: values.myBusinessName,
  //       businessTypeName: values.businessTypeName,
  //       myBusinessImageOrVideo: imageUrls[i], // Store only the filename
  //       comp_iamge: imageUrlsCompresse[i],
  //       isVideo: values.isVideo,
  //       businessCategoryName: values.businessCategoryName,
  //       languageName: values.languageName,
  //       createDate: values.createDate,
  //       createTime: values.createTime,
  //       updateDate: values.updateDate,
  //       addDate: values.addDate,
  //     };

  //     try {
  //       const res = await axios.post(
  //         "https://brandingprofitable-29d465d7c7b1.herokuapp.com/my_business/business",
  //         dataToSend
  //       );

  //       if (res.data.statusCode === 200 && !successShown) {
  //         swal("", res.data.message, "success");
  //         successShown = true;
  //       } else if (!successShown) {
  //         swal("", res.data.message, "error");
  //         successShown = true; // Set to true after showing the error message
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       swal("Error", error.message, "error");
  //       // swal("Error", "An error occurred while saving data.", "error");
  //     }
  //   }

  //   setModalShowForPopupForm(false);
  //   getData();
  // };

  //   edit machine-type here
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [multipleDataSendModal, setMultipleDataSendModal] = useState(false);
  let [id, setId] = React.useState();


  if (!id) {
    var handleSubmit = async (values) => {
      try {
        values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
        values["createTime"] = moment(new Date()).format("HH:mm:ss");
        values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
        values["myBusinessImageOrVideo"] = image;
        values["comp_iamge"] = compImage;
        values["addDate"] = moment().add(2, 'seconds').format("YYYY-MM-DD HH:mm:ss");
  
        let res = await axios.post(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/my_business/business",
          values
        );
  
        if (res.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          swal("", res.data.message, "success");
        }
        //  else {
        //   swal("", res.data.message, "error");
        // }
      } catch (error) {
        swal("API Error", error.message, "error");
      }
    };
  } else {
    handleSubmit = async (values) => {
      try {
        values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
        values["updateTime"] = moment(new Date()).format("HH:mm:ss");
        values["myBusinessImageOrVideo"] = image;
        values["comp_iamge"] = compImage;
        values["addDate"] = moment().add(2, 'seconds').format("YYYY-MM-DD HH:mm:ss");
  
        let response = await axios.put(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/my_business/business/" + id,
          values
        );
  
        if (response.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          swal("", response.data.message, "success");
        } else {
          swal("", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error:", error);
        swal("API Error", error.message, "error");
      }
    };
  }
  

  //    // "add fom logic"
  let [editData, setEditData] = React.useState({});

  //   auto form fill up in edit
  let seletedEditData = async (datas) => {
    setModalShowForPopupForm(true);
    setId(datas._id);
    setEditData(datas);
  };

  // Formik
  let [ProductDetailsFormik, setProductDetailsFormik] = useState({});
  let [myBusinessCategoryFormik, setMyBusinessCategoryFormik] = useState({});
  const FormikValues = () => {
    const formik = useFormikContext();
    React.useEffect(() => {
      setMyBusinessCategoryFormik(formik.values);
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

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  let [businessTypeNameInDropdawn, setBusinessTypeNameInDropdawn] = useState();

  let getBusinessTypeNameData = async () => {
    let responce = await axios.get(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/business_type/get_business_type"
    );
    setBusinessTypeNameInDropdawn(responce.data.data);
  };

  React.useEffect(() => {
    getBusinessTypeNameData();
  }, []);

  let [businessTypeToCategort, serBusinessTypeToCategort] = useState();

  let getBusinessTypeToCategort = async () => {
    let responce = await axios.get(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/business_category/businesstype_to_category/" +
        myBusinessCategoryFormik.businessTypeName
    );
    serBusinessTypeToCategort(responce.data.result);
  };

  React.useEffect(() => {
    getBusinessTypeToCategort();
  }, [myBusinessCategoryFormik.businessTypeName]);

  let [searchData, setSearchData] = useState({ businessTypeName: "" });

  const updateCategoryInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setSearchData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  var filterCategoty = async () => {
    let response = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/my_business/filter_business",
      {
        businessTypeName: searchData.businessTypeName,
      }
    );
    if (response.data.statusCode === 200) {
      setMyBusinessData(response.data.data);
      setCountData(response.data.totalCount);
    }
  };

  React.useEffect(() => {
    if (searchData.businessTypeName !== "") {
      // Check if categoryName is not empty
      filterCategoty();
    }
  }, [searchData.businessTypeName]);

  const [data, setData] = useState({
    startingDate: "",
    endingDate: "",
  });

  const updateInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  const filterDate = async () => {
    if (data.startingDate && data.endingDate) {
      // Format the dates to match the database format
      const startingDateFormatted = moment(data.startingDate).format(
        "DD-MM-YYYY"
      );
      const endingDateFormatted = moment(data.endingDate).format("DD-MM-YYYY");

      let response = await axios.post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/my_business/filterData/",
        {
          startingDate: startingDateFormatted,
          endingDate: endingDateFormatted,
        }
      );

      if (response.data.statusCode === 200) {
        setMyBusinessData(response.data.findByDateWisenData);
        setCountData(response.data.totalCount);
      }
    }
  };
  React.useEffect(() => {
    if (data.startingDate && data.endingDate) {
      filterDate();
    }
  }, [data.startingDate, data.endingDate]);

  // let [getLanguageName, setGetLanguageName] = useState();

  // let getLanguageNameData = async () => {
  //   const token = cookies.get("token");
  //   let responce = await axios.get(
  //     "https://brandingprofitable-29d465d7c7b1.herokuapp.com/language/languages",
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   setGetLanguageName(responce.data.data);
  // };

  // React.useEffect(() => {
  //   getLanguageNameData();
  // }, []);

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
                setSelectedBusiness({});
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
                setSelectedBusiness({});
              }}
            >
              Add BusinessType
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
                All Business
              </Typography>
            )}

            <div className="d-flex gap-2 m-2">
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Category Name</InputLabel>
                <Select
                  label="CategoryName"
                  name="businessTypeName"
                  value={searchData?.businessTypeName}
                  onChange={updateCategoryInputs}
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
                        businessTypeName: "",
                      });
                    }}
                  >
                    All
                  </MenuItem>
                  {businessTypeNameInDropdawn?.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e.businessTypeName}>
                        {e.businessTypeName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <TextField
                value={data.startingDate}
                onChange={updateInputs}
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
                onChange={updateInputs}
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

            {/* {accessType &&
              (() => {
                if (!accessType.includes("Allow To Delete")) {
                  return null;
                }
                return ( */}
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
          {loader ? (
            <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="50"
                visible={loader}
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
                          selected.length < myBusinessData?.length
                        }
                        checked={
                          myBusinessData?.length > 0 &&
                          selected.length === myBusinessData?.length
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
                  {myBusinessData?.map((row, index) => {
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
        <DialogTitle>{"Business Form"}</DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              myBusinessName:
                editData && editData.myBusinessName
                  ? editData.myBusinessName
                  : "",
              businessTypeName:
                editData && editData.businessTypeName
                  ? editData.businessTypeName
                  : "",

              isVideo: editData && editData.isVideo ? editData.isVideo : "",
              businessCategoryName:
                editData && editData.businessCategoryName
                  ? editData.businessCategoryName
                  : "",
              // languageName:
              //   editData && editData.languageName
              //     ? editData.languageName
              //     : "",
            }}
            validationSchema={Yup.object().shape({
              myBusinessName: Yup.string().required("Required"),
              businessTypeName: Yup.string().required("Required"),
              isVideo: Yup.boolean().required("Required"),
              businessCategoryName: Yup.string().required("Required"),
              // languageName: Yup.string().required("Required"),
            })}
            onSubmit={(values, { resetForm }) => {
              console.log(values, "values");
              handleSubmit(values);
              resetForm(values);
            }}
          >
            {({ values, errors, touched, handleBlur, handleChange }) => (
              <Form>
                <FormikValues />
                <div>
                  <div className="mt-3">
                    <TextField
                      type="text"
                      size="small"
                      fullWidth
                      placeholder="Image Name *"
                      label="Image Name *"
                      name="myBusinessName"
                      value={values.myBusinessName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.myBusinessName && errors.myBusinessName ? (
                      <div className="text-danger">{errors.myBusinessName}</div>
                    ) : null}
                  </div>

                  <div className="mb-3 mt-3">
                    <label>Banner Image</label>
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

                  {/* <div className="mt-4">
                    <FormControl fullWidth>
                      <InputLabel size="small">Business Type</InputLabel>
                      <Select
                        size="small"
                        label="Business Type"
                        name="businessTypeName"
                        value={values.businessTypeName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {businessTypeNameInDropdawn?.map((option) => (
                          <MenuItem
                            key={option?.businessTypeName}
                            value={option?.businessTypeName}
                          >
                            {option.businessTypeName}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.businessTypeName && errors.businessTypeName ? (
                        <div className="text-danger">
                          {errors.businessTypeName}
                        </div>
                      ) : null}
                    </FormControl>
                  </div> */}

                  <div className="mt-4">
                    <FormControl fullWidth>
                      <Autocomplete
                        options={businessTypeNameInDropdawn || []}
                        getOptionLabel={(option) =>
                          option.businessTypeName || ""
                        }
                        value={selectedBusiness || null}
                        onChange={(_, newValue) => {
                          setSelectedBusiness(newValue);
                          handleChange({
                            target: {
                              name: "businessTypeName",
                              value: newValue ? newValue.businessTypeName : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Business Type"
                            name="businessTypeName"
                            size="small"
                            onBlur={handleBlur}
                          />
                        )}
                        filterOptions={(options, state) => {
                          return options.filter((option) =>
                            option.businessTypeName
                              .toLowerCase()
                              .includes(state.inputValue.toLowerCase())
                          );
                        }}
                        noOptionsText="No matching Business"
                      />
                    </FormControl>
                    {touched.businessTypeName && errors.businessTypeName ? (
                      <div className="text-danger field-error">
                        {errors.businessTypeName}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <FormControl fullWidth>
                      <InputLabel size="small">Business Category</InputLabel>
                      <Select
                        size="small"
                        label="Business Category"
                        name="businessCategoryName"
                        value={values.businessCategoryName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {businessTypeToCategort?.map((option) => (
                          <MenuItem
                            key={option?.businessCategoryName}
                            value={option?.businessCategoryName}
                          >
                            {option.businessCategoryName}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.businessCategoryName &&
                      errors.businessCategoryName ? (
                        <div className="text-danger">
                          {errors.businessCategoryName}
                        </div>
                      ) : null}
                    </FormControl>
                  </div>

                  {/* <div className="mt-3">
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
                  </div> */}

                  {/* {!id ? (
                    <Button className="mt-3" type="submit" variant="primary">
                      Add Category
                    </Button>
                  ) : (/*
                    <Button className="mt-3" type="submit" variant="warning">
                      Update Category
                    </Button>
                  )} */}

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
      {/* ======================================== */}

      <Dialog
        fullWidth
        open={multipleDataSendModal}
        onClose={() => setMultipleDataSendModal(false)}
      >
        <DialogTitle>{"Business Form"}</DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              myBusinessName:
                editData && editData.myBusinessName
                  ? editData.myBusinessName
                  : "",
              businessTypeName:
                editData && editData.businessTypeName
                  ? editData.businessTypeName
                  : "",

              isVideo: editData && editData.isVideo ? editData.isVideo : "",
              businessCategoryName:
                editData && editData.businessCategoryName
                  ? editData.businessCategoryName
                  : "",
              // languageName:
              //   editData && editData.languageName
              //     ? editData.languageName
              //     : "",
            }}
            validationSchema={Yup.object().shape({
              myBusinessName: Yup.string().required("Required"),
              businessTypeName: Yup.string().required("Required"),
              isVideo: Yup.boolean().required("Required"),
              businessCategoryName: Yup.string().required("Required"),
            })}
            onSubmit={(values, { resetForm }) => {
              handleSubmitMultiImage(values);
              resetForm(values);
            }}
          >
            {({ values, errors, touched, handleBlur, handleChange }) => (
              <Form>
                <FormikValues />
                <div>
                  <div className="mt-3">
                    <TextField
                      type="text"
                      size="small"
                      fullWidth
                      placeholder="Image Name *"
                      label="Image Name *"
                      name="myBusinessName"
                      value={values.myBusinessName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.myBusinessName && errors.myBusinessName ? (
                      <div className="text-danger">{errors.myBusinessName}</div>
                    ) : null}
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

                  {/* <div className="mt-4">
                    <FormControl fullWidth>
                      <InputLabel size="small">Business Type</InputLabel>
                      <Select
                        size="small"
                        label="Business Type"
                        name="businessTypeName"
                        value={values.businessTypeName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {businessTypeNameInDropdawn?.map((option) => (
                          <MenuItem
                            key={option?.businessTypeName}
                            value={option?.businessTypeName}
                          >
                            {option.businessTypeName}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.businessTypeName && errors.businessTypeName ? (
                        <div className="text-danger">
                          {errors.businessTypeName}
                        </div>
                      ) : null}
                    </FormControl>
                  </div> */}

                  <div className="mt-4">
                    <FormControl fullWidth>
                      <Autocomplete
                        options={businessTypeNameInDropdawn || []}
                        getOptionLabel={(option) =>
                          option.businessTypeName || ""
                        }
                        value={selectedBusiness || null}
                        onChange={(_, newValue) => {
                          setSelectedBusiness(newValue);
                          handleChange({
                            target: {
                              name: "businessTypeName",
                              value: newValue ? newValue.businessTypeName : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Business Type"
                            name="businessTypeName"
                            size="small"
                            onBlur={handleBlur}
                          />
                        )}
                        filterOptions={(options, state) => {
                          return options.filter((option) =>
                            option.businessTypeName
                              .toLowerCase()
                              .includes(state.inputValue.toLowerCase())
                          );
                        }}
                        noOptionsText="No matching Business"
                      />
                    </FormControl>
                    {touched.businessTypeName && errors.businessTypeName ? (
                      <div className="text-danger field-error">
                        {errors.businessTypeName}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <FormControl fullWidth>
                      <InputLabel size="small">Business Category</InputLabel>
                      <Select
                        size="small"
                        label="Business Category"
                        name="businessCategoryName"
                        value={values.businessCategoryName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {businessTypeToCategort?.map((option) => (
                          <MenuItem
                            key={option?.businessCategoryName}
                            value={option?.businessCategoryName}
                          >
                            {option.businessCategoryName}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.businessCategoryName &&
                      errors.businessCategoryName ? (
                        <div className="text-danger">
                          {errors.businessCategoryName}
                        </div>
                      ) : null}
                    </FormControl>
                  </div>

                  {/* <div className="mt-3">
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
                  </div> */}

                  {/* {!id ? (
                    <Button className="mt-3" type="submit" variant="primary">
                      Add Category
                    </Button>
                  ) : (/*
                    <Button className="mt-3" type="submit" variant="warning">
                      Update Category
                    </Button>
                  )} */}

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
