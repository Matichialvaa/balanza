import React, {useState} from 'react';
import './Start.css';
import { useNavigate } from 'react-router-dom';
import mqtt from 'mqtt';
import config from "../../config";

function Start() {
    let navigate = useNavigate();
    const [flightID, setFlightID] = useState('');

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
        const client = mqtt.connect('ws://' + config.mqtt.hostname + ':' + config.mqtt.port);
        console.log(client);

        let weightReceived = false;
        let heightReceived = false;
        let weight = null;
        let height = null;

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
                weight = message.toString();
            } else if (topic === 'height') {
                heightReceived = true;
                height = message.toString()
            }

            // If both data are received, fetch the information from the database
            if (weightReceived && heightReceived) {
                console.log('Fetching information from the database');
                let informationFetched = true;
                //GET REQUEST TO BACKEND
                const fetchData = async () => {
                    try {
                        const response = await fetch('http://localhost:27017/data:');
                        const jsonData = await response.json();
                        setData(jsonData);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };
                let flightID = 'AA1234';
                let flightWeight = '20';
                let flightHeight = '30';


                // If both data are received, navigate to the home page
                if (weightReceived && heightReceived && informationFetched) {
                    console.log("Weight and height received, navigating to home page");
                    navigate('/home', {state: {weight: weight, height: height, flightID: flightID, flightWeight: flightWeight, flightHeight: flightHeight}});
                    client.end();
                }
            }});

        client.on('error', (error) => {
            console.error('Connection error:', error);
        });
        navigate('/home', {state: {weight: 120, height: 120, flightID: "idExample", flightWeight: 120, flightHeight: 120}});
    };


    return (
        <div className="start">
            <h1>Welcome to the App</h1>
            <input type="text" value={flightID} onChange={(e) => setFlightID(e.target.value)} placeholder="Enter flight ID" />
            <button onClick={publishMessage}>Start</button>
        </div>
    );
}

export default Start;

