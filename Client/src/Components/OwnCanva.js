import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import Dropzone from "react-dropzone";

function OwnCanva() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      selection: false, // Disable default selection behavior
    });
    setCanvas(newCanvas);
  }, []);

  const handleAddImage = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const dataURL = reader.result;
      fabric.Image.fromURL(dataURL, (img) => {
        canvas.add(img);
        canvas.renderAll();
      });
    };

    reader.readAsDataURL(file);
  };

  const handleAddText = () => {
    const text = new fabric.Textbox("Type your text here", {
      left: 50,
      top: 50,
      fontSize: 20,
      width: 200,
      textAlign: "left",
      borderColor: "black",
      cornerColor: "black",
      cornerSize: 6,
    });
    canvas.add(text);
    canvas.setActiveObject(text); // Automatically select the added text
    canvas.renderAll();
  };

  useEffect(() => {
    if (canvas) {
      // Enable resizing controls for selected object
      canvas.on("object:selected", (e) => {
        const selectedObject = e.target;
        selectedObject.setControlsVisibility({
          mt: true,
          mb: true,
          ml: true,
          mr: true,
        });
        selectedObject.hasControls = selectedObject.hasBorders = true;
      });

      // Disable resizing controls for unselected object
      canvas.on("before:selection:cleared", (e) => {
        const selectedObject = e.target;
        selectedObject.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
        });
        selectedObject.hasControls = selectedObject.hasBorders = false;
      });
    }
  }, [canvas]);

  return (
    <div>
      <Dropzone onDrop={handleAddImage}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              width: "400px",
              height: "300px",
              border: "2px dashed #aaa",
            }}
          >
            <input {...getInputProps()} />
            Drop an image here or click to select an image.
          </div>
        )}
      </Dropzone>
      <button onClick={handleAddText}>Add Text</button>
      <canvas ref={canvasRef} width={400} height={300} />
    </div>
  );
}

export default OwnCanva;
