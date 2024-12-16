import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
        },
        publishYear: {
            type: Number,
            required: [true, 'Publish Year is required'],
            min: [0, 'Publish Year cannot be negative'], // Example constraint
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        filePath: {
            type: String,
            required: [true, 'File path is required'],
            // validate: {
            //   validator: function (value) {
            //     // Ensure filePath starts with "uploads/" and ends with ".pdf"
            //     return /^uploads\/.+\.pdf$/.test(value);
            //   },
            //   message: (props) =>
            //     `${props.value} is not a valid file path. File must be in uploads/ and have a .pdf extension.`,
            // },
        },
        lastReadPage: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

export const Book = mongoose.model('Book', bookSchema);
