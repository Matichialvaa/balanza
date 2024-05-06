import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';

function Home() {
    const location = useLocation();
    const { weight, height } = location.state;

    // State to store data fetched from the backend
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from the backend when the component mounts
        fetchData();
    }, []);

    // Function to fetch data from backend
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:27017/data'); // Change the port if different
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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
            fetchData(); // Fetch all data again to update the list
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <div className="home">
            <h1>Home Page</h1>

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
