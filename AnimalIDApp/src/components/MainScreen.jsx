
import { Link } from "react-router-dom";
import './MainScreen.css';

function MainScreen() {
  return (
    <div className = "main-container">
        <h1 className = "main-title">Instant Animal Identification</h1>
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


export default MainScreen;