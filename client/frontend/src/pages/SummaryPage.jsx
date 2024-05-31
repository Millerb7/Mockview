import {List, ListItem, ListItemText, Typography, Box, } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { getSummary } from './api';
import { Image } from 'mui-image';

import React from 'react';
import logo from "./logo.png";

export const SummaryPage = () => {
  const [failed, setFailed ] = React.useState([])
  const [ passed, setPassed ] = React.useState([])
  const [summary, setSummary]=React.useState(undefined)
  const navigate = useNavigate()

  React.useEffect(()=>{
      getSummary().then(x=>{
        setSummary(x)
        setFailed(x["failedImages"])
        setPassed(x["passed"])
        console.log(failed)
      })
  },[])

  return (<>
    <Box>
      <Box>
        <Image onClick={() => navigate("/")} src={logo} width={350} duration={0} style={{marginLeft: '20px', cursor:'pointer'}}/>
        <Typography variant="h4" textAlign={"center"} gutterBottom> Summary Page </Typography> 
      </Box>

      <Typography variant="h5" marginLeft={3}  gutterBottom> Passed Images </Typography> 
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {passed.map(file=>{
        return <ListItem><ListItemText primary={file.split(' ')[1]}/></ListItem>
        })}
      </List>

      <Typography variant="h5" marginLeft={3} gutterBottom> Failed Images </Typography> 
      <List sx={{ width: '100%',  bgcolor: 'background.paper' }}>
        {failed.map(file=>{
        return <ListItem><ListItemText primary={file.split(' ')[1]}/></ListItem>
      })}
      </List>
    </Box>
  </>);
}