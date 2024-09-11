const express = require('express');
const router = express.Router();
const Property = require('../models/Property'); // Adjust the path as needed

// Route to get all properties with optional filtering
router.get('/', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, minBedrooms } = req.query;

    const query = {};

    if (location) query.location = new RegExp(location, 'i'); // Case-insensitive regex for location
    if (minPrice) query.price = { $gte: parseFloat(minPrice) }; // Minimum price filter
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) }; // Maximum price filter
    if (minBedrooms) query.bedrooms = { $gte: parseInt(minBedrooms) }; // Minimum bedrooms filter
//filter
    const properties = await Property.find(query); 
    res.json(properties); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to get a single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      res.json(property); 
    } else {
      res.status(404).json({ message: 'Property not found' }); 
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message }); // Handle server errors
  }
});

module.exports = router;
