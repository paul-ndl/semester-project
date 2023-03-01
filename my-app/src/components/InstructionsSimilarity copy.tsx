import { Button, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { auth } from './../db'
import { signInAnonymously } from "firebase/auth"
import { useStore } from '../store';

export default function InstructionsSimilarity() {
    const navigate = useNavigate()
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
            <h1>Instructions</h1>
            <p>Instructions for similarity queries</p>
            <p>ToDo:</p>
            <Button onClick={() => { navigate("/similarityQueries") }}>Continue</Button>
        </div>
    )
}
