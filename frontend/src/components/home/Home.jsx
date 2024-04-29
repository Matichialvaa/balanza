import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { useNavigate } from 'react-router-dom';
import config from "../../config";
import './Home.css';


function Home() {
    const [weight, setWeight] = useState(null);
    const [height, setHeight] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        // Connection to the MQTT broker
        const client = mqtt.connect('ws://52.23.242.25:9000');

        client.on('connect', () => {
            console.log('Connected to the MQTT broker');
            // Subscribe to the topics 'weight' and 'height'
            client.subscribe(['weight', 'height']);
        });

        client.on('message', (topic, message) => {
            console.log(`Message received on topic ${topic}: ${message.toString()}`);

            switch (topic) {
                case 'weight':
                    setWeight(message.toString());
                    console.log(weight)
                    break;
                case 'height':
                    setHeight(message.toString());
                    console.log(height)
                    break;
                default:
                    break;
            }

            // If both data are received, navigate to the next page
            if (weight && height) {
                // Check in the database weight && height in the indicated airline and flight.
                console.log("Weight: " + weight + " Height: " + height);
                console.log("navigating to next page");
                navigate('/newPage');
            }
        });

        // Clean up the effect
        return () => { client.end(); };
    },); // Run the useEffect again if weight or height changes

    return (
        <div>
            <h1>Home Page</h1>
            {weight && <p>Weight: {weight}</p>}
            {height && <p>Height: {height}</p>}
        </div>
    );
}

export default Home;