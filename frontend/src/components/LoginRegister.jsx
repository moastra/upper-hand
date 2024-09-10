import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginRegister.css';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('avatar1.png');
  const [webcam, setWebcam] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/register', {
        username,
        email,
        password,
        avatar,
        webcam,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      navigate('/dashboard');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className='login-register-container'>
      <div className='form-container'>
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
          {!isLogin && (
            <div>
              <label>Username: </label>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label>Email: </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label>Confirm Password: </label>
              <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <button type='submit'>{isLogin ? 'Login' : 'Register'}</button>
          <br></br>
        </form>
        <div className='toggle-form'>
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              className='toggle-button'
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
