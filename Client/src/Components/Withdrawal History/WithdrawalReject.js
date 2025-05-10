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
import PDFIcon from "../logo/pdf.png";
import ExcelIcon from "../logo/excel.png";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
// import XLSXStyle from 'xlsx-style';
import generatePDF from "../reportGenerate";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import moment from "moment";
import FalseIcon from "../logo/error.png";
import TrueIcon from "../logo/accept.png";
import PendingIcon from "../logo/pending-tasks.png";

import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Full Name",
  },
  {
    label: "Transaction Id",
  },
  {
    label: "Amount",
  },
  {
    label: "Bank Name",
  },
  {
    label: "AC Number",
  },
  {
    label: "AC/Upi Name",
  },
  {
    label: "IFSC",
  },

  {
    label: "Reason",
  },
  {
    label: "status",
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

  let [modelShow, setModelShow] = React.useState(false);

  const [reason, setReason] = useState("");

  // Update the state when the TextField changes
  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleWidrawalHistoryReject = async (status) => {
    try {
      const response = await axios.put(
        `https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/withdrawal_reject`,
        {
          mobileNumber: row.mobileNumber, // Adjust with your row object structure
          transaction_id: row.transaction_id, // Adjust with your row object structure
          amount: row.amount, // Adjust with your row object structure
          reason: reason,
          status: "fail", // Assuming 'Rejected' as the status for rejection
        }
      );

      if (response.data.statusCode === 200) {
        setModelShow(false);
        swal("", response.data.message, "success");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      swal("", "An error occurred while processing your request.", "error");
    }
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row.transaction_id)}
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
        <TableCell align="center">{row.transaction_id}</TableCell>
        <TableCell align="center">{row.withdraw_amount}</TableCell>
        <TableCell align="center">{row.Bank_Name}</TableCell>
        <TableCell align="center">{row.Account_Number}</TableCell>
        <TableCell align="center">{row.Account_Name}</TableCell>
        <TableCell align="center">{row.Ifsc}</TableCell>

        <TableCell align="center">{row.reason}</TableCell>

        <TableCell align="center">
          {row.status.includes("Success") ? (
            <img src={TrueIcon} alt="Approve" />
          ) : // <FalseIcon />
          row.status.includes("fail") ? (
            <img src={FalseIcon} alt="Reject" />
          ) : (
            <Button
              onClick={() => {
                setModelShow(true);
              }}
            >
              Reject
            </Button>
          )}
        </TableCell>

        {/* <TableCell align="center">
          <button class="btn btn-default" onClick={() => seletedEditData(row)}>
            <EditIcon />
          </button>
        </TableCell> */}
      </TableRow>

      {/* -------------------------------------------------------------- */}
      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={modelShow}
        onClose={() => setModelShow(false)}
      >
        <DialogTitle>
          {"Reject"}
          <IconButton
            aria-label="close"
            onClick={() => setModelShow(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            {/* <CloseIcon /> */}
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableCell align="center">
              <div className="d-flex justify-content-center gap-3">
                <TextField
                  type="text"
                  size="small"
                  fullWidth
                  placeholder="Reason *"
                  label="Reason *"
                  name="reason"
                  value={reason}
                  onChange={handleReasonChange}
                />
                <Button onClick={() => handleWidrawalHistoryReject(row)}>
                  Submit
                </Button>
              </div>
            </TableCell>
          </Table>
        </DialogContent>
      </Dialog>
      {/* --------------------------------------------------------------- */}
    </React.Fragment>
  );
}

export default function WithdrawalReject() {
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
  let [addLanguage, setAddLanguage] = useState([]);
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(200);
  const getData = async () => {
    try {
      const res = await axios.get(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/widrawal_fail_history",
        // "https://brandingprofitable-29d465d7c7b1.herokuapp.com/withdrawal/withdrawal",
        {
          params: {
            pageSize: rowsPerPage,
            pageNumber: page,
          },
        }
      );
      setLoader(false);
      setAddLanguage(res.data.history);
      setCountData(res.data.totalWidrawalRejectCount); // Make sure to adjust the key here
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
      const newSelected = addLanguage?.map((n) => n.transaction_id);
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

  var handleUpdate = () => {
    try {
      swal("Has the money of the selected request been transferred?", {
        buttons: ["No", "Yes"],
      }).then(async (buttons) => {
        if (buttons === true) {
          axios
            .put("https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/withdrawal/success", {
              transactionIds: selected,
            })
            .then((response) => {
              if (response.data.statusCode === 200) {
                getData();
                setSelected([]);
                swal("", response.data.message, "success");
              } else {
                console.log(response.data, "dfghdf");
              }
            });
        }
      });
    } catch (error) {
      console.log("error in handle update ", error);
    }
  };

  // Searchbar
  let handleSearchData = async (values) => {
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/widrawal_fail/search",
      {
        search: values,
      },
    );
    if (res.data.statusCode === 200) {
      if (values !== "") {
        setAddLanguage(res.data.data);
        setCountData(res.data.count)
      } else {
        getData();
      }
    }
  };

  //   edit machine-type here
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [id, setId] = React.useState();
  // if (!id) {
  //   var handleSubmit = async (values) => {
  //     const token = "your_jwt_token_here";
  //     let res = await axios.post(
  //       "https://brandingprofitable-29d465d7c7b1.herokuapp.com/language/language",
  //       values
  //     );
  //     if (res.data.statusCode === 200) {
  //       setModalShowForPopupForm(false);
  //       getData();
  //       swal("", res.data.message, "success");
  //     } else {
  //       swal("", res.data.message, "error");
  //     }
  //   };
  // } else {
  var handleSubmit = async (values) => {
    let response = await axios.put(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/withdrawal/withdrawal/tobank",
      {
        isWidrawalRequestsSendToBank: true,
      }
    );

    if (response.data.statusCode === 200) {
      setModalShowForPopupForm(false);
      getData();
      swal("", response.data.message, "success");
    }
  };
  // }

  // var handleSubmit;

  if (!id) {
    handleSubmit = async (values) => {
      const token = cookies.get("token"); // Replace with your actual JWT token
      try {
        const res = await axios.post(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/language/language",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          swal("", res.data.message, "success");
        } else {
          swal("", res.data.message, "error");
        }
      } catch (error) {
        console.error("Error:", error);
        swal("", "An error occurred while processing your request.", "error");
      }
    };
  } else {
    handleSubmit = async (values) => {
      const token = cookies.get("token"); // Replace with your actual JWT token

      try {
        const response = await axios.put(
          `https://brandingprofitable-29d465d7c7b1.herokuapp.com/language/language/${id}`, // Use template literals to include the id
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          swal("", response.data.message, "success");
        }
      } catch (error) {
        console.error("Error:", error);
        swal("", "An error occurred while processing your request.", "error");
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

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  // const exportToCSV = () => {
  //   // for each ticket pass all its data into an array
  //   let rowData = addLanguage.map((row) => ({
  //     "Beneficiary Name": row.acName,
  //     "Beneficiary Account Number": row.acNumber,
  //     "IFSC": row.ifsc,
  //     "Transaction Type": "",
  //     "Debit Account Number": "",
  //     "Transaction Date": "",
  //     "Amount": row.withdrawalAmount,
  //     "Currency": "INR",

  //   }));
  //   // push each tickcet's info into a row
  //   console.log("Row Data", rowData);
  //   const ws = XLSX.utils.json_to_sheet(rowData);
  //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: fileType });
  //   FileSaver.saveAs(data, `Engineer  Report` + fileExtension);
  // };

  let [allReportData, setAllReportData] = React.useState([]);

  let Report_All = async () => {
    let response = await axios.get(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/withdrawal/withdrawal/history"
    );
    if (response.data.statusCode === 200) {
      setAllReportData(response.data.data);
    }
  };

  React.useEffect(() => {
    Report_All();
  }, []);

  const currentDate = moment(new Date()).format("DD-MM-YYYY");

  const exportToCSV = () => {
    let rowData = addLanguage.map((row, index) => ({
      "#": index + 1,
      "Beneficiary Name": row.Account_Name,
      "Beneficiary Account Number": row.Account_Number,
      IFSC: row.Ifsc,
      "Transaction Type": "NEFT",
      "Debit Account Number": "XXXXXXXXXXX",
      "Transaction Date": currentDate,
      Amount: row.withdraw_amount,
      Currency: "INR",
    }));

    const wsData = XLSX.utils.json_to_sheet(rowData);

    // Set column widths for specific columns
    const columnWidths = [
      { wch: 25 }, // Beneficiary Name
      { wch: 30 }, // Beneficiary Account Number
      { wch: 20 }, // IFSC
      { wch: 20 }, // Transaction Type
      { wch: 25 }, // Debit Account Number
      { wch: 20 }, // Transaction Date
      { wch: 20 }, // Amount
      { wch: 15 }, // Currency
    ];

    // Apply the column widths
    wsData["!cols"] = columnWidths;

    // Apply style to the header row (bold and blue color)
    const headerRange = XLSX.utils.decode_range(wsData["!ref"]);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRange.s.r, c: C });
      const cell = wsData[cellAddress];
      cell.s = { font: { bold: true, color: { rgb: "0000FF" } } };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsData, "data");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `Withdrawal` + fileExtension);
  };

  // const exportToCSV = () => {
  //   let rowData = addLanguage.map((row) => ({
  //     "Beneficiary Name": row.acName,
  //     "Beneficiary Account Number": row.acNumber,
  //     "IFSC": row.ifsc,
  //     "Transaction Type": "",
  //     "Debit Account Number": "",
  //     "Transaction Date": "",
  //     "Amount": row.withdrawalAmount,
  //     "Currency": "INR",
  //   }));

  //   const wsData = XLSX.utils.json_to_sheet(rowData);

  //   // Set column widths for specific columns
  //   const columnWidths = [
  //     { wch: 25 }, // Beneficiary Name
  //     { wch: 30 }, // Beneficiary Account Number
  //     { wch: 20 }, // IFSC
  //     { wch: 20 }, // Transaction Type
  //     { wch: 25 }, // Debit Account Number
  //     { wch: 20 }, // Transaction Date
  //     { wch: 20 }, // Amount
  //     { wch: 15 }, // Currency
  //   ];

  //   // Apply the column widths
  //   wsData['!cols'] = columnWidths;

  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, wsData, 'data');

  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: fileType });
  //   FileSaver.saveAs(data, `Engineer Report` + fileExtension);
  // };

  return (
    <>
      <UserSidebar />

      <Box sx={{ width: "100%", pb: "2%", pl: "2%", pr: "2%" }}>
        {/* <div id="main-btn-add-machinetype">
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
              Add Language
            </Button>
          </div>
        </div> */}

        <div className="d-flex gap-2">
          <Button
            onClick={() => {
              navigate("/withdrawal");
            }}
            className="mb-2"
          >
            Pending
          </Button>
          <Button
            onClick={() => {
              navigate("/withdrawal-progress");
            }}
            className="mb-2"
          >
            Progress
          </Button>
          <Button
            onClick={() => {
              navigate("/withdrawal-reject");
            }}
            className="mb-2"
            disabled={true}
          >
            Reject
          </Button>
          <Button
            onClick={() => {
              navigate("/withdrawal-success");
            }}
            className="mb-2"
          >
            Success
          </Button>

          <Button
            onClick={() => {
              navigate("/withdrawal-allhistory");
            }}
            className="mb-2"
          >
            All
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
                Withdrawal Reject
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
                  {/* <IconButton onClick={() => handleUpdate()}>
                    <AccountBalanceWalletIcon />
                  </IconButton> */}
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
                          selected.length < addLanguage?.length
                        }
                        checked={
                          addLanguage?.length > 0 &&
                          selected.length === addLanguage?.length
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

                    {/* <TableCell className="fw-bold" align="center">
                      Action
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addLanguage?.map((row, index) => {
                    const isItemSelected = isSelected(row.transaction_id);
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
    </>
  );
}
