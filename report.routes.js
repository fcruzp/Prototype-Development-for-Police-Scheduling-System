const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isAdmin, isSupervisor } = require('../middleware/auth.middleware');

// Routes for supervisors and admins
router.get('/user/:userId', verifyToken, isSupervisor, reportController.getUserPerformanceReport);
router.get('/department/:departmentId', verifyToken, isSupervisor, reportController.getDepartmentPerformanceReport);

module.exports = router;
