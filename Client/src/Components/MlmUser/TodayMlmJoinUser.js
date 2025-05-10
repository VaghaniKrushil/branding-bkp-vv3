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
    label: "Name",
  },
  {
    label: "ReferralCode",
  },
  {
    label: "Mobile Number",
  },
  {
    label: "Purchase Date",
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

  const reformatRegisterDate = (originalDate) => {
    const [year, month, day] = originalDate.split("-");
    const formattedDate = `${day}/${month}/${year}`;
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
        {/* <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell> */}

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
        <TableCell align="center">{row.fullName || row.businessType}</TableCell>
        <TableCell align="center">{row.referral_id}</TableCell>

        <TableCell align="center">{row.number}</TableCell>
        <TableCell align="center">
          {" "}
          {reformatRegisterDate(row.register_date)}
        </TableCell>
        {/* <TableCell align="center"> {formatDate(row.registrationDate)}</TableCell> */}

        {/* <TableCell align="center">
          <button class="btn btn-default" onClick={() => seletedEditData(row)}>
            <EditIcon />
          </button>
        </TableCell> */}
      </TableRow>

      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
        {/* <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ paddingLeft: 15, margin: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              Other Data :
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="fw-bold" align="center">
                    Adress
                  </TableCell>
                  <TableCell className="fw-bold" align="center">
                    Email
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{row.adress}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Collapse> */}
      </TableCell>
    </React.Fragment>
  );
}

export default function TodayMlmJoinUser() {
  let navigate = useNavigate();

  const [image, setImage] = useState("");
  const [imgLoader, setImgLoader] = useState(false);

  //   let [getCategoryData, setGetCategoryData] = useState([]);
  let [addLanguage, setAddLanguage] = useState([]);
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const getData = async () => {
    try {
      const res = await axios.get(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/todayjoin",
        {
          params: {
            pageSize: rowsPerPage,
            pageNumber: page,
          },
        }
      );
      setLoader(false);
      setAddLanguage(res.data.history);
      setCountData(res.data.totalTodayJoinCount); // Make sure to adjust the key here
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
      const newSelected = addLanguage?.map((n) => n._id);
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
  // var handleDelete = () => {
  //   const token = cookies.get("token");
  //   axios
  //     .delete(
  //       "https://brandingprofitable-29d465d7c7b1.herokuapp.com/language/language",
  //       {
  //         data: selected,
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response.data.statusCode === 200) {
  //         getData();
  //         setSelected([]);
  //         swal("", response.data.message, "success");
  //       }
  //     });
  // };

  //
  // Searchbar
  // let handleSearchData = async (values) => {
  //   const token = cookies.get("token");
  //   let res = await axios.post(
  //     "https://brandingprofitable-29d465d7c7b1.herokuapp.com/language/language/search",
  //     {
  //       search: values,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   if (res.data.statusCode === 200) {
  //     if (values !== "") {
  //       setAddLanguage(res.data.data);
  //     } else {
  //       getData();
  //     }
  //   }
  // };

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
  //   handleSubmit = async (values) => {
  //     let response = await axios.put(
  //       "https://brandingprofitable-29d465d7c7b1.herokuapp.com/language/language" + id,
  //       values
  //     );

  //     if (response.data.statusCode === 200) {
  //       setModalShowForPopupForm(false);
  //       getData();
  //       swal("", response.data.message, "success");
  //     }
  //   };
  // }

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
                Today Purchase MLM
              </Typography>
            )}
            {/* <form className="form-inline">
              <inputf
                id="serchbar-size"
                className="form-control mr-sm-2"
                type="search"
                onChange={(e) => handleSearchData(e.target.value)}
                placeholder="Search"
                aria-label="Search"
              />
            </form> */}

            {/* {accessType &&
              (() => {
                if (!accessType.includes("Allow To Delete")) {
                  return null;
                }
                return ( */}
            <>
              {selected.length > 0 ? (
                <Tooltip title="Delete">
                  {/* <IconButton onClick={() => handleDelete()}>
                    <DeleteIcon />
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
                    {/* <TableCell align="center"></TableCell> */}

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
                  {addLanguage?.map((row, index) => {
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
