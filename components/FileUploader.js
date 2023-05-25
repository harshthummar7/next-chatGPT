import { useState, useEffect, useRef } from "react";
import style from "../styles/FileUploader.module.css";
import { getSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";

let imageUrl;

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [id, setId] = useState(null);
  const fileInputRef = useRef(null);

  const handleSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const file = selectedFile;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const session = await getSession();

      if (!session) {
        console.error("User not authenticated.");
        return;
      }
      // formData.append("session", JSON.stringify(session));
      const response = await axios.post("/api/uploadFile", formData, {
        // method: "POST",
        // body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(progress);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        const data = await response.data;
        console.log("File uploaded successfully. File ID:", data.fileId);
        setSelectedFile(null);
        imageUrl = data.url;
        //imageUrl = `https://drive.google.com/uc?export=view&id=1jcnIZpW60Ay1lROutHNCFFjYojzPWCfs`;
        // imageUrl = `https://drive.google.com/uc?id=1oZaUpHmGEYFlDeMaklh-4Y7vZ8zbxV6z`;
        setId(data.fileId);
      } else {
        console.log("isssue");
        console.error("Error uploading in file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading  file:", error);
    }
  };

  return (
    <>
      <div className={style.main}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <button onClick={handleSelect}>
          <i className="bi bi-paperclip"></i>Select File
          {selectedFile && <p>{selectedFile.name}</p>}
        </button>

        <button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </button>
        {/* {uploadProgress > 0 && (
          <div className={style.progress}>
            <div
              className={`${style.progressBar} ${style.active}`}
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}
            </div>
          </div>
        )} */}
      </div>
      {id !== null && (
        <div>
          <h1>Uploaded Image</h1>
          <img src={imageUrl} alt="Uploaded Image" width={500} height={500} />
        </div>
      )}
    </>
  );
};

export default FileUploader;
