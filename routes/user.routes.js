const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin, isSupervisor } = require('../middleware/auth.middleware');

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, userController.createUser);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

// Protected routes - Supervisor and Admin
router.get('/', verifyToken, isSupervisor, userController.getAllUsers);
router.get('/role/:role', verifyToken, isSupervisor, userController.getUsersByRole);
router.get('/department/:departmentId', verifyToken, isSupervisor, userController.getUsersByDepartment);
router.get('/:id', verifyToken, isSupervisor, userController.getUserById);

// Protected routes - All authenticated users
router.put('/location/update', verifyToken, userController.updateLocation);

module.exports = router;
