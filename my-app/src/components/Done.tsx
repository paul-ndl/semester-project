import { CopyAllOutlined } from '@mui/icons-material';
import { Alert, Button, IconButton } from '@mui/material';
import React, { useEffect } from 'react'
import {auth} from './../db'

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';


export default function Done() {


  const [open, setOpen] = React.useState(false);

  const displaySuccess = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const copyCode=()=>{

    navigator.clipboard.writeText(auth.currentUser?.uid ?? "").then(function() {
      console.log('Async: Copying to clipboard was successful!');
      displaySuccess();
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  
  }

  useEffect(() => {
    copyCode();
  }, [])
  
  return (
    <div style={{
      width:"100vw",
      height:"100vh",
      display:"flex", 
      flexDirection:"column", 
      justifyItems:"center", 
      alignItems:"center", 
      justifyContent:"center", 
      alignContent:"center"}}>
      <h1>Participation code</h1>
      <div style={{
        display:"flex"
      }}>
<p>{auth.currentUser?.uid}</p>
      <IconButton color="primary" component="label" onClick={copyCode}>
  <CopyAllOutlined/>
</IconButton>
<Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="coped to clipboard">
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
    Copied to Clipboard!
  </Alert>
        </Snackbar>
      </div>
      
    </div>
  )
}
