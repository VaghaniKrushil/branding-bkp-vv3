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
import moment from "moment";
const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Business Banner",
  },
  {
    label: "Special Date",
  },
  {
    label: "Switch (On/Off)",
  },
  {
    label: "Days",
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

  // ---------------------------Banner On/Off Switch-------------------------------------

  const handleToggle = (id) => {
    const apiUrl = `https://brandingprofitable-29d465d7c7b1.herokuapp.com/business_banner/businessbanner_onoff/${id}`;

    axios
      .put(apiUrl, { isSplashScreenDisplay: !row.isSplashScreenDisplay })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating splash screen:", error);
      });
  };

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
        {/* <TableCell align="center">{row.categoryName}</TableCell>
        <TableCell align="center">{row.imageName}</TableCell> */}

        <TableCell align="center">
          <img
            src={imagePath + row.businessBanner}
            alt={row.businessBanner}
            width="50px"
            height="50px"
          />
        </TableCell>

        <TableCell align="center">
          {moment(row.imageDate).format("DD/MM/YYYY")}
        </TableCell>

        {/* <TableCell align="center">
          <div>
            <Switch {...label} checked={row.isBannerDaysSwitch} />
          </div>
        </TableCell> */}

        <TableCell align="center">
          <div>
            <Switch
              checked={row.isSplashScreenDisplay}
              // onChange={handleToggle}
              onClick={() => {
                handleToggle(row._id);
              }}
            />
          </div>
        </TableCell>

        <TableCell align="center">{row.isBannerDaysSwitch == false ? row.showBannerDays : "-"}</TableCell>

        <TableCell align="center">
          <button class="btn btn-default" onClick={() => seletedEditData(row)}>
            <EditIcon />
          </button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function AddBusinessBanner() {
  let navigate = useNavigate();

  const [image, setImage] = useState("");
  const [imgLoader, setImgLoader] = useState(false);

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
        setImage(imagePath);
      })
      .catch((err) => {
        setImgLoader(false);
        console.log("Error uploading image:", err);
      });
  };

  //   let [getCategoryData, setGetCategoryData] = useState([]);
  let [getPureAndNaturalProducts, setGetPureAndNaturalProducts] = useState([]);
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  let getData = async () => {
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/business_banner/business_banner/get",
      {
        pageSize: rowsPerPage,
        pageNumber: page,
      }
    );
    setLoader(false);
    setGetPureAndNaturalProducts(res.data.data);
    setCountData(res.data.TodayAndTomorrowCategoryCount);
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
      const newSelected = getPureAndNaturalProducts.map((n) => n._id);
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
    swal("Are You Sure You Want TO Delete ?", {
      buttons: ["No", "Yes"],
    }).then(async (buttons) => {
      if (buttons === true) {
        axios
          .delete("https://brandingprofitable-29d465d7c7b1.herokuapp.com/business_banner/business_banner", {
            data: selected,
          })
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

  //
  // Searchbar
  let handleSearchData = async (values) => {
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/today/search_today_category",
      {
        search: values,
      }
    );
    if (res.data.statusCode === 200) {
      if (values !== "") {
        setGetPureAndNaturalProducts(res.data.data);
        setCountData(res.data.count);
      } else {
        getData();
      }
    }
  };

  //   edit machine-type here
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [id, setId] = React.useState();
  if (!id) {
    var handleSubmit = async (values) => {
      values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["createTime"] = moment(new Date()).format("HH:mm:ss");
      values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["businessBanner"] = image;
      // values["showCategoryDaysSwitch"] = switchChecked;
      values["isBannerDaysSwitch"] = switchChecked;
      let res = await axios.post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/business_banner/business_banner",
        values
      );
      if (res.data.statusCode === 200) {
        setModalShowForPopupForm(false);
        getData();
        swal("", res.data.message, "success");
      } else {
        swal("", res.data.message, "error");
      }
    };
  } else {
    handleSubmit = async (values) => {
      values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["updateTime"] = moment(new Date()).format("HH:mm:ss");
      values["businessBanner"] = image;
      values["isBannerDaysSwitch"] = switchChecked;
      let response = await axios.put(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/business_banner/business_banner/" + id,
        values
      );

      if (response.data.statusCode === 200) {
        setModalShowForPopupForm(false);
        getData();
        swal("", response.data.message, "success");
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
    setImage(datas.businessBanner);
  };

  // Formik
  //   let [ProductDetailsFormik, setProductDetailsFormik] = useState({});
  //   const FormikValues = () => {
  //     const formik = useFormikContext();
  //     React.useEffect(() => {
  //       setProductDetailsFormik(formik.values);
  //     }, [formik.values]);
  //     return null;
  //   };

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

  const [isSwitchOff, setIsSwitchOff] = useState();
  const [switchChecked, setSwitchChecked] = useState(false);
  const handleSwitchChange = () => {
    setSwitchChecked(!switchChecked);
    setIsSwitchOff(!isSwitchOff);
  };

  // DAte wise filter Data
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateWiseFilterData, setDateWiseFilterData] = useState([]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

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

  var filterDate = async () => {
    if (data.startingDate && data.endingDate) {
      let response = await axios.post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/today/filterData/",
        {
          startingDate: data.startingDate,
          endingDate: data.endingDate,
        }
      );
      if (response.data.statusCode === 200) {
        setGetPureAndNaturalProducts(response.data.findByDateWisenData);
        setCountData(response.data.totalCount);
      }
    }
  };

  React.useEffect(() => {
    if (data.startingDate && data.endingDate) {
      filterDate();
    }
  }, [data.startingDate, data.endingDate]);

  // --------------------------------------Default Banner Logic------------------------------------------------------------------------------------
  let [defaultBannerPopupForm, setDefaultBannerPopupForm] =
    React.useState(false);

  let [editDataDefaultImage, setEditDataDefaultImage] = React.useState({});

  let [defaultBannerId, setDefaultBannerId] = useState(null);
  if (!defaultBannerId) {
    var handleDefaultSubmit = async (values) => {
      values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["createTime"] = moment(new Date()).format("HH:mm:ss");
      values["defaultBannerImage"] = image;
      let res = await axios.post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/default_banner/default_banner",
        values
      );
      if (res.data.statusCode === 200) {
        setDefaultBannerId(false);
        getData();
        swal("", res.data.message, "success");
      } else {
        swal("", res.data.message, "error");
      }
    };
  } else {
    handleDefaultSubmit = async (values) => {
      values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["updateTime"] = moment(new Date()).format("HH:mm:ss");
      values["defaultBannerImage"] = image;
      let response = await axios.put(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/default_banner/default_banner/" + defaultBannerId,
        values
      );

      if (response.data.statusCode === 200) {
        setDefaultBannerId(false);
        setDefaultBannerPopupForm(false);
        getDefaultAdvertiseBanner();
        getData();
        swal("", response.data.message, "success");
      }
    };
  }

  let selectedDefaultBannerEditData = async (datass) => {
    console.log(datass, "datass");
    setEditDataDefaultImage(datass._id);
    setEditDataDefaultImage(datass);
    setDefaultBannerPopupForm(true);
    setDefaultBannerId(datass._id);
    setImage(datass.defaultBannerImage);
  };

  let [defaultAdvertiseBanner, setDefaultAdvertiseBanner] = useState();

  let getDefaultAdvertiseBanner = async () => {
    let responce = await axios.get(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/default_banner/business_banner_default"
    );
    setDefaultAdvertiseBanner(responce.data.data);
  };

  React.useEffect(() => {
    getDefaultAdvertiseBanner();
  }, []);

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
                setModalShowForPopupForm(true);
                setId(null);
                setEditData({});
                setImage({});
                setDefaultBannerId({});
              }}
            >
              Add Banner
            </Button>
            {/* <Button
              className="text-capitalize"
              size="small"
              onClick={() => {
                setDefaultBannerPopupForm(true);
              }}
            >
              Add Default Banner
            </Button> */}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3 mb-3">
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
              All
            </Button>
          </div>
        </div>

        {/* Shaddow */}
        <div className="shadowed-div border rounded p-3 mb-3">
          <table>
            <thead>
              <tr>
                <th>Banner</th>
                <th>&nbsp;&nbsp;&nbsp;Banner Type</th>
                <th> Date</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {defaultAdvertiseBanner?.map((row, id) => {
                if (row.defaultBannerType === "Business Banner") {
                  return (
                    <tr key={id}>
                      <td>
                        <img
                          src={imagePath + row.defaultBannerImage}
                          alt={row.defaultBannerType}
                          width="50px"
                          height="50px"
                        />
                      </td>
                      <td>{row.defaultBannerType}</td>
                      <td>{row.createDate}</td>
                      <button
                        class="btn btn-default"
                        onClick={() => selectedDefaultBannerEditData(row)}
                      >
                        <EditIcon />
                      </button>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
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
                Business Banner
              </Typography>
            )}

            <form className="form-inline m-3">
              <input
                id="serchbar-size"
                className="form-control mr-sm-2"
                type="search"
                onChange={(e) => handleSearchData(e.target.value)}
                placeholder="Search"
                aria-label="Search"
              />
            </form>

            <>
              {selected.length > 0 ? (
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete()}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </>
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
                    <TableCell align="center" padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < getPureAndNaturalProducts?.length
                        }
                        checked={
                          getPureAndNaturalProducts?.length > 0 &&
                          selected.length === getPureAndNaturalProducts?.length
                        }
                        onChange={handleSelectAllClick}
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                      />
                    </TableCell>

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
                  {getPureAndNaturalProducts?.map((row, index) => {
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
      <>
        <Dialog
          fullWidth
          open={modalShowForPopupForm}
          onClose={() => setModalShowForPopupForm(false)}
        >
          <DialogTitle>{"Banner Form"}</DialogTitle>
          <DialogContent dividers>
            <Formik
              initialValues={{
                specialDate:
                  editData && editData.specialDate ? editData.specialDate : "",
                isBannerDaysSwitch:
                  editData && editData.isBannerDaysSwitch
                    ? editData.isBannerDaysSwitch
                    : "",
                showBannerDays:
                  editData && editData.showBannerDays
                    ? editData.showBannerDays
                    : "",
              }}
              validationSchema={Yup.object().shape({
                specialDate: Yup.string().required("Required"),
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
                    <div className="mb-3 mt-3">
                      <label>Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => fileData(e.target.files[0])}
                        // required
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

                    <div>
                      <TextField
                        type="date"
                        size="small"
                        fullWidth
                        placeholder="Special Date"
                        label="Special Date"
                        name="specialDate"
                        className="mt-3"
                        value={values.specialDate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      ></TextField>
                      {touched.specialDate && errors.specialDate ? (
                        <div className="text-danger">{errors.specialDate}</div>
                      ) : null}
                    </div>

                    <div className="d-flex gap-3 mt-3">
                      <div>
                        <label>
                          Show Date Field
                          <Switch
                            checked={switchChecked}
                            onChange={handleSwitchChange}
                            defaultChecked={false}
                          />
                        </label>
                      </div>

                      {switchChecked === false ? (
                        <div>
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            placeholder="Enter Day *"
                            label="Enter Day *"
                            name="showBannerDays"
                            value={values.showBannerDays}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        </div>
                      ) : null}
                    </div>

                    {/* <div className="d-flex gap-3 mt-3">
                    <div className="mr-auto ">
                      <TextField
                        type="date"
                        size="small"
                        fullWidth
                        placeholder="Shedual StartDate"
                        label="Shedual StartDate"
                        name="shedualStartDate"
                        value={values.shedualStartDate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>

                    <div className="">
                      <TextField
                        type="date"
                        size="small"
                        fullWidth
                        placeholder="Shedual EndDate"
                        label="Shedual EndDate"
                        name="shedualEndDate"
                        value={values.shedualEndDate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
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

        {/* --------------------------------Default Banner--------------------------------------------------------------------- */}
        <Dialog
          fullWidth
          open={defaultBannerPopupForm}
          onClose={() => setDefaultBannerPopupForm(false)}
        >
          <DialogTitle>{"Banner Form"}</DialogTitle>
          <DialogContent dividers>
            <Formik
              initialValues={{
                defaultBannerType:
                  editDataDefaultImage && editDataDefaultImage.defaultBannerType
                    ? editDataDefaultImage.defaultBannerType
                    : "",
              }}
              // validationSchema={Yup.object().shape({
              //   specialDate: Yup.string().required("Required"),
              // })}
              onSubmit={(values, { resetForm }) => {
                handleDefaultSubmit(values);
                resetForm(values);
              }}
            >
              {({ values, errors, touched, handleBlur, handleChange }) => (
                <Form>
                  {/* <FormikValues /> */}
                  <div>
                    <div className="mb-3 mt-3">
                      <label>Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => fileData(e.target.files[0])}
                        // required
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

                    <div className="mt-3">
                      {!defaultBannerId ? (
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
    </>
  );
}
