// import React, { useEffect } from "react";
// import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
// import { Toolbar } from "polotno/toolbar/toolbar";
// import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
// import { SidePanel } from "polotno/side-panel";
// import { Workspace } from "polotno/canvas/workspace";
// import axios from "axios";
// import { createStore } from "polotno/model/store";

// const store = createStore({
//   key: "nFA5H9elEytDyPyvKL7T",
//   showCredit: true,
// });

// // Function to initialize the Polotno store with the fetched data
// function initializePolotnoWithData(polotnoData) {
//   store.loadJSON(polotnoData.cds_template.page); // Load the page data from cds_template
//   // Set the background image
//   const backgroundImage = polotnoData.cds_template.page.pages[0].children.find(
//     (element) => element.type === "image"
//   );
//   store.setBackgroundFromDataUrl(backgroundImage.src);
// }

// function Polotno() {
//   useEffect(() => {
//     axios
//       .get("https://brandingprofitable-29d465d7c7b1.herokuapp.com/cd_section/cd_section")
//       .then((response) => {
//         const polotnoData = response.data.data[0]; // Assuming you only have one data entry
//         // Initialize the Polotno store with the fetched data
//         initializePolotnoWithData(polotnoData);
//       })
//       .catch((error) => {
//         console.error("Error fetching Polotno data:", error);
//       });
//   }, []);

//   return (
//     <PolotnoContainer style={{ width: "100vw", height: "100vh" }}>
//       <SidePanelWrap>
//         <SidePanel store={store} />
//       </SidePanelWrap>
//       <WorkspaceWrap>
//         <Toolbar store={store} downloadButtonEnabled />
//         <Workspace store={store} />
//         <ZoomButtons store={store} />
//       </WorkspaceWrap>
//     </PolotnoContainer>
//   );
// }

// export default Polotno;

import React, { useState } from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import axios from "axios";
import { createStore } from "polotno/model/store";

const store = createStore({
  key: "nFA5H9elEytDyPyvKL7T",
  showCredit: true,
});
const page = store.addPage();

// Function to upload the image to CDN
const fileData = (file) => {
  const dataArray = new FormData();
  dataArray.append("b_video", file);

  let url = "https://cdn.brandingprofitable.com/image_upload.php/";
  return axios.post(url, dataArray, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Function to convert the base64 image data to a Blob object
function convertBase64ToImageFile(base64ImageData) {
  try {
    const padding = "=".repeat((4 - (base64ImageData.length % 4)) % 4);
    const completeBase64 = base64ImageData + padding;
    const byteString = atob(completeBase64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: "image/jpeg" }); // Change the content type if needed
    const file = new File([blob], "image.jpg", { type: "image/jpeg" }); // Change the content type if needed
    return file;
  } catch (error) {
    console.error("Error converting base64 to image file:", error);
    return null;
  }
}

function Polotno() {
  const [imageUrl, setImageUrl] = useState("");
  const [imgLoader, setImgLoader] = useState(false);

  const handleImageSave = (base64ImageData) => {
    setImgLoader(true);
    const file = convertBase64ToImageFile(base64ImageData);
    if (file) {
      fileData(file)
        .then((res) => {
          setImgLoader(false);
          const imagePath = res?.data?.image_path;
          setImageUrl(imagePath);
          console.log("CDN URL:", imagePath);

          // Save the CDN URL and Polotno code in the database
          const polotnoData = {
            version: "1.0",
            page: store.toJSON(),
            imageUrl: imagePath,
          };
          const polotnoCode = JSON.stringify(polotnoData);
          axios
            .post(
              "https://brandingprofitable-29d465d7c7b1.herokuapp.com/cd_section/cd_section",
              {
                cds_template: polotnoCode,
              }
            )
            .then((response) => {
              console.log("API Response:", response.data);
            })
            .catch((error) => {
              console.error("API Error:", error);
            });
        })
        .catch((err) => {
          setImgLoader(false);
          console.log("Error uploading image:", err);
        });
    }
  };

  function generatePolotnoCode() {
    const polotnoData = {
      version: "1.0",
      page: store.toJSON(),
    };

    const polotnoCode = JSON.stringify(polotnoData);
    console.log(polotnoCode);

    handleImageSave(polotnoCode);
  }

  return (
    <PolotnoContainer style={{ width: "100vw", height: "100vh" }}>
      <SidePanelWrap>
        <SidePanel store={store} />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar store={store} downloadButtonEnabled />
        <Workspace store={store} />
        {imageUrl && <img src={imageUrl} alt="Uploaded Image" />}
        <ZoomButtons store={store} />
      </WorkspaceWrap>
      <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
        <button onClick={() => generatePolotnoCode()}>Log Polotno Code</button>
      </div>
    </PolotnoContainer>
  );
}

export default Polotno;

// import React, { useState } from "react";
// import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
// import { Toolbar } from "polotno/toolbar/toolbar";
// import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
// import { SidePanel } from "polotno/side-panel";
// import { Workspace } from "polotno/canvas/workspace";
// import axios from "axios";
// import "@blueprintjs/icons/lib/css/blueprint-icons.css";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
// import { createStore } from "polotno/model/store";

// const store = createStore({
//   key: "nFA5H9elEytDyPyvKL7T",
//   showCredit: true,
// });
// const page = store.addPage();

// function generatePolotnoCode() {
//   const polotnoData = {
//     version: "1.0",
//     page: store.toJSON(),
//   };

//   const polotnoCode = JSON.stringify(polotnoData);
//   console.log(polotnoCode);

//   axios
//     .post(
//       "https://brandingprofitable-29d465d7c7b1.herokuapp.com/cd_section/cd_section",
//       {
//         cds_template: polotnoCode,
//       }
//     )
//     .then((response) => {
//       console.log("API Response:", response.data);
//     })
//     .catch((error) => {
//       console.error("API Error:", error);
//     });
// }

// function Polotno() {
//   const [imageUrl, setImageUrl] = useState("");
//   const [imgLoader, setImgLoader] = useState(false);

//   const fileData = (file) => {
//     setImgLoader(true);
//     const dataArray = new FormData();
//     dataArray.append("b_video", file);
//     let url = "https://cdn.brandingprofitable.com/image_upload.php/";
//     axios
//       .post(url, dataArray, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((res) => {
//         setImgLoader(false);
//         const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
//         setImageUrl(imagePath);
//       })
//       .catch((err) => {
//         setImgLoader(false);
//         console.log("Error uploading image:", err);
//       });
//   };

//   return (
//     <PolotnoContainer style={{ width: "100vw", height: "100vh" }}>
//       <SidePanelWrap>
//         <SidePanel store={store} />
//       </SidePanelWrap>
//       <WorkspaceWrap>
//         <Toolbar store={store} downloadButtonEnabled />
//         <Workspace store={store} />
//         {imageUrl && <img src={imageUrl} alt="Uploaded Image" />}
//         <ZoomButtons store={store} />
//       </WorkspaceWrap>
//       <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
//         <button onClick={() => generatePolotnoCode()}>Log Polotno Code</button>
//       </div>
//     </PolotnoContainer>
//   );
// }

// export default Polotno;
