import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Stack,
    Input,
    Box,
    CircularProgress,
    IconButton,
  } from "@mui/material";
  import DeleteIcon from "@mui/icons-material/Delete"; // Import the Delete icon for the unselect button
  import { useNavigate } from "react-router-dom";
  import CloudUploadIcon from "@mui/icons-material/CloudUpload";
  import React, { useEffect, useState } from "react";
  import {
    uploadFile,
    uploadFiles,
    checkBackendHealth,
    checkProcessed,
  } from "./api";
  
  export const StartPage = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState(""); // For displaying selected file/folder name
    const [uploadType, setUploadType] = useState(""); // To distinguish between file and folder uploads
    const [isLoading, setIsLoading] = useState(false);
    const [backendIsUp, setBackendIsUp] = useState(false);
    const [isFileProcessed, setIsFileProcessed] = useState(null);
  
    const handleFileChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        setSelectedFile(event.target.files[0]);
        setSelectedFileName(event.target.files[0].name); // Set the file name for display
        setUploadType("file"); // Set the upload type to "file"
        setIsFileProcessed(checkProcessed(event.target.files[0].name));
      }
    };
  
    const handleUnselect = () => {
      setSelectedFile(null);
      setSelectedFiles([]);
      setSelectedFileName("");
      setUploadType("");
    };
  
    const handleUpload = () => {
      setIsLoading(true);
      if (uploadType === "file" && selectedFile) {
        uploadFile(selectedFile)
          .then(handleUploadSuccess)
          .catch(handleUploadError);
      } else if (
        uploadType === "folder" &&
        selectedFiles.length > 0
      ) {
        uploadFiles(selectedFiles)
          .then(handleUploadSuccess)
          .catch(handleUploadError);
      } else {
        alert("Please select a file.");
        setIsLoading(false);
      }
    };
  
    const handleUploadSuccess = (response) => {
      console.log(response);
      setIsLoading(false);
      navigate("/model-response", {
        state: { filePath: uploadType === "file" ? response : response },
      });
    };
  
    const handleUploadError = (error) => {
      console.error("Upload error:", error);
      setIsLoading(false);
    };
  
    useEffect(() => {
      const checkBackendStatus = () => {
        checkBackendHealth().then((res) => {
          if (res.ok) {
            console.log("backend is live");
            setBackendIsUp(true);
            clearInterval(interval);
          }
        });
      };
  
      const interval = setInterval(checkBackendStatus, 5000); // Adjust the interval as needed
    }, []);
  
    return (
      <>
        <Typography variant="h4" textAlign={"center"}>
          Mockview
        </Typography>
  
        <Stack spacing={6} marginTop={10}>
          <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
            <Button
              component="label"
              variant="outlined"
              size="large"
              startIcon={<CloudUploadIcon />}
              disabled={isLoading || uploadType === "folder"}
            >
              Upload File
              <Input
                type="file"
                accept=".dcm"
                sx={{ display: "none" }}
                onChange={handleFileChange}
                disabled={isLoading || uploadType === "folder"}
              />
            </Button>
          </Box>
          {selectedFileName && (
            <Box
              justifyContent={"center"}
              sx={{
                display: "flex",
                flexDirection: "column", // Set direction of items to column
                alignItems: "center",
                ml: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row", // Set direction of items to column
                  alignItems: "center",
                  ml: 2,
                }}
              >
                <Typography variant="body1">{selectedFileName}</Typography>
                <IconButton onClick={handleUnselect} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box>
                {isFileProcessed && (
                  <Typography variant="body2" color="secondary" sx={{ ml: 2 }}>
                    This file has been processed prior.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
  
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Stack spacing={3} direction={"row"} justifyContent={"center"}>
              <Button
                size="large"
                variant="outlined"
                onClick={handleUpload}
                disabled={isLoading || !backendIsUp}
              >
                Send images to the model
              </Button>
            </Stack>
          )}
        </Stack>
      </>
    );
  };
  