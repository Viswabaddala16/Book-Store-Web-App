import mongoose from 'mongoose';
import { Book } from './models/bookModel.js'; 
import {mongoDBURL} from './config.js';
// Adjust the path to your model

const deleteAllBooks = async () => {
    try {
        mongoose.connect(mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
        console.log('Connected to MongoDB.');

        // Delete all books
        const result = await Book.deleteMany({});
        console.log(`${result.deletedCount} books deleted successfully.`);
    } catch (error) {
        console.error('Error deleting all books:', error.message);
    } finally {
        // Disconnect MongoDB
        mongoose.disconnect();
    }
};

deleteAllBooks();
