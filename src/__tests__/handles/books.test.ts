import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../../models/books';
import processFileMiddleware from '../../middlewares/process.middleware';
import {
  createBook,
  updateBookCoverImage,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById
} from '../../middlewares/books';

jest.mock('../../models/books');
jest.mock('../../middlewares/process.middleware');

type RequestWithId = Request<{ id: string }, any, any, any>;
type RequestWithIdBody = Request<{ id: string }, {}, any, any>;

describe('Book Controller', () => {
  let req: Partial<Request>;
  let reqWithId: Partial<RequestWithId>;
  let reqWithIdBody: Partial<RequestWithIdBody>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    req = {};
    reqWithId = { params: { id: '507f1f77bcf86cd799439011' } };
    reqWithIdBody = { params: { id: '507f1f77bcf86cd799439011' }, body: {} };
    json = jest.fn();
    status = jest.fn(() => ({ json })) as any;
    res = { status, json };
  });

  describe('createBook', () => {
    it('should create a book and return 201 status', async () => {
      req.body = { title: 'Test Title', author: 'Test Author', published_date: '2024-01-01', isbn: 1234567890 };

      const mockCreate = Book.create as jest.Mock;
      mockCreate.mockResolvedValue(req.body);

      await createBook(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({
        message: 'Book was created successfully',
        data: req.body,
      });
    });

    it('should return 400 status for invalid book data', async () => {
      req.body = { title: 'Test Title' };

      await createBook(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: 'Missing required book data in request body' });
    });
  });

  describe('updateBookCoverImage', () => {
    it('should update book cover image and return 200 status', async () => {
      const mockFile = {
        fieldname: 'cover_image',
        originalname: 'cover.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1234,
        buffer: Buffer.from(''),
        stream: null,
      } as any;

      reqWithId.files = { cover_image: [mockFile] };

      const mockFindByIdAndUpdate = Book.findByIdAndUpdate as jest.Mock;
      mockFindByIdAndUpdate.mockResolvedValue({ cover_image: 'cover.jpg' });

      await updateBookCoverImage(reqWithId as RequestWithId, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        message: 'Book cover image updated',
        data: { cover_image: 'cover.jpg' },
      });
    });

    it('should return 400 status for invalid book ID', async () => {
      reqWithId.params = { id: 'invalid-id' };

      await updateBookCoverImage(reqWithId as RequestWithId, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Invalid book ID' });
    });

    it('should return 400 status if no file uploaded', async () => {
      reqWithId.files = {};

      await updateBookCoverImage(reqWithId as RequestWithId, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'No file uploaded' });
    });
  });

  describe('getBooks', () => {
    it('should return a list of books and 200 status', async () => {
      const mockBooks = [{ title: 'Test Book' }];
      const mockFind = Book.find as jest.Mock;
      mockFind.mockResolvedValue(mockBooks);

      await getBooks(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        message: 'success',
        data: mockBooks,
      });
    });

    it('should return 404 status if no books found', async () => {
      const mockFind = Book.find as jest.Mock;
      mockFind.mockResolvedValue([]);

      await getBooks(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: 'No books found' });
    });
  });

  describe('getBookById', () => {
    it('should return a book and 200 status', async () => {
      const mockBook = { title: 'Test Book' };
      const mockFindById = Book.findById as jest.Mock;
      mockFindById.mockResolvedValue(mockBook);

      await getBookById(reqWithId as RequestWithId, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        message: 'success',
        data: mockBook,
      });
    });

    it('should return 404 status if book not found', async () => {
      const mockFindById = Book.findById as jest.Mock;
      mockFindById.mockResolvedValue(null);

      await getBookById(reqWithId as RequestWithId, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: 'Book not found' });
    });

    it('should return 400 status for missing book ID', async () => {
      await getBookById(req as RequestWithId, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: 'Missing book ID in request parameters' });
    });
  });

  describe('updateBookById', () => {
    it('should update a book and return 200 status', async () => {
      reqWithIdBody.body = { title: 'Updated Title', author: 'Updated Author', published_date: '2024-01-01', isbn: 1234567890 };

      const mockFindByIdAndUpdate = Book.findByIdAndUpdate as jest.Mock;
      mockFindByIdAndUpdate.mockResolvedValue(reqWithIdBody.body);

      await updateBookById(reqWithIdBody as RequestWithIdBody, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        message: 'Book updated successfully',
        data: reqWithIdBody.body,
      });
    });

    it('should return 404 status if book not found', async () => {
      reqWithIdBody.body = { title: 'Updated Title', author: 'Updated Author', published_date: '2024-01-01', isbn: 1234567890 };

      const mockFindByIdAndUpdate = Book.findByIdAndUpdate as jest.Mock;
      mockFindByIdAndUpdate.mockResolvedValue(null);

      await updateBookById(reqWithIdBody as RequestWithIdBody, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: 'Book not found' });
    });

    it('should return 400 status for missing required data', async () => {
      reqWithIdBody.body = { title: 'Updated Title' };

      await updateBookById(reqWithIdBody as RequestWithIdBody, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: 'Missing required book data or ID in request' });
    });
  });

  describe('deleteBookById', () => {
    it('should delete a book and return 200 status', async () => {
      const mockFindByIdAndDelete = Book.findByIdAndDelete as jest.Mock;
      mockFindByIdAndDelete.mockResolvedValue({ title: 'Deleted Book' });

      await deleteBookById(reqWithId as RequestWithId, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        message: 'Book deleted successfully',
        data: { title: 'Deleted Book' },
      });
    });

    it('should return 404 status if book not found', async () => {
      const mockFindByIdAndDelete = Book.findByIdAndDelete as jest.Mock;
      mockFindByIdAndDelete.mockResolvedValue(null);

      await deleteBookById(reqWithId as RequestWithId, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: 'Book not found' });
    });

    it('should return 400 status for missing book ID', async () => {
      await deleteBookById(req as RequestWithId, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: 'Missing book ID in request parameters' });
    });
  });
});
