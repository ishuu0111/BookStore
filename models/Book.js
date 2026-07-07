import { Schema, model } from 'mongoose';
const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    publishYear: {
        type: Number
    }
}, { timestamps: true });

const Book = model('Book', bookSchema);
export default Book