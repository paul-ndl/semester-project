import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import Done from './components/Done';
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import { auth, db } from './db';
import { ref, set, onValue, get, child } from 'firebase/database';
import Feedback from './components/Feedback';

function App() {

    const [signIn, signOut, setTickerValue] = useStore((state) => ([state.signIn, state.signOut, state.setTickerValue]), shallow);

    useEffect(() => {
        signInAnonymously(auth)

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("auth state control")
                signIn();
                // read ticker Value
                const tickerRef = ref(db, `globalTickerValue`);
                get(tickerRef).then((snapshot) => {
                    let val = 0;
                    if (snapshot.exists()) {
                        val = snapshot.val();
                    }
                    setTickerValue(val);
                    console.log(val);
                    set(ref(db, `globalTickerValue`), val + 1);

                }
                ).catch((error) => {
                    console.error(error);
                });
            } else {
                signOut();
            }
        });
    }, [])


    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path='/welcome' element={<Welcome />} />
                <Route path="/feedback" element={<Feedback/>}/>
                <Route path='/done' element={<Done />} />
            </Routes>
        </Router>
    );
}

export default App;
