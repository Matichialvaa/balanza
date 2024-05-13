import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

    const rows = [
        { category: "Height", value: numHeight },
        { category: "Weight", value: numWeight }
    ];

    return (
        <div className="container">
            <div className="anim_gradient">
                <div className="home">
                    <h1>Home Page</h1>
                    <p>PassengerID: {passengerID}</p>
                </div>
                <div className="table-container">
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 100}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Category</TableCell>
                                    <TableCell align="right">Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {row.category}
                                        </TableCell>
                                        <TableCell align="right">{row.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <p>{numWeight < numFlightWeight ? "Correct weight" : "Not adequate weight"}</p>
                <p>{numHeight < numFlightHeight ? "Correct height" : "Not adequate height"}</p>
                <div className="button-container">
                    <button onClick={saveData}>Save Data</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
