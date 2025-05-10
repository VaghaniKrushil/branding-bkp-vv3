import * as React from "react";
import { useEffect } from "react";
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
import UserSidebar from "../PaymentApproveHistory/PaymentApprove";
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

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Name",
  },
  {
    label: "Date",
  },
  {
    label: "Time",
  },
  {
    label: "Payment Switch",
  },
  {
    label: "Image",
  },

  // {
  //   label: "Action",
  // },
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

  // let [image, setImage] = useState("");
  // let [imgLoader, setImgLoader] = useState();
  // const fileData = (file) => {
  //   setImgLoader(true);
  //   const dataArray = new FormData();
  //   dataArray.append("b_video", file);
  //   let url = "https://cdn.brandingprofitable.com/image_upload.php/";
  //   axios
  //     .post(url, dataArray, {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //       },
  //     })
  //     .then((res) => {
  //       setImgLoader(false);
  //       image = res?.data?.iamge_path;
  //       setImage(image);
  //     })
  //     .catch((err) => console.log(err));
  // };
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const url =
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/payment/payment";

    try {
      const response = await axios.get(url);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  let handleSubmitCancel = async (id) => {
    let response = await axios.put(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/payment/payment/" +
        id,
      { isPayment: true }
    );
    if (response.data.statusCode === 200) {
      fetchData();
    }
  };

  return (
    <React.Fragment>
      {/* {data.map((row) => ( */}
      <React.Fragment key={row._id}>
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
          <TableCell align="center">{row.fullName}</TableCell>
          {/* <TableCell align="center">{row.bannerImage}</TableCell> */}
          <TableCell align="center">{row.transactionDate}</TableCell>
          <TableCell align="center">{row.transactionTime}</TableCell>
          <TableCell align="center">
            <div>
              <Switch
                {...label}
                onClick={() => handleSubmitCancel(row._id, {})}
                checked={row.isPayment}
              />
            </div>
          </TableCell>

          <TableCell align="center">
            <a
              href={row.transactionImage}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imagePath + row.transactionImage}
                alt={row.transactionImage}
                width="50px"
                height="50px"
              />
            </a>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={5}
          ></TableCell>
        </TableRow>
      </React.Fragment>
      {/* ))} */}
    </React.Fragment>
  );
}

export default function PaymentApprove() {
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
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/payment/payment",
      {
        pageSize: rowsPerPage,
        pageNumber: page,
      }
    );
    setLoader(false);
    setGetPureAndNaturalProducts(res.data.data);
    setCountData(res.data.userDataCount);
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
    axios
      .post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/popup_banner/delete_popup_banner",
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
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mainbanner/search_mainbanner",
      {
        search: values,
      }
    );
    if (res.data.statusCode === 200) {
      if (values !== "") {
        setGetPureAndNaturalProducts(res.data.data);
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
      values["popupBannerImage"] = image;
      let res = await axios.post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/popup_banner/popup_banner",
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
      let response = await axios.put(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/popup_banner/popup_banner/" +
          id,
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

  return (
    <>
      <UserSidebar />

      <Box sx={{ width: "100%", pb: "2%", pl: "2%", pr: "2%" }}>
        <div id="main-btn-add-machinetype">
          <div className="d-flex flex-row justify-content-end mb-2">
            <Button
              className="text-capitalize"
              size="small"
              onClick={() => {
                setModalShowForPopupForm(true);
                setId(null);
                setEditData({});
              }}
            >
              Add Popup Banner
            </Button>
          </div>
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
                All Popup Banner
              </Typography>
            )}
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
                    {accessType?.role === "Super Admin" ? <DeleteIcon /> : null}
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
                    {/* );
                      })()} */}

                    {headCells.map((headCell, id) => {
                      return (
                        <TableCell key={id} className="fw-bold" align="center">
                          {headCell.label}
                        </TableCell>
                      );
                    })}
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
      <Dialog
        fullWidth
        open={modalShowForPopupForm}
        onClose={() => setModalShowForPopupForm(false)}
      >
        <DialogTitle>{"Popup-Banner Form"}</DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              popupBannerName:
                editData && editData.popupBannerName
                  ? editData.popupBannerName
                  : "",
              //   bannerImage:
              //     editData && editData.bannerImage ? editData.bannerImage : "",
              popupBannerSwitch:
                editData && editData.popupBannerSwitch
                  ? editData.popupBannerSwitch
                  : "",
              shedualDate:
                editData && editData.shedualDate ? editData.shedualDate : "",
            }}
            validationSchema={Yup.object().shape({
              popupBannerName: Yup.string().required("Required"),
              popupBannerSwitch: Yup.boolean().required("Required"),
              shedualDate: Yup.string().required("Required"),
            })}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm(values);
              console.log(values, "values");
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
                      placeholder="Popup-Banner Name *"
                      label="Popup-Banner Name *"
                      name="popupBannerName"
                      value={values.popupBannerName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.popupBannerName && errors.popupBannerName ? (
                      <div className="text-danger">
                        {errors.popupBannerName}
                      </div>
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
                      label="Popup-Banner Switch"
                      name="popupBannerSwitch"
                      value={values.popupBannerSwitch}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      {/* <MenuItem value="">Select Role</MenuItem> */}
                      <MenuItem value={true}>On</MenuItem>
                      <MenuItem value={false}>Off</MenuItem>
                    </TextField>
                    {touched.popupBannerSwitch && errors.popupBannerSwitch ? (
                      <div className="text-danger">
                        {errors.popupBannerSwitch}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <TextField
                      type="date"
                      size="small"
                      fullWidth
                      placeholder="Shedual Date"
                      label="Shedual Date"
                      name="shedualDate"
                      value={values.shedualDate}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
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
