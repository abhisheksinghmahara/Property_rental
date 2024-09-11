const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  
  // Check if token is provided
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id}; 
 
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
