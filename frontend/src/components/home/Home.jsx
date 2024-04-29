import React from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';

function Home() {
    const location = useLocation();
    const { weight, height } = location.state;

    return (
        <div className="home">
            <h1>Home Page</h1>
            <p>Weight: {weight}</p>
            <p>Height: {height}</p>
        </div>
    );
}

export default Home;