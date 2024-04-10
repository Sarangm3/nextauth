import mongoose from 'mongoose';

let connected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  // If the database is already connected, don't connect again
  if (connected) {
    console.log('MongoDB is already connected...');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    connected = true;
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

export default connectDB;
