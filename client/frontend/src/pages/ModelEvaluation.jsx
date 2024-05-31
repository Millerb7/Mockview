import { useLocation, useNavigate } from 'react-router-dom';
import { approveImage } from './api';
import { Image } from 'mui-image'
import logo from "./logo.png";
import React, { useState } from 'react';
import { Box, Typography, Stack, Button, TextField, MenuItem, FormControl, Select, InputLabel } from '@mui/material';

const EvaluationComponent = ({ imagePath }) => {
  const [message, setMessage] = useState('');
  const [feedbackReason, setFeedbackReason] = useState('');
  const [customFeedback, setCustomFeedback] = useState('');

  const feedbackOptions = {
    missedProblem: 'Missed the problem',
    incorrectClassification: 'Incorrect classification',
    needsTraining: 'Model Needs Training',
    other: 'Other (please specify)',
  };

  const handleFeedbackChange = (event) => {
    setFeedbackReason(event.target.value);
  };

  const handleCustomFeedbackChange = (event) => {
    setCustomFeedback(event.target.value);
  };

  const submitFeedback = (agree) => {
    let feedbackMessage = agree ? "Feedback: Agree. " : "Feedback: Disagree. ";
    if (feedbackReason === 'other') {
      feedbackMessage += `Reason: ${customFeedback}`;
    } else {
      const reasonText = feedbackOptions[feedbackReason];
      feedbackMessage += `Reason: ${reasonText}`;
    }
    setMessage(feedbackMessage);
    approveImage()
  };

  return (
    <Box marginTop={4} textAlign={"center"}>
      <Typography variant='h6'>{imagePath.split("\\").pop()}</Typography>
      <Image src={imagePath} alt="Evaluated Image" />
      <Typography variant="body1" marginTop={2}>
        Indicate below whether you agree or disagree with the model's output.
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="feedback-select-label">Reason for Feedback</InputLabel>
        <Select
          labelId="feedback-select-label"
          id="feedback-select"
          value={feedbackReason}
          label="Reason for Feedback"
          onChange={handleFeedbackChange}
        >
          {Object.entries(feedbackOptions).map(([key, value]) => (
            <MenuItem key={key} value={key}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {feedbackReason === 'other' && (
        <TextField
          fullWidth
          margin="normal"
          label="Custom Feedback"
          variant="outlined"
          value={customFeedback}
          onChange={handleCustomFeedbackChange}
        />
      )}
      <Stack spacing={2} direction="row" justifyContent={"center"} marginTop={2}>
        <Button variant="contained" onClick={() => submitFeedback(true)} color="success" size='large'>Agree</Button>
        <Button variant="contained" onClick={() => submitFeedback(false)} color="error" size='large'>Disagree</Button>
      </Stack>
      {message && <Typography variant="subtitle1" marginTop={2}>{message}</Typography>}
    </Box>
  );
};

export default EvaluationComponent;


export const ModelEvaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filePaths = location.state?.filePath; // Adjusted for possibly receiving multiple paths

  const renderImageEvaluations = () => {
    console.log(filePaths);
    // Check if filePaths is an array and has at least one object
    if (Array.isArray(filePaths) && filePaths.length > 0) {
      console.log(filePaths[0].path);
      return filePaths.map((fileObject, index) => (
        // Ensure to extract the path from each fileObject
        <EvaluationComponent key={index} imagePath={fileObject.path} />
      ));
    } 
    else if (filePaths) {
      // single upload
      return <EvaluationComponent imagePath={filePaths} />;
    }
    else {
      // Handle case where filePaths might not be in the expected format or empty
      return <Typography variant="body1">No images to evaluate.</Typography>;
    }
  };

  return (
    <>
      <Box textAlign={"center"} marginTop={4}>
        <Image onClick={() => navigate("/")} src={logo} width={350} duration={0} style={{ cursor: 'pointer' }} />
        <Typography variant="h4" marginTop={2}>Model Evaluation</Typography>
        {renderImageEvaluations()}
        <Button variant="contained" onClick={() => navigate("/summary")} marginTop={3}>Submit Analysis</Button>
      </Box>
    </>
  );
};
