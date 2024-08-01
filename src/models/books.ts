import mongoose, { Schema, Model } from 'mongoose';

// interface for the Book Document
interface Book {
  title: string;
  author: string;
  published_date: string;
  isbn: number;
  cover_image?: string;
  createdAt: Date;
}

// Schema for the Book Document
const bookSchema = new Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  published_date: {
    type: String,
    required: true,
  },
  isbn: {
    type: Number,
    required: true,
  },
  cover_image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Book model type for type safety
type BookModel = Model<Book>;

// Book model
const Book = mongoose.model<Book, BookModel>("Book", bookSchema);

export default Book;
