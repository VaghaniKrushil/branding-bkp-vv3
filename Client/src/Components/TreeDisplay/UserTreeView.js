import React, { useState, useEffect } from "react";
import Tree from "react-d3-tree";
import "../TreeDisplay/TreeDisplay.css"; // Import the CSS file
import axios from "axios";
import { useParams } from "react-router-dom";

const staticData = {
  name: "Meet",
  referralId: "REF123",
  treeId: "123", // Add treeId
  children: [
    {
      name: "Bhavin",
      referralId: "REF234",
      treeId: "234", // Add treeId
      children: [
        {
          name: "Dinesh",
          referralId: "REF345",
          treeId: "345", // Add treeId
          children: [
            { name: "Hardik", referralId: "REF456", treeId: "456" },
            { name: "Iran", referralId: "REF456", treeId: "456" },
          ],
        },
        { name: "Emran", referralId: "REF456", treeId: "456" },
      ],
    },
    {
      name: "Chirag",
      referralId: "REF567",
      treeId: "567", // Add treeId
      children: [
        { name: "Faizan", referralId: "REF678", treeId: "678" },
        {
          name: "Vaibhav",
          referralId: "REF789",
          treeId: "789", // Add treeId
          children: [
            { name: "Hardik", referralId: "REF456", treeId: "456" },
            {
              name: "Iran",
              referralId: "REF456",
              treeId: "456",
              children: [
                { name: "Jit", referralId: "REF456", treeId: "456" },
                { name: "Jit", referralId: "REF456", treeId: "456" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const gradientBackground = "linear-gradient(to bottom, #20AE5C, #000000)";

function UserTreeView() {
  const { number } = useParams();
  console.log(number, "number")

  const [treeData, setTreeData] = useState(null);
  useEffect(() => {
    // Fetch data using Axios
    axios
      .get(`https://brandingprofitable-29d465d7c7b1.herokuapp.com/mlm/tree/${number}`)
      .then((response) => {
        // Set the fetched data to the treeData state variable
        setTreeData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
    const rectWidth = textLength + 150;
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
        <text x="0" y="-22" className="tree-node-text">
          {nodeDatum.name}
        </text>
        <text x="100" y="-22" className="tree-node-text">
          {nodeDatum.side && (
            <>
              <tspan dy="-0.5em" fontSize="0.8em">
                {nodeDatum.side}
              </tspan>
              {/* <tspan dy="0.5em" fontSize="0.5em" baselineShift="super">
                  {nodeDatum.side === "left" ? "L" : "R"}
                </tspan> */}
            </>
          )}
        </text>

        <text
          x={rectX + 10}
          y="0"
          className="tree-tree-id"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {nodeDatum.treeId}
        </text>
        <text
          x={rectX + rectWidth - 53}
          y="0"
          className="tree-referral-id"
          textAnchor="end"
          dominantBaseline="middle"
        >
          {nodeDatum.referralId}
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
      <div style={{ width: "100%", height: "100vh" }}>
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 190, y: 100 }}
          renderCustomNodeElement={CustomNodeElement} // Use custom rendering function for nodes
          separation={separation}
          pathFunc={customPathFunc} // Use the custom path function for links
          linkAttributes={{ stroke: "white", "stroke-dasharray": "5,5" }} // Set white dashed line style
        />
      </div>
    </div>
  );
}

export default UserTreeView;
