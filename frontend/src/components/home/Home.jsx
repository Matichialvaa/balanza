import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { useNavigate } from 'react-router-dom';
import config from "../../config";


function Home() {
    const [weight, setWeight] = useState(null);
    const [height, setHeight] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        // Conexión al broker MQTT
        const client = mqtt.connect('ws://44.204.54.69:9000');

        client.on('connect', () => {
            console.log('Conectado al broker MQTT');
            // Suscribirse a los topics 'weight' y 'height'
            client.subscribe(['weight', 'height']);
        });

        client.on('message', (topic, message) => {
            console.log(`Mensaje recibido en topic ${topic}: ${message}`);

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


            // Si recibo ambos datos, navego a la siguiente página
            if (weight && height) {
                // Chequeo en la base de datos weight && height en la aerolínea y vuelo indicado.
                console.log("Weight: " + weight + " Height: " + height);
                console.log("navigating to next page");
                navigate('/newPage');
            }
        });

        // Clean up the effect
        return () => { client.end(); };
    }, [weight, height]); // Corre de nuevo el useEffect si cambia weight o height

    return (
        <div>
            <h1>Home Page</h1>
            {weight && <p>Weight: {weight}</p>}
            {height && <p>Height: {height}</p>}
        </div>
    );
}

export default Home;