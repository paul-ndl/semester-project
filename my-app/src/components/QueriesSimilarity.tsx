import { Button, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { auth } from '../db'
import { signInAnonymously } from "firebase/auth"
import { useStore } from './../store';
import { shallow } from 'zustand/shallow';
import allHitData from './../generated/hits.json';

export default function QueriesSimilarity() {
    const navigate = useNavigate()

    // get the app state
    const [tickerValue, currentSimilarityIdx] = useStore((state) => [state.tickerValue, state.currentSimilarityIdx], shallow);
    const [addAnswer] = useStore((state) => [state.addSimilarityAnswer], shallow);

    // parse the current similarity question out of the json
    const hitIdx = tickerValue % allHitData.length;
    const hitData = allHitData[hitIdx];
    let query = null;
    if (currentSimilarityIdx < hitData['similarity_questions'].length) {
        query = hitData['similarity_questions'][currentSimilarityIdx];
    }

    // if we have answered all the similarity questions, navigate to the next part of the survey
    useEffect(() => {
        if (currentSimilarityIdx >= hitData['similarity_questions'].length) {
            navigate("/feedback")
        }
    }, [currentSimilarityIdx])

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
            {query? 
            <p>ToDo: display a UI element here. The data of the query is {query?.a}, {query?.b}, {query?.c}</p>
             :<p>navigating ...</p>}
            <Button onClick={() => {addAnswer("bla") }}>Continue</Button>
        </div>
    )
}
