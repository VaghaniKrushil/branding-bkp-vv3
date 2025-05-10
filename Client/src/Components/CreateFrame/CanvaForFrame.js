import React, { useEffect, useState } from "react";
// import Sidebar from "../UserSidebar";

function CanvaForFrame() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* <Sidebar /> */}
      <iframe
        src="https://bpk-canva-frame-new.vercel.app/" // Replace with the actual URL of your Canva_Projects
        title="Canva Editor"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
}

export default CanvaForFrame;
