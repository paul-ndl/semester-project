import { Button, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { auth } from './../db'
import { signInAnonymously } from "firebase/auth"
import { useStore } from '../store';

export default function Welcome() {
  const navigate = useNavigate()
  const [signedIn] = useStore((state) => [state.signedIn]);
  return (
    <div style={{
      width: "80%",
      margin: "auto",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyItems: "center",
      alignItems: "center",
      justifyContent: "center",
      alignContent: "center"
    }}>
      <h1>Information Sheet</h1>
      <p>We collect the following information:</p>
      <ul>
        <li>Basic demographic data (age brackets, gender, nationality)</li>
        <li>Answers to surveys</li>
        <li>Interaction metadata, such as time to decide</li>
      </ul>
      <p>
        We do not collect any data that makes you personally identifiable.
        Your submissions in this survey are entirely anonymous.
      </p>
      <p>
        We will use this data to investigate the mechanism of human
        similarity perception. Our findings, together with the dataset, will
        be made publicly available.
      </p>
      <p>
        Your data will be processed in accordance with Swiss laws on data protection.
        As members of EPFL, the following articles apply to our research: <a href='https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1993/210_210_210/20170501/en/pdf-a/fedlex-data-admin-ch-eli-cc-1993-210_210_210-20170501-en-pdf-a.pdf'>art. 36c ETH Act (RS 414.110)</a>
      </p>
      {signedIn ?
        (<Button onClick={() => { navigate("/similarityInstructions") }}>Let's start</Button>) :
        (<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><p>connecting to database ...</p><CircularProgress /></div>)}
    </div>
  )
}
