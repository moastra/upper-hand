import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [avatar, setAvatar] = useState('avatar1.png');
  // const [webcam, setWebcam] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();

    try {
      const response = await axios.post('/api/register', { username, email, password/*, avatar, webcam*/ });

      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Registration failed. Please try again.'); 
    }
  };
  
  return (
    <div className='register-container'>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type='submit'>Register</button>
      </form>
    </div>
  );

}


export default Register;
