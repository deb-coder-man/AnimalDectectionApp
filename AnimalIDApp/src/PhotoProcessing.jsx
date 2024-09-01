/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import OpenAI from 'openai';
import './PhotoProcessing.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { database, ref, get, update } from './firebase';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

const toCamelCase = (inputString) => {
    const words = inputString.split(' ');

    const camelCaseWords = words.map((word, index) =>
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    return camelCaseWords.join('');

};
export default function PhotoProcessing(props) {

    const [labels, setLabels] = useState(" , , , ");
    const [animal, setAnimal] = useState([]);
    const [bar, setBar] = useState(0);
    const [loading, setLoading] = useState(true);
    const {image, latitude, longitude, finalLocation} = props


    React.useEffect(() => {
        setLabels(" , , , ");
        const fetchLabels = async () => {
            try {

                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                      {
                        role: "user",
                        content: [
                          { type: "text", text: "Analyze the image of the animal provided in the request. Return the following details as a single line of comma-separated values: Animal Name, Species, Endangered Level, short desciption without any commas. Make sure there is no additional text, just the CSV data. If you can't identify the image just return this string: error,error,error,error. Give all the data in form the of Name: ___, Species:____, Endangered Level:____, and Description:____" },
                          {
                            type: "image_url",
                            image_url: {
                              "url": `${image}`,
                            },
                          },
                        ],
                      },
                    ],
                  });
                  setLabels(response.choices[0].message.content); 

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
  
    React.useEffect(() => {
        setBar(0); // Reset progress bar
        const interval = setInterval(() => {
            setBar(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setLoading(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 500); // Increase progress every 200ms

        return () => clearInterval(interval);
    }, [image]);

    React.useEffect(() => {
        // Check if the animal has valid data before saving to the database
        if (animal.length > 0 && animal[0].trim() !== "") {
            saveSightingToDatabase(animal, latitude, longitude);
        }
    }, [animal]); // Trigger this effect whenever finalLocation changes

    //----------->Database stuff<---------------
    const saveSightingToDatabase = async (animal, latitude, longitude) => {
        const name = animal[0].split(":")[1].trim();
        const camelCaseName = toCamelCase(name); // Convert the name to camelCase
        const sightingsRef = ref(database, `/sightings/${camelCaseName}`); // Reference to the animal object in the database
        
        if (animal[0] === "error") {
            return;
        }

        try {
            const snapshot = await get(sightingsRef);
            if (snapshot.exists()) {
                // If the animal exists, add a new sighting
                const existingSightings = snapshot.val().sightings || {};
                const newSightingKey = `sighting${Object.keys(existingSightings).length + 1}`;
                const newSighting = {
                    latitude: latitude,
                    longitude: longitude,
                };
                update(ref(database, `/sightings/${camelCaseName}/sightings`), {
                    [newSightingKey]: newSighting
                });
            } else {
                // If the animal does not exist, create a new animal object and add the first sighting
                console.log(name)
                const newAnimalData = {
                    name: name,
                    sightings: {
                        sighting1: {
                            latitude: latitude,
                            longitude: longitude
                        }
                    }
                };
                update(sightingsRef, newAnimalData);
            }
            console.log("Sighting saved to database.");
        } catch (error) {
            console.error("Error saving sighting to database:", error);
        }
    };
    //<------------------------------>

    return (
        <div>

        {bar !== 100 ? <div style={{width: "20rem", height: "1rem"}}>
                        <ProgressBar animated now={bar} />
                    </div> :
                    <div className='Animal-Container'>
                        <p>{animal[0] === "error" ? "Can't process image" : animal[0]}</p>
                        <p>{animal[0] !== "error" && animal[1]}</p>
                        <p>{animal[0] !== "error" && animal[2]}</p>
                        <p>{animal[0] !== "error" && animal[3]}</p>
                    </div>
        }
        </div>
         
    )
            
};

  

