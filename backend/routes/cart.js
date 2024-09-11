const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('../models/Booking'); // Ensure this model exists

// Add item to cart
router.post('/add', authMiddleware, async (req, res) => {
  const { propertyId, quantity } = req.body;

  if (!propertyId || quantity === undefined) {
    return res.status(400).json({ message: 'Property ID and quantity are required.' });
  }

  if (quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1.' });
  }

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.propertyId.toString() === propertyId);
      if (itemIndex > -1) {
        // Update quantity if the item already exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item to the cart
        cart.items.push({ propertyId, quantity });
      }
      await cart.save();
    } else {
      // Create new cart if not found
      const newCart = new Cart({
        userId: req.user.id,
        items: [{ propertyId, quantity }]
      });
      cart = await newCart.save();
    }

    res.status(201).json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cart items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.propertyId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', authMiddleware, async (req, res) => {
  const { itemId } = req.params;
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
      if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1); 
        cart = await cart.save();
        return res.json({ message: 'Item removed from cart', cart });
      } else {
        return res.status(404).json({ message: 'Item not found in cart.' });
      }
    } else {
      return res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Checkout endpoint


// Protected route to test authentication
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated!' });
});

module.exports = router;
