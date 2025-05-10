var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  secure: true,
  port: 465,
  auth: {
    user: "sahil_ajmeri@sparrowsofttech.com",
    pass: "Sahil@123",
  },
});

var mailOptions = {
  from: "sahil_ajmeri@sparrowsofttech.com",
  to: "shivam_shukla@sparrowsofttech.com",
  subject: "Delete Request for Branding Profitable Account",
  html: `
    <p>Hello Shivam Shukla,</p>
    <p>We have received a delete request for the Branding Profitable account. Please process accordingly.</p>
    <p>Thank you,</p>
    <p>Sahil Ajmeri</p>
  `,
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
