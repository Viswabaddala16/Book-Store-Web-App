import React,{useState} from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const[email,setEmail] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('https://book-store-web-backend.onrender.com/forgot-password',{email});
            alert(response.data.message);
        }
        catch(error){
            alert(error.response?.data?.message || 'Something went wrong');
        } 
    };
return(
        <div className='h-screen bg-center bg-cover'
        style={{ backgroundImage: "url('/Image/images.png')" }}
        >   
            <h2 className='text-center text-2xl mb-6 '>Send Reset Link</h2>
            <form onSubmit={handleForgotPassword} className='text-center'>
                <input 
                    type='email'
                    value ={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder='Enter Your Email'
                    className='border rounded px-2 py-1 w-2/3 mb-4  outline-none focus:ring-2 focus:ring-gray-300'
                />
                <br/>
                <button type='submit' className='bg-sky-300 hover:bg-sky-800 py-2 px-4 rounded-lg'>Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate,useLocation } from 'react-router-dom';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isResetting, setIsResetting] = useState(false); // Track if user is in reset mode
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
// const token = new URLSearchParams(location.search).get('token');

//   // Handle Forgot Password Submission
//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');
//     try {
//       const response = await axios.post('https://book-store-backend-lsnz.onrender.com/forgot-password', {
//         email,
//       });
//       alert(response.data.message);
//        // Assume backend returns a token for resetting
//       setIsResetting(true); // Switch to reset mode
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || 'Something went wrong');
//     }
//   };

//   // Handle Password Reset Submission
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');
//     try {
//       const response = await axios.post('https://book-store-backend-lsnz.onrender.com/reset-password', {
//         token,
//         password,
//       });
//       setSuccessMessage(response.data.message);
//       setTimeout(() => {
//         navigate('/login'); // Redirect to login after success
//       }, 2000);
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || 'Failed to reset password');
//     }
//   };

//   return (
//     <div className="h-screen bg-center bg-cover" style={{ backgroundImage: "url('/Image/images.png')" }}>
//       {isResetting ? (
//         // Reset Password Form
//         <div className="text-center">
//           <h2 className="text-2xl mb-4">Reset Password</h2>
//           {successMessage ? (
//             <p className="text-green-500">{successMessage}</p>
//           ) : (
//             <form onSubmit={handleResetPassword}>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="New Password"
//                 required
//                 className="border rounded px-2 py-1 w-2/3 mb-4 outline-none focus:ring-2 focus:ring-gray-300"
//               />
//               <br />
//               <button type="submit" className="bg-sky-300 hover:bg-sky-800 py-2 px-4 rounded-lg">
//                 Update Password
//               </button>
//             </form>
//           )}
//           {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
//         </div>
//       ) : (
//         // Forgot Password Form
//         <div className="text-center">
//           <h2 className="text-2xl mb-4">Send Reset Link</h2>
//           <form onSubmit={handleForgotPassword}>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="Enter Your Email"
//               className="border rounded px-2 py-1 w-2/3 mb-4 outline-none focus:ring-2 focus:ring-gray-300"
//             />
//             <br />
//             <button type="submit" className="bg-sky-300 hover:bg-sky-800 py-2 px-4 rounded-lg">
//               Send Reset Link
//             </button>
//           </form>
//           {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ForgotPassword;
