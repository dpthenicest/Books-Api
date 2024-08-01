import { Router, Request, Response } from 'express';
import { createBook, getBooks, getBookById, updateBookCoverImage, updateBookById, deleteBookById } from '../middlewares/books';

const router = Router();

// POST /books
router.post(`/`, createBook);

// PATCH /books/cover-image/:id
router.patch(`/cover-image/:id`, updateBookCoverImage);

// GET /books
router.get('/', getBooks);

// GET /books/:id
router.get('/:id', getBookById);

// PUT /books/:id
// description: Update a Book
router.put(`/:id`, updateBookById);

// DELETE /books/:id
router.delete(`/:id`, deleteBookById);

export default router;

