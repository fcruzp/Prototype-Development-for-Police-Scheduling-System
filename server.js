require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const shiftRoutes = require('./routes/shift.routes');
const taskRoutes = require('./routes/task.routes');
const reportRoutes = require('./routes/report.routes');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jamaica_police_wfm';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.user.id);
  
  // Join user to their own room for private messages
  socket.join(`user:${socket.user.id}`);
  
  // Join department room for department-wide messages
  if (socket.user.department) {
    socket.join(`department:${socket.user.department}`);
  }
  
  // Handle location updates
  socket.on('location:update', (data) => {
    // Save location to database
    // Emit to supervisors
    io.to(`department:${socket.user.department}`).emit('officer:location', {
      userId: socket.user.id,
      location: data.location,
      timestamp: new Date()
    });
  });
  
  // Handle task status updates
  socket.on('task:update', (data) => {
    // Update task in database
    // Notify relevant users
    io.to(`user:${data.supervisorId}`).emit('task:updated', {
      taskId: data.taskId,
      status: data.status,
      updatedBy: socket.user.id,
      timestamp: new Date()
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.id);
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
