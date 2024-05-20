import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './Home.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import {Button, Typography} from "@mui/material";
import logo from '../assets/AA2000.webp';

function Home() {
    const location = useLocation();
    const { weight, height, flightID, flightWeight, flightHeight, passengerID } = location.state;
    let navigate = useNavigate();

    // Paso de string an int
    const numWeight = Number(weight);
    const numHeight = Number(height);
    const numFlightWeight = Number(flightWeight);
    const numFlightHeight = Number(flightHeight);

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
            navigate('/')
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const rows = [
        { category: "Height", value: numHeight, maxLimit: numFlightHeight},
        { category: "Weight", value: numWeight, maxLimit: numFlightWeight },
    ];

    return (
        <div className="anim_gradient">
            <div className="start">
                <img src={logo}/>
                <div className={"ids"}>
                    <div className={"passenger-id"}>
                        <h3>Passenger ID</h3>
                        <h4>{passengerID}</h4>
                    </div>
                    <div className={"flight-id"}>
                        <h3>Flight ID</h3>
                        <h4>{flightID}</h4>
                    </div>
                </div>
                <div className="table-container">
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 100}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="bold-text"></TableCell>
                                    <TableCell className="bold-text">Value</TableCell>
                                    <TableCell className="bold-text">Max limit</TableCell>
                                    <TableCell className="bold-text">State</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" className="bold-text">
                                            {row.category}
                                        </TableCell>
                                        <TableCell align={"center"}>{row.value}</TableCell>
                                        <TableCell align={"center"}>{row.maxLimit}</TableCell>
                                        <TableCell>
                                            <div style={{
                                                backgroundColor: row.value <= row.maxLimit ? 'green' : 'red',
                                                width: '20px',
                                                height: '20px',
                                                marginLeft: '7px',
                                                borderRadius: '18%'
                                            }}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <Button
                    variant={"contained"}
                    type={"submit"}
                    onClick={saveData}>Save & Finish</Button>
            </div>
        </div>
    );
}

export default Home;
