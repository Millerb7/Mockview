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
import { Image } from "mui-image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import logo from "./logo.png";
import React, { useEffect, useState } from "react";
import {
  uploadFile,
  uploadFiles,
  checkBackendHealth,
  checkProcessed,
} from "./api";

export const StartPage = () => {
  const navigate = useNavigate();
  const [material, setMaterial] = useState("");
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

  const handleDirectoryChange = (event) => {
    if (event.target.files) {
      setSelectedFiles([...event.target.files]);
      setSelectedFileName(
        event.target.files[0].webkitRelativePath.split("/")[0]
      ); // Extract the folder name
      setUploadType("folder"); // Set the upload type to "folder"
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
    if (uploadType === "file" && selectedFile && material) {
      uploadFile(selectedFile, material)
        .then(handleUploadSuccess)
        .catch(handleUploadError);
    } else if (
      uploadType === "folder" &&
      selectedFiles.length > 0 &&
      material
    ) {
      uploadFiles(selectedFiles, material)
        .then(handleUploadSuccess)
        .catch(handleUploadError);
    } else {
      alert("Please select a file or files and a material.");
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
      <Image
        duration={0}
        src={logo}
        width={350}
        style={{ marginLeft: "20px", cursor: "pointer" }}
      />
      <Typography variant="h4" textAlign={"center"}>
        X-Ray Weld Defect Detection App
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
          <Button
            component="label"
            variant="outlined"
            size="large"
            startIcon={<CloudUploadIcon />}
            disabled={isLoading || uploadType === "file"}
          >
            Upload Directory
            <Input
              type="file"
              inputProps={{ webkitdirectory: "", directory: "" }}
              accept=".dcm"
              sx={{ display: "none" }}
              onChange={handleDirectoryChange}
              disabled={isLoading || uploadType === "file"}
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

        <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
          <FormControl style={{ width: "50%" }} disabled={isLoading}>
            <InputLabel id="material-select-label">Material</InputLabel>
            <Select
              labelId="material-select-label"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <MenuItem value={"Ti"}>Titanium</MenuItem>
              <MenuItem value={"Al"}>Aluminum</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate("/summary")}
              disabled={isLoading}
            >
              Go to Summary Page
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  );
};
