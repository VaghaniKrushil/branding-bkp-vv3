// import React from "react";
// import Sidebar from "../UserSidebar";

// const CanvaEditor = () => {
//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <Sidebar />
//       <iframe
//         src="http://127.0.0.1:5173/" // Replace with the actual URL of your Canva_Project
//         title="Canva Editor"
//         width="100%"
//         height="100%"
//       ></iframe>
//     </div>
//   );
// };

// export default CanvaEditor;

import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import axios from "axios"; // Import Axios

import Sidebar from "../UserSidebar";

const CanvaEditor = () => {
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const iframeRef = useRef(null);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    // Fetch data from the API using Axios
    axios
      .get(
        `https://brandingprofitable-29d465d7c7b1.herokuapp.com/cd_section/cds_data/64d1cf4121844a34667ad534`
      )
      .then((response) => {
        const data = response.data;
        setApiData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]); // Fetch data whenever the 'id' parameter changes

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;

    // Send the fetched API data to the iframe
    iframe.contentWindow.postMessage({ apiData }, "*");
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* <Sidebar /> */}
      <iframe
        ref={iframeRef}
        onLoad={handleIframeLoad}
        src="https://canva-editor-new.vercel.app/" // Replace with your actual iframe source URL
        title="Canva Editor"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
};

export default CanvaEditor;
