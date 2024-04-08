import React from 'react';
import './App.css'; // Make sure you have an App.css file for styling

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <h1>hola pomo</h1>
        </header>
        <nav className="App-nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
        <main className="App-main">
          <p>Hello pomo</p>
        </main>
        <footer className="App-footer">
          © 2024 My React App
        </footer>
      </div>
  );
}

export default App;
