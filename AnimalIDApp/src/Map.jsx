import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { database } from './firebase';
import { ref, get } from "firebase/database";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Link } from "react-router-dom";
import "./Map.css"; // Ensure you have styling for the search input and suggestions

const containerStyle = {
  width: '100vw',
  height: '100vh'
};
const tenorapikey = import.meta.env.VITE_TENOR_API_KEY;
const center = {
  lat: -36.90689993565643,
  lng: 174.8362967225019
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [enteredAnimal, setEnteredAnimal] = useState('');
  const [sightings, setSightings] = useState([]);
  const [names, setNames] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [gif, setGif] = useState('');
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
          console.log("No data found.");
        }
      } catch (error) {
        console.error("Error fetching animal names:", error);
      }
    };

    fetchAnimalNames();
  }, []);
  async function fetchGIF(searchTerm) {
    const apiKey = import.meta.env.VITE_TENOR_APIKEY; // Replace with your Tenor API key
    const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchTerm)}&key=${apiKey}&limit=1`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        console.log('GIF found:', data.results[0].media_formats.gif.url);
       setGif(data.results[0].media_formats.gif.url); // Return the URL of the first GIF
      } else {
        console.log('No GIFs found for this search term.');
        return ''; // Return an empty string if no GIF is found
      }
    } catch (error) {
      console.error('Error fetching GIF:', error);
      return ''; // Return an empty string in case of error
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
                    new window.google.maps.LatLng(sighting.latitude, sighting.longitude)
                  );
                });
              }
            }
          });

          setSightings(sightingsList);
          console.log("Loaded sightings:", sightingsList);
        } else {
          console.log("No data found.");
          setSightings([]);
        }
      } catch (error) {
        console.error("Error fetching sightings data:", error);
      }
    };

    fetchSightings();
  }, [enteredAnimal]); // Re-run when enteredAnimal changes

  useEffect(() => {
    // Initialize heatmap once the map and sightings data are available
    if (map && sightings.length > 0) {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null); // Clear existing heatmap layer
      }

      if(map){
        map.setZoom(3);
        map.setCenter(center);
<<<<<<< HEAD
      }    

=======
      }
    
>>>>>>> 5b2ef09ef85dde97c048292f3910a753d6a75d61
      heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
        data: sightings,
        map: map,
        radius: 20, // Adjust the radius of the heatmap
      });

      console.log("Heatmap updated.");
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
    const apiKey = import.meta.env.VITE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK') {
        const localTime = new Date((timestamp + data.dstOffset) * 1000);
        console.log('Local Time:', localTime.toLocaleString("en-US", { timeZone: data.timeZoneId }));
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
  
  fetchTimeZone(latitude, longitude, timestamp);


  // const goBack = () => {
  //   navigate('/');  // Navigate to the home page
  // };
  
  return (
    <>
      <div className="searchContainer">
      <Link to = "/"><button className='back-button-map'>Back</button></Link>
        <ReactSearchAutocomplete
          items={filteredNames.map(name => ({ id: name, name }))}
          onSearch={handleSearch}
          onSelect={handleSelect}
          formatResult={formatResult}
          className='animalInput'
          placeholder="Type animal name"
          autoFocus
        />
        {gif !== '' && <img className="animal-gif" src={gif} />}
      </div>
      
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_API_KEY}
        libraries={['visualization']} // Required for heatmap
      >
        <GoogleMap
          style={{ height: "100vh" }}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15} // Adjusted zoom level
          onLoad={onMapLoad}  // Save the map instance
          options={{disableDefaultUI: true, colorScheme: "DARK", minZoom: "3"}}
        />
      </LoadScript>
       
    </>
  );
};

export default Map;
