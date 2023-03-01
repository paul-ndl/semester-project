import { Button, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import {auth} from './../db'
import {signInAnonymously} from "firebase/auth"
import { useStore } from '../store';

export default function Welcome() {
  const navigate = useNavigate()
  const [signedIn] = useStore((state)=>[state.signedIn]);
  return (
    <div style={{
      width:"80%",
      margin:"auto",
      height:"100vh",
      display:"flex", 
      flexDirection:"column", 
      justifyItems:"center", 
      alignItems:"center", 
      justifyContent:"center", 
      alignContent:"center"}}>
      <h1>Welcome</h1>
      <p>ToDo (Lars), copy over legal text from mturk_hosted</p>
      {signedIn ? 
      (<Button onClick={() => { navigate("/feedback") }}>Let's start</Button>):
      (<div style={{display:"flex", flexDirection:"column", alignItems:"center"}}><p>connecting to database ...</p><CircularProgress/></div>)}
    </div>
  )
}
