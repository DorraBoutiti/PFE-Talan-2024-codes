import React, { useRef, useState } from "react";
import "./FileUpload.css";
import axios from "axios";
import { IoIosClose } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import PropTypes from "prop-types"; // Import PropTypes

const FileUpload = ({ candidatId }) => {
  const inputRef = useRef();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("select");

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    const initialProgresses = files.map(() => 0);
    setProgresses(initialProgresses);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFiles([]);
    setProgresses([]);
    setUploadStatus("select");
  };

  const handleUpload = async () => {
    if (uploadStatus === "done") {
      clearFileInput();
      return;
    }

    try {
      setUploadStatus("uploading");

      await Promise.all(
        selectedFiles.map(async (file, index) => {
          const formData = new FormData();
          formData.append("file", file); 
          formData.append("candidatId", candidatId); // Append candidatId to FormData

          try {
            const response = await axios.post("http://localhost:4000/document/test", formData, {
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                const updatedProgresses = [...progresses];
                updatedProgresses[index] = percentCompleted;
                setProgresses(updatedProgresses);
              },
            });

            // Handle the response here if needed
            console.log("Upload successful:", response.data);
          } catch (error) {
            // Handle errors if the upload fails
            console.error("Upload failed:", error);
            setUploadStatus("select"); // Reset upload status
          }
        })
      );

      setUploadStatus("done");
    } catch (error) {
      // Handle errors if the upload fails
      console.error("Upload failed:", error);
      setUploadStatus("select"); // Reset upload status
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      />

      {/* Button to trigger the file input dialog */}
      {selectedFiles.length === 0 && (
        <button className="file-btn" onClick={onChooseFile}>
          <span className="material-symbols-outlined">upload</span> Upload File
        </button>
      )}

      {selectedFiles.length > 0 && (
        <>
          {selectedFiles.map((file, index) => (
            <div className="file-card" key={index}>
              <MdDescription />

              <div className="file-info">
                <div style={{ flex: 1 }}>
                  <h6>{file.name}</h6>

                  <div className="progress-bg">
                    <div className="progress" style={{ width: `${progresses[index]}%` }} />
                  </div>
                </div>

                {uploadStatus === "select" ? (
                  <button onClick={clearFileInput}>
                    <IoIosClose />
                  </button>
                ) : (
                  <div className="check-circle">
                    {uploadStatus === "uploading" ? (
                      `${progresses[index]}%`
                    ) : uploadStatus === "done" ? (
                      <CiCircleCheck />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button className="upload-btn" onClick={handleUpload}>
            {uploadStatus === "select" || uploadStatus === "uploading" ? "Upload" : "Done"}
          </button>
        </>
      )}
    </div>
  );
};

// Define PropTypes for the FileUpload component
FileUpload.propTypes = {
  candidatId: PropTypes.number.isRequired, // Adjust the type as per your requirement
};
export default FileUpload;
