import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';

function Home() {
    const location = useLocation();
    const { weight, height, flightID, flightWeight, flightHeight, passengerID } = location.state;

    // Paso de string a int
    const numWeight = Number(weight);
    const numHeight = Number(height);
    const numFlightWeight = Number(flightWeight);
    const numFlightHeight = Number(flightHeight);
    const numPassengerID = Number(passengerID);
    const numFlightID = Number(flightID);

    // Function to send data to the backend
    const saveData = async () => {
        try {
            const response = await fetch('http://localhost:27017/save-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic: 'measure', message: `Weight: ${weight}, Height: ${height}` }),
            });

            const responseData = await response.text();
            console.log(responseData);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <div className="home">
            <h1>Home Page</h1>
            <p>PassengerID : {passengerID}</p>
            <p>Weight: {weight}</p>
            <p>Height: {height}</p>
            <p>{(numWeight < numFlightWeight) ? "Correct weight" : "Not adequate weight"}</p>
            <p>{(numHeight < numFlightHeight) ? "Correct height" : "Not adequate height"}</p>
            <button onClick={saveData}>Save Data</button>
        </div>
    );
}

export default Home;
