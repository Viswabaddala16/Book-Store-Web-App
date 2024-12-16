import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5555/signup', { email, password });
      enqueueSnackbar("Signup Successfully", { variant: "success" });
      navigate('/login'); // Redirect to login after successful signup
    } catch (error) {
      enqueueSnackbar("Error", { variant: "error" });
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="p-4 h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/Image/loginImage.jpg')" }}
    >
      <div className='flex justify-end absoulte top-4 right-2 gap-2 '>
        <div className='rounded bg-sky-300 hover:bg-blue-800 px-4 py-1 text-sm md:text-base'>
          <Link to='/'>Home</Link>
        </div>
        <div className='rounded bg-sky-300 hover:bg-blue-800 px-4 py-1 text-sm md:text-base'>
          <Link to='/login'>Login</Link>
        </div>
      </div>
      <h2 className="text-2xl mb-4 text-center">Signup</h2>
      <form onSubmit={handleSignup} className='text-center'>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-2 py-1 w-2/3 outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded px-2 py-1 w-2/3 outline-none"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
