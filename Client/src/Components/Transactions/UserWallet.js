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

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Full Name",
  },
  {
    label: "Mobile Number",
  },
  {
    label: "Grenn Wallet",
  },
  {
    label: "Red Wallet",
  },

  {
    label: "Purchase Date",
  },
  {
    label: "Side",
  },
  {
    label: "Total Left",
  },
  {
    label: "Total Right",
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return formattedDate;
  };

  const formatDirectorDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const reformatDate = (originalDate) => {
    const [datePart, timePart] = originalDate.split(" ");
    const [year, month, day] = datePart.split("-");
    const formattedDate = `${month}-${day}-${year} ${timePart}`;
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
        <TableCell align="center">{row.fullName}</TableCell>

        <TableCell
          align="center"
          onClick={() => navigate(`/wallet-history/${row.number}`)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {row.number}
        </TableCell>
        <TableCell align="center">{row.green_wallet}</TableCell>
        <TableCell align="center">{row.red_wallet}</TableCell>

        <TableCell align="center"> {reformatDate(row.date)}</TableCell>
        <TableCell align="center">{row.add_side}</TableCell>
        <TableCell align="center">{row.total_left_side}</TableCell>
        <TableCell align="center">{row.total_right_side}</TableCell>

        {/* <TableCell align="center"> {formatDate(row.registrationDate)}</TableCell> */}

        {/* <TableCell align="center">
          <button class="btn btn-default" onClick={() => seletedEditData(row)}>
            <EditIcon />
          </button>
        </TableCell> */}
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ paddingLeft: 15, margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Other Data :
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="fw-bold" align="center">
                      B1
                    </TableCell>
                    <TableCell className="fw-bold" align="center">
                      B2
                    </TableCell>
                    <TableCell className="fw-bold" align="center">
                      B3
                    </TableCell>
                    <TableCell className="fw-bold" align="center">
                      B4
                    </TableCell>
                    <TableCell className="fw-bold" align="center">
                      B5
                    </TableCell>
                    <TableCell className="fw-bold" align="center">
                      B6
                    </TableCell>
                    <TableCell className="fw-bold" align="center">
                      B7
                    </TableCell>
                    <TableCell className="fw-bold" align="center">
                      Director Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      {row.V1 === "0" ? "-" : formatDate(row.V1)}
                    </TableCell>
                    <TableCell align="center">
                      {row.V2 === "0" ? "-" : formatDate(row.V2)}
                    </TableCell>
                    <TableCell align="center">
                      {row.V3 === "0" ? "-" : formatDate(row.V3)}
                    </TableCell>
                    <TableCell align="center">
                      {row.V4 === "0" ? "-" : formatDate(row.V4)}
                    </TableCell>
                    <TableCell align="center">
                      {row.V5 === "0" ? "-" : formatDate(row.V5)}
                    </TableCell>
                    <TableCell align="center">
                      {row.V6 === "0" ? "-" : formatDate(row.V6)}
                    </TableCell>
                    <TableCell align="center">
                      {row.V7 === "0" ? "-" : formatDate(row.V7)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDirectorDate(row.director_date)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="d-flex gap-5 mt-3">
                <div className="fw-bold">
                  Sponcor Income: {row.income_totals?.Sponsor_Bonus}
                </div>
                <div className="fw-bold">
                  Pair Income: {row.income_totals?.Pair_Bonus}
                </div>
                <div className="fw-bold">
                  Royalty Income: {row.income_totals?.Royalty_Bonus}
                </div>
                <div className="fw-bold">
                  Global Income: {row.income_totals?.Global_Royalty}{" "}
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function UserWallet() {
  let navigate = useNavigate();

  const [image, setImage] = useState("");
  const [imgLoader, setImgLoader] = useState(false);

  let [userWalletHistory, setuserWalletHistory] = useState([]);
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [limit, setLimit] = useState(10);
  const [selectDataLoader, setSelectDataLoader] = useState(false);
  const getData = async () => {
    // const token = cookies.get("token");
    try {
      setSelectDataLoader(true);
      const res = await axios.get(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/user_wallet",
        {
          params: {
            pageSize: rowsPerPage,
            pageNumber: page,
            limit: limit,
          },
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );
      setSelectDataLoader(false);
      setLoader(false);
      setuserWalletHistory(res.data.history);
      setCountData(res.data.totalUsernCount); // Make sure to adjust the key here
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
      setSelectDataLoader(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, [rowsPerPage, page, limit]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setLimit(event.target.value);
    setPage(0);
  };

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = userWalletHistory?.map((n) => n._id);
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

  const [searchLoader, setSearchLoader] = useState(false);
  // Searchbar
  let handleSearchData = async (values) => {
    setSearchLoader(true);
    let res = await axios.post(
      `https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/search_user_wallet`,
      {
        search: values,
      }
    );
    if (res.data.statusCode === 200) {
      setSearchLoader(false);
      if (values !== "") {
        setuserWalletHistory(res.data.history);
      } else {
        getData();
      }
    }
  };

  //   edit machine-type here
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [id, setId] = React.useState();

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
                User Details
              </Typography>
            )}

            <div className="d-flex gap-3">
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
              {selected.length > 0 ? <Tooltip title="Delete"></Tooltip> : null}
            </>
          </Toolbar>
          {loader || searchLoader || selectDataLoader ? (
            <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="50"
                visible={loader || searchLoader || selectDataLoader}
              />
            </div>
          ) : (
            <TableContainer>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"></TableCell>

                    {/* <TableCell align="center" padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < userWalletHistory?.length
                        }
                        checked={
                          userWalletHistory?.length > 0 &&
                          selected.length === userWalletHistory?.length
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userWalletHistory?.map((row, index) => {
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
                // onRowsPerPageChange={handleChangeRowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </Paper>
      </Box>
    </>
  );
}
