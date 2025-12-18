import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });
      localStorage.setItem('token', res.data.access);
      alert("Zalogowano!");
      navigate('/admin-panel');
    } catch (err) {
      alert("Błędne dane logowania");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Logowanie Admina</h2>
        <input 
          type="text" placeholder="Login" 
          className="w-full border p-3 rounded-xl mb-4"
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          type="password" placeholder="Hasło" 
          className="w-full border p-3 rounded-xl mb-6"
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-black text-white py-3 rounded-xl font-bold">
          Zaloguj się
        </button>
      </form>
    </div>
  );
};

export default Login;