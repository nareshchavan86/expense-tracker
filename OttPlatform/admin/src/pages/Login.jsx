import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/services';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h2>
        <input
          type="text"
          placeholder="Email or Username"
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded border border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-gray-700 text-white rounded border border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
