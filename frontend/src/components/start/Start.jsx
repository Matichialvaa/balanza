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

    // Function to publish a message to the MQTT broker
    const publishMessage = (event) => {
        event.preventDefault();
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
            console.log(weightReceived, heightReceived);
            // If both data are received, navigate to the home page
            if (weightReceived && heightReceived) {
                console.log("Weight and height received, navigating to home page");
                navigate('/home', {state: {weight: weight, height: height, passengerID: passengerID}});
                client.end();
            }
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
        });
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



