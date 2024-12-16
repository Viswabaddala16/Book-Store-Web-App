import express from 'express';
import mongoose from 'mongoose';
import {upload} from '../utility/multerConfig.js';
import { Book } from '../models/bookModel.js'; 
import { authenticate } from '../middleware/authMiddleware.js';
import {uploadToS3} from '../utility/s5Config.js';
import {getS3File} from '../utility/s5Config.js';
import dotenv from 'dotenv';



dotenv.config();
const router = express.Router();

// Route to handle PDF upload
router.post('/upload', authenticate, upload.single('pdf'), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
  
    if (!req.file || !req.body.title) {
      return res.status(400).json({ message: 'File and title are required.' });
    }
  
    try {
      const { title } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }

      // S3 
      const bucketName = process.env.AWS_BUCKET_NAME;
      const key = `uploads/${Date.now()}-${req.file.originalname}`;
      const fileUrl = await uploadToS3(req.file.buffer, bucketName, key,req.file.mimetype);
  
      const newBook = new Book({
        title,
        author : "unknown",
        publishYear: new Date().getFullYear(),
        filePath: key,
        fileUrl,
        userId,
      });
    //   filePath: req.file.path.replace(/\\/g, '/'),
  
      await newBook.save();
      res.status(201).json({ message: 'File uploaded successfully.', data: newBook });
    } catch (error) {
      console.error('Error during file upload:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
  

// Route to fetch all uploaded PDF
router.get('/uploads', authenticate, async (req, res) => {
    try {
        
        const userId = req.user?.id;
        const books = await Book.find({ userId });
        // Generate signed Urls 
        const bucketName = process.env.AWS_BUCKET_NAME;

        const booksWithUrls = await Promise.all(
            books.map(async (book) => {
                const signedUrl = await getS3File(bucketName, book.filePath);
                return { 
                    title: book.title,
                    url: signedUrl,
                    _id:book._id
                };
            })
        );
        res.status(200).json({
        count: booksWithUrls.length,
        data: booksWithUrls,
        });
    } catch (error) {
      console.error('Error fetching uploads:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
  
router.post('/last-read/:id',authenticate,async(req,res) => {
    const {id} = req.params;
    const {lastReadPage} = req.body;

    // Validate if `id` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid book ID' });
    }
    const book = await  Book.findById(id);
    
    if(!book){
        return res.status(404).json({message : "Book is not found"});
    }

    book.lastReadPage = lastReadPage || book.lastReadPage;
    await book.save();

    res.status(200).json({lastReadPage : book.lastReadPage })
});
router.get('/last-read/:id', authenticate, async (req, res) => {
    try {
      const { id } = req.params;

      // Validate if `id` is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }
      const book = await Book.findById(id);
      
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({ lastReadPage: book.lastReadPage || 0 });
    } catch (error) {
      console.error('Error fetching last read page:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});
  

router.post('/', authenticate, async (request,response) => {
    const { title, author, publishYear,filePath} = request.body;
    const userId = request.user?.id;
    if (!userId) {
        return response.status(400).json({ message: 'User ID is required' });
    }
    try{
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear ||
            !request.body.filePath
        ){
            return response.status(400).send({
                message : 'Send all required fields : title,author,publishYear'
            });
        }
        const newBook = {
            title,
            author,
            publishYear,
            userId,
            filePath,
        };
        const book = await Book.create(newBook);
        return response.status(201).send(book);           
    } catch(error) {
        console.error("Error creating book",error.message);
        response.status(500).send({message :"Internal Server Error", error:error.message});
    }
});
    // Route for Get all routes from database
router.get('/',authenticate,async (request,response) => {
    const userId = request.user?.id;
    try {
        const books = await Book.find({userId}).select('title filePath');
        return response.status(200).json({
            count : books.length,
            data : books,
        });

    } catch(error) {
        console.error('Error Fetching Books',error.message);
        response.status(500).send({message : 'Internal Server Error',error:error.message});
    }
});
    // Routeer to get one book from book store database by id

router.get('/:id', authenticate,async (request,response) => {
    try{
        const {id} = request.params;
        const book = await Book.findById(id);
        return response.status(200).json(book);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message : error.message});
    }
})

    // Router for update the book store by using id
    // PUT: Update a book by ID
router.put('/:id', authenticate, async (request, response) => {
    try {
        const { id } = request.params;
        const { title, author, publishYear } = request.body;

        if (!title || !author || !publishYear) {
            return response.status(400).json({ message: 'All fields are required' });
        }

        const book = await Book.findById(id);

        if (!book) {
            return response.status(404).json({ message: 'Book not found' });
        }

        if (String(request.user.id) !== String(book.userId)) {
            return response.status(403).json({ message: 'You are not authorized to update this book' });
        }

        book.title = title;
        book.author = author;
        book.publishYear = publishYear;
        await book.save();

        return response.status(200).json({ message: 'Book updated successfully' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: error.message });
    }
});

    // Router for delete the book from data base by id
    // DELETE: Delete a book by ID
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
    const book = await Book.findById(id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized access, user not authenticated' });
    }
    if (String(req.user.id) !== String(book.userId)) {
        console.log('user id ',req.user.id);
        console.log('book id ',book.userId);
        return res.status(403).json({ message: 'You are not authorized to delete this book' });
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
    

    
export default router;  