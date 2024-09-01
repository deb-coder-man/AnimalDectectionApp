
import { Link } from "react-router-dom";
import './MainScreen.css';
import TypingAnimation from "../Style Components/TypingAnimation";
import { useState, useEffect } from "react";

function MainScreen() {

  const [key, setKey] = useState(0); // State to force re-render
  const [isHovered, setIsHovered] = useState(false);

  // Function to reanimate the typing animation
  const reanimate = () => {
    setKey(prevKey => prevKey + 1); // Update the key to re-render TypingAnimation
  };

  useEffect(() =>{
    if(isHovered){
      reanimate();
    }
  }, [isHovered]);

  return (
    <div className = "main-container">

        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="main-title-container">
          <TypingAnimation key={key} className="main-title" text="Google Paws" duration={100} />
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5rem"
        }}>
          <div className = "button-container">
          <Link to="/photo"><button className="button-33" role="button">Identify an Animal</button></Link>
          <Link to="/map"><button className = "button-33">Global Sightings</button></Link>
        </div>
          
        </div>
    </div>
  );
}

function reanimate() {
  return <TypingAnimation className = "main-title" text="Animal Identification App" duration={100}/>
}



export default MainScreen;