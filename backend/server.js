const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const providerRoutes = require('./routes/providers');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const chatbotRoutes = require('./routes/chatbot');
const noShowRoutes = require('./routes/noshow');
const favoriteRoutes = require('./routes/favorites');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'FixIt API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/noshow', noShowRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/ai', aiRoutes);

// Serve built frontend in production
const path = require('path');
const fs = require('fs');
const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
const frontendIndex = path.join(frontendBuild, 'index.html');
if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(frontendIndex);
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

connectDB().then((connected) => {
  app.listen(PORT, () => {
    console.log(`FixIt server running on port ${PORT}`);
    if (!connected) {
      console.log('NOTE: MongoDB not connected. API endpoints requiring DB will fail.');
      console.log('Install MongoDB locally or update MONGO_URI in .env');
    }
  });
}).catch((err) => {
  console.error('Failed to start server:', err.message);
  app.listen(PORT, () => console.log(`FixIt server running on port ${PORT} (no DB)`));
});
