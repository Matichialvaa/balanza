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
        const client = mqtt.connect('ws://34.201.59.202:1883', options);

        client.on('connect', () => {
            console.log('Connected to MQTT Broker on EC2');

            // Publish a message to a topic
            client.publish('start/button', 'Button clicked', {}, (error) => {
                if (error) {
                    console.error('Publish error:', error);
                }
            });

            // After publishing the message, you can navigate to the home page
            navigate('/home');

            // Optionally, end the connection when done
            client.end();
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

