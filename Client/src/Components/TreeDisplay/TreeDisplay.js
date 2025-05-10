import React, { useState, useEffect } from "react";
import Tree from "react-d3-tree";
import "../TreeDisplay/TreeDisplay.css"; // Import the CSS file
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { ColorRing } from "react-loader-spinner";
import Cookies from "universal-cookie";

const gradientBackground = "linear-gradient(to bottom, #20AE5C, #000000)";

let WinWidth = window.innerWidth;

// Define the component
const TreeDisplay = () => {
  let cookies = new Cookies();

  let navigate = useNavigate();

  React.useEffect(() => {
    if (cookies.get("token")) {
      console.log("token found")
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState()

  const [inputMobileNumber, setInputMobileNumber] = useState("");

  console.log(inputMobileNumber)

  const handleChangeNumber = (e) => {
    const num = e.target.value
    setInputMobileNumber(num)
    if (num.length == 10) {
      handleNumberClick(num)
    } else if (num == "") {
      handleNumberClick(9900000001)
    }
  }

  // const handleClick = (nodeDatum) => {
  //   if (nodeDatum && nodeDatum.referralId) {
  //     navigate(`/user-tree/${nodeDatum.referralId}`);
  //     console.log(nodeDatum.referralId, "nodeDatum.referralId");
  //   } else {
  //     console.error("No referralId available.");
  //   }
  // };

  console.log("WinWidth", WinWidth)

  const [treeData, setTreeData] = useState(null);
  // useEffect(() => {
  //   // Fetch data using Axios
  //   axios
  //     .get(
  //       "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/treeview"
  //       // "https://brandingprofitable-29d465d7c7b1.herokuapp.com/user/treeview/1"
  //     )
  //     .then((response) => {
  //       // Set the fetched data to the treeData state variable
  //       setTreeData(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  const [view, setView] = useState("api1");
  const [clickedNumber, setClickedNumber] = useState(null);
  const [loadingClickedNumber, setLoadingClickedNumber] = useState(false);
  const fetchData = async (url) => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      setTreeData(response.data);
      const details = {
        total_left: response.data.total_left_side,
        total_right: response.data.total_right_side,
        today_left: response.data.today_joings_count_L,
        today_right: response.data.today_joings_count_R,
        green_wallet: response.data.green_wallet,
        red_wallet: response.data.red_wallet,
      }
      setUserData(details)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleNumberClick = (number) => {
    setLoadingClickedNumber(true);
    setClickedNumber(number);
    setView("api1");
  };

  useEffect(() => {
    if (!clickedNumber) {
      fetchData(
        "https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/treeview"
      );
    } else {
      fetchData(
        `https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/tree/${clickedNumber}`
      );
      setLoadingClickedNumber(false);
    }
  }, [clickedNumber]);

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        setTreeData(receivedData);
      } catch (error) {
        console.error("Error parsing received data:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const CustomNodeElement = ({ nodeDatum }) => {
    const dotStyle = {
      fill: "blue",
      r: 5,
    };

    const nameLength = nodeDatum.name ? nodeDatum.name.length : 0;
    const referralIdLength = nodeDatum.referralId
      ? nodeDatum.referralId.length
      : 0;
    const textLength = Math.max(nameLength, referralIdLength) * 10;
    const rectWidth = textLength + 200;
    const rectX = -(rectWidth / 2);

    const rectStyle = {
      fill: "white",
      stroke: "black",
      strokeWidth: 1,
    };

    const cornerRadius = 10; // Adjust this value to change the radius of the corners

    return (
      <g>
        <circle cx="0" cy="0" {...dotStyle} />
        <rect
          x={rectX}
          y="-46" // Adjust the y position to center the text vertically
          width={rectWidth}
          height="63" // Increase the height to accommodate the extra text
          rx={cornerRadius}
          ry={cornerRadius}
          {...rectStyle}
        />
        <text
          x="0"
          y="-22"
          className="tree-node-text"
          onClick={() => handleNumberClick(nodeDatum.number)}
        // onClick={() => {
        //   navigate(
        //     `/user-tree/$mobile=${nodeDatum.number}`
        //   );
        // }}
        >
          {nodeDatum.number}
        </text>
        <text x="70" y="-22" className="tree-node-text">
          {nodeDatum.add_side && (
            <>
              <tspan dy="-0.5em" fontSize="0.8em">
                {nodeDatum.add_side}
              </tspan>
              {/* <tspan dy="0.5em" fontSize="0.5em" baselineShift="super">
                {nodeDatum.side === "left" ? "L" : "R"}
              </tspan> */}
            </>
          )}
        </text>

        {/* <text
          x={rectX + 10}
          y="0"
          className="tree-tree-id"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {nodeDatum.green_wallet}
        </text> */}
        <text
          x={rectX + rectWidth - 100}
          y="0"
          className="tree-referral-id"
          textAnchor="end"
          dominantBaseline="middle"
        >
          {nodeDatum.fullName}
        </text>
      </g>
    );
  };

  // Define the custom path function for square links
  const customPathFunc = (linkData, orientation) => {
    const { source, target } = linkData;
    const sourceX = orientation === "horizontal" ? source.y : source.x;
    const sourceY = orientation === "horizontal" ? source.x : source.y;
    const targetX = orientation === "horizontal" ? target.y : target.x;
    const targetY = orientation === "horizontal" ? target.x : target.y;

    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;

    if (orientation === "horizontal") {
      return `
      M${sourceX},${sourceY}
      L${centerX},${sourceY}
      L${centerX},${targetY}
      L${targetX},${targetY}
    `;
    } else {
      return `
      M${sourceX},${sourceY}
      L${sourceX},${centerY}
      L${targetX},${centerY}
      L${targetX},${targetY}
    `;
    }
  };

  const separation = { siblings: 3, nonSiblings: 3 }; // Adjust these values as needed

  return (
    <div
      style={{ width: "100%", height: "100vh", background: gradientBackground }}
    >

      {
        WinWidth > 500 &&
        <div style={{ position: 'absolute', zIndex: 100, top: 20, left: 20, backgroundColor: 'white', borderRadius: 10, padding: 10, boxShadow: 'inset -3px -3px 10px #000', }}>
          <TextField
            value={inputMobileNumber}
            onChange={handleChangeNumber}
            type="text"
            label="Mobile Number"
            size="small"
            name="Mobile Number"
            style={{ border: 'none', borderWidth: 0 }}
          />
        </div>
      }

      {
        WinWidth > 500 &&
        <div style={{ position: 'absolute', zIndex: 100, top: 20, right: 20, backgroundColor: 'white', borderRadius: 10, padding: 15, boxShadow: 'inset -3px -3px 10px #000', }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderBottom: '1px solid #ccc', marginBottom: 15 }}>
            <h6 style={{ fontWeight: 'bold', marginBottom: 15 }}>TOTAL TEAM - {parseInt(userData?.total_left) + parseInt(userData?.total_right)}</h6>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 15 }}>
            <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <h6 style={{ fontWeight: 'bold', marginBottom: 15 }}>LEFT</h6>
              <p>Total Left: {userData?.total_left}</p>
              <p>Today Left: {userData?.today_left}</p>
            </div>
            <div style={
              {backgroundColor:'lightgray', width: 2, height: 100 }
            }>{" "}</div>
            <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <h6 style={{ fontWeight: 'bold', marginBottom: 15 }}>RIGHT</h6>
              <p>Total Right: {userData?.total_right}</p>
              <p>Today Right: {userData?.today_right}</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #ccc',borderBottom: '1px solid #ccc', marginBottom: 0, paddingTop: 10 }}>
            <h6 style={{ fontWeight: 'bold', marginBottom: 15 }}>WALLET</h6>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 0 }}>
            <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <p>Green Wallet: {userData?.green_wallet}</p>
            </div>
            <div style={{ borderLeft: '1px solid #ccc', marginLeft: 10, paddingLeft: 10, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <p>Red Wallet: {userData?.red_wallet}</p>
            </div>
          </div>
        </div>
      }


      {loading ? ( // Show loader while loading data
        <div className="d-flex flex-direction-row justify-content-center align-items-center">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        // <div style={{ width: "100%", height: "100vh" }}>
        //   <Tree
        //     // data={staticData}
        //     data={treeData}
        //     orientation="vertical"
        //     translate={{ x: 190, y: 100 }}
        //     renderCustomNodeElement={CustomNodeElement}
        //     separation={separation}
        //     pathFunc={customPathFunc}
        //     linkAttributes={{ stroke: "white", "stroke-dasharray": "5,5" }}
        //   />
        // </div>
        <div style={{ width: "100%", height: "100vh" }}>
          <Tree
            data={treeData}
            orientation="vertical"
            translate={{ x: WinWidth / 2, y: 200 }}
            renderCustomNodeElement={CustomNodeElement}
            separation={separation}
            pathFunc={customPathFunc}
            linkAttributes={{ stroke: "white", "stroke-dasharray": "5,5" }}
            onClick={(node) => handleNumberClick(node.nodeDatum.number)} // Add onClick to handle number click
          />
        </div>
      )}
    </div>
  );
};

export default TreeDisplay;
