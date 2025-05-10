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
import moment from "moment";
import Switch from "@mui/material/Switch";
import TrueIcon from "../logo/accept.png";
import FailIcon from "../logo/error.png";

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Full Name",
  },
  {
    label: "Number",
  },
  {
    label: "Amount",
  },
  {
    label: "Payment Date",
  },
  {
    label: "Status",
  },
  {
    label: "Payment Type",
  },

  // {
  //   label: "Action",
  // },
];

function Row(props) {
  const { row, handleClick, isItemSelected, labelId } = props;
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
        // onClick={(event) => handleClick(event, row._id)}
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

        {/* <TableCell align="center" padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell> */}

        {/* <TableCell align="center">{ row + 1}</TableCell> */}
        <TableCell align="center">{row?.fullName}</TableCell>
        <TableCell align="center">{row?.mobileNumber}</TableCell>
        <TableCell align="center">{row?.amount}</TableCell>
        <TableCell align="center">{row?.payment_date}</TableCell>
        <TableCell
          align="center"
          // style={{ color: row.status === "Done" ? <img src={TrueIcon} alt="Approve" /> : "red" }}
        >
          {row.status === "Done" ? (
            <img src={TrueIcon} alt="Approve" />
          ) : (
            <img src={FailIcon} alt="Fail" />
          )}
        </TableCell>

        <TableCell align="center">
          {row?.data?.data?.paymentInstrument?.type}
        </TableCell>

      </TableRow>


      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ paddingLeft: 15, margin: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              Other Data :
            </Typography>
            <hr />

            <table
              style={{
                fontFamily: "arial, sans-serif",
                border: "collapse",
                width: "50%",
              }}
            >
              <tr>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  Field
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  Value
                </th>
              </tr>

              {/* {row.client_details.map((index, id) => ( */}
              <tr>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  transaction_id
                </th>
                <td
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  {row.transaction_id}
                </td>
              </tr>
              {/* ))} */}
            </table>
          </Box>
        </Collapse>
      </TableCell>
    </React.Fragment>
  );
}

export default function PaymentSuccess() {
  let navigate = useNavigate();

  const [phonepePayments, setPhonepePayments] = useState([]);
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const getData = async () => {
    const token = cookies.get("token");
    try {
      const res = await axios.get(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/payments/success",
        {
          params: {
            pageSize: rowsPerPage,
            pageNumber: page,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoader(false);
      setPhonepePayments(res.data.data);
      setCountData(res.data.count); // Make sure to adjust the key here
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
    }
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
      const newSelected = phonepePayments?.map((n) => n._id);
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

  //
  // Searchbar
  const [searchLoader, setSearchLoader] = useState(false);

  let handleSearchData = async (values) => {
    setSearchLoader(true);
    // const token = cookies.get("token");
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/payments/success_search",
      {
        search: values,
      }
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    if (res.data.statusCode === 200) {
      if (values !== "") {
        setSearchLoader(false);
        setPhonepePayments(res.data.data);
        setCountData(res.data.count);
      } else {
        setSearchLoader(false);

        getData();
      }
    }
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
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/language/filterData/",
        {
          startingDate: startingDateFormatted,
          endingDate: endingDateFormatted,
        }
      );

      if (response.data.statusCode === 200) {
        setPhonepePayments(response.data.findByDateWisenData);
        setCountData(response.data.totalCount);
      }
    }
  };
  React.useEffect(() => {
    if (data.startingDate && data.endingDate) {
      filterDate();
    }
  }, [data.startingDate, data.endingDate]);

  return (
    <>
      <UserSidebar />

      <Box sx={{ width: "100%", pb: "2%", pl: "2%", pr: "2%" }}>
        <div>
          <div className="d-flex flex-row justify-content-start mb-2 gap-2">
            <div>
              <Button
                className="text-capitalize"
                size="small"
                onClick={() => navigate("/payment-fail")}
              >
                Fail
              </Button>
            </div>
            <div>
              <Button
                className="text-capitalize"
                size="small"
                onClick={() => navigate("/payment-success")}
                disabled={true}
              >
                Sucess
              </Button>
            </div>
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
            {/* {selected.length > 0 ? (
              <Typography
                sx={{ flex: "1 1 100%" }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {selected.length} selected
              </Typography>
            ) : ( */}
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Payments Success
            </Typography>
            {/* )} */}

            {/* <div className="d-flex gap-2 m-2">
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
            </div> */}

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
            {/* <>
              {selected.length > 0 ? (
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete()}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </> */}
            {/* );
              })()} */}
          </Toolbar>
          {loader || searchLoader ? (
            <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="50"
                visible={loader || searchLoader}
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
                    {/* <TableCell align="center" padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < phonepePayments?.length
                        }
                        checked={
                          phonepePayments?.length > 0 &&
                          selected.length === phonepePayments?.length
                        }
                        onChange={handleSelectAllClick}
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                      />
                    </TableCell> */}
                    {/* );
                      })()} */}

                    {headCells.map((headCell, id) => {
                      return (
                        <TableCell key={id} className="fw-bold" align="center">
                          {headCell.label}
                        </TableCell>
                      );
                    })}

                    {/* <TableCell className="fw-bold" align="center">
                      Action
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {phonepePayments?.map((row, index) => {
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
    </>
  );
}
