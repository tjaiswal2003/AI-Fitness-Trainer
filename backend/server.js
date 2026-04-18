const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - Updated CORS with your actual live URLs
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'https://ai-fitness-eta.vercel.app', // Your actual live frontend
    'https://ai-fitness-eta.vercel.app', // Primary domain
    'https://ai-fitness-git-main-tusharsharmma.vercel.app', // Git branch deployment
    'https://ai-fitness-*.vercel.app' // All preview deployments
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection with improved error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-ai';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  console.log('💡 Please make sure MongoDB is running on your system');
  process.exit(1);
});

// MongoDB connection event handlers
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

db.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Auto-initialize food database
const initializeFoodDatabase = async () => {
  try {
    // Import the Food model
    const Food = require('./models/FoodDatabase');
    await Food.initializeFoodDatabase();
    console.log('✅ Food database initialized successfully');
  } catch (error) {
    console.log('⚠️ Food database initialization note:', error.message);
  }
};

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const workoutRoutes = require('./routes/workout');
const nutritionRoutes = require('./routes/nutrition');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Fitness AI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'FitAI Trainer Backend API',
    status: 'running',
    version: '1.0.0',
    documentation: 'Visit /api/health for API status',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      workout: '/api/workout',
      nutrition: '/api/nutrition',
      health: '/api/health'
    }
  });
});

// ML Service proxy endpoints
app.use('/api/ml', require('./routes/mlProxy'));

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Catch-all handler for non-API routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    note: 'This is a backend API server. Frontend is hosted separately.',
    backendAPI: `${req.protocol}://${req.get('host')}/api/health`,
    availableEndpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/user/profile',
      '/api/workout',
      '/api/nutrition',
      '/api/health'
    ]
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${MONGODB_URI}`);
  console.log(`⚡ Backend API: http://localhost:${PORT}`);
  console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Frontend URL: https://ai-fitness-eta.vercel.app`);
});

// Initialize food database after server starts
server.on('listening', async () => {
  console.log('🔄 Initializing food database...');
  await initializeFoodDatabase();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ HTTP server closed');
  });
  
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ HTTP server closed');
  });
  
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;