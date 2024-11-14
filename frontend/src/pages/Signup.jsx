import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function Signup({setIsLoggedIn}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5555/signup', { email, password });
      console.log(response.data);
      console.log(response);
      setIsLoggedIn(true);
      enqueueSnackbar("Signup Successfully",{variant: "success"});
      // Optionally redirect or set a login state here
      navigate('/login'); // Redirect to login after successful signup
    } catch (error) {
      console.error('Signup failed', error);
      enqueueSnackbar("Error",{variant: "error"});
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="p-4 h-screen bg-cover bg-center"
    style={{backgroundImage : "url('../../public/Image/loginImage.jpg')"}}
    >
      <div className='flex justify-end relative gap-4 mr-6'>
        <div className='mr-4  rounded bg-sky-300 hover:bg-blue-800 px-4 py-1'><Link to='/'>Home</Link></div>
        <div className='mr-10  rounded bg-sky-300 hover:bg-blue-800 px-4 py-1'><Link to='/login'>Login</Link></div>
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
            className="border rounded px-2 py-1 w-2/3 outline-none focus-2-ring "
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
        <button type="submit" className="bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg text-center">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
