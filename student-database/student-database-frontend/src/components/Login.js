import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      if (response.status === 200) {
        sessionStorage.setItem('token', response.data.token);
        navigate('/landing');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="container-fluid" style={{ 
      background: 'linear-gradient(to right, #4a148c, #ff6f00)', // Example gradient colors
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 className="card-title text-center mb-4">Existing User Login</h2>
        <form>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={handleLogin}>Login</button>
        </form>
        <div className="mt-3 text-center">
          <p className="mb-0">New User? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
