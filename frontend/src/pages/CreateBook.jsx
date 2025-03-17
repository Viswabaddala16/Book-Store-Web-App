import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';


function CreateBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

 

  // Save Book
  const handleSaveBook = async () => {
    // const token = localStorage.getItem('token');
    const token = localStorage.getItem('token');
    if (!token) {
      enqueueSnackbar('Authentication token is missing. Please login again.', { variant: 'error' });
      navigate('/login');
      return;
    }
    if (!title || !author || !publishYear) {
      enqueueSnackbar('Please fill in all fields.', { variant: 'warning' });
      return;
    }

    if (isNaN(publishYear) || publishYear <= 0) {
      enqueueSnackbar('Publish Year must be a positive number.', { variant: 'warning' });
      return;
    }

    
    const data = { title, author, publishYear: parseInt(publishYear, 10) };

    setLoading(true);
    try {
      await axios.post('http://localhost:5555/books', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      enqueueSnackbar('Book Created Successfully!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Error creating book.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 flex flex-col bg-orange-300">
      <BackButton />
      <h1 className="text-2xl my-4 font-semibold text-primary text-center">Create Book</h1>
      {loading && <Spinner />}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl max-w-lg w-full p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500 text-secondary">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-500 px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border border-gray-500 px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Publish Year</label>
          <input
            type="text"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className="border border-gray-500 px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <button
          className="p-2 bg-sky-300 m-8 hover:bg-primary-dark rounded-lg transition disabled:opacity-50"
          onClick={handleSaveBook}
          disabled={loading}
        >
          {loading ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default CreateBook;
