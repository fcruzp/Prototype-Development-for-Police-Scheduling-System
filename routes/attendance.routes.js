const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { verifyToken, isAdmin, isSupervisor } = require('../middleware/auth.middleware');

// Routes for officers
router.post('/check-in', verifyToken, attendanceController.checkIn);
router.post('/check-out', verifyToken, attendanceController.checkOut);
router.get('/user/:userId', verifyToken, attendanceController.getAttendanceByUser);

// Routes for supervisors
router.get('/department/:departmentId', verifyToken, isSupervisor, attendanceController.getAttendanceByDepartment);

module.exports = router;
