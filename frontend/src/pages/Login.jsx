import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import jwtDecode from 'jwt-decode'; // Import jwtDecode here

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5555/login', { email, password });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        console.log('Received Token:', token);

        const decodedToken = jwtDecode(token); // Decode token here
        console.log('Decoded Token on Login:', decodedToken);
        enqueueSnackbar('Logged in successfully!', { variant: 'success' });

        navigate('/');
      } else {
        enqueueSnackbar('Login failed. No token received.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Login failed. Please check your credentials.', { variant: 'error' });
      console.error('Login failed', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div
      className="p-4 bg-center bg-cover h-screen"
      style={{ backgroundImage: "url('/Image/loginImage.jpg')" }}
    >
      {/* Top Navigation Buttons */}
      <div className="flex gap-2 absolute top-1 right-2 flex-wrap justify-end ml-2">
        <Link
          to="/"
          className="rounded bg-sky-300 hover:bg-blue-800 px-3 py-1 text-white text-sm md:text-base"
        >
          Home
        </Link>
        <Link
          to="/signup"
          className="rounded bg-sky-300 hover:bg-blue-800 px-3 py-1 text-white text-sm md:text-base"
        >
          Signup
        </Link>
      </div>

      {/* Login Form */}
      <h2 className="text-2xl mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="text-center">
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-2 py-1 w-2/3 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded px-2 py-1 w-2/3 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg text-white">
          Login
        </button>
        <Link to="/forgot-password" className="text-blue-800 hover:underline ml-4">
          Forgot Password?
        </Link>
      </form>
    </div>
  );
}

export default Login;
