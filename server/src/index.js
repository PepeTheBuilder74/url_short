import dotenv from 'dotenv';
import app from './server.js';
import mongoose from 'mongoose';
import './models/User.js';
import './models/Link.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/url_shortener';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    if (process.env.AUTO_CREATE_DB === 'true') {
      // Touch collections to ensure they are created (MongoDB creates on first insert)
      await Promise.all([
        mongoose.connection.db.listCollections({ name: 'users' }).hasNext().then(async exists => {
          if (!exists) await mongoose.connection.db.createCollection('users');
        }),
        mongoose.connection.db.listCollections({ name: 'links' }).hasNext().then(async exists => {
          if (!exists) await mongoose.connection.db.createCollection('links');
        })
      ]);
      console.log('Collections ensured');
    }
    app.listen(PORT, HOST, () => {
      const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Server running on port ${PORT}`);
  console.log(`SERVE_STATIC=${process.env.SERVE_STATIC}`);
      console.log(`Base URL: http://${displayHost}:${PORT}`);
      console.log(`Health:   http://${displayHost}:${PORT}/health`);
      console.log('Press Ctrl+C to stop');
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
