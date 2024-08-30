// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmeB1pbqgeo3t4INKjLDSGZbW6e5uYpHw",
  authDomain: "gdsc-2d5d4.firebaseapp.com",
  projectId: "gdsc-2d5d4",
  storageBucket: "gdsc-2d5d4.appspot.com",
  messagingSenderId: "330116564734",
  appId: "1:330116564734:web:2f58a5e2aa9d755c74c7af",
  measurementId: "G-11LBRX7RNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);