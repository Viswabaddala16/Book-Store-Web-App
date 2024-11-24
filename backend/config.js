import dotenv from 'dotenv';  // Import dotenv package

// Load environment variables from .env file
dotenv.config();  // Ensure .env is loaded before accessing environment variables

// Exporting values from the environment
export const PORT = process.env.PORT || 5000;
export const mongoDBURL = process.env.MONGODB_URL;  // MongoDB connection string
export const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-jwt-secret';  // JWT secret
