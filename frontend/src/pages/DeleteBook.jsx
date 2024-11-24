import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { useSnackbar } from 'notistack';

function DeleteBook() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteBook = async () => {
    const authToken = localStorage.getItem('token');

    if (!authToken) {
      enqueueSnackbar('No token found, please login again', { variant: 'error' });
      navigate('/login');
      return;
    }

    try {
      // Validate token expiration
      let jwtDecode, decodedToken;
      jwtDecode = (await import('jwt-decode')).default; // Dynamically import jwt-decode
      decodedToken = jwtDecode(authToken);

      const currentTime = Math.floor(Date.now() / 1000);
      if (!decodedToken.exp || decodedToken.exp < currentTime) {
        enqueueSnackbar('Session expired. Please login again.', { variant: 'error' });
        navigate('/login');
        return;
      }

      setLoading(true);

      // Proceed with delete
      const response = await axios.delete(`https://book-store-backend-lsnz.onrender.com/books/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      enqueueSnackbar(response.data.message || 'Book deleted successfully', { variant: 'success' });
      navigate('/'); // Navigate back to the book list
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting book';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Delete Book</h1>
      {loading ? <Spinner /> : ''}
      <div className="flex flex-col p-8 mx-auto rounded-xl w-[600px] border-2 bg-sky-400 flex justify-center items-center">
        <h3 className="text-3xl ">Are you sure you want to delete it?</h3>
        <button
          className="p-4 bg-red-600 text-white m-8 w-full"
          onClick={handleDeleteBook}
          disabled={loading}
        >
          Yes, Delete It
        </button>
      </div>
    </div>
  );
}

export default DeleteBook;
