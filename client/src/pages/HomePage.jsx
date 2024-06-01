import React, { useEffect, useState, useRef } from 'react';
import { Button, Typography, Stack, Input, Box, CircularProgress, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://127.0.0.1:4000";

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadType, setUploadType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendIsUp, setBackendIsUp] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = socketIOClient(ENDPOINT);
    console.log("Connected to server");

    socket.current.on('connect', () => {
      console.log("WebSocket connected");
      setBackendIsUp(true);
    });

    socket.current.on('disconnect', () => {
      console.log("WebSocket disconnected");
      setBackendIsUp(false);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setSelectedFileName(event.target.files[0].name);
      setUploadType("file");
    }
  };

  const handleUnselect = () => {
    setSelectedFile(null);
    setSelectedFileName("");
    setUploadType("");
  };

  const handleUpload = () => {
    if (uploadType === "file" && selectedFile) {
      setIsLoading(true);
      const fileLocation = selectedFile.path;
      socket.current.emit('fileLocation', { filePath: fileLocation }, (response) => {
        if (response.status === "success") {
          handleUploadSuccess(response);
        } else {
          handleUploadError(response.message);
        }
      });
    } else {
      alert("Please select a file.");
    }
  };

  const handleUploadSuccess = (response) => {
    console.log(response);
    setIsLoading(false);
    navigate("/model-response", {
      state: { filePath: response.filePath },
    });
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    setIsLoading(false);
  };

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
              flexDirection: "column",
              alignItems: "center",
              ml: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                ml: 2,
              }}
            >
              <Typography variant="body1">{selectedFileName}</Typography>
              <IconButton onClick={handleUnselect} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
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
              Send file to the model
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  );
};
