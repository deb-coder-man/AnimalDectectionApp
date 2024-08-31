import React from "react";
import { Link } from "react-router-dom";

function MainScreen() {
  return (
    <div>
      <h1>Welcome to the Animal Identification App</h1>
      <Link to="/photo"><button>Upload a Photo</button></Link>
      <Link to="/map"><button>Go to Map</button></Link>
    </div>
  );
}

export default MainScreen;