import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Start from './components/start/Start';
import Home from './components/home/Home';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    );
}

export default App;
