import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const ResetPassword = () => {

    const[password,setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');
    const { enqueueSnackbar } = useSnackbar();  

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post('https://book-store-web-backend.onrender.com/reset-password',{
                token,
                password,
            });
            
            enqueueSnackbar(response.data.message, { variant: "success" });
            setTimeout(() => {
                navigate('/login'); 
            },2000);
            
        }
        catch(error){
            enqueueSnackbar(response.data.message, { variant: "error" });
        }
    };
    return(
        <div className='h-screen bg-cover bg-center'
        style={{ backgroundImage: "url('../../public/Image/images.png')" }}
        >
            <h2 className='text-2xl mb-4 text-center'>Reset Passowrd</h2>
                    <form onSubmit={handleSubmit} className='text-center '>
                        <input 
                            type="password"
                            value = {password}
                            onChange =  {(e) => setPassword(e.target.value)}
                            placeholder='New Password'
                            required
                            className="w-2/3 rounded px-4 py-2 text-center mb-4 outline-none focus:ring-2 focus:ring-gray-300"
                        />
                        <br/>
                        <button type='submit' className='text-2xl bg-sky-300 hover:bg-sky-800 rounded-lg px-4 py-2'>Reset Password</button>
                    </form>
        </div>
    )
}
export default ResetPassword;
