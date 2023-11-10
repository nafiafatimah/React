import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: username,
        password: password,
      });
      console.log('Pendaftaran berhasil:', response.data);
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Gagal mendaftar:', error);
    }
  };
  return (
  <div class="container">
      <h2 class="mt-5">Form Pendaftaran</h2>
      <form>
          <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" class="form-control" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" class="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="button" class="btn btn-primary mt-2" onClick={handleRegister}>Daftar</button>
      </form>
  </div>
  );
}
export default Register;