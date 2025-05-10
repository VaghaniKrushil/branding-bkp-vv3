import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
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
import Sidebar from "../UserSidebar";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState } from "react";
import Cookies from "universal-cookie";
import { useFormik } from "formik";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import swal from "sweetalert";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import moment from "moment";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { RotatingLines } from "react-loader-spinner";
import CloseIcon from "@mui/icons-material/Close";
// import jwt_decode from "jwt-decode";

import bcrypt from "bcryptjs";

const headCells = [
  {
    label: "Name",
  },
  {
    label: "Email",
  },
  {
    label: "Mobile Number",
  },
];

const accessTypeData = [
  "Dashboard",

  // Banners
  "Main Banner",
  "Advertise Banner",
  "Popup Banner",
  "Splash Screen",
  "Business Banner",
  "Custome Banner",

  //   Branding Profitable
  "Today & Tomorrow",
  "Trending & News",
  "My Business",
  "Dynamic Section",
  "Custome Dynamic Section",
  "Frame",
  "Frame Request",
  "Category Days",
  "Add Language",
  "Notification",
  "Frame Responce",

  //   Network
  "kyc",
  "Wallet",
  "Users",
  "Tree",
  "Add Clipping",
  "Withdrawal Request",
  "Payment History",
  "Payment(V2)",
  "Passbook",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function Row(props) {
  const { row, handleClick, isItemSelected, labelId, seletedEditData } = props;
  // let cookies = new Cookies();
  const [open, setOpen] = React.useState(false);

  // var RoleName = jwt_decode(cookies.get("token"));
  // var [passwordCPasswordHide, setPasswordCPasswordHide] = useState(true);

  const otpExpiryTime = new Date();
  console.log(otpExpiryTime);
  const [accessType, setAccessType] = useState(null);

  return (
    <React.Fragment>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row._id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row._id}
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

        {accessType &&
          (() => {
            if (!accessType.includes("Allow To Delete")) {
              return null;
            }
            return (
              <TableCell align="center" padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isItemSelected}
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </TableCell>
            );
          })()}

        {/* <TableCell align="center">{row.accessId}</TableCell> */}
        <TableCell align="center">{row.userName}</TableCell>
        <TableCell align="center">{row.email}</TableCell>
        <TableCell align="center">{row.mobileNumber}</TableCell>
        <TableCell align="center">
          <button
            class="btn btn-default"
            onClick={() => {
              seletedEditData(row);
              // setPasswordCPasswordHide(false);
            }}
          >
            <EditIcon />
          </button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ paddingLeft: 15, margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Other Data :
              </Typography>
              <div>
                <Typography variant="p" gutterBottom component="div">
                  {row.accessType?.map((accessType, id) => {
                    return (
                      <span className="d-flex flex-column">
                        {id + 1}. {accessType}
                      </span>
                    );
                  })}
                  {/* <span className="fw-bold">Access:</span> {row.accessType} */}
                </Typography>
                {/* <div>
                  <Typography variant="p" gutterBottom component="div">
                    <span className="fw-bold">Create At:</span> {row.createAt}
                  </Typography>
                  {row.upadateAt ? (
                    <Typography variant="p" gutterBottom component="div">
                      <span className="fw-bold">Upadate At:</span>
                      {row.upadateAt}
                    </Typography>
                  ) : null}
                </div> */}
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function AccessTable() {
  let navigate = useNavigate();
  let cookies = new Cookies();

  let [engineerData, setEngineerData] = useState([]);
  console.log(engineerData, "abc");
  let [countData, setCountData] = useState(0);
  let [loader, setLoader] = useState(true);
  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //   let [loader, setLoader] = React.useState(true);
  const getData = async () => {
    try {
      const res = await axios.get(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/register/access/get",
        {
          params: {
            pageSize: rowsPerPage,
            pageNumber: page,
          },
        }
      );
      setLoader(false);
      setEngineerData(res.data.data);
      setCountData(res.data.accessCount);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

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
      const newSelected = engineerData.map((n) => n._id);
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
        const token = cookies.get("token");
        axios
          .delete(
            "https://brandingprofitable-29d465d7c7b1.herokuapp.com/register/register/remove",
            {
              data: selected,
            }
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

  //  let [search, setSearch] = React.useState("");

  //   edit Engineer here
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [id, setId] = React.useState();

  let [editData, setEditData] = React.useState({});

  if (!id) {
    var handleSubmit = async (values) => {
      try {
        values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
        values["createTime"] = moment(new Date()).format("HH:mm:ss");
        values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");

        let res = await axios.post(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/register/register",
          values
        );

        if (res.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          swal("", res.data.message, "success");
        }
      } catch (error) {
        console.error("Error while registering:", error);
        // Handle the error (e.g., show an error message to the user)
      }
    };
  } else {
    handleSubmit = async (values) => {
      try {
        values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
        values["updateTime"] = moment(new Date()).format("HH:mm:ss");

        if (values.password === "") {
          values.password = editData.password;
        }
        if (values.cPassword === "") {
          values.cPassword = editData.cPassword;
        }

        let response = await axios.put(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/register/register/" +
            id,
          values
        );

        if (response.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          swal("", response.data.message, "success");
        }
      } catch (error) {
        console.error("Error while editing:", error);
        // Handle the error (e.g., show an error message to the user)
      }
    };
  }

  // var hashPassword = async (pwd) => {
  //   let salt = await bcrypt.genSalt(10);
  //   let hash = await bcrypt.hash(pwd, salt);
  //   return hash;
  // };

  let accessFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: editData && editData.userName ? editData.userName : "",
      email: editData && editData.email ? editData.email : "",
      // password: editData && editData.password ? editData.password : "",
      password: "",
      // cPassword: editData && editData.cPassword ? editData.cPassword : "",
      cPassword: "",
      mobileNumber:
        editData && editData.mobileNumber ? editData.mobileNumber : "",
      accessType: editData && editData.accessType ? editData.accessType : [],
    },
    validationSchema: yup.object({
      userName: yup.string().required("Required field"),
      email: yup.string().email("Invalid Email").required("Required field"),
      password: yup
        .string()
        // .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase or One Lowercase, One Number and one special case Character"
        ),
      cPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
      // .required("Required field"),
      mobileNumber: yup.number().required("Required field"),
      accessType: yup.array().required("Please Select Machine Type"),
    }),
    onSubmit: async (values) => {
      console.log(values.password, "abc");
      if (values.password !== values.cPassword) {
        swal("", "Passwords do not match", "error");
        return;
      }
      // if (values.password !== "") {
      //   values.password = await hashPassword(values.password);
      // }
      // if (values.cPassword !== "") {
      //   values.cPassword = await hashPassword(values.cPassword);
      // }
      handleSubmit(values);
    },
  });

  //   auto form fill up in edit
  let seletedEditData = async (datas) => {
    setModalShowForPopupForm(true);
    setId(datas._id);
    setEditData(datas);
  };

  var [passwordCPasswordHide, setPasswordCPasswordHide] = useState(true);

  return (
    <>
      <Sidebar getData={getData} />
      <Box sx={{ width: "100%", pb: "2%", pl: "2%", pr: "2%" }}>
        <div className="d-flex flex-row justify-content-end mb-2">
          <Button
            className="text-capitalize"
            size="small"
            onClick={() => {
              setModalShowForPopupForm(true);
              setId(null);
              setEditData({});
            }}
            style={{ backgroundColor: "rgb(11, 11, 59) " }}
          >
            Add Access
          </Button>
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
                Access Table
              </Typography>
            )}
            <form className="form-inline">
              <input
                id="serchbar-size"
                className="form-control mr-sm-2"
                type="search"
                // onChange={(e) => handleSearchData(e.target.value)}
                placeholder="Search"
                aria-label="Search"
              />
            </form>
            {selected.length > 0 ? (
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete()}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            ) : null}
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
                    <TableCell align="center" padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < engineerData.length
                        }
                        checked={
                          engineerData?.length > 0 &&
                          selected.length === engineerData?.length
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
                  {engineerData?.map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <Row
                        key={row.empId}
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
                rowsPerPageOptions={[10, 25, 100]}
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
        onClose={() => {
          setModalShowForPopupForm(false);
          // setPasswordCPasswordHide(false);
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {"Access Form"}
          <IconButton
            aria-label="close"
            onClick={() => setModalShowForPopupForm(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={accessFormik.handleSubmit}>
            <div>
              <div className="mt-4">
                <TextField
                  type="text"
                  size="small"
                  fullWidth
                  placeholder="UserName"
                  label="UserName"
                  name="userName"
                  onBlur={accessFormik.handleBlur}
                  onChange={accessFormik.handleChange}
                  value={accessFormik.values.userName}
                />
                {accessFormik.touched.userName &&
                accessFormik.errors.userName ? (
                  <div className="text-danger">
                    {accessFormik.errors.userName}
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                <TextField
                  type="email"
                  size="small"
                  fullWidth
                  placeholder="Email"
                  label="Email"
                  name="email"
                  onBlur={accessFormik.handleBlur}
                  onChange={accessFormik.handleChange}
                  value={accessFormik.values.email}
                />
                {accessFormik.touched.email && accessFormik.errors.email ? (
                  <div style={{ color: "red" }}>
                    {accessFormik.errors.email}
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  placeholder="MobileNumber"
                  label="MobileNumber"
                  name="mobileNumber"
                  onBlur={accessFormik.handleBlur}
                  onChange={accessFormik.handleChange}
                  value={accessFormik.values.mobileNumber}
                />
                {accessFormik.touched.mobileNumber &&
                accessFormik.errors.mobileNumber ? (
                  <div className="text-danger">
                    {accessFormik.errors.mobileNumber}
                  </div>
                ) : null}
              </div>

              {/* {!passwordCPasswordHide && ( */}
              <>
                <div className="mt-4">
                  <TextField
                    type="password"
                    size="small"
                    fullWidth
                    placeholder="Password"
                    label="Password"
                    name="password"
                    onBlur={accessFormik.handleBlur}
                    onChange={accessFormik.handleChange}
                    value={accessFormik.values.password}
                  />
                  {accessFormik.touched.password &&
                  accessFormik.errors.password ? (
                    <div style={{ color: "red" }}>
                      {accessFormik.errors.password}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4">
                  <TextField
                    type="password"
                    size="small"
                    fullWidth
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    name="cPassword"
                    onBlur={accessFormik.handleBlur}
                    onChange={accessFormik.handleChange}
                    value={accessFormik.values.cPassword}
                  />
                  {accessFormik.touched.cPassword &&
                  accessFormik.errors.cPassword ? (
                    <div style={{ color: "red" }}>
                      {accessFormik.errors.cPassword}
                    </div>
                  ) : null}
                </div>
              </>

              <div className="w-100 mt-3">
                <FormControl fullWidth>
                  <InputLabel size="small">Access Type</InputLabel>
                  <Select
                    multiple
                    size="small"
                    name="accessType"
                    value={accessFormik.values.accessType}
                    onChange={accessFormik.handleChange}
                    input={<OutlinedInput label="Access Type" />}
                    renderValue={(selected) => selected.join(", ")}
                    onBlur={accessFormik.handleBlur}
                    MenuProps={MenuProps}
                  >
                    {accessTypeData.map((e) => (
                      <MenuItem key={e} value={e}>
                        <Checkbox
                          checked={
                            accessFormik?.values?.accessType.indexOf(e) > -1
                          }
                        />
                        <ListItemText primary={e} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {accessFormik.touched.accessType &&
                accessFormik.errors.accessType ? (
                  <div className="text-danger">
                    {accessFormik.errors.accessType}
                  </div>
                ) : null}
              </div>

              {!id ? (
                <Button className="mt-3" type="submit" variant="primary">
                  Add Access
                </Button>
              ) : (
                <Button className="mt-3" type="submit" variant="warning">
                  Update Access
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
