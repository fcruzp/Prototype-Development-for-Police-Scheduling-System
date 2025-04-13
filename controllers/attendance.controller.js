const Attendance = require('../models/attendance.model');
const ShiftAssignment = require('../models/shiftAssignment.model');
const User = require('../models/user.model');

// Record attendance check-in
const checkIn = async (req, res) => {
  try {
    const { shiftAssignmentId, coordinates, notes } = req.body;
    
    // Validate coordinates
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Invalid coordinates format' });
    }
    
    // Check if shift assignment exists
    const shiftAssignment = await ShiftAssignment.findById(shiftAssignmentId);
    if (!shiftAssignment) {
      return res.status(404).json({ message: 'Shift assignment not found' });
    }
    
    // Check if user is assigned to this shift
    if (shiftAssignment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to check in for this shift' });
    }
    
    // Check if attendance record already exists
    let attendance = await Attendance.findOne({ shiftAssignment: shiftAssignmentId });
    
    if (attendance) {
      // Update existing record if check-out hasn't been recorded
      if (!attendance.checkOutTime) {
        attendance.checkInTime = Date.now();
        attendance.checkInLocation.coordinates = coordinates;
        attendance.notes = notes;
        attendance.updatedAt = Date.now();
        
        await attendance.save();
      } else {
        return res.status(400).json({ message: 'Already checked in and out for this shift' });
      }
    } else {
      // Create new attendance record
      attendance = new Attendance({
        user: req.user._id,
        shiftAssignment: shiftAssignmentId,
        checkInTime: Date.now(),
        checkInLocation: {
          type: 'Point',
          coordinates: coordinates
        },
        notes
      });
      
      await attendance.save();
    }
    
    // Update shift assignment status
    shiftAssignment.status = 'completed';
    shiftAssignment.startTime = Date.now();
    await shiftAssignment.save();
    
    // Update user's last location
    await User.findByIdAndUpdate(req.user._id, {
      'lastLocation.coordinates': coordinates,
      'lastLocation.lastUpdated': Date.now()
    });
    
    res.status(200).json({
      message: 'Check-in recorded successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Record attendance check-out
const checkOut = async (req, res) => {
  try {
    const { shiftAssignmentId, coordinates, notes } = req.body;
    
    // Validate coordinates
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Invalid coordinates format' });
    }
    
    // Find attendance record
    const attendance = await Attendance.findOne({ 
      shiftAssignment: shiftAssignmentId,
      user: req.user._id
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for this shift' });
    }
    
    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out for this shift' });
    }
    
    // Update attendance record
    attendance.checkOutTime = Date.now();
    attendance.checkOutLocation.coordinates = coordinates;
    if (notes) attendance.notes = attendance.notes ? `${attendance.notes}\n${notes}` : notes;
    attendance.updatedAt = Date.now();
    
    await attendance.save();
    
    // Update shift assignment
    const shiftAssignment = await ShiftAssignment.findById(shiftAssignmentId);
    if (shiftAssignment) {
      shiftAssignment.endTime = Date.now();
      await shiftAssignment.save();
    }
    
    // Update user's last location
    await User.findByIdAndUpdate(req.user._id, {
      'lastLocation.coordinates': coordinates,
      'lastLocation.lastUpdated': Date.now()
    });
    
    res.status(200).json({
      message: 'Check-out recorded successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get attendance records by user
const getAttendanceByUser = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        checkInTime: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    const attendance = await Attendance.find({
      user: req.params.userId,
      ...dateFilter
    })
    .populate({
      path: 'shiftAssignment',
      populate: {
        path: 'shift',
        model: 'Shift'
      }
    })
    .sort({ checkInTime: -1 });
    
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get attendance records by department
const getAttendanceByDepartment = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        checkInTime: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    // Get users in department
    const users = await User.find({ department: req.params.departmentId });
    const userIds = users.map(user => user._id);
    
    const attendance = await Attendance.find({
      user: { $in: userIds },
      ...dateFilter
    })
    .populate('user', 'firstName lastName badgeNumber')
    .populate({
      path: 'shiftAssignment',
      populate: {
        path: 'shift',
        model: 'Shift'
      }
    })
    .sort({ checkInTime: -1 });
    
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendanceByUser,
  getAttendanceByDepartment
};
