import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { useParams } from 'react-router-dom';

function ShowBook() {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading as true
    const [error, setError] = useState(null); // State to handle error
    const { id } = useParams();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
                const response = await axios.get(`https://book-store-web-backend.onrender.com/books/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add Authorization header
                    },
                });
                if (response.status === 200) {
                    setBook(response.data);
                } else {
                    setError('Book not found.'); // Handle non-200 response
                }
            } catch (error) {
                console.error('Error fetching book:', error);
                setError('Error fetching book data.');
            } finally {
                setLoading(false); // Set loading to false in finally block
            }
        };
    
        fetchBook();
    }, [id]);
    

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error}</div>; // Display error message
    }

    return (
        <div className='p-4'>
            <BackButton />
            <h1 className='text-3xl my-4'>Show Book</h1>
            <div className="flex flex-col border-2 border-sky-800 w-fit p-4 rounded-lg">
                <div className='my-4'>
                    <span className='mr-4 text-xl text-gray-500'>Id</span>
                    <span>{book._id}</span>
                </div>
                <div className='my-4'>
                    <span className='mr-4 text-xl text-gray-500'>Title</span>
                    <span>{book.title}</span>
                </div>
                <div className='my-4'>
                    <span className='mr-4 text-xl text-gray-500'>Author</span>
                    <span>{book.author}</span>
                </div>
                <div className='my-4'>
                    <span className='mr-4 text-xl text-gray-500'>Publish Year</span>
                    <span>{book.publishYear}</span>
                </div>
                <div className='my-4'>
                    <span className='mr-4 text-xl text-gray-500'>Create Time</span>
                    <span>{new Date(book.createdAt).toLocaleString()}</span>
                </div>
                <div className='my-4'>
                    <span className='mr-4 text-xl text-gray-500'>Last Update Time</span>
                    <span>{new Date(book.updatedAt).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

export default ShowBook;
