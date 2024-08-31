import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { database } from './firebase';
import { ref, get } from "firebase/database";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import "./Map.css"; // Ensure you have styling for the search input and suggestions


const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: -36.90689993565643,
  lng: 174.8362967225019
};



// const fetchGIFs = async (searchTerm) => {
//   const apiKey = import.meta.env.VITE_TENOR_APIKEY // Replace with your actual API key
//   const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchTerm)}&key=${apiKey}&limit=10`;

//   try {
//     const response = await axios.get(url);
//     const gifs = response.data.results;
    
//     // Log the GIF URLs
//     gifs.forEach(gif => {
//       console.log(gif.url); // URL to the GIF page
//       console.log(gif.media_formats.gif.url); // URL to the actual GIF
//     });
//   } catch (error) {
//     console.error('Error fetching GIFs:', error);
//   }
// };
const Map = () => {
  // fetchGIFs('cats');
  const [map, setMap] = useState(null);
  const [enteredAnimal, setEnteredAnimal] = useState('');
  const [sightings, setSightings] = useState([]);
  const [names, setNames] = useState([]);
  const heatmapRef = useRef(null);

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
    console(fetchTimeZone(-36.8485, 174.7633, Math.floor(Date.now() / 1000)));
  };

  const handleSelect = (item) => {
    setEnteredAnimal(item.name);
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
        console.log('Time Zone ID:', data.timeZoneId);
        console.log('Time Zone Name:', data.timeZoneName);

        const localTime = new Date((timestamp + data.dstOffset) * 1000);
        console.log('Local Time:', localTime.toLocaleString("en-US", { timeZone: data.timeZoneId }));

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
  return (
    <>
      <div className="searchContainer">
        <ReactSearchAutocomplete
          items={filteredNames.map(name => ({ id: name, name }))}
          onSearch={handleSearch}
          onSelect={handleSelect}
          formatResult={formatResult}
          className='animalInput'
          placeholder="Type animal name"
          autoFocus
          
        />
      </div>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_API_KEY}
        libraries={['visualization']} // Required for heatmap
      >
        <GoogleMap
          style = {{height: "100vh"}}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15} // Adjusted zoom level
          onLoad={onMapLoad}  // Save the map instance
          options={{disableDefaultUI: true, colorScheme: "FOLLOW_SYSTEM", minZoom: "3"}}
        />
      </LoadScript>
    </>
  );
};

export default Map;
