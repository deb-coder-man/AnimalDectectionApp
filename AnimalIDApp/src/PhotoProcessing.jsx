/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import OpenAI from 'openai';
import './PhotoProcessing.css';
import { set } from 'firebase/database';


export default function PhotoProcessing(props) {

    const [labels, setLabels] = useState(" , , , ");
    const [animal, setAnimal] = useState([]);
    const image = props.image;

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
                          { type: "text", text: "Analyze the image of the animal provided in the request. Return the following details as a single line of comma-separated values: Animal Name, Species, Endangered Level, short desciption without any commas. Make sure there is no additional text, just the CSV data." },
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
  

    return (
        <div className='Animal-Container'>
            <h3>Animal Information</h3>
            <p><strong>Name:</strong> {animal[0]}</p>
            <p><strong>Species:</strong> {animal[1]}</p>
            <p><strong>Endangered Level:</strong> {animal[2]}</p>
            <p><strong>Description:</strong>{animal[3]}</p>
        </div>
    );
}


  
