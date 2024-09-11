const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    max:1
  }
});

// Define Cart Schema
const CartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [CartItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CartSchema.index({ userId: 1, 'items.propertyId': 1 }, { unique: true });

module.exports = mongoose.model('Cart', CartSchema);