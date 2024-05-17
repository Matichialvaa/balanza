import React, {useState} from 'react';
import './Start.css';
import { useNavigate } from 'react-router-dom';
import mqtt from 'mqtt';
import config from "../../config";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import logo from '../assets/AA2000.webp';
import {Button} from "@mui/material";

function Start() {
    let navigate = useNavigate();
    const [passengerID, setPassengerID] = useState('');
    const [data, setData] = useState({ flightID: '', flightWeight: '', flightHeight: '' });
    const [informationFetched, setInfoFetched] = useState(false);

    // Function to fetch flights data from the backend by the passenger ID
    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:27017/data/${passengerID}`);
            console.log(response.data);
            const jsonData = await response.json();
            let { flight_id, max_weight, max_height } = jsonData;

            setData({
                flightID: flight_id,
                flightWeight: max_weight,
                flightHeight: max_height
            });
            setInfoFetched(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
            fetchData().then();
            // If both data are received, navigate to the home page
            if (weightReceived && heightReceived && informationFetched) {
                console.log("Weight and height received, navigating to home page");
                navigate('/home', {state: {weight: weight, height: height, flightID: data.flightID, flightWeight: data.flightWeight, flightHeight: data.flightHeight, passengerID: passengerID}});
                client.end();
            }
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
        });
        navigate('/home', {state: {weight: 10, height: 10, flightID: 10, flightWeight: 10, flightHeight: 10, passengerID: 10}});
    };




    return (
        <div className='anim_gradient'>
            <div className="start">
                <img src={logo}/>
                <form onSubmit={publishMessage} className={"textContainer"}>
                    <TextField
                        id="standard-required"
                        label="PassengerId"
                        variant="standard"
                        value={passengerID}
                        onChange={(e) => setPassengerID(e.target.value)}
                    />
                    <Button
                        variant={"contained"}
                        type={"submit"}
                        disabled={passengerID != '' ? false : true}>Start</Button>
                </form>
            </div>
        </div>
    );
}


export default Start;



