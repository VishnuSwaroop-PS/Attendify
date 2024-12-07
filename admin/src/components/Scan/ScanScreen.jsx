import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const ScanScreen = () => {
  const webcamRef = useRef(null);
  const [faces, setFaces] = useState([]);

  const captureFrame = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());

    const formData = new FormData();
    formData.append("frame", blob, "frame.jpg");

    try {
      const res = await axios.post(
        "http://localhost:3000/upload-frame",
        formData
      );
      setFaces(res.data.result.faces);
    } catch (err) {
      console.error(err);
      alert("Failed to recognize faces");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between items-center py-20">
      <h2 className="font-bold text-xl font-Outfit">Live Face Recognition</h2>
      <div className="p-2 bg-primaryColor rounded-lg">
      <Webcam 
      className="rounded-lg"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
      />
      </div>
      <div className="flex items-center justify-center gap-5 flex-col">
        <button
          onClick={captureFrame}
          className="px-5 py-2 bg-primaryColor rounded-xl text-white"
        >
          Scan
        </button>
        <div className="px-5 py-2 bg-white shadow-md rounded-md">
          {faces.map((face, index) => (
            <p className="font-Outfit" key={index}>Name: {face.name}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanScreen;