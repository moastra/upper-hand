import React from 'react';
import '../styles/Homepage.css';
import Login from './Login'
import { useNavigate } from 'react-router-dom';
import App from '../App';

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <header className="header">
        <h1>Welcome to</h1>
        <h1><span>Upper-Hand</span></h1>
        <p>The ultimate showdown in ROCK-PAPER-SCISSORS</p>
      </header>

      <main>
        <div className="game-info">
          <h2>Do you have the Upper Hand?</h2>
          <p>Challenge yourself, play against friends or strangers, and see if you can win!</p>
          <div className="choices">
            <img src="Rock-Paper-Scissors.png" alt="Rock-Paper-Scissors" />
          </div>
          <br></br>
          <h2>To play</h2>
          <div className="auth-buttons">
          <button 
              className="auth-btn login-btn" 
              onClick={() => navigate('/loginregister')}>
              Start
            </button>
            {/* <button className="auth-btn register-btn">Register</button> */}
          </div>
        </div>

      </main>

      <footer>
        <p>© 2024 Upper-Hand. Rock-Paper-Scissors reimagined for true competitors.</p>
      </footer>
    </div>
  );
};

export default Homepage;