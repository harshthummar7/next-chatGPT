import { useState } from "react";
import style from "../styles/FileUploader.module.css";
import { getSession } from "next-auth/react";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to handle file selection
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle file upload
  const handleUpload = async () => {
    const file = selectedFile;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const session = await getSession(); // Import getSession from next-auth/client
      //console.log("session", session);
      if (!session) {
        console.error("User not authenticated.");
        return;
      }
      formData.append("session", JSON.stringify(session));
      const response = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      });
      console.log("output");
      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded successfully. File ID:", data.fileId);
      } else {
        console.error("Error uploading in file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading  file:", error);
    }
  };

  return (
    <div className={style.main}>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
    </div>
  );
};

export default FileUploader;
