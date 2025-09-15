import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async (): Promise<void> => {
  try {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new Error("DATABASE_URL is not defined in .env");
    }

    await mongoose.connect(url);
    console.log("✅ MongoDB connection successful!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

testConnection();
