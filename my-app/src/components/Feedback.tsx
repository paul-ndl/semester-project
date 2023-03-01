import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react'
import { db, auth } from './../db'
import { ref, push, serverTimestamp } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {


  const minLength = 50;
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();


  return (
    <div style={{ display: "flex", width: "100vw", alignContent: "center", flexDirection: "column", alignItems: "center", justifyContent: "center", justifyItems: 'center' }}>
      <h1>How did you like this HIT?</h1>
      {
        //<p>Feedback is optional, but we'll give a bonus of 10$ and 2x5$ to the 3 most helpful feedback texts.</p>
      }
      <div style={{ width: "80%" }}>
        <TextField
          fullWidth
          id="outlined-textarea"
          label="Feedback for the HIT?"
          value={feedback}
          error={feedback.length > minLength ? undefined : true}
          helperText={`please provide at least ${minLength} characters, ` + feedback.length + `/ ${minLength}`}

          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFeedback(event.target.value);
          }}
          multiline
        />
      </div>

      <Button disabled={feedback.length < minLength} onClick={() => {
        let endpoint;
        if (auth.currentUser) {
          endpoint = ref(db, `/users/${auth.currentUser?.uid}`)
        }
        else {
          endpoint = ref(db, `/users/missing`)
        }
        push(endpoint, {
          feedback: feedback,
          timestamp: serverTimestamp()
        });
        navigate("/done")
      }}>Continue</Button>
    </div>
  )
}
