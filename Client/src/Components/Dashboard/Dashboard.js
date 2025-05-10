import React from "react";
import Sidebar from "../UserSidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import UserSidebar from "../UserSidebar";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { RotatingLines } from "react-loader-spinner";
import jwt_decode from "jwt-decode";

function Dashboard() {
  let navigate = useNavigate();
  let cookies = new Cookies();

  let [loader, setLoader] = useState(true);

  const [dashboartMoneyCount, setDashboardMoneyCount] = useState();
  // let getDashboardMoneyCount = async () => {
  //   let responce = await axios.get(
  //     "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/dashboard"
  //   );
  //   setLoader(false);
  //   setDashboardMoneyCount(responce.data);
  // };
  let getDashboardMoneyCount = async () => {
    try {
      let response = await axios.get(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/dashboard"
      );
      setDashboardMoneyCount(response.data);
    } catch (error) {
      console.error("Error fetching dashboard money count:", error);
      // Handle the error, e.g., set an error state or display a message to the user.
    } finally {
      setLoader(false);
    }
  };

  React.useEffect(() => {
    getDashboardMoneyCount();
  }, []);

  // -----------------------------------------------------------------------Toady--------------------------
  // Today Company Balance
  const [companySixWallet, setCompanySixWallet] = useState();
  let getCompanySixWallet = async () => {
    let responce = await axios.get(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/companywallet"
    );
    setCompanySixWallet(responce.data);
  };

  React.useEffect(() => {
    getCompanySixWallet();
  }, []);
  // ---------------------------------------------------------------------------------------------------------

  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwt_decode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <UserSidebar
      // getData={getData}
      // getPartyData={getPartyData}
      // getEngineerData={getEngineerData}
      />
      {loader ? (
        <div className="d-flex flex-direction-row justify-content-center align-items-center vh-100">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="70"
            visible={loader}
          />
        </div>
      ) : (
        <div>
          <Grid
            container
            component="main"
            spacing={2}
            rowSpacing={3}
            className="marginside"
            sx={{ marginBottom: "40px" }}
          >
            {/* Total Credit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/credit-history")}
                      sx={{
                        backgroundColor: "#91DA21",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f0f4c3",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Total Credit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Total_Credit}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-solid fa-eye"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Total Sponcor Credit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      // onClick={() => navigate("/machine?value=amc-pending-data")}
                      sx={{
                        backgroundColor: "#91DA21",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f8bbd0",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            <div className="titleName">
                              Total Sponsor Credit
                            </div>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>
                              {dashboartMoneyCount?.Total_Sponsor_Income_Credit}
                            </b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-regular fa-circle-xmark"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Binary Credit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      // onClick={() => navigate("/machine?value=amc-pending-data")}
                      sx={{
                        backgroundColor: "#91DA21",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f8bbd0",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            <div className="titleName">Binary Credit</div>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>
                              {dashboartMoneyCount?.Total_Pair_Income_Credit}
                            </b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-regular fa-circle-xmark"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Reward Credit*/}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      // onClick={() => navigate("/reward")}
                      className="card_hover"
                      sx={{
                        backgroundColor: "#91DA21",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f0f4c3",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Reward Credit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>
                              {dashboartMoneyCount?.Total_Award_Reward_Credit}
                            </b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-solid fa-eye"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Royalty Credit*/}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      // onClick={() => navigate("/royalty")}
                      sx={{
                        backgroundColor: "#91DA21",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#bbdefb",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Royalty Credit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Total_Royalty_Credit}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-users"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Global Credit */}

            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      // onClick={() => navigate("/global-royalty")}
                      sx={{
                        backgroundColor: "#91DA21",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#bbdefb",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Global Credit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>
                              {dashboartMoneyCount?.Total_Globle_Royalty_Credit}
                            </b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-users"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Total Debit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/debit-history")}
                      sx={{
                        backgroundColor: "#E34726",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f0f4c3",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Total Debit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Total_Debit}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-solid fa-eye"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Total Sponcor Debit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/sponcor")}
                      sx={{
                        backgroundColor: "#E34726",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f8bbd0",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            <div className="titleName">Total Sponsor Debit</div>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>
                              {dashboartMoneyCount?.Total_Sponsor_Income_Debit}
                            </b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-regular fa-circle-xmark"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Binary Debit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/binary")}
                      sx={{
                        backgroundColor: "#E34726",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f8bbd0",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            <div className="titleName">Binary Debit</div>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>
                              {dashboartMoneyCount?.Total_Pair_Income_Debit}
                            </b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-regular fa-circle-xmark"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Reward Debit*/}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      // onClick={() => navigate("/reward")}
                      className="card_hover"
                      sx={{
                        backgroundColor: "#E34726",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f0f4c3",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Reward Debit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>
                              {dashboartMoneyCount?.Total_Award_Reward_Debit}
                            </b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-solid fa-eye"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Royalty Debit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/royalty")}
                      sx={{
                        backgroundColor: "#E34726",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#bbdefb",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Royalty Debit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Total_Royalty_Debit}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-users"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Global Debit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/global-royalty")}
                      sx={{
                        backgroundColor: "#E34726",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#bbdefb",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Global Debit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>
                              {dashboartMoneyCount?.Total_Globle_Royalty_Debit}
                            </b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-users"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Total Credit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/all-history")}
                      sx={{
                        backgroundColor: "#FFC82F",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#e1bee7",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Total Credit & Debit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Total_wallet}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-fax"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Sponsor*/}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      // onClick={() => navigate("/sponcor")}
                      className="card_hover"
                      sx={{
                        backgroundColor: "#FFC82F",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#e1bee7",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Curent Wallet Sponsor
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Currunt_Sponsor_Income}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-fax"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Pair Income */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      sx={{
                        backgroundColor: "#FFC82F",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f8bbd0",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            <div className="titleName">
                              Current Wallet Pair Income
                            </div>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Currunt_Pair_Income}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-regular fa-circle-xmark"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Reward */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      // onClick={() => navigate("/reward")}
                      className="card_hover"
                      sx={{
                        backgroundColor: "#FFC82F",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f0f4c3",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Current Wallet Reward
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Currunt_Reward}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-solid fa-eye"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Royalty */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      sx={{
                        backgroundColor: "#FFC82F",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#bbdefb",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Current Wallet Royalty
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Currunt_Royalty}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-users"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Global Royalty */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      sx={{
                        backgroundColor: "#FFC82F",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#bbdefb",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Global Wallet
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Currunt_Global_Royalty}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-users"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/*Today Join Count */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/todaymlm-user")}
                      sx={{
                        backgroundColor: "#90caf9",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f0f4c3",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Today Join
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Today_Join}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-solid fa-person"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Today Credit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/todaycredit-history")}
                      sx={{
                        backgroundColor: "#FFC82F",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f8bbd0",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Today Credit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Today_Credit}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-user-secret"></i>
                            {/* <FaxIcon /> */}
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Today Debit */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/todaydebit-history")}
                      sx={{
                        backgroundColor: "#E34726",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#b2dfdb",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Today Debit
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Today_Debit}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-solid fa-inbox"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Total Join Count */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/mlm-user")}
                      sx={{
                        backgroundColor: "#90caf9",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#bbdefb",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            Total Join
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Total_Join}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa fa-users"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* Bonanza */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return (
                    <Grid item xs={12} lg={2} sm={2} md={2}>
                      <Card
                        className="card_hover"
                        // onClick={() => navigate("/machine?value=amc-pending-data")}
                        sx={{
                          backgroundColor: "#f48fb1",
                          borderRadius: "10px",
                          boxShadow: 3,
                          borderRight: 10,
                          borderColor: "#f8bbd0",
                          // cursor: "pointer",
                        }}
                      >
                        <CardContent className="row">
                          <div className="col mt-2">
                            <Typography
                              variant="h6"
                              component="div"
                              style={{ color: "black", fontWeight: "600" }}
                            >
                              <div className="titleName">Welcome</div>
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                              {/* <b>{dashboartMoneyCount?.Currunt_Bonanza}</b> */}
                            </Typography>
                          </div>
                          <Typography
                            variant="h3"
                            className="pull-right col text-center"
                            style={{ color: "black" }}
                          >
                            <div className="mt-2">
                              <i class="fa-solid fa-house"></i>
                            </div>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      // onClick={() => navigate("/machine?value=amc-pending-data")}
                      sx={{
                        backgroundColor: "#f48fb1",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f8bbd0",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            <div className="titleName">Bonanza</div>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{dashboartMoneyCount?.Currunt_Bonanza}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-regular fa-circle-xmark"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {/* OverallCompanyBalance */}
            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      // onClick={() => navigate("/machine?value=amc-pending-data")}
                      sx={{
                        backgroundColor: "#f48fb1",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f8bbd0",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            <div className="titleName">Gst + Profit</div>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>{companySixWallet?.remaining}</b>
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-regular fa-circle-xmark"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}

            {accessType &&
              (() => {
                if (!accessType.includes("Dashboard")) {
                  return null;
                }
                return (
                  <Grid item xs={12} lg={2} sm={2} md={2}>
                    <Card
                      className="card_hover"
                      onClick={() => navigate("/wallet")}
                      sx={{
                        backgroundColor: "#90caf9",
                        borderRadius: "10px",
                        boxShadow: 3,
                        borderRight: 10,
                        borderColor: "#f8bbd0",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent className="row">
                        <div className="col mt-2">
                          <Typography
                            variant="h6"
                            component="div"
                            style={{ color: "black", fontWeight: "600" }}
                          >
                            <div className="titleName">User Wallet</div>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {/* <b>{companySixWallet?.remaining}</b> */}
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="pull-right col text-center"
                          style={{ color: "black" }}
                        >
                          <div className="mt-2">
                            <i className="fa-regular fa-circle-xmark"></i>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })()}
          </Grid>
        </div>
      )}
    </>
  );
}

export default Dashboard;
