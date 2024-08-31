import React from "react";
import { useNavigate } from 'react-router-dom'; 

function MapScreen() {
  const navigate = useNavigate();

const goBack = () => {
  navigate('/')
}


  return (
    <div>
      <h1>Map Screen</h1>
      <div>
       <p>Map with pins will be displayed here.</p>
       {/* Placeholder for map */}
      </div>
      <button onClick={goBack}>Go back to home</button>
    </div>
  );
}

export default MapScreen;
