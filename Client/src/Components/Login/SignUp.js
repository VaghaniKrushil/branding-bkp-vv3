import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import moment from "moment";

const accessTypeData = [
  "Dashboard",
  "Access",
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
  "Passbook"
];

function SignUp() {
  let navigate = useNavigate();

  let handleSubmit = async (values) => {
    values["accessType"] = accessTypeData;
    values["createDate"] = moment(new Date()).format("DD-MM-YYYY");
    values["createTime"] = moment(new Date()).format("HH:mm:ss");
    values["updateDate"] = moment(new Date()).format("DD-MM-YYYY");
    let res = await axios.post(
      "https://brandingprofitable-29d465d7c7b1.herokuapp.com/register/register",
      values
    );
    if (res.data.statusCode === 200) {
      navigate("/login");
      alert(res.data.message);
    } else if (res.data.statusCode === 403) {
      alert(res.data.message);
    } else {
      alert(res.data.message);
    }
  };

  let signUpFormik = useFormik({
    initialValues: {
      userName: "",
      mobileNumber: "",
      email: "",
      password: "",
      cPassword: "",
    },
    validationSchema: yup.object({
      userName: yup.string().required("Required"),
      mobileNumber: yup.number().required("Required"),
      email: yup.string().email("Invalid Email").required("Required"),
      password: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
      cPassword: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      console.log(values, "values");
    },
  });

  return (
    <div>
      <section className="vh-100" style={{ backgroundcolor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Sign up
                      </p>

                      <form
                        className="mx-1 mx-md-4"
                        onSubmit={signUpFormik.handleSubmit}
                      >
                        <div className="d-flex flex-row align-items-center mb-4">
                          <PersonIcon fontSize="large" className="me-3 mt-3" />
                          <div className="form-outline flex-fill mb-0">
                            <TextField
                              type="text"
                              placeholder="Your Name"
                              label="Your Name"
                              variant="standard"
                              fullWidth
                              name="userName"
                              onBlur={signUpFormik.handleBlur}
                              onChange={signUpFormik.handleChange}
                              value={signUpFormik.values.userName}
                            />
                            {signUpFormik.touched.userName &&
                            signUpFormik.errors.userName ? (
                              <div style={{ color: "red" }}>
                                {signUpFormik.errors.userName}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <PersonIcon fontSize="large" className="me-3 mt-3" />
                          <div className="form-outline flex-fill mb-0">
                            <TextField
                              type="number"
                              placeholder="Mobile Number"
                              label="Mobile Number"
                              variant="standard"
                              fullWidth
                              name="mobileNumber"
                              onBlur={signUpFormik.handleBlur}
                              onChange={signUpFormik.handleChange}
                              value={signUpFormik.values.mobileNumber}
                            />
                            {signUpFormik.touched.mobileNumber &&
                            signUpFormik.errors.mobileNumber ? (
                              <div style={{ color: "red" }}>
                                {signUpFormik.errors.mobileNumber}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <EmailIcon fontSize="large" className="me-3 mt-3" x />
                          <div className="form-outline flex-fill mb-0">
                            <TextField
                              type="email"
                              placeholder="Your Email"
                              label="Your Email"
                              variant="standard"
                              fullWidth
                              name="email"
                              onBlur={signUpFormik.handleBlur}
                              onChange={signUpFormik.handleChange}
                              value={signUpFormik.values.email}
                            />
                            {signUpFormik.touched.email &&
                            signUpFormik.errors.email ? (
                              <div style={{ color: "red" }}>
                                {signUpFormik.errors.email}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <LockIcon fontSize="large" className="me-3 mt-3" />
                          <div className="form-outline flex-fill mb-0">
                            <TextField
                              type="password"
                              placeholder="Password"
                              label="Password"
                              variant="standard"
                              fullWidth
                              name="password"
                              onBlur={signUpFormik.handleBlur}
                              onChange={signUpFormik.handleChange}
                              value={signUpFormik.values.password}
                            />
                            {signUpFormik.touched.password &&
                            signUpFormik.errors.password ? (
                              <div style={{ color: "red" }}>
                                {signUpFormik.errors.password}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <VpnKeyIcon fontSize="large" className="me-3 mt-3" />
                          <div className="form-outline flex-fill mb-0">
                            <TextField
                              type="password"
                              placeholder="Confirm Password"
                              label="Confirm Password"
                              variant="standard"
                              fullWidth
                              name="cPassword"
                              onBlur={signUpFormik.handleBlur}
                              onChange={signUpFormik.handleChange}
                              value={signUpFormik.values.cPassword}
                            />
                            {signUpFormik.touched.cPassword &&
                            signUpFormik.errors.cPassword ? (
                              <div style={{ color: "red" }}>
                                {signUpFormik.errors.cPassword}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <Button
                            variant="contained"
                            size="large"
                            type="submit"
                          >
                            Register
                          </Button>
                        </div>
                        <p className="text-center">
                          <Button
                            onClick={() => navigate("/login")}
                            className="text-dark shadow-none"
                            style={{ backgroundColor: "#ffff", border: "none" }}
                          >
                            <span className="text-muted">
                              Have an account&nbsp;?&nbsp;
                            </span>
                            Login
                          </Button>
                        </p>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        className="img-fluid"
                        alt="Sample image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
