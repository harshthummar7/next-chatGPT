import { useState, useEffect, useRef } from "react";
import style from "../styles/FileUploader.module.css";
import { getSession } from "next-auth/react";
import axios from "axios";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [url, setUrl] = useState(null);
  const [load, setLoad] = useState(0);
  const [imgTag, setImgTag] = useState(false);
  const [dragging, setDragging] = useState(true);
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

      const response = await axios.post("/api/uploadFile", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        const data = await response.data;

        console.log(
          "File uploaded successfully. File ID:",
          data.fileDetail.data.id
        );
        setLoad(0);
        if (data.fileDetail.data.mimeType.startsWith("image/")) {
          setImgTag(true);
        }

        setUrl(data.dataUrl);
        setDragging(false);
      } else {
        console.error("Error uploading in file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading  file:", error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setSelectedFile(event.dataTransfer.files[0]);
  };

  const handleDragStart = (event) => {
    console.log("1");
    const file = selectedFile;
    if (file) {
      event.dataTransfer.setData("text/plain", file.name);
    }
  };

  useEffect(() => {
    if (uploadProgress === 100) {
      const timer = setTimeout(() => {
        alert("File successfully uploaded");
        setLoad(1);

        setUploadProgress(0);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [uploadProgress]);

  return (
    <>
      <div className={style.main}>
        <div
          className={style.dragging}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={style.first}>
            <i className="bi bi-arrow-up-square-fill"></i>
            <h3>Drag and Drop</h3>
          </div>
          <p>OR</p>
          <div className={style.second}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <button onClick={handleSelect} onDragStart={handleDragStart}>
              <i className="bi bi-paperclip"></i>Select File
              {selectedFile && <p>{selectedFile.name}</p>}
            </button>
          </div>
        </div>

        <button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </button>
        {uploadProgress > 0 && (
          <div className={style.progress}>
            <div
              className={style.active}
              style={{ width: `${uploadProgress}%` }}
            >
              {`${uploadProgress}%`}
            </div>
          </div>
        )}
        {load === 1 ? (
          <div className={style.loader}></div>
        ) : (
          url && (
            <div className={style.frame}>
              {imgTag === true ? (
                <img src={`${url}`} width="500" height="300" />
              ) : (
                <iframe src={`${url}`} width="500" height="300" />
              )}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default FileUploader;
