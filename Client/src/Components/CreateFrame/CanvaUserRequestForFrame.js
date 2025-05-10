import React from 'react'

function CanvaUserRequestForFrame() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
          {/* <Sidebar /> */}
          <iframe
            src="https://bpk-canva-user-req-frame-new-mauve.vercel.app/" // Replace with the actual URL of your Canva_Projects
            title="Canva Editor"
            width="100%"
            height="100%"
          ></iframe>
        </div>
      );
}

export default CanvaUserRequestForFrame