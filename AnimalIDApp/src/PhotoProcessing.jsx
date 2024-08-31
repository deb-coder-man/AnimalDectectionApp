/* eslint-disable react/prop-types */
import { useState } from 'react';

export default function PhotoProcessing(props) {

    const [labels, setLabels] = useState([]);

    const image = props.image;

    const fetchLabels = async () => {
        try {
            const response = await fetch('http://localhost:3001/openai', {
                headers: {
                    'Content-Type': 'application/json',
                    'image': `${image}`,
                },
            });
            const labelsData = await response.json();
            setLabels(labelsData.message.content); 
        } catch (error) {
            console.error('Error fetching labels:', error);
        }
    };

    return (
        <div>
            <h1>Label Detection</h1>
            <img style={{width: "400px"}} src="./cat.jpeg"/>
            <button style={{width: "100px"}} onClick={fetchLabels}>Analyse Image</button>
            <h1>{labels}</h1>
        </div>
    );
}


  