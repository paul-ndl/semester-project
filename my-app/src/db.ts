// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database';
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

    apiKey: "AIzaSyBK3YN4motDBv2kAn-viDQS998VOPUbPmU",
  
    authDomain: "comparisons-2ad8d.firebaseapp.com",
  
    projectId: "comparisons-2ad8d",
  
    storageBucket: "comparisons-2ad8d.appspot.com",
  
    messagingSenderId: "933325725562",
  
    appId: "1:933325725562:web:ddb072971c399c8c1200c3"
  
  };
  

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
