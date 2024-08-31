/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import OpenAI from 'openai';
import './PhotoProcessing.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';



export default function PhotoProcessing(props) {

    const [labels, setLabels] = useState(" , , , ");
    const [animal, setAnimal] = useState([]);
    const [bar, setBar] = useState(0);
    const [loading, setLoading] = useState(true);
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

    


    return (
        <div>
        {bar !== 100 ? <div style={{width: "20rem", height: "1rem"}}>
                        <ProgressBar animated now={bar} />
                    </div> :
                    <div className='Animal-Container'>
                        <p>{animal[0]}</p>
                        <p>{animal[1]}</p>
                        <p>{animal[2]}</p>
                        <p>{animal[3]}</p>
                    </div> }
            
            
            
        </div>
         
    )
            
};

  
