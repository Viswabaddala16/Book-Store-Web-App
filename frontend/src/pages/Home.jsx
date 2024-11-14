    import React, { useState, useEffect } from 'react';
    import Spinner from '../components/Spinner';
    import axios from 'axios';
    import { Link, useNavigate } from 'react-router-dom'; // Change here
    import { MdOutlineAddBox } from 'react-icons/md';
    import BookTable from '../components/Home/BookTable';
    import BookCard from '../components/Home/BookCard';
  import { useSnackbar } from 'notistack';


    function Home({isLoggedIn,setIsLoggedIn}) {
      const [books, setBooks] = useState([]);
      const [loading, setLoading] = useState(false);
      const [showType, setShowType] = useState('');
      const {enqueueSnackbar} = useSnackbar();
      const navigate = useNavigate(); // Change here

      useEffect(() => {
        if (isLoggedIn) {
          setLoading(true);
          axios
            .get('http://localhost:5555/books')
            .then((response) => {
              console.log(response.data.data);
              setBooks(response.data.data);
              setLoading(false);
            })
            .catch((error) => {
              console.log("Error fetching books:", error);
              setLoading(false);
            });
        }
      }, [isLoggedIn]);

      // const handleLogin = () => {
        // Logic for logging in, set the login state
        // setIsLoggedIn(true);
        // navigate('/'); // Redirect to home after login
      // };

      const handleLogout = () => {
        // Logic for logging out, reset the login state
        setIsLoggedIn(false);
        enqueueSnackbar("Logout Successfully ",{variant : "success"});
      };

      return (
        <div className="p-4 h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('../../public/Image/images.png')" }}
        >
          <div className='flex justify-between items-center'>
            <h1 className='text-5xl my-8 mx-5'>{isLoggedIn ? 'Book List' : 'Welcome to the Book Store'}</h1>
            <div className='flex items-center gap-x-4'>
              {!isLoggedIn ? (
                <>
                  <Link to='/login'>
                    <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg'>Login</button>
                  </Link>
                  <Link to='/signup'>
                    <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg'>Signup</button>
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className='bg-red-500 hover:bg-red-700 px-4 py-1 rounded-lg'>Logout</button>
              )}
              
            </div>
          </div>
          
          {isLoggedIn && (
            <div className='flex items-center justify-center gap-x-4 relative top-0'>
              <div className=''>
                <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg ' onClick={() => setShowType("table")}>
                  Table
                </button>  
              </div>
              <div>
                <button className='bg-sky-300 hover:bg-sky-800 px-4 py-1 rounded-lg' onClick={() => setShowType("card")}>
                  Card
                </button>
              </div>
              <div>
                <Link to='/books/create'>
                  <MdOutlineAddBox className='text-sky-800 text-4xl' />
                </Link>
              </div>
            </div>
          )}
          
          {loading ? (
            <Spinner />
          ) : isLoggedIn ? (
            showType === 'table' ? (
              <BookTable books={books} />
            ) : (
              <BookCard books={books} />
            )
          ) : (
            <h2 className='text-2xl text-gray-500 mx-5 my-6'>Please log in to view the book list.</h2>
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