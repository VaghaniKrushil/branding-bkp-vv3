import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import Sidebar from "../UserSidebar";
import axios from "axios";
import DawnArrow from "../logo/down.png";
import UpArrow from "../logo/up-arrow.png";
import { useParams } from "react-router-dom";

function UserTransactionHistory() {
  const [userTransactionHistory, setUserTransactionHistory] = useState([]);
  const { mobileNumber } = useParams();

  useEffect(() => {
    // Fetch data using Axios
    axios
      .get(`https://brandingprofitable-29d465d7c7b1.herokuapp.com/user/abc/${mobileNumber}`)
      .then((response) => {
        // Set the fetched data to the userTransactionHistory state variable
        setUserTransactionHistory(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <Sidebar />
      <section>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            {userTransactionHistory.map((transactionGroup, index) => (
              <MDBCol key={index} md="6" className="mb-4">
                <div className="mb-4">
                  <span className="text-muted small">
                    {transactionGroup.date}
                  </span>
                </div>
                {transactionGroup.transactions &&
                  transactionGroup.transactions.map(
                    (transaction, innerIndex) => (
                      <MDBCard
                        key={innerIndex}
                        className="card-stepper mb-3"
                        style={{ borderRadius: "10px" }}
                      >
                        <MDBCardBody className="p-4">
                          <div className="d-flex flex-row justify-content-between align-items-center align-content-center">
                            <span className="dot"></span>
                            {/* <hr className="flex-fill track-line" /> */}
                            <span className="dot"></span>
                            {innerIndex ===
                              transactionGroup.transactions.length - 1 && (
                              <span className="d-flex justify-content-center align-items-center big-dot dot">
                                <MDBIcon icon="check text-white" />
                              </span>
                            )}
                          </div>

                          <div className="d-flex flex-row justify-content-between align-items-center">
                            <div className="d-flex flex-column align-items-start">
                              {/* <span>Amount: {transaction.amount}</span> */}
                              <span>Type: {transaction.type}</span>
                              <span>Message: {transaction.message}</span>
                              <span>
                                Date:{" "}
                                {new Date(
                                  transaction.transactionDate
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="d-flex flex-column align-items-end">
                              {/* <span>Amount: {transaction.amount}</span> */}

                              <span
                                className={`amount ${
                                  transaction.type === "Debit"
                                    ? "debit-amount"
                                    : "credit-amount"
                                }`}
                              >
                                Amount: {transaction.amount}
                                <img
                                  src={
                                    transaction.type === "Debit"
                                      ? DawnArrow
                                      : UpArrow
                                  }
                                  alt="Arrow Image"
                                />
                              </span>
                            </div>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    )
                  )}
              </MDBCol>
            ))}
          </MDBRow>
        </MDBContainer>
      </section>
    </>
  );
}

export default UserTransactionHistory;
