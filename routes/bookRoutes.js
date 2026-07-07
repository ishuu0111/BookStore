import express from 'express';
const router = express.Router();
import Book from '../models/Book.js';
import { isValidObjectId } from 'mongoose';
import verifyToken from '../middleware/verifyTokens.js';
const validateBookPayload = (body, { partial = false } = {}) => {
  const errors = [];
  if (!partial && !body.title?.trim()) {
    errors.push('title is required');
  }
  if (!partial && !body.author?.trim()) {
    errors.push('author is required');
  }
  if (!partial && (body.price === undefined || body.price === null || Number.isNaN(Number(body.price)))) {
    errors.push('price must be a valid number');
  }
  if (body.title !== undefined && !body.title.trim()) {
    errors.push('title cannot be empty');
  }
  if (body.author !== undefined && !body.author.trim()) {
    errors.push('author cannot be empty');
  }
  if (body.price !== undefined && body.price !== null && Number.isNaN(Number(body.price))) {
    errors.push('price must be a valid number');
  }
  if (body.publishYear !== undefined && body.publishYear !== '' && Number.isNaN(Number(body.publishYear))) {
    errors.push('publishYear must be a valid number');
  }
  return errors;
};
const ensureValidId = id => {
  return isValidObjectId(id);
};
const buildBookPayload = body => {
  const payload = {};
  if (body.title !== undefined) {
    payload.title = body.title.trim();
  }
  if (body.author !== undefined) {
    payload.author = body.author.trim();
  }
  if (body.genre !== undefined) {
    payload.genre = body.genre.trim();
  }
  if (body.price !== undefined) {
    payload.price = Number(body.price);
  }
  if (body.publishYear !== undefined) {
    payload.publishYear = body.publishYear === '' ? undefined : Number(body.publishYear);
  }
  return payload;
};
// GET all books
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.genre) {
      filter.genre = req.query.genre;
    }
    const books = await Book.find(filter);
    res.status(200).json({
      count: books.length,
      data: books
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
// GET one book
router.get('/:id', async (req, res) => {
  try {
    if (!ensureValidId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid book id'
      });
    }
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
// CREATE book
router.post('/', async (req, res) => {
  try {
    const errors = validateBookPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(', ')
      });
    }
    const book = await Book.create(buildBookPayload(req.body));
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});
// UPDATE book
router.put('/:id', async (req, res) => {
  try {
    if (!ensureValidId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid book id'
      });
    }
    const errors = validateBookPayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(', ')
      });
    }
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      buildBookPayload(req.body),
      {
        new: true,
        runValidators: true
      }
    );
    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});
// DELETE book (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!ensureValidId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid book id'
      });
    }
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }
    res.status(200).json({
      message: 'Book deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
export default router;