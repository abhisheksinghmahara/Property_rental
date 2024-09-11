const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  properties: [
    {
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
    },
  ],
  totalCost: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate totalCost before saving
BookingSchema.pre('save', async function (next) {
  this.totalCost = this.properties.reduce((total, property) => total + property.cost, 0);
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
