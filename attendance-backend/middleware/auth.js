// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify the JWT token from the request header
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expects "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Add the decoded user payload to the request object
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check if the user has the 'teacher' role
const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ msg: 'Access forbidden: Not a teacher' });
  }
  next();
};

module.exports = { verifyToken, isTeacher };