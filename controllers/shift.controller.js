const Shift = require('../models/shift.model');
const ShiftAssignment = require('../models/shiftAssignment.model');
const User = require('../models/user.model');

// Get all shifts
const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().populate('department').populate('createdBy', 'firstName lastName');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get shift by ID
const getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id)
      .populate('department')
      .populate('createdBy', 'firstName lastName');
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new shift
const createShift = async (req, res) => {
  try {
    const { 
      name, 
      startTime, 
      endTime, 
      department, 
      minStaffCount, 
      recommendedStaffCount,
      isRecurring,
      recurringDays,
      notes
    } = req.body;

    const shift = new Shift({
      name,
      startTime,
      endTime,
      department,
      minStaffCount,
      recommendedStaffCount,
      isRecurring,
      recurringDays,
      notes,
      createdBy: req.user._id
    });

    await shift.save();

    res.status(201).json({
      message: 'Shift created successfully',
      shift
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update shift
const updateShift = async (req, res) => {
  try {
    const { 
      name, 
      startTime, 
      endTime, 
      department, 
      minStaffCount, 
      recommendedStaffCount,
      isRecurring,
      recurringDays,
      notes,
      isActive
    } = req.body;

    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      {
        name,
        startTime,
        endTime,
        department,
        minStaffCount,
        recommendedStaffCount,
        isRecurring,
        recurringDays,
        notes,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    res.status(200).json({
      message: 'Shift updated successfully',
      shift
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete shift
const deleteShift = async (req, res) => {
  try {
    // Check if shift has assignments
    const assignments = await ShiftAssignment.find({ shift: req.params.id });
    if (assignments.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete shift with existing assignments. Deactivate it instead.' 
      });
    }

    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get shifts by department
const getShiftsByDepartment = async (req, res) => {
  try {
    const shifts = await Shift.find({ 
      department: req.params.departmentId,
      isActive: true
    }).populate('department');
    
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign shift to user
const assignShift = async (req, res) => {
  try {
    const { userId, shiftId, date, notes } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if shift exists
    const shift = await Shift.findById(shiftId);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // Check if assignment already exists
    const existingAssignment = await ShiftAssignment.findOne({
      user: userId,
      shift: shiftId,
      date: new Date(date)
    });

    if (existingAssignment) {
      return res.status(400).json({ message: 'Shift assignment already exists' });
    }

    // Create new assignment
    const assignment = new ShiftAssignment({
      user: userId,
      shift: shiftId,
      date: new Date(date),
      notes,
      createdBy: req.user._id
    });

    await assignment.save();

    res.status(201).json({
      message: 'Shift assigned successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get shift assignments by user
const getShiftAssignmentsByUser = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const assignments = await ShiftAssignment.find({
      user: req.params.userId,
      ...dateFilter
    })
    .populate('shift')
    .populate('user', 'firstName lastName badgeNumber')
    .sort({ date: 1 });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update shift assignment status
const updateShiftAssignmentStatus = async (req, res) => {
  try {
    const { status, startTime, endTime, notes } = req.body;

    const assignment = await ShiftAssignment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        startTime,
        endTime,
        notes,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    )
    .populate('shift')
    .populate('user', 'firstName lastName badgeNumber');

    if (!assignment) {
      return res.status(404).json({ message: 'Shift assignment not found' });
    }

    res.status(200).json({
      message: 'Shift assignment updated successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  getShiftsByDepartment,
  assignShift,
  getShiftAssignmentsByUser,
  updateShiftAssignmentStatus
};
