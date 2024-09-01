// firebase.js

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, push, update } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: "https://animalidapp-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Test the database connection
const testRef = ref(database, '/sightings');

get(testRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log("Database import successful. Sightings data:", snapshot.val());
    } else {
      console.log("Database import successful, but no data found at the specified path.");
    }
  })
  .catch((error) => {
    console.error("Error fetching data from the database:", error);
  });

export { app, database, get, ref, push, update };