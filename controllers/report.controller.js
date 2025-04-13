const ShiftAssignment = require('../models/shiftAssignment.model');
const Task = require('../models/task.model');
const Attendance = require('../models/attendance.model');
const User = require('../models/user.model');

// Generate performance report for a user
const getUserPerformanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.params.userId;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get shift assignments
    const shiftAssignments = await ShiftAssignment.find({
      user: userId,
      date: { $gte: start, $lte: end }
    }).populate('shift');
    
    // Get attendance records
    const attendanceRecords = await Attendance.find({
      user: userId,
      checkInTime: { $gte: start, $lte: end }
    });
    
    // Get tasks
    const tasks = await Task.find({
      assignedTo: userId,
      createdAt: { $gte: start, $lte: end }
    });
    
    // Calculate metrics
    const totalShiftsAssigned = shiftAssignments.length;
    const completedShifts = shiftAssignments.filter(s => s.status === 'completed').length;
    const missedShifts = shiftAssignments.filter(s => s.status === 'missed').length;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'assigned').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    
    // Calculate attendance metrics
    const onTimeAttendance = attendanceRecords.filter(a => {
      const assignment = shiftAssignments.find(s => s._id.toString() === a.shiftAssignment.toString());
      if (!assignment || !assignment.shift) return false;
      
      const shiftStart = new Date(assignment.date);
      const shiftHours = new Date(assignment.shift.startTime).getHours();
      const shiftMinutes = new Date(assignment.shift.startTime).getMinutes();
      
      shiftStart.setHours(shiftHours, shiftMinutes, 0, 0);
      
      // Consider on time if checked in within 15 minutes of shift start
      const checkInTime = new Date(a.checkInTime);
      const timeDiff = (checkInTime - shiftStart) / (1000 * 60); // difference in minutes
      
      return timeDiff <= 15;
    }).length;
    
    // Generate report
    const report = {
      userId,
      period: {
        startDate: start,
        endDate: end
      },
      shifts: {
        total: totalShiftsAssigned,
        completed: completedShifts,
        missed: missedShifts,
        completionRate: totalShiftsAssigned > 0 ? (completedShifts / totalShiftsAssigned) * 100 : 0
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      },
      attendance: {
        total: attendanceRecords.length,
        onTime: onTimeAttendance,
        punctualityRate: attendanceRecords.length > 0 ? (onTimeAttendance / attendanceRecords.length) * 100 : 0
      }
    };
    
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate department performance report
const getDepartmentPerformanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const departmentId = req.params.departmentId;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get users in department
    const users = await User.find({ department: departmentId });
    const userIds = users.map(user => user._id);
    
    // Get shift assignments
    const shiftAssignments = await ShiftAssignment.find({
      user: { $in: userIds },
      date: { $gte: start, $lte: end }
    }).populate('shift');
    
    // Get attendance records
    const attendanceRecords = await Attendance.find({
      user: { $in: userIds },
      checkInTime: { $gte: start, $lte: end }
    });
    
    // Get tasks
    const tasks = await Task.find({
      assignedTo: { $in: userIds },
      createdAt: { $gte: start, $lte: end }
    });
    
    // Calculate metrics
    const totalShiftsAssigned = shiftAssignments.length;
    const completedShifts = shiftAssignments.filter(s => s.status === 'completed').length;
    const missedShifts = shiftAssignments.filter(s => s.status === 'missed').length;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'assigned').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    
    // Calculate attendance metrics
    const onTimeAttendance = attendanceRecords.filter(a => {
      const assignment = shiftAssignments.find(s => s._id.toString() === a.shiftAssignment.toString());
      if (!assignment || !assignment.shift) return false;
      
      const shiftStart = new Date(assignment.date);
      const shiftHours = new Date(assignment.shift.startTime).getHours();
      const shiftMinutes = new Date(assignment.shift.startTime).getMinutes();
      
      shiftStart.setHours(shiftHours, shiftMinutes, 0, 0);
      
      // Consider on time if checked in within 15 minutes of shift start
      const checkInTime = new Date(a.checkInTime);
      const timeDiff = (checkInTime - shiftStart) / (1000 * 60); // difference in minutes
      
      return timeDiff <= 15;
    }).length;
    
    // Generate report
    const report = {
      departmentId,
      period: {
        startDate: start,
        endDate: end
      },
      officers: {
        total: users.length,
        active: users.filter(u => u.status === 'active').length
      },
      shifts: {
        total: totalShiftsAssigned,
        completed: completedShifts,
        missed: missedShifts,
        completionRate: totalShiftsAssigned > 0 ? (completedShifts / totalShiftsAssigned) * 100 : 0
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      },
      attendance: {
        total: attendanceRecords.length,
        onTime: onTimeAttendance,
        punctualityRate: attendanceRecords.length > 0 ? (onTimeAttendance / attendanceRecords.length) * 100 : 0
      }
    };
    
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserPerformanceReport,
  getDepartmentPerformanceReport
};
