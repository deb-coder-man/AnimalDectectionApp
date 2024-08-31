// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVdeJxlDkZfNTPO2x15Z9LerJ2hMZAoYg",
  authDomain: "animalidapp.firebaseapp.com",
  projectId: "animalidapp",
  storageBucket: "animalidapp.appspot.com",
  messagingSenderId: "666417253972",
  appId: "1:666417253972:web:60d98aefd8ad1fdfa467c1",
  measurementId: "G-P8WYG0J9N3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };