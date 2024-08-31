/* eslint-disable react/prop-types */
import React, { useState } from 'react';

export default function PhotoProcessing(props) {

    const [labels, setLabels] = useState(" , , , ");
    const [animal, setAnimal] = useState([]);
    const image = props.image;

    React.useEffect(() => {
        const fetchLabels = async () => {
            try {
                const response = await fetch('http://localhost:3001/openai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                    image: image, // Assuming `image` is a Base64 string
                    }),
                });
                const labelsData = await response.json();
                setLabels(labelsData.message.content); 
            } catch (error) {
                console.error('Error fetching labels:', error);
            }
        };
        fetchLabels();
    }, [image]);

    React.useEffect(() => {
        let parts = labels.split(",");
        setAnimal(parts);
    }, [labels]);
  

    return (
        <div>
            <h3>Animal Information</h3>
            <p><strong>Name:</strong> {animal[0]}</p>
            <p><strong>Species:</strong> {animal[1]}</p>
            <p><strong>Endangered Level:</strong> {animal[2]}</p>
            <p><strong>Description:</strong>{animal[3]}</p>
        </div>
    );
}


  
