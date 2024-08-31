import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import PhotoProcessing from '../PhotoProcessing';

import { set } from "firebase/database";

function PhotoScreen() {
  const [image, setImage] = useState(null);  // State to hold the captured image
  const [showCamera, setShowCamera] = useState(false);  // State to show/hide the camera
  const [showImage, setShowImage] = useState(false);  // State to show/hide the captured image
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Function to handle back navigation
  const goBack = () => {
    navigate('/');  // Navigate to the home page
  };

  // Function to handle image file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    setShowImage(true);
  };

  // Function to activate the camera
  const activateCamera = async () => {
    setShowCamera(true);
    setShowImage(false);
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
      stopCamera();  // Stop camera after capturing the image
      if( 'geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Success callback
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          },
          (error) => {
            // Error callback
            console.error(`Error Code = ${error.code}: ${error.message}`);
          }
        );
      }

    }
  };

  return (
    <div className="AnimalInfo-container">
      <h1 style={{marginTop: "50px"}}>Snap & Identify</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div style={{margin: "40px",
                  marginBottom: "5px",
                  display:"flex",
                  gap: "5rem"}}   
       >
        <button className="button-33" onClick={activateCamera}>Open Camera</button>
        <button className="button-33" onClick={stopCamera}>Close Camera</button> 
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        margin: '20px'
      }}>
        {showCamera && <video ref={videoRef} style={{ width: '600px' }} />}
        {showImage && <img src={image} alt="Captured" style={{ width: '600px', height: 'auto' }} />}
        <canvas ref={canvasRef} style={{ display: 'none' }} width="300" height="200"></canvas>
        {showCamera && <button className="capture" onClick={captureImage}>Capture</button>}
      </div>
      <div>
        <PhotoProcessing image={image} />
      </div>
      <div className = "home-button-container"> <button className = "home-button" onClick={goBack}><i className ="fas fa-home"></i> Home </button></div>
      
    </div>
  );
}

export default PhotoScreen;
