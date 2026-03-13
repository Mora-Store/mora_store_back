const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection error (attempt ${retries}/${maxRetries}):`, error.message);
      if (retries >= maxRetries) {
        console.error('Could not connect to MongoDB. Exiting...');
        process.exit(1);
      }
      // Wait 3 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

module.exports = connectDB;
