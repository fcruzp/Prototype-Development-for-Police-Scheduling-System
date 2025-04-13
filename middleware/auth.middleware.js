const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');

console.log('Middleware loaded:', typeof authenticate); // Should log: Middleware loaded: function

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user by id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Middleware to check if user has admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Requires admin role' });
  }
};

// Middleware to check if user has supervisor role
const isSupervisor = (req, res, next) => {
  if (req.user && (req.user.role === 'supervisor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Requires supervisor role' });
  }
};

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/protected-route', authenticate, (req, res) => {
    res.status(200).json({ message: 'You have access to this protected route.' });
});

module.exports = {
  verifyToken,
  isAdmin,
  isSupervisor,
  router
};
