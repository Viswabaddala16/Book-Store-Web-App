import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import { MdOutlineAddBox } from 'react-icons/md';
import BookTable from '../components/Home/BookTable';
import BookCard from '../components/Home/BookCard';
import { useSnackbar } from 'notistack';  

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://book-store-web-backend.onrender.com/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(response.data.data);
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Error fetching books',
          { variant: 'error' }
        );
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [isLoggedIn, enqueueSnackbar, navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    enqueueSnackbar("Logout Successfully", { variant: "success" });
    navigate('/');
  };

  return (
    <div
      className="p-4 min-h-screen bg-cover bg-center md:p-8"
      style={{ backgroundImage: "url('/Image/images.png')" }}
    >
      <div className='flex flex-col md:flex-row justify-between items-center'>
        <h1 className='text-3xl md:text-5xl my-4 md:my-8 mx-5 text-center md:text-left'>
          {isLoggedIn ? 'Book List' : 'Welcome to the Book Store'}
        </h1>
        <div className='flex gap-2 absolute top-4 right-4 md:top-6 md:right-8'>
          {!isLoggedIn ? (
            <>
              <Link to='/login'>
                <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg text-sm md:text-base'>Login</button>
              </Link>
              <Link to='/signup'>
                <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg text-sm md:text-base'>Signup</button>
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} 
            className='bg-red-500 text-white hover:bg-red-700
             px-4 py-1 sm:py-1 sm:px-2 md:px-3 md:py-2 rounded-lg
            transition-all duration-300 absolute top-2 right-2 sm:top-3 sm:right-0 md:top-4 md:right-'
            >
              Logout</button>
          )}
        </div>
      </div>

      {isLoggedIn ? (
        loading ? (
          <Spinner />
        ) : (
          <>
            <div className='flex justify-center items-center gap-4 my-6 '>
              <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg text-sm md:text-base' onClick={() => setShowType("table")}>
                Table              </button>
              <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg text-sm md:text-base' onClick={() => setShowType("card")}>
                Card
              </button>
              <Link to='/books/create'>
                <MdOutlineAddBox className='text-sky-800 text-4xl md:text-5xl' />
              </Link>
              <Link to='/books/upload'>
                <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg text-sm md:text-base' >Upload File</button>
              </Link>
            </div>
            <div className='mt-4'>{showType === 'table' ? <BookTable books={books} /> : <BookCard books={books} />}</div>
          </>
        )
      ) : (
        <h2 className='md:text-2xl text-xl text-gray-500 mx-5 my-6'>
          Please log in to view the book list.
        </h2>
      )}
    </div>
  );
}

export default Home;





    // import React,{useState,useEffect} from 'react';
    // import Spinner from '../components/Spinner';
    // import axios from 'axios';
    // import { Link } from 'react-router-dom';
    // import {MdOutlineAddBox} from 'react-icons/md';
    // import BookTable from '../components/Home/BookTable';
    // import BookCard from '../components/Home/BookCard';


    // function Home() {
    // const[books,setBooks] = useState([]);
    // const[loading,setLoading] = useState(false);
    // const[showType,setShowType] = useState('');

    // useEffect(() => {
    // setLoading(true);
    // axios
    //     .get('http://localhost:5555/books')
    //     .then((response) => {
    //         console.log(response.data.data);
            
    //         setBooks(response.data.data);
    //         setLoading(false);
    //     })
    //     .catch((error) => {
    //         console.log("error is coming is ",error);
    //         setLoading(false);
    //     })
    // },[]);
    // return (
    // <div className="p-4">
    // <div className='flex items-center justify-center gap-x-4'>
    //     <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg' onClick={() => setShowType("table")}>
    //         Table
    //     </button>
    //     <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg' onClick={() => setShowType("card")}>
    //         Card
    //     </button>
    // </div>
    // <div className='flex justify-between items-center'>
    //     <h1 className='text-3xl my-8'>BookList</h1>
    //     <Link to='/books/create'>
    //         <MdOutlineAddBox className='text-sky-800 text-4xl'/>

    //     </Link>
    // </div>
    // {loading ? (
    //     <Spinner/>
    // ) : showType === 'table' ? (
    // <BookTable books={books}/>

    // )
    // :
    // ( 
    //     <BookCard books={books}/>
    // )}

    // </div>
    // )
    // }

    // export default Home;
