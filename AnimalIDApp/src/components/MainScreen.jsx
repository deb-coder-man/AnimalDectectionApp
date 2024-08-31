
import { Link } from "react-router-dom";
import './MainScreen.css';
import TypingAnimation from "../Style Components/TypingAnimation";
import { useState } from "react";

function MainScreen() {

  const [key, setKey] = useState(0); // State to force re-render

  // Function to reanimate the typing animation
  const reanimate = () => {
    setKey(prevKey => prevKey + 1); // Update the key to re-render TypingAnimation
  };

  return (
    <div className = "main-container">

        <div onMouseOver={reanimate}>
          <TypingAnimation key={key} className="main-title" text="Animal Identification App" duration={100} />
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5rem"
        }}>
          <Link to="/photo"><button className="button-33" role="button">Identfiy an Animal</button></Link>
          <Link to="/map"><button className = "button-33">Global Sightings</button></Link>
        </div>
    </div>
  );
}

function reanimate() {
  return <TypingAnimation className = "main-title" text="Animal Identification App" duration={100}/>
}



export default MainScreen;