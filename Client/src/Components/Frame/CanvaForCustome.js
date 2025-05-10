import React from "react";
// import Sidebar from "../UserSidebar";

function CanvaForCustome() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* <Sidebar /> */}
      <iframe
        src="http://127.0.0.1:5173" // Replace with the actual URL of your Canva_Project
        title="Canva Editor"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
}

export default CanvaForCustome;
