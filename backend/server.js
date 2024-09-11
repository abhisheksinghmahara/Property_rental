const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS if needed

// Routes
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const propertyRoutes = require('./routes/propertiesRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // Add this line

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes); // Add this line

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
