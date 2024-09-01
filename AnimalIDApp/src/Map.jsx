import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { database } from './firebase';
import { ref, get } from 'firebase/database';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Link } from 'react-router-dom';
import './Map.css';
import HyperText from './Style Components/HyperText';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 0,
  lng: 0
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [enteredAnimal, setEnteredAnimal] = useState('');
  const [sightings, setSightings] = useState([]);
  const [names, setNames] = useState([]);
  const [gif, setGif] = useState('');
  const [closestText, setClosestText] = useState('');
  const heatmapRef = useRef(null);
  const [mode, setMode] = useState('LIGHT'); // Default mode

  useEffect(() => {
    // Fetch animal names from Firebase
    const fetchAnimalNames = async () => {
      const sightingsRef = ref(database, '/sightings');

      try {
        const snapshot = await get(sightingsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const animalNames = Object.values(data).map(species => species.name);
          setNames(animalNames);
        } else {
          console.log('No data found.');
        }
      } catch (error) {
        console.error('Error fetching animal names:', error);
      }
    };

    fetchAnimalNames();
  }, []);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };



  async function fetchGIF(searchTerm) {
    const apiKey = import.meta.env.VITE_TENOR_APIKEY; // Ensure correct API key environment variable
    const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchTerm)}&key=${apiKey}&limit=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        console.log('GIF found:', data.results[0].media_formats.gif.url);
        setGif(data.results[0].media_formats.gif.url); // Return the URL of the first GIF
      } else {
        console.log('No GIFs found for this search term.');
        setGif(''); // Clear GIF if none found
      }
    } catch (error) {
      console.error('Error fetching GIF:', error);
      setGif(''); // Clear GIF in case of error
    }
  }

  useEffect(() => {
    // Fetch sightings data from Firebase based on the enteredAnimal
    const fetchSightings = async () => {
      if (enteredAnimal.trim() === '') {
        setSightings([]);
        return;
      }

      const sightingsRef = ref(database, '/sightings');

      try {
        const snapshot = await get(sightingsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const sightingsList = [];

          // Find the matching species and collect sightings data
          Object.keys(data).forEach(speciesKey => {
            if (data[speciesKey].name === enteredAnimal) {
              const species = data[speciesKey];
              if (species.sightings) {
                Object.values(species.sightings).forEach(sighting => {
                  sightingsList.push(
                    {
                      lat: sighting.latitude,
                      lng: sighting.longitude
                    }
                  );
                });
              }
            }
          });

          setSightings(sightingsList);
          console.log('Loaded sightings:', sightingsList);

          // Find closest points
          findClosestPoints(sightingsList);
        } else {
          console.log('No data found.');
          setSightings([]);
        }
      } catch (error) {
        console.error('Error fetching sightings data:', error);
      }
    };

    fetchSightings();
  }, [enteredAnimal]);
  const findClosestPoints = (sightingsList) => {
    if (sightingsList.length === 0) return;

    const distances = sightingsList.map(sighting => {
      const distance = haversineDistance(center.lat, center.lng, sighting.lat, sighting.lng);
      return { distance, location: sighting };
    });

    distances.sort((a, b) => a.distance - b.distance);
    const closestPoints = distances.slice(0, 3);
    setClosestText(closestPoints.map(point => {
     
        return `• ${point.distance.toFixed(2)} km `;
      
      return '';
    }).join(' \n')); // Update state with closest points
  };

  useEffect(() => {
    if (map && sightings.length > 0 && window.google && window.google.maps) {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null); // Clear existing heatmap layer
      }

      if (map) {
        map.setZoom(3);
        map.setCenter(center);
      }

      heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
        data: sightings.map(sighting => new window.google.maps.LatLng(sighting.lat, sighting.lng)),
        map: map,
        radius: 20, // Adjust the radius of the heatmap
      });

      console.log('Heatmap updated.');
    }
  }, [map, sightings]);

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const handleSearch = (string, results) => {
    setEnteredAnimal("");
  };

  const handleSelect = (item) => {
    setEnteredAnimal(item.name);
    fetchGIF(item.name);
  };

  const formatResult = (item) => {
    return (
      <span>{item.name}</span>
    );
  };

  // Filter names based on the enteredAnimal in correct order
  const filteredNames = enteredAnimal.trim() === '' ? names : names.filter(name =>
    name.toLowerCase().includes(enteredAnimal.toLowerCase())
  );

  const fetchTimeZone = async (latitude, longitude, timestamp) => {
    const apiKey = import.meta.env.VITE_API_KEY; // Ensure correct API key environment variable
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const localTime = new Date((timestamp + data.dstOffset) * 1000);
        console.log('Local Time:', localTime.toLocaleString('en-US', { timeZone: data.timeZoneId }));
        setMode(localTime.getHours() >= 18 ? 'DARK' : 'LIGHT');
      } else {
        console.error('Error:', data.status);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const latitude = -36.8485;
  const longitude = 174.7633;
  const timestamp = Math.floor(Date.now() / 1000);

  useEffect(() => {
    fetchTimeZone(latitude, longitude, timestamp);
  }, []);

  return (
    <>
      <div className="UI">
        <div className="searchContainer">
          <Link to="/"><button className='back-button-map'><i className="fas fa-home"></i>Home</button></Link>
          <ReactSearchAutocomplete
            items={filteredNames.map(name => ({ id: name, name }))}
            onSearch={handleSearch}
            onSelect={handleSelect}
            formatResult={formatResult}
            className='animalInput'
            placeholder="Type animal name"
            autoFocus
          />
          {gif !== '' && <img className="animal-gif" src={gif} alt="Animal GIF" />}
        </div>

        <div className="hyper">
        {enteredAnimal.trim() !== '' && (
  <>
    <h1 className="distance distance-title">Closest {enteredAnimal}:</h1>
    <h1 className="distance distance-text"><pre>{closestText}</pre></h1>
  </>
)}
        
      </div>
    </div>

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_API_KEY}
        libraries={['visualization']} // Required for heatmap
      >
        <GoogleMap
          style={{ height: '100vh' }}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15} // Adjusted zoom level
          onLoad={onMapLoad}  // Save the map instance
          options={{ disableDefaultUI: true, styles: mode === 'DARK' ? darkModeStyle : lightModeStyle, minZoom: 3 }}
        />
      </LoadScript>
    </>
  );
};

const darkModeStyle = [
  // Dark mode styles here
];

const lightModeStyle = [
  // Light mode styles here
];

export default Map;
