import express, { Request, Response, Application } from 'express';
import booksRouter from './routes/booksRouter';
import { connectDB } from './config/mongodb';
import { config } from 'dotenv';

config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Use Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Use Custom Middleware
app.use('/books', booksRouter);

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
