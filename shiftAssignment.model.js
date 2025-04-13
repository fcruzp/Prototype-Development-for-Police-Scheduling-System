const mongoose = require('mongoose');

const shiftAssignmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'missed', 'reassigned'],
    default: 'scheduled'
  },
  startTime: Date,
  endTime: Date,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Create compound index for user and date to quickly find assignments for a user on a specific date
shiftAssignmentSchema.index({ user: 1, date: 1 });
// Create index for shift and date to quickly find all assignments for a shift on a specific date
shiftAssignmentSchema.index({ shift: 1, date: 1 });

const ShiftAssignment = mongoose.model('ShiftAssignment', shiftAssignmentSchema);

module.exports = ShiftAssignment;
