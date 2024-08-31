import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import MainScreen from "./components/MainScreen";
import MapScreen from "./components/MapScreen";
import PhotoScreen from "./components/PhotoScreen";
import './App.css'

function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/photo" element={<PhotoScreen />} />
      </Routes>
    </BrowserRouter>
    
    </div>
  );
}

export default App; 
