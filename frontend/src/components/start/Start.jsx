import React from 'react';
import './Start.css';
import { useNavigate } from 'react-router-dom';

function Start() {
    let navigate = useNavigate();

    return (
        <div className="start">
            <h1>Welcome to the App</h1>
            <button onClick={() => navigate('/home')}>Start</button>
        </div>
    );
}

export default Start;
