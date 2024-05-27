import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Start from './components/start/Start';
import Home from './components/home/Home';
import {lineWobble} from "ldrs";
import AddFlight from "./components/addFlight/AddFlight";

function App() {
    lineWobble.register();
    return (
        <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/home" element={<Home />} />
            <Route path="/addFlight" element={<AddFlight />} />
        </Routes>
    );
}

export default App;
