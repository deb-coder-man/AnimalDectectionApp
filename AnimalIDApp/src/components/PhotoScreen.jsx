import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import PhotoProcessing from '../PhotoProcessing';
import Location from '../Style Components/Popup';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


function PhotoScreen() {
  const [image, setImage] = useState(null);  
  const [showCamera, setShowCamera] = useState(false);  
  const [showImage, setShowImage] = useState(false);  
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [loadingLocationBox, setLoadingLocationBox] = useState(false)

  const [finalLocation, setFinalLocation] = useState("")
  const [variableLocation, setVariableLocation] = useState("")

  // Function to handle back navigation
  const goBack = () => {
    navigate('/');  
  };

  
  const handleImageChange = async (event) => {


    setLoadingLocationBox(true)
    

    const file = event.target.files[0];

    if (file) {

      const reader = new FileReader();

      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
      if( 'geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
          },
          (error) => {
          }
        );
      }
    }
    setShowImage(true);
  };

  // Function to activate the camera
  const activateCamera = async () => {
    setShowCamera(true);
    setShowImage(false);
    setLoadingLocationBox(false)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing the camera: ', error);
      }
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      setShowCamera(false);
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Function to capture the image from the video stream and stop the camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      setShowImage(true);
      setShowCamera(false);
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      setImage(canvasRef.current.toDataURL('image/png'));
      stopCamera();  
      if( 'geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
          },
          (error) => {
          }
        );
      }

    }
  };


  return (
    <div className="AnimalInfo-container">
      
      <h1 style={{marginTop: "50px"}}>Snap & Identify</h1>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "3rem",
      }}>
        <h2 style={{fontSize: "2rem"}}>UPLOAD AN IMAGE</h2>

        <input className="Input-Box" type="file" accept="image/*" onChange={handleImageChange} />
        
        <h1 style={{fontSize: "2rem"}}>OR</h1>
        <button className="button-33" onClick={activateCamera}>Open Camera</button>
      </div>
      <div style={{margin: "40px",
                  marginBottom: "5px",
                  display:"flex",
                  gap: "5rem"}}   
       >
        {showCamera && <button className="button-33" onClick={stopCamera}>Close Camera</button>} 
      </div>
      <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          margin: '20px'
        }}>
          {showCamera && <video ref={videoRef} style={{ width: '600px' }} />}
          {showImage && <img className="Animal-Image" src={image} alt="Captured" style={{ width: '600px', height: '400px', borderRadius: "3rem" }} />}
          <canvas ref={canvasRef} style={{ display: 'none' }} width="300" height="200"></canvas>
          {showCamera && <button className="capture" onClick={captureImage}>Capture</button>}
        </div>
        <div>
          {showImage && <PhotoProcessing image={image} latitude={latitude} longitude={longitude} finalLocation={finalLocation} />}
        </div>
      </div>
      
      <div className = "home-button-container"> <button className = "home-button" onClick={goBack}><i className ="fas fa-home"></i> Home </button></div>
    </div>
  );
}
  
export default PhotoScreen;
