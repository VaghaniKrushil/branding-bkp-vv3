import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import logo from "../Components/logo/B_Profitable_Logo.png";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "axios";
// import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Select, MenuItem, CircularProgress } from "@material-ui/core";
import Cookies from "universal-cookie";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Collapse from "@material-ui/core/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import jwt_decode from "jwt-decode";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ReportIcon from "@mui/icons-material/Report";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import DomainSharpIcon from "@mui/icons-material/DomainSharp";
import ConstructionSharpIcon from "@mui/icons-material/ConstructionSharp";
import AllInboxSharpIcon from "@mui/icons-material/AllInboxSharp";
import AppRegistrationSharpIcon from "@mui/icons-material/AppRegistrationSharp";
import ListSubheader from "@mui/material/ListSubheader";
import swal from "sweetalert";
const drawerWidth = 290;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(2.5),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    // width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft({
  getData,
  getPartyData,
  getEngineerData,
}) {
  let navigate = useNavigate();

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  let cookies = new Cookies();

  let logOut = () => {
    cookies.remove("token");
    navigate("/login");
  };

  const [loader, setLoader] = useState(false);
  const downloadData = async () => {
    setLoader(true);

    try {
      // Use the 'responseType' option to handle binary data
      const res = await axios.get(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/downloadCollections",
        {
          responseType: "blob",
        }
      );

      // Create a Blob object from the binary data
      const blob = new Blob([res.data]);

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "collections.zip";
      link.click();
      if (res.status === 200) {
        swal("", "Backup Data Downloaded Successfully", "success");
        setLoader(false);
      } else {
        swal("", "Data Download Cancel. Try Again", "error");
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      swal("", error.message, "error");
      setLoader(false);
    }
  };

  const [customeDynamicSection, setCustomeDynamicSection] = useState(false);
  const handleCustomeDynamicSectionClick = () => {
    setCustomeDynamicSection((prev) => !prev);
  };

  const [myBusiness, setMyBusiness] = useState(false);
  const handleMyBsinessClick = () => {
    setMyBusiness((prev) => !prev);
  };

  const [todayAndTomorrow, setTodayAndTomorrow] = useState(false);
  const handleTodayAndTomorrowClick = () => {
    setTodayAndTomorrow((prev) => !prev);
  };

  const [dynamicSection, setDynamicSection] = useState(false);
  const handleDynamicSectionClick = () => {
    setDynamicSection((prev) => !prev);
  };

  const [trendingAndNews, setTrendingAndNews] = useState(false);
  const handleTrendingAndNewsClick = () => {
    setTrendingAndNews((prev) => !prev);
  };

  const [frame, setFrame] = useState(false);
  const handleFrameClick = () => {
    setFrame((prev) => !prev);
  };

  const [accessType, setAccessType] = useState(null);
  const [Role, setRole] = useState("");

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwt_decode(cookies.get("token"));
      setAccessType(jwt.accessType);
      setRole(jwt.role);
    } else {
      navigate("/login");
    }
  }, [cookies, navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" className="app-bar" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Avatar
            alt="Diamond"
            src={logo}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Branding Profitable
            {/* <div className="d-flex gap-1">
              <div className="text-danger">Branding</div>
              <div className="text-dark"> Profitable</div>
            </div> */}
          </Typography>

          {loader ? (
            <>
              <h6 className="p-3">Downloading...</h6>
              <Button color="inherit">
                <CircularProgress
                  size={20}
                  color="inherit"
                  style={{ marginRight: "8px" }}
                />
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                downloadData();
              }}
            >
              <CloudDownloadIcon />
            </Button>
          )}

          <Button
            color="inherit"
            onClick={() => {
              logOut();
            }}
          >
            <LogoutIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader className="d-flex flex-row justify-content-between align-items-center">
          <Avatar alt="Branding Profitable" src={logo} />
          {/* <div className="text-danger">Branding</div>
          <div className="text-dark"> Profitable</div> */}
          <div className="d-flex gap-1">
            <div className="text-danger">Branding</div>
            <div className="text-dark"> Profitable</div>
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          <ListSubheader className="text-primary">Dashboard</ListSubheader>

          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <Divider />

          {accessType &&
            (() => {
              if (!accessType.includes("Access")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/access")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Access" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          <ListSubheader className="text-primary">Banner</ListSubheader>

          {/* Main-Banner */}
          {accessType &&
            (() => {
              if (!accessType.includes("Main Banner")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/mainbanner")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Main Banner" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {/* Advertise-Banner */}
          {accessType &&
            (() => {
              if (!accessType.includes("Advertise Banner")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => navigate("/advertise_banner")}
                    >
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Advertise Banner" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {/* Popup-Banner */}
          {accessType &&
            (() => {
              if (!accessType.includes("Popup Banner")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/popup_banner")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Popup Banner" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {/* Splash Screen */}
          {accessType &&
            (() => {
              if (!accessType.includes("Splash Screen")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/splashscreen")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Splash Screen" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Business Banner")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => navigate("/business_banner")}
                    >
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Business Banner" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {/* Custome Dynamic Banner */}
          {accessType &&
            (() => {
              if (!accessType.includes("Custome Banner")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/cd_banner")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Custome Banner" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          <ListSubheader className="text-primary">
            Branding Profitable
          </ListSubheader>

          {accessType &&
            (() => {
              if (!accessType.includes("Today & Tomorrow")) {
                return null;
              }
              return (
                <>
                  <ListItem button onClick={handleTodayAndTomorrowClick}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Today & Tomorrow" />
                    {todayAndTomorrow ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItem>

                  <Collapse in={todayAndTomorrow} timeout="auto" unmountOnExit>
                    <List>
                      {/* Popup-Banner */}
                      <Divider />
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/today_category")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Today & Tomorrow Category" />
                        </ListItemButton>
                      </ListItem>
                      <Divider />

                      {/*  */}
                      <Divider />
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/todayandtomorrow")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Today & Tomorrow" />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </List>
                  </Collapse>
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Trending & News")) {
                return null;
              }
              return (
                <>
                  <ListItem button onClick={handleTrendingAndNewsClick}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Trending & News" />
                    {trendingAndNews ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItem>

                  <Collapse in={trendingAndNews} timeout="auto" unmountOnExit>
                    <List>
                      {/* Business Type  */}
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/trending_category")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Trending&News Category" />
                        </ListItemButton>
                      </ListItem>

                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/trending_section")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Trending&News" />
                        </ListItemButton>
                      </ListItem>

                      {/* My Business */}
                      {/* <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/my_business")}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Business" />
                </ListItemButton>
              </ListItem>

              <Divider /> */}
                    </List>
                  </Collapse>
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Category Days")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/days")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Category Days" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Custome Dynamic Section")) {
                return null;
              }
              return (
                <>
                  <ListItem button onClick={handleCustomeDynamicSectionClick}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="CDS" />
                    {customeDynamicSection ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItem>

                  <Collapse
                    in={customeDynamicSection}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List>
                      {/* Add Blog Category  */}
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/cds_category")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="CDS Category" />
                        </ListItemButton>
                      </ListItem>

                      {/* Canva Editor */}
                      {/* <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/canva_editor")}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="CDS" />
                </ListItemButton>
              </ListItem> */}

                      {/* Canva Editor */}
                      <Divider />
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/cds")}>
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Custome Section" />
                        </ListItemButton>
                      </ListItem>

                      <Divider />
                    </List>
                  </Collapse>
                </>
              );
            })()}

          {/* Frame-Request */}
          {accessType &&
            (() => {
              if (!accessType.includes("Frame Request")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/framerequest")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Frame-Requesṭ" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Frame Responce")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => navigate("/framerequest-responce")}
                    >
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Frame-Responce" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {/* View Frame */}
          {accessType &&
            (() => {
              if (!accessType.includes("Frame")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/viewCanvaFrame")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="View Frame" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("My Business")) {
                return null;
              }
              return (
                <>
                  <ListItem button onClick={handleMyBsinessClick}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Business" />
                    {myBusiness ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItem>

                  <Collapse in={myBusiness} timeout="auto" unmountOnExit>
                    <List>
                      {/* Business Type  */}
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/business_type")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Business Type" />
                        </ListItemButton>
                      </ListItem>

                      {/* Business Category  */}
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/business_category")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Business Category" />
                        </ListItemButton>
                      </ListItem>

                      {/* My Business */}
                      <Divider />
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/my_business")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="My Business" />
                        </ListItemButton>
                      </ListItem>

                      <Divider />
                    </List>
                  </Collapse>
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Dynamic Section")) {
                return null;
              }
              return (
                <>
                  <ListItem button onClick={handleDynamicSectionClick}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dynamic Section" />
                    {dynamicSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItem>

                  <Collapse in={dynamicSection} timeout="auto" unmountOnExit>
                    <List>
                      {/* Business Type  */}
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/dynamic_category")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Dynamic Category" />
                        </ListItemButton>
                      </ListItem>

                      {/* Business Type  */}
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate("/dynamic_section")}
                        >
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Dynamic Data" />
                        </ListItemButton>
                      </ListItem>

                      {/* My Business */}
                      {/* <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/my_business")}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Business" />
                </ListItemButton>
              </ListItem>

              <Divider /> */}
                    </List>
                  </Collapse>
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Add Language")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/language")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Add Language" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {/* Send Notification */}
          {accessType &&
            (() => {
              if (!accessType.includes("Notification")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/notification")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Notification" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          <ListSubheader className="text-primary">Network</ListSubheader>

          {accessType &&
            (() => {
              if (!accessType.includes("Wallet")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/wallet")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Wallet" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Users")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/users")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Users" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Tree")) {
                return null;
              }
              return (
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/tree")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Tree" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {/* {accessType &&
            (() => {
              if (!accessType.includes("Add Clipping")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/clipping")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="AddClippingCount" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()} */}

          {accessType &&
            (() => {
              if (!accessType.includes("Withdrawal Request")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/withdrawal")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Withdrawal Req" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Payment History")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/mlm-pending")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Payment History" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Payment(V2)")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/payment-fail")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Payment(V2)" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("kyc")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/kyc")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="KYC" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {accessType &&
            (() => {
              if (!accessType.includes("Passbook")) {
                return null;
              }
              return (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/passbook")}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Passbook" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })()}

          {/* <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/payment-history")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Payment Status" />
            </ListItemButton>
          </ListItem>
          <Divider /> */}

          {/* <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/trending")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Trending & News" />
            </ListItemButton>
          </ListItem>
          <Divider /> */}

          {/* ========================================= */}

          {/* <ListItem button onClick={handleFrameClick}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Frame" />
            {frame ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>

          <Collapse in={frame} timeout="auto" unmountOnExit>
            <List>
    

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    // window.location.replace(
                    //   "https://bpk-canva-frame-4841.vercel.app"
                    // )
                    navigate("/canva-frame")
                  }
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Frame" />
                </ListItemButton>
              </ListItem>

         
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/viewCanvaFrame")}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Frame" />
                </ListItemButton>
              </ListItem>

              <Divider />
            </List>
          </Collapse> */}

          {/* =========================================== */}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
