import React from 'react';
import './Start.css';
import { useNavigate } from 'react-router-dom';
import mqtt from 'mqtt';

function Start() {
    let navigate = useNavigate();

    // MQTT connection options
    const options = {
        connectTimeout: 4000, // Timeout period
        // Authentication (if needed)
        //clientId: 'react_mqtt_client',
        // If your MQTT broker requires authentication, uncomment these lines
        // username: 'your_username',
        // password: 'your_password',
    };


    // Function to publish a message to the MQTT broker
    const publishMessage = () => {
        console.log('intento conectar el cliente');
        const client = mqtt.connect('ws://52.23.242.25:9000');
        console.log(client);

        let weightReceived = false;
        let heightReceived = false;

        client.on('connect', () => {
            console.log('Connected to MQTT Broker on EC2');

            // Subscribe to the topics 'weight' and 'height'
            client.subscribe(['weight', 'height']);

            // Publish a message to a topic
            client.publish('start', 'clicked', {}, (error) => {
                if (error) {
                    console.error('Publish error:', error);
                }
            });
        });

        client.on('message', (topic, message) => {
            console.log(`Message received on topic ${topic}: ${message.toString()}`);

            if (topic === 'weight') {
                weightReceived = true;
            } else if (topic === 'height') {
                heightReceived = true;
            }

            // If both data are received, navigate to the home page
            if (weightReceived && heightReceived) {
                console.log("Weight and height received, navigating to home page");
                navigate('/home');
                client.end();
            }
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
        });
    };


    return (
        <div className="start">
            <h1>Welcome to the App</h1>
            <button onClick={publishMessage}>Start</button>
        </div>
    );
}

export default Start;

