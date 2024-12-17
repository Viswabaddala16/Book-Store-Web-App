import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function EditBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchBookDetails = async () => {
      const token = localStorage.getItem('token'); // Ensure the token is retrieved
      if (!token) {
        enqueueSnackbar('Please log in to edit the book.', { variant: 'error' });
        navigate('/login');
        return;
      }

      try {
        let jwtDecode, decodedToken;
      jwtDecode = (await import('jwt-decode')).default; // Dynamically import jwt-decode
      decodedToken = jwtDecode(token);

      const currentTime = Math.floor(Date.now() / 1000);
      if (!decodedToken.exp || decodedToken.exp < currentTime) {
        enqueueSnackbar('Session expired. Please login again.', { variant: 'error' });
        navigate('/login');
        return;
      }
        setLoading(true);
        const response = await axios.get(`https://book-store-web-backend.onrender.com/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { title, author, publishYear } = response.data;
        setTitle(title);
        setAuthor(author);
        setPublishYear(publishYear);
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Error fetching book details.',
          { variant: 'error' }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, enqueueSnackbar, navigate]);

  const handleEditBook = async () => {
    const token = localStorage.getItem('token'); // Ensure the token is retrieved
    if (!token) {
      enqueueSnackbar('Please log in to edit the book.', { variant: 'error' });
      navigate('/login');
      return;
    }

    const data = {
      title,
      author,
      publishYear,
    };

    try {
      setLoading(true);
      await axios.put(`http://localhost:5555/books/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      enqueueSnackbar('Book updated successfully!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Error updating the book.',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (  
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Edit Book</h1>
      {loading ? <Spinner /> : null}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Publish Year</label>
          <input
            type="text"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className="border border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <button
          className="p-2 bg-sky-300 m-8"
          onClick={handleEditBook}
          disabled={loading}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditBook;
