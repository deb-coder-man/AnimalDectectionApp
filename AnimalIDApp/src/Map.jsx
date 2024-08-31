import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { db } from './firebase';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: -36.90689993565643,
  lng: 174.8362967225019
};

const Map = () => {
  const [markers, setMarkers] = useState([]);

//   useEffect(() => {
//     Retrieve markers data from Firebase
//     const markersRef = database.ref('markers'); // Adjust the path to your database

//     markersRef.on('value', (snapshot) => {
//       const data = snapshot.val();
//       const loadedMarkers = [];

//       for (let id in data) {
//         loadedMarkers.push(data[id]);
//       }

//       setMarkers(loadedMarkers);
//     });

//     Cleanup listener on component unmount
//     return () => markersRef.off();
//   }, []);

  const mapOptions = {
    mapTypeId: 'satellite',
  };

  return (
    <div>
      <LoadScript
        googleMapsApiKey="AIzaSyBJgb5sVPOXGL2kE51OLSaIs9eUUHxSDWY" // Replace with your API key
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={90}
          options={mapOptions}
        >
          {markers.map((position, index) => (
            <Marker
              key={index}
              position={position}
              title={`Marker ${index + 1}`}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
