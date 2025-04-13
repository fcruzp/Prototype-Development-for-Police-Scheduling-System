const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  minStaffCount: {
    type: Number,
    default: 1
  },
  recommendedStaffCount: {
    type: Number
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDays: {
    type: [Number], // 0 = Sunday, 1 = Monday, etc.
    validate: {
      validator: function(days) {
        return days.every(day => day >= 0 && day <= 6);
      },
      message: 'Recurring days must be between 0 and 6'
    }
  },
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
