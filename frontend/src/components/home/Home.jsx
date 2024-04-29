import React from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';

function Home() {
    const location = useLocation();
    const { weight, height, flightID, flightWeight, flightHeight } = location.state;

    //paso de string a int
    const numWeight = Number(weight);
    const numHeight = Number(height);
    const numFlightWeight = Number(flightWeight);
    const numFlightHeight = Number(flightHeight);


    return (
        <div className="home">
            <h1>Home Page</h1>
            <p>Weight: {weight}</p>
            <p>Height: {height}</p>
            <p>{(numWeight < numFlightWeight && numHeight < numFlightHeight) ? "Correct" : "Not adequate weight and height"}</p>
        </div>
    );
}

export default Home;