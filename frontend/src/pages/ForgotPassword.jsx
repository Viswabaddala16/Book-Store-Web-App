import React,{useState} from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const[email,setEmail] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('https://book-store-backend-lsnz.onrender.com/forgot-password',{email});
            alert(response.data.message);
        }
        catch(error){
            alert(error.response?.data?.message || 'Something went wrong');
        } 
    };
    return(
        <div className='h-screen bg-center bg-cover'
        style={{ backgroundImage: "url('../../public/Image/images.png')" }}
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
