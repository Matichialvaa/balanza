import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import './AddFlight.css';
import config from "../../config";

function AddFlight() {
    const [passengerID, setPassengerID] = useState('');
    const [flightID, setFlightID] = useState('');
    const [maxWeight, setMaxWeight] = useState('');
    const [maxHeight, setMaxHeight] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    let navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(config.app.url + `/submitFlight`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ passenger_id: passengerID, flight_id: flightID, maxHeight: maxHeight, maxWeight: maxWeight }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
            setSubmitSuccess(true);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    useEffect(() => {
        if (submitSuccess) {
            navigate('/');
        }
    }, [submitSuccess, navigate]);

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Passenger ID"
                value={passengerID}
                onChange={(e) => setPassengerID(e.target.value)}
            />
            <TextField
                label="Flight ID"
                value={flightID}
                onChange={(e) => setFlightID(e.target.value)}
            />
            <TextField
                label="Max Weight"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
            />
            <TextField
                label="Max Height"
                value={maxHeight}
                onChange={(e) => setMaxHeight(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default AddFlight;