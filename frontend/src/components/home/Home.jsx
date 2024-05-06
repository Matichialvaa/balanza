import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';

function Home() {
    const location = useLocation();
    const { weight, height, flightID, flightWeight, flightHeight } = location.state || {};

    //paso de string a int
    const numWeight = Number(weight);
    const numHeight = Number(height);
    const numFlightWeight = Number(flightWeight);
    const numFlightHeight = Number(flightHeight);


    // State to store data fetched from the backend
    const [data, setData] = useState([]);

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
            <p>Weight: {weight}</p>
            <p>Height: {height}</p>
            <p>{(numWeight < numFlightWeight && numHeight < numFlightHeight) ? "Correct" : "Not adequate weight and height"}</p>
            <button onClick={saveData}>Save Data</button>
            <h2>Data fetched:</h2>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{item.message} - {item.fecha}</li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
