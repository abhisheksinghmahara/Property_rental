const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String,
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  bedrooms: { 
    type: Number, 
    required: true,
    min: 0 
  },
  amenities: [{ 
    type: String 
  }],
  imageUrl: { 
    type: String,
    required: true 
  },
  available: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true }); // Automatically manages createdAt and updatedAt fields

module.exports = mongoose.model('Property', PropertySchema);
