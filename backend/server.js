// backend/server.js - Updated for Docker networking
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes'); //Auth Route
const quizRoutes = require('./routes/quiz'); //Quiz Route
const lifeStyleQuizRoutes = require('./routes/lifeStyleQuiz'); // LifeStyleQuiz Route
const dashboardRoutes = require('./routes/dashboard');
const screeningRoutes = require('./routes/screeningRecommendations');
const chatRoutes = require('./routes/chat');

// Connect to database
connectDB();

const app = express();

// Trust proxy for IP address tracking (needed for quiz analytics)
app.set('trust proxy', true);

// Middleware - Updated CORS for Docker networking
app.use(cors({
  credentials: true,
  // Allow requests from Docker containers and localhost
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost and Docker container requests
    const allowedOrigins = [
      'http://localhost:4173',
      'http://localhost:3000',
      'http://frontend:4173',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/lifestyle-quiz', lifeStyleQuizRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/screening', screeningRoutes);
app.use('/api/chat', chatRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'SCS Backend API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});