import axios from 'axios';
import React,{useState} from 'react'
import { useNavigate,useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { useSnackbar } from 'notistack';



function DeleteBook() {
  const {id} = useParams();
  const[loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const handleDeleteBook = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/books/${id}`)
      .then((response) => {
        setLoading(false);
        enqueueSnackbar("Book Created Succesfully ",{variant : "sucess"});
        navigate('/')

      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error",{variant : "error"});
        
      })
  }
  return (
    <div className='p-4'>
      <BackButton/>
      <h1 className='text-3xl my-4'>Delete Book</h1>
      {loading? <Spinner/> : ""}
      <div className='flex flex-col p-8 mx-auto rounded-xl w-[600] border-2 bg-sky-400'>
        <h3 className='text-3xl'>Are You Sure You want to Delete It </h3>
        <button className='p-4 bg-red-600 text-white  m-8 w-full ' onClick={handleDeleteBook}>
          Yes,Delete It 
        </button>
      </div>
    </div>
  )
}

export default DeleteBook;