import { Request, Response } from "express";
import Book from '../models/books'
import processFileMiddleware from "./process.middleware";
import mongoose from 'mongoose';

type BookItem = {
  title: string
  author: string
  published_date: string
  isbn: number
}

// Create Book Middleware
export const createBook = async (request: Request<{}, {}, BookItem>, response: Response) => {
  // Type guard to check if request body has all properties
  const { title, author, published_date, isbn } = request.body;

  if (title && author && published_date && isbn) {
    try {
      // Create a new book and save
      const book = await Book.create({ title, author, published_date, isbn });

      if (book) {
        return response.status(201).json({
          message: "Book was created successfully",
          data: book,
        });
      } else {
        return response.status(500).json({ error: "Failed to create book" });
      }
    } catch (error) {
      return response.status(400).json({ error: "Invalid book data provided" });
    }
  } else {
    return response.status(400).json({ error: "Missing required book data in request body" });
  }
};

// Update Book Cover Image Middleware
export const updateBookCoverImage = async (request: Request<{ id: string }>, response: Response) => {
  if (request.params && 'id' in request.params) {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: 'Invalid book ID' });
    }

    try {
      await processFileMiddleware(request, response);

      const files = request.files as { [fieldname: string]: Express.Multer.File[] };
      const coverImageFile = files['cover_image'] ? files['cover_image'][0] : null;

      if (!coverImageFile) {
        return response.status(400).json({ message: 'No file uploaded' });
      }

      const fileName = coverImageFile.originalname; // Get the original filename

      // ... logic to update the book's cover image path with fileName

      const book = await Book.findByIdAndUpdate(id, { cover_image: fileName }, { new: true });

      if (book) {
        response.status(200).json({
          message: 'Book cover image updated',
          data: book,
        });
      } else {
        response.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  } else {
    response.status(400).json({ message: 'Invalid request' });
  }
};

// Get All Books Middleware
export const getBooks = async (request: Request, response: Response) => {
  try {
    const books = await Book.find({});

    if (books.length > 0) {
      return response.status(200).json({
        message: "success",
        data: books,
      });
    } else {
      return response.status(404).json({ error: "No books found" });
    }
  } catch (error) {
    return response.status(500).json({ error: "Error retrieving books" });
  }
};

// Get a Book by Id Middleware
export const getBookById = async (request: Request<{ id: string }>, response: Response) => {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({ error: "Missing book ID in request parameters" });
  }

  try {
    const book = await Book.findById(id);

    if (book) {
      return response.status(200).json({
        message: "success",
        data: book,
      });
    } else {
      return response.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    return response.status(400).json({ error: "Error retrieving book" });
  }
};

// Update a Book by Id Middleware
export const updateBookById = async (request: Request<{ id: string }, {}, BookItem>, response: Response) => {
  if (request.params && "id" in request.params && request.body && 'title' in request.body && 'author' in request.body && 'published_date' in request.body && 'isbn' in request.body) {
    const { id } = request.params;
    const { title, author, published_date, isbn } = request.body;

    try {
      const book = await Book.findByIdAndUpdate(
        id,
        { title, author, published_date, isbn },
        { new: true }
      );

      if (book) {
        response.status(200).json({
          message: "Book updated successfully",
          data: book,
        });
        return;
      } else {
        response.status(404).json({ error: "Book not found" });
        return;
      }
    } catch (error) {
      response.status(400).json({ error: "Error updating book" });
      return;
    }
  } else {
    response.status(400).json({ error: "Missing required book data or ID in request" });
    return;
  }
};

// Delete a Book Middleware
export const deleteBookById = async (request: Request<{ id: string }>, response: Response) => {
  const { id } = request.params;
  
  if (!id) {
    return response.status(400).json({ error: "Missing book ID in request parameters" });
  }

  try {
    const book = await Book.findByIdAndDelete(id);

    if (book) {
      return response.status(200).json({
        message: "Book deleted successfully",
        data: book,
      });
    } else {
      return response.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    return response.status(500).json({ error: "Error deleting book" });
  }
}

