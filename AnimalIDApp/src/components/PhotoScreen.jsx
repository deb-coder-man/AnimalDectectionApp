import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import PhotoProcessing from '../PhotoProcessing';

function PhotoScreen() {
  const [animalName, setAnimalName] = useState("Name of the Animal");
  const [species, setSpecies] = useState("Species");
  const [description, setDescription] = useState("Brief Description");
  const [image, setImage] = useState(null);  // State to hold the captured image
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
  };

  // Function to activate the camera
  const activateCamera = async () => {
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
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Function to capture the image from the video stream and stop the camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      setImage(canvasRef.current.toDataURL('image/png'));
      stopCamera();  // Stop camera after capturing the image
    }
  };

  return (
    <div>
      <h1>Photo Screen</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={activateCamera}>Open Camera</button>
      <button onClick={stopCamera}>Close Camera</button> {/* Close Camera Button */}
      <div>
        <video ref={videoRef} style={{ width: '300px' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} width="300" height="200"></canvas>
        <button onClick={captureImage}>Capture</button>
      </div>
      <div>
        <h3>Animal Information</h3>
        <p><strong>Name:</strong> {animalName}</p>
        <p><strong>Species:</strong> {species}</p>
        <p><strong>Description:</strong> {description}</p>
        {image && <PhotoProcessing image={image} />}
      </div>
      <button onClick={goBack}>Go Back to Home</button>
    </div>
  );
}

export default PhotoScreen;
