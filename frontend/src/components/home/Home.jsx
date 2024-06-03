import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './Home.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import logo from '../assets/AA2000.webp';
import config from "../../config";
import mqtt from "mqtt";

function Home() {
    const location = useLocation();
    const { weight, height, passengerID } = location.state;
    const [flightID, setFlightID] = useState('');
    const [flightWeight, setFlightWeight] = useState('');
    const [flightHeight, setFlightHeight] = useState('');
    let navigate = useNavigate();
    const client = mqtt.connect('ws://' + '52.71.113.81:9000');
    console.log('Client: ' + client)
    // Paso de string an int
    const numWeight = Number(weight);
    const numHeight = Number(height);
    const numFlightWeight = Number(flightWeight);
    const numFlightHeight = Number(flightHeight);

    // Function to fetch flights data from the backend by the passenger ID
    const fetchData = async () => {
        try {
            const response = await fetch(config.app.url + `/data/${passengerID}`);
            const jsonData = await response.json();

            let { flight_id, max_weight, max_height } = jsonData;

            setFlightID(flight_id);
            setFlightWeight(max_weight);
            setFlightHeight(max_height);

            sendLedSignal().then();

            console.log("fetched data from db");
            console.log(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const num = numWeight <= numFlightWeight && numHeight <= numFlightHeight ? 'green' : 'red';

    // Function to send a signal to the LED
    const sendLedSignal = async () => {
        client.publish('led', num, {}, (error) => {
            if (error) {
                console.error('Publish error:', error);
            } else {
                console.log('Signal sent to LED:' + num);
            }
        });
    }

    // Function to send data to the backend
    const saveData = async () => {
        try {
            const response = await fetch(config.app.url + `/save-data`, {
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

    useEffect(() => {
        fetchData().then();
    }, []);

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
                    <TableContainer component={Paper} >
                        <Table sx={{minWidth: 100}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="bold-text"></TableCell>
                                    <TableCell className="bold-text" align={"center"}>Value</TableCell>
                                    <TableCell className="bold-text" align={"center"}>Max limit</TableCell>
                                    <TableCell className="bold-text">State</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" className="bold-text">
                                            {row.category}
                                        </TableCell>
                                        {row.category === "Height" ? (
                                            <>
                                                <TableCell align={"center"}>{row.value} cm</TableCell>
                                                <TableCell align={"center"}>{row.maxLimit} cm</TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell align={"center"}>{row.value} g</TableCell>
                                                <TableCell align={"center"}>{row.maxLimit} g</TableCell>
                                            </>
                                        )}
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
                <a className="bn31" href="/" onClick={saveData}>
                    <span className="bn31span">Save & Finish</span>
                </a>
            </div>
        </div>
    );
}

export default Home;
