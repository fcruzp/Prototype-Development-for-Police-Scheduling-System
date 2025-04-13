const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shiftAssignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShiftAssignment'
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  checkInLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  checkOutLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'early_departure'],
    default: 'present'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for geospatial queries
attendanceSchema.index({ checkInLocation: '2dsphere' });
attendanceSchema.index({ checkOutLocation: '2dsphere' });
// Create index for user to quickly find attendance records for a specific user
attendanceSchema.index({ user: 1 });
// Create index for shiftAssignment to quickly find attendance record for a specific shift assignment
attendanceSchema.index({ shiftAssignment: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
