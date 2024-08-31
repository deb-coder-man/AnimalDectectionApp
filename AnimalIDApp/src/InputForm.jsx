import React, { useState } from 'react';
import { db, collection, addDoc } from './firebase'; // Import Firestore functions

const InputForm = () => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async (e) => {
    console.log(name, latitude, longitude)
    e.preventDefault(); // Prevent default form submission behavior

    try {
      await addDoc(collection(db, 'animals'), {
        name,
        latitude: parseFloat(latitude), // Convert to number
        longitude: parseFloat(longitude) // Convert to number
      });
      setName('');
      setLatitude('');
      setLongitude('');
      alert('Animal data added successfully.');
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  return (
    <div>
      <h1>Add Animal Data</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Animal Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Latitude:
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              step="any" // Allows decimal values
            />
          </label>
        </div>
        <div>
          <label>
            Longitude:
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              step="any" // Allows decimal values
            />
          </label>
        </div>
        <button type="submit">Add Data</button>
      </form>
    </div>
  );
};

export default InputForm;
