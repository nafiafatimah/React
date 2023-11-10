import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      const token = response.data.token;
  
      if (token) {
        localStorage.setItem('token', token);
        navigate('/mhs');
        window.location.reload();
      } else {
        console.error('Gagal login: Token tidak diterima');
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.error('Gagal login: Kata sandi atau username salah');
      } else {
        console.error('Gagal login:', error);
      }
    }
  };
  
  return (
    <div class="container">
    <h1 class="mt-5">Login</h1>
    <form>
        <div class="form-group">
            <label for="username">Username:</label>
            <input class="form-control" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input class="form-control" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="button" class="btn btn-primary mt-2" onClick={handleLogin}>Login</button>
        <p class="mt-2">Belum punya akun? <a href="/register">Daftar</a></p>
    </form>
</div>

  );
}

export default Login;