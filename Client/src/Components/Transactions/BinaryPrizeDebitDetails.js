// import React from 'react'

// function BinaryPrizeDebitDetails() {
//   return (
//     <div>BinaryPrizeDebitDetails</div>
//   )
// }

// export default BinaryPrizeDebitDetails

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
import { useNavigate, useParams } from "react-router-dom";
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
    label: "Transaction Id",
  },
  {
    label: "Full Name",
  },
  {
    label: "Credit/Debit",
  },
  {
    label: "Anount",
  },
  {
    label: "Type",
  },
  {
    label: "Date",
  },
  {
    label: "Reason",
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

  const reformatDate = (originalDate) => {
    const [datePart, timePart] = originalDate.split(" ");
    const [year, month, day] = datePart.split("-");
    const formattedDate = `${day}-${month}-${year} ${timePart}`;
    return formattedDate;
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
        {/* <TableCell align="center">{ row + 1}</TableCell> */}
        <TableCell align="center">{row.transaction_id}</TableCell>
        <TableCell align="center">{row.fullName}</TableCell>
        <TableCell align="center">
          {row.C_D_type === "D" ? "Debit" : "Credit"}
        </TableCell>

        {/* <TableCell align="center"> {reformatDate(row.date)}</TableCell> */}
        <TableCell align="center"> {row.amount}</TableCell>
        <TableCell align="center"> {row.type}</TableCell>
        <TableCell align="center"> {reformatDate(row.date)}</TableCell>
        <TableCell align="center"> {row.reson}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function BinaryPrizeDebitDetails() {
  let navigate = useNavigate();

  const [totalDebitDetail, setTotalDebitDetails] = useState([]);
  console.log(totalDebitDetail, "totalDebitDetail");
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(200);
  const { number, name } = useParams();
  const getData = async () => {
    // const token = cookies.get("token");
    try {
      const res = await axios.get(
        `https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/total_binarydebit_history/${number}`,
        {
          params: {
            pageSize: rowsPerPage,
            pageNumber: page,
          },
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );

      setLoader(false);
      setTotalDebitDetails(res.data.history);
      setCountData(res.data.totalUserHistoryCount); // Make sure to adjust the key here
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
      const newSelected = totalDebitDetail?.map((n) => n._id);
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

  //   edit machine-type here
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [id, setId] = React.useState();

  let [searchData, setSearchData] = useState({ income_type: "" });

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

  //   const [dropdownLoader, setDropdownLoader] = useState(false);
  //   var filterDate = async () => {
  //     setDropdownLoader(true);
  //     let response = await axios.post(
  //       `https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/filter_all_userhistory/${number}/All`,
  //       {
  //         income_type: searchData.income_type,
  //       }
  //     );
  //     if (response.data.statusCode === 200) {
  //     //   setTotalDebitDetails(response.data.history);
  //       setCountData(response.data.totalUserHistoryCount);
  //       setDropdownLoader(false);
  //     }
  //   };
  //   React.useEffect(() => {
  //     if (searchData) {
  //       filterDate();
  //     }
  //   }, [searchData]);

  //   const [searchLoader, setSearchLoader] = useState(false)
  //   // Searchbar
  //   let handleSearchData = async (values) => {
  //     setSearchLoader(true)
  //     let res = await axios.post(
  //       `https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/search_userhistory/${number}/All`,
  //       {
  //         search: values,
  //       }
  //     );
  //     if (res.data.statusCode === 200) {
  //       setSearchLoader(false)
  //       if (values !== "") {
  //         // setTotalDebitDetails(res.data.history);
  //       } else {
  //         getData();
  //       }
  //     }
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
                Binary Debit History: {name}, {number}
              </Typography>
            )}
            {/* <div className="d-flex gap-3">
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

              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>income_type</InputLabel>
                <Select
                  label="income_type"
                  name="income_type"
                  value={searchData?.income_type}
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
                        income_type: "",
                      });
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem value="Sponsor Income">Sponsor Income</MenuItem>
                  <MenuItem value="Pair Income">Pair Income</MenuItem>
                  <MenuItem value="Limit Pair Income">
                    Limit Pair Income
                  </MenuItem>
                  <MenuItem value="Royalty">Royalty</MenuItem>
                  <MenuItem value="Global Royalty">Global Royalty</MenuItem>
                </Select>
              </FormControl>
            </div> */}

            <>
              {selected.length > 0 ? <Tooltip title="Delete"></Tooltip> : null}
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
                    {/* <TableCell align="center"></TableCell> */}

                    {/* <TableCell align="center" padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < totalDebitDetail?.length
                        }
                        checked={
                          totalDebitDetail?.length > 0 &&
                          selected.length === totalDebitDetail?.length
                        }
                        onChange={handleSelectAllClick}
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                      />
                    </TableCell> */}

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
                  {totalDebitDetail?.map((row, index) => {
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
                        // seletedEditData={seletedEditData}
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
