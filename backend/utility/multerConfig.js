import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 1733912207728-959033877.pdf
  },
});

export const upload = multer({
  storage:multer.memoryStorage(),  //Use memory storage
  limits: { fileSize: 50 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});





// import multer from 'multer';
// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs';
// import path from 'path';

// // Directory for storing uploaded files
// const uploadDir = path.join(process.cwd(), 'uploads/');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure Multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
//         cb(null, uniqueName);
//     },
// });

// // Multer middleware for file uploads
// export const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'application/pdf') {
//             cb(null, true);
//         } else {
//             cb(new Error('Only PDF files are allowed'));
//         }
//     },
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });
