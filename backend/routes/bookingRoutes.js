const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, properties } = req.body;

    if (!userId || !Array.isArray(properties) || properties.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const updatedProperties = await Promise.all(
      properties.map(async (booking) => {
        const property = await Property.findById(booking.property);
        if (!property) {
          throw new Error(`Property not found: ${booking.property}`);
        }
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const duration = (end - start) / (1000 * 60 * 60 * 24 * 30);
        const cost = property.price * duration;

        return {
          property: property._id,
          startDate: booking.startDate,
          endDate: booking.endDate,
          cost,
        };
      })
    );

    const newBooking = new Booking({
      userId,
      properties: updatedProperties,
      status: 'Pending', // Set initial status to 'Pending'
      createdAt: Date.now()
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

//using cart
// Route to get all bookings for a user   
// router.get('/:userId', authMiddleware, async (req, res) => {
//   try {
//     if (req.user.id !== req.params.userId) {
//       return res.status(403).json({ message: 'Not authorized to view these bookings' });
//     }

//     const bookings = await Booking.find({ userId: req.params.userId })
//       .populate('properties.property');
//     res.json(bookings);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: err.message });
//   }
// });

// bookings by userId 
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    // console.log('Token User ID:', req.user.id);
    // console.log('Requested User ID:', req.params.userId);

    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to view these bookings' });
    }

    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('properties.property');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});



// Route to get a specific booking by ID
router.get('/booking/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('properties.property');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.id !== booking.userId.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});




// Route to checkout for cart (update bookings status to 'Confirmed')
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (status !== 'Confirmed') {
      return res.status(400).json({ message: 'Invalid status. Only "Confirmed" is allowed.' });
    }

    // Find all pending bookings for the user
    const bookings = await Booking.find({ userId: req.user.id, status: 'Pending' });

    if (!bookings.length) {
      return res.status(404).json({ message: 'No pending bookings found for the user.' });
    }

    // Calculate the total cost
    let totalCost = 0;
    bookings.forEach(booking => {
      booking.properties.forEach(property => {
        totalCost += property.cost; // Sum up the cost of all properties
      });
    });

    // Update the status of all pending bookings to 'Confirmed'
    await Booking.updateMany({ userId: req.user.id, status: 'Pending' }, { $set: { status: 'Confirmed' } });

    // Fetch the updated bookings
    const updatedBookings = await Booking.find({ userId: req.user.id, status: 'Confirmed' });

    res.status(200).json({
      message: 'Checkout successful!',
      totalCost,
      bookings: updatedBookings
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});


// Route to update a booking status (Confirmed/Cancelled)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate that the status is either "Confirmed" or "Cancelled"
    if (!['Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Allowed values are "Confirmed" or "Cancelled".' });
    }

    // Find the booking by ID
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is authorized to update this booking
    if (req.user.id !== booking.userId.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});



// Route to update a booking status using cart
// router.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const { status } = req.body;
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     if (req.user.id !== booking.userId.toString() && req.user.role !== 'Admin') {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     booking.status = status;
//     await booking.save();

//     res.json(booking);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
