import mongoose from 'mongoose';
import { config } from 'dotenv';

config(); // Load environment variables

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "books",
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
