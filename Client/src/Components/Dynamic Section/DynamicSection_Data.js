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
import Autocomplete from "@mui/material/Autocomplete";

import Switch from "@mui/material/Switch";
import { imagePath } from "../ImageVariableGlobal/ImageVariableGlobal";

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Category Name",
  },
  {
    label: "Image",
  },
  {
    label: "Video/Image",
  },
  {
    label: "Language",
  },
  {
    label: "Switch",
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
        <TableCell align="center">{row.ds_category}</TableCell>

        {/* <TableCell align="center">
          <a
            href={row.ds_itemImage}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // Open the image in a new tab
              window.open(imagePath + row.ds_itemImage, "_blank");
            }}
          >
            <img
              src={imagePath + row.ds_itemImage}
              alt={row.ds_itemImage}
              width="50px"
              height="50px"
            />
          </a>
        </TableCell> */}

        <TableCell align="center">
          {row.isVideo ? (
            <a href={imagePath + row.ds_itemImage} target="_blank">
              Video
            </a>
          ) : (
            <img
              src={imagePath + row.ds_itemImage}
              alt={row.ds_itemImage}
              width="50px"
              height="50px"
            />
          )}
        </TableCell>

        <TableCell align="center">{row.isVideo ? "Video" : "Image"}</TableCell>

        <TableCell align="center">{row.languageName}</TableCell>
        {/* <TableCell align="center">
          {row.bannerSwitch === true ? "True" : "False"}
        </TableCell> */}
        <TableCell align="center">
          <div>
            <Switch {...label} checked={row.ds_itemSwitch} />
          </div>
        </TableCell>
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

export default function DynamicSection_Data() {
  let navigate = useNavigate();

  const [image, setImage] = useState("");
  const [compImage, setCompImage] = useState("");
  const [imgLoader, setImgLoader] = useState(false);

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
        setMultiImage(imagesPath);
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

  let [getDynamicSection, setGetDynamicSection] = useState([]);
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);
  const [totalImage, setTotalImage] = useState()

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  let getData = async () => {
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/ds_item/get_ds_item",
      {
        pageSize: rowsPerPage,
        pageNumber: page,
      }
    );
    setLoader(false);
    setGetDynamicSection(res.data.data);
    setCountData(res.data.DynamicSection_ItemCount);
    setTotalImage(res.data.DynamicSection_ItemCount);
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
      const newSelected = getDynamicSection.map((n) => n._id);
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
          .post(
            "https://brandingprofitable-29d465d7c7b1.herokuapp.com/ds_item/delete_ds_item",
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

  //
  // Searchbar
  let handleSearchData = async (values) => {
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/ds_item/search_ds_item",
      {
        search: values,
      }
    );
    if (res.data.statusCode === 200) {
      if (values !== "") {
        setGetDynamicSection(res.data.data);
        setCountData(res.data.count)
      } else {
        getData();
      }
    }
  };

  var handleSubmitMultiImage = async (values) => {
    values["ds_itemImage"] = multiImage;
    values["comp_iamge"] = multipleCompressedImage;
    values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
    values["createTime"] = moment(new Date()).format("HH:mm:ss");
    values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
    values["addDate"] = moment()
      .add(2, "seconds")
      .format("YYYY-MM-DD HH:mm:ss");

    const imageUrls = Array.isArray(values.ds_itemImage)
      ? values.ds_itemImage
      : [values.ds_itemImage];

    const imageUrlsCompresse = Array.isArray(values.comp_iamge)
      ? values.comp_iamge
      : [values.comp_iamge];

    let successShown = false;

    for (let i = 0; i < imageUrls.length; i++) {
      // Extract the filename from the URL
      // const url = new URL(imageUrl);
      // const filename = url.pathname.split("/").pop();

      const dataToSend = {
        ds_category: values.ds_category,
        ds_itemImage: imageUrls[i], // Store only the filename
        comp_iamge: imageUrlsCompresse[i],
        ds_itemSwitch: values.ds_itemSwitch,
        languageName: values.languageName,
        isVideo: values.isVideo,
        createDate: values.createDate,
        createTime: values.createTime,
        updateDate: values.updateDate,
        addDate: values.addDate,
      };

      try {
        const res = await axios.post(
          "https://brandingprofitable-29d465d7c7b1.herokuapp.com/ds_item/ds_item",
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

    setMultipleDataSendModal(false);
    getData();
  };

  //   edit machine-type here
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [multipleDataSendModal, setMultipleDataSendModal] = useState(false);
  let [id, setId] = React.useState();
  if (!id) {
    var handleSubmit = async (values) => {
      values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["createTime"] = moment(new Date()).format("HH:mm:ss");
      values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
      values["ds_itemImage"] = image;
      values["comp_iamge"] = compImage;
      values["addDate"] = moment()
        .add(2, "seconds")
        .format("YYYY-MM-DD HH:mm:ss");
      let res = await axios.post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/ds_item/ds_item",
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
      values["ds_itemImage"] = image;
      values["comp_iamge"] = compImage;
      let response = await axios.put(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/ds_item/ds_item/" +
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
    setImage(imagePath + datas.ds_itemImage);
  };

  // Formik
  let [dynamicSectionDataFormik, setDynamicSectionDataFormik] = useState({});
  const FormikValues = () => {
    const formik = useFormikContext();
    React.useEffect(() => {
      setDynamicSectionDataFormik(formik.values);
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
  let [dynamicSectionCategory, setDynamicSectionCategory] = useState();

  let getCategoryNameData = async () => {
    let responce = await axios.get(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/ds_title/ds_category"
    );
    setDynamicSectionCategory(responce.data.data);
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

  // -----------------Dropdawn Logic---------------------------------------

  let [searchData, setSearchData] = useState({ categoryName: "" });

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
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/ds_item/filter_ds_item",
      {
        ds_category: searchData.ds_category,
      }
    );
    if (response.data.statusCode === 200) {
      setGetDynamicSection(response.data.data);
      setCountData(response.data.totalCount);
    }
  };
  React.useEffect(() => {
    if (searchData) {
      filterDate();
    }
  }, [searchData]);
  // ----------------------------------------------------------------------

  // ----------------------Date Filter Logic---------------------------------------
  const [data, setData] = useState({
    startingDate: "",
    endingDate: "",
  });

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

  const filterDateWiseData = async () => {
    if (data.startingDate && data.endingDate) {
      // Format the dates to match the database format
      const startingDateFormatted = moment(data.startingDate).format(
        "DD-MM-YYYY"
      );
      const endingDateFormatted = moment(data.endingDate).format("DD-MM-YYYY");

      let response = await axios.post(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/ds_item/filterData/",
        {
          startingDate: startingDateFormatted,
          endingDate: endingDateFormatted,
        }
      );

      if (response.data.statusCode === 200) {
        setGetDynamicSection(response.data.findByDateWisenData);
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
                setModalShowForPopupForm(true);
                setId(null);
                setEditData({});
                setImage({});
                setSelectedCategoryName({});
              }}
            >
              Add Dynamic Data
            </Button>

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
          </div>
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
                Dynamic Section
              </Typography>
            )}
            {/* 
            <div className="d-flex gap-2 m-2">
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
            </div> */}

            <div className="d-flex gap-3">
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Select Category</InputLabel>
                <Select
                  label="Select Category"
                  name="ds_category"
                  value={searchData?.ds_category}
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
                        ds_category: "",
                      });
                    }}
                  >
                    All
                  </MenuItem>
                  {dynamicSectionCategory?.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e.ds_category}>
                        {e.ds_category}
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
                          selected.length < getDynamicSection?.length
                        }
                        checked={
                          getDynamicSection?.length > 0 &&
                          selected.length === getDynamicSection?.length
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
                  {getDynamicSection?.map((row, index) => {
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
        <DialogTitle>{"Dynamic Section"}</DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              ds_category:
                editData && editData.ds_category ? editData.ds_category : "",
              ds_itemSwitch:
                editData && editData.ds_itemSwitch
                  ? editData.ds_itemSwitch
                  : "",
              languageName:
                editData && editData.languageName ? editData.languageName : "",
              isVideo: editData && editData.isVideo ? editData.isVideo : "",
            }}
            validationSchema={Yup.object().shape({
              ds_category: Yup.string().required("Required"),
              //   bannerImage: Yup.string().required("Required"),
              ds_itemSwitch: Yup.boolean().required("Required"),
              languageName: Yup.string().required("Required"),
              isVideo: Yup.boolean().required("Required"),
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
                  {/* <div className="mt-4">
                    <FormControl fullWidth>
                      <InputLabel size="small">Select Category</InputLabel>
                      <Select
                        size="small"
                        label="Select Category"
                        name="ds_category"
                        value={values.ds_category}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {dynamicSectionCategory?.map((option) => (
                          <MenuItem
                            key={option?.ds_category}
                            value={option?.ds_category}
                          >
                            {option.ds_category}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.ds_category && errors.ds_category ? (
                        <div className="text-danger">{errors.ds_category}</div>
                      ) : null}
                    </FormControl>
                  </div> */}

                  <div className="mt-3">
                    <FormControl fullWidth>
                      <Autocomplete
                        options={dynamicSectionCategory || []}
                        getOptionLabel={(option) => option.ds_category || ""}
                        value={selectedCategoryName || null}
                        onChange={(_, newValue) => {
                          setSelectedCategoryName(newValue);
                          handleChange({
                            target: {
                              name: "ds_category",
                              value: newValue ? newValue.ds_category : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category Name"
                            name="ds_category"
                            size="small"
                            onBlur={handleBlur}
                          />
                        )}
                        filterOptions={(options, state) => {
                          return options.filter((option) =>
                            option.ds_category
                              .toLowerCase()
                              .includes(state.inputValue.toLowerCase())
                          );
                        }}
                        noOptionsText="No matching Category Name"
                      />
                    </FormControl>
                    {touched.ds_category && errors.ds_category ? (
                      <div className="text-danger field-error">
                        {errors.ds_category}
                      </div>
                    ) : null}
                    {/* </div> */}
                    {/* {dynamicSectionDataFormik.ds_category ? (
<div className="mt-4">
<TextField fullWidth size="small" id="outlined-select-currency" label="Party City" name="partyCity" disabled
value={showPartyCity} />
</div>
) : null} */}
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

                  <div className="w-100 mb-3 mt-3">
                    <TextField
                      fullWidth
                      size="small"
                      select
                      label="Switch"
                      name="ds_itemSwitch"
                      value={values.ds_itemSwitch}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      {/* <MenuItem value="">Select Role</MenuItem> */}
                      <MenuItem value={true}>On</MenuItem>
                      <MenuItem value={false}>Off</MenuItem>
                    </TextField>
                    {touched.ds_itemSwitch && errors.ds_itemSwitch ? (
                      <div className="text-danger">{errors.ds_itemSwitch}</div>
                    ) : null}
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
      {/* ======================================================== */}

      <Dialog
        fullWidth
        open={multipleDataSendModal}
        onClose={() => setMultipleDataSendModal(false)}
      >
        <DialogTitle>{"Add Multiple Item"}</DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              ds_category:
                editData && editData.ds_category ? editData.ds_category : "",
              ds_itemSwitch:
                editData && editData.ds_itemSwitch
                  ? editData.ds_itemSwitch
                  : "",
              languageName:
                editData && editData.languageName ? editData.languageName : "",
              isVideo: editData && editData.isVideo ? editData.isVideo : "",
            }}
            validationSchema={Yup.object().shape({
              ds_category: Yup.string().required("Required"),
              ds_itemSwitch: Yup.boolean().required("Required"),
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
                  {/* <div className="mt-4">
                    <FormControl fullWidth>
                      <InputLabel size="small">Select Category</InputLabel>
                      <Select
                        size="small"
                        label="Select Category"
                        name="ds_category"
                        value={values.ds_category}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        MenuProps={{
                          style: {
                            maxHeight: 210,
                          },
                        }}
                      >
                        {dynamicSectionCategory?.map((option) => (
                          <MenuItem
                            key={option?.ds_category}
                            value={option?.ds_category}
                          >
                            {option.ds_category}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.ds_category && errors.ds_category ? (
                        <div className="text-danger">{errors.ds_category}</div>
                      ) : null}
                    </FormControl>
                  </div> */}

                  <div className="mt-4">
                    <FormControl fullWidth>
                      <Autocomplete
                        options={dynamicSectionCategory || []}
                        getOptionLabel={(option) => option.ds_category || ""}
                        value={selectedCategoryName || null}
                        onChange={(_, newValue) => {
                          setSelectedCategoryName(newValue);
                          handleChange({
                            target: {
                              name: "ds_category",
                              value: newValue ? newValue.ds_category : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category Name"
                            name="ds_category"
                            size="small"
                            onBlur={handleBlur}
                          />
                        )}
                        filterOptions={(options, state) => {
                          return options.filter((option) =>
                            option.ds_category
                              .toLowerCase()
                              .includes(state.inputValue.toLowerCase())
                          );
                        }}
                        noOptionsText="No matching Category Name"
                      />
                    </FormControl>
                    {touched.ds_category && errors.ds_category ? (
                      <div className="text-danger field-error">
                        {errors.ds_category}
                      </div>
                    ) : null}
                    {/* </div> */}
                    {/* {dynamicSectionDataFormik.ds_category ? (
<div className="mt-4">
<TextField fullWidth size="small" id="outlined-select-currency" label="Party City" name="partyCity" disabled
value={showPartyCity} />
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

                  <div className="w-100 mb-3 mt-3">
                    <TextField
                      fullWidth
                      size="small"
                      select
                      label="Switch"
                      name="ds_itemSwitch"
                      value={values.ds_itemSwitch}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      {/* <MenuItem value="">Select Role</MenuItem> */}
                      <MenuItem value={true}>On</MenuItem>
                      <MenuItem value={false}>Off</MenuItem>
                    </TextField>
                    {touched.ds_itemSwitch && errors.ds_itemSwitch ? (
                      <div className="text-danger">{errors.ds_itemSwitch}</div>
                    ) : null}
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
