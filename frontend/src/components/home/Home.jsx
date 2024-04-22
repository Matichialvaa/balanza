import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import config from "../../config";
import { useNavigate } from 'react-router-dom';

function Home() {
    const [weight, setWeight] = useState(null);
    const [height, setHeight] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        const client = mqtt.connect('ws://44.204.54.69:9000');

        client.on('connect', () => {
            client.subscribe('weight');
            client.subscribe('height');
        });

        client.on('message', (topic, message) => {
            switch (topic) {
                case 'weight':
                    setWeight(message.toString());
                    break;
                case 'height':
                    setHeight(message.toString());
                    break;
                default:
                    break;
            }

            // If both weight and height are received, navigate to a new page
            if (weight && height) {
                //chequeo en la base de datos weight && height en la aerolinea y vuelo indicado.
                console.log("Weight: " + weight + " Height: " + height);
                console.log("navigating to next page");
                navigate('/newPage');
            }
        });

        // Clean up the effect
        return () => client.end();
    }, [weight, height]); // Re-run the effect when weight or height changes

    return (
        <div>
            <h1>Home Page</h1>
            {weight && <p>Weight: {weight}</p>}
            {height && <p>Height: {height}</p>}
        </div>
    );
}

export default Home;