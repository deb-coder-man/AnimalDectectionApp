import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { database, ref, get } from './firebase';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: -36.90689993565643,
  lng: 174.8362967225019
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [animalData, setAnimalData] = useState([]);
  const heatmapRef = useRef(null);

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const dbRef = ref(database, 'sightings/redFox');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.values(data).map((sighting) => ({
            latitude: sighting.latitude,
            longitude: sighting.longitude
          }));
          setAnimalData(formattedData);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAnimalData();
  }, []);

  useEffect(() => {
    if (map && window.google && window.google.maps) {
      const heatmapData = animalData.map(animal =>
        new window.google.maps.LatLng(animal.latitude, animal.longitude)
      );

      if (heatmapRef.current) {
        heatmapRef.current.setMap(null); // Remove previous heatmap layer if it exists
      }

      heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: 30,
      });
    }
  }, [map, animalData]);

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  return (
    <div>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_API_KEY}
        libraries={['visualization']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onLoad={onMapLoad}
        />
      </LoadScript>
    </div>
  );
};

export default Map;
