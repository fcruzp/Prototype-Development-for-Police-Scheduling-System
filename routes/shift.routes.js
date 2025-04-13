const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shift.controller');
const { verifyToken, isAdmin, isSupervisor } = require('../middleware/auth.middleware');

// Protected routes - Admin and Supervisor
router.post('/', verifyToken, isSupervisor, shiftController.createShift);
router.put('/:id', verifyToken, isSupervisor, shiftController.updateShift);
router.delete('/:id', verifyToken, isAdmin, shiftController.deleteShift);
router.post('/assign', verifyToken, isSupervisor, shiftController.assignShift);
router.put('/assignment/:id', verifyToken, isSupervisor, shiftController.updateShiftAssignmentStatus);

// Protected routes - All authenticated users
router.get('/', verifyToken, shiftController.getAllShifts);
router.get('/:id', verifyToken, shiftController.getShiftById);
router.get('/department/:departmentId', verifyToken, shiftController.getShiftsByDepartment);
router.get('/assignments/user/:userId', verifyToken, shiftController.getShiftAssignmentsByUser);

module.exports = router;
