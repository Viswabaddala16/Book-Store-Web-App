    import express from 'express';
    import { Book } from '../models/bookModel.js'; 
    import { authenticate } from '../middleware/authMiddleware.js';
    const router = express.Router();

    router.post('/', authenticate, async (request,response) => {
        const { title, author, publishYear} = request.body;
        const userId = request.user?.id;
        if (!userId) {
            return response.status(400).json({ message: 'User ID is required' });
        }
        try{
            if(
                !request.body.title ||
                !request.body.author ||
                !request.body.publishYear
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
            const books = await Book.find({userId});
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