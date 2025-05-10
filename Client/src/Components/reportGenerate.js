// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import moment from "moment";

// const generatePDF = ({ allReportData }) => {
//   // Initialize jsPDF
//   const doc = new jsPDF();
//   const currentDate = moment(new Date()).format("DD-MM-YYYY");

//   // Define the columns we want and their titles
//   const tableColumn = [
//     "Beneficiary Name",
//     "Beneficiary Account Number",
//     "IFSC",
//     "Transaction Type",
//     "Debit Account Number",
//     "Transaction Date",
//     "Amount",
//     "Currency",
//   ];

//   // Define an empty array of rows
//   const tableRows = [];

//   // For each data row, extract the values and push into tableRows
//   allReportData.forEach((row) => {
//     const rowData = [
//       row.acName,
//       row.acNumber,
//       row.ifsc,
//       "NEFT",
//       "XXXXXXXXXXXX",
//       currentDate,
//       row.withdrawalAmount,
//       "INR",
//     ];
//     tableRows.push(rowData);
//   });

//   // Define cell styles for the body
//   const bodyStyles = { lineWidth: 0.01, lineColor: [0, 0, 0] };

//   // Define smaller font size for the heading
//   const headStyles = { fontSize: 8 }; // Adjust the font size as needed

//   // StartY is basically margin-top
//   doc.autoTable({
//     head: [tableColumn],
//     body: tableRows,
//     startY: 10,
//     headStyles: headStyles, // Apply styles to the heading
//     bodyStyles: bodyStyles, // Apply styles to the body
//   });

//   // Draw a border around the entire table
//   doc.autoTable({
//     theme: "plain", // Use a plain theme to avoid additional styling
//     margin: { top: 10 }, // Adjust top margin to match the start position of the table
//     tableWidth: "auto",
//   });

//   // Save the PDF with a specific name
//   doc.save("Withdrawal.pdf");
// };

// export default generatePDF;

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const generatePDF = ({ allReportData }) => {
  // Filter the data to include only the documents where "isWidrawalRequestsSendToBank" is false
  const filteredData = allReportData.filter(
    (row) => !row.isWidrawalRequestsSendToBank
  );

  // Initialize jsPDF
  const doc = new jsPDF();
  const currentDate = moment(new Date()).format("DD-MM-YYYY");

  // Define the columns we want and their titles
  const tableColumn = [
    "Index", // Add an Index column
    "Beneficiary Name",
    "Beneficiary Account Number",
    "IFSC",
    "Transaction Type",
    "Debit Account Number",
    "Transaction Date",
    "Amount",
    "Currency",
  ];

  // Define an empty array of rows
  const tableRows = [];

  // For each data row, extract the values and push into tableRows
  filteredData.forEach((row, index) => {
    const rowData = [
      index + 1, // Add the index number (adding 1 to start from 1)
      row.fullName,
      row.acNumber,
      row.ifsc,
      "NEFT",
      "XXXXXXXXXXXX",
      currentDate,
      row.withdrawalAmount,
      "INR",
    ];
    tableRows.push(rowData);
  });

  // Define cell styles for the body
  const bodyStyles = { lineWidth: 0.01, lineColor: [0, 0, 0] };

  // Define cell styles for the heading with a blue background
  const headStyles = {
    lineWidth: 0.01,
    lineColor: [0, 0, 0],
    fillColor: ["#1359a0"], // Blue background color
    textColor: [255, 255, 255],
    fontStyle: "bold",
  };

  // StartY is basically margin-top
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 10,
    headStyles: headStyles, // Apply styles to the heading
    bodyStyles: bodyStyles, // Apply styles to the body
    pageBreak: "avoid", // Disable pagination
  });

  // Draw a border around the entire table
  doc.autoTable({
    theme: "plain",
    margin: { top: 10 },
    tableWidth: "auto",
  });

  // Save the PDF with a specific name
  doc.save("Withdrawal.pdf");
};

export default generatePDF;


// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import moment from "moment";
// const generatePDF = ({ allReportData }) => {
//   const doc = new jsPDF();
//   const currentDate = moment(new Date()).format("DD-MM-YYYY");
//   const tableColumn = [
//     "Beneficiary Name",
//     "Beneficiary Account Number",
//     "IFSC",
//     "Transaction Type",
//     "Debit Account Number",
//     "Transaction Date",
//     "Amount",
//     "Currency",
//   ];
//   const tableRows = [];
//   allReportData.forEach((row, index) => {
//     const rowData = [
//       row.acName,
//       row.acNumber,
//       row.ifsc,
//       "NEFT",
//       "XXXXXXXXXXXX",
//       currentDate,
//       row.withdrawalAmount,
//       "INR",
//     ];
//     tableRows.push(rowData);
//   });
//   const docParams = {
//     head: [tableColumn],
//     body: tableRows,
//     startY: 10,
//     headStyles: {
//       lineWidth: 0.01,
//       lineColor: [0, 0, 0],
//       fillColor: ["#1359a0"],
//       textColor: [255, 255, 255],
//       fontStyle: "bold",
//     },
//   };
//   const alternatingColors = ["#bfd9f2", "#bfd9f2"]; // Red and Yellow
//   tableRows.forEach((rowData, index) => {
//     const bodyStyles = {
//       lineWidth: 0.01,
//       lineColor: [0, 0, 0],
//       fillColor: alternatingColors[index % 2],
//     };
//     doc.autoTable({ ...docParams, bodyStyles });
//   });
//   // Save the PDF with a specific name
//   doc.save("Withdrawal.pdf");
// };
// export default generatePDF;
