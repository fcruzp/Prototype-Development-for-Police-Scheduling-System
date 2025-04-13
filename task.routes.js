const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { verifyToken, isAdmin, isSupervisor } = require('../middleware/auth.middleware');

// Protected routes - Admin and Supervisor
router.post('/', verifyToken, isSupervisor, taskController.createTask);
router.put('/:id', verifyToken, isSupervisor, taskController.updateTask);
router.delete('/:id', verifyToken, isAdmin, taskController.deleteTask);

// Protected routes - All authenticated users
router.get('/', verifyToken, taskController.getAllTasks);
router.get('/:id', verifyToken, taskController.getTaskById);
router.get('/department/:departmentId', verifyToken, taskController.getTasksByDepartment);
router.get('/assignee/:userId', verifyToken, taskController.getTasksByAssignee);
router.put('/status/:id', verifyToken, taskController.updateTaskStatus);
router.get('/location/nearby', verifyToken, taskController.getNearbyTasks);

module.exports = router;
