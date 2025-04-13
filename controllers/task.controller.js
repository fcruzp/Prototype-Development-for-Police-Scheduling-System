const Task = require('../models/task.model');
const User = require('../models/user.model');

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'firstName lastName badgeNumber')
      .populate('assignedBy', 'firstName lastName')
      .populate('department', 'name');
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName badgeNumber')
      .populate('assignedBy', 'firstName lastName')
      .populate('department', 'name');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      priority, 
      location, 
      assignedTo, 
      department,
      estimatedDuration,
      dueDate,
      notes,
      attachments
    } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      location,
      assignedTo,
      assignedBy: req.user._id,
      department,
      estimatedDuration,
      dueDate,
      notes,
      attachments
    });

    await task.save();

    // If task is assigned to someone, populate the user info
    let populatedTask = task;
    if (assignedTo) {
      populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'firstName lastName badgeNumber')
        .populate('assignedBy', 'firstName lastName')
        .populate('department', 'name');
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      priority, 
      status,
      location, 
      assignedTo, 
      department,
      estimatedDuration,
      dueDate,
      notes,
      attachments
    } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        priority,
        status,
        location,
        assignedTo,
        department,
        estimatedDuration,
        dueDate,
        notes,
        attachments,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'firstName lastName badgeNumber')
    .populate('assignedBy', 'firstName lastName')
    .populate('department', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get tasks by department
const getTasksByDepartment = async (req, res) => {
  try {
    const tasks = await Task.find({ department: req.params.departmentId })
      .populate('assignedTo', 'firstName lastName badgeNumber')
      .populate('assignedBy', 'firstName lastName')
      .populate('department', 'name');
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get tasks assigned to user
const getTasksByAssignee = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId })
      .populate('assignedTo', 'firstName lastName badgeNumber')
      .populate('assignedBy', 'firstName lastName')
      .populate('department', 'name');
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { status, notes, startTime, completionTime } = req.body;

    // Only allow assigned user or supervisors to update status
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to the task or is a supervisor
    const isAssignedUser = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
    const isSupervisor = req.user.role === 'supervisor' || req.user.role === 'admin';
    
    if (!isAssignedUser && !isSupervisor) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Update fields based on status
    const updateFields = { status, updatedAt: Date.now() };
    
    if (notes) {
      updateFields.notes = notes;
    }
    
    if (status === 'in_progress' && !task.startTime) {
      updateFields.startTime = startTime || Date.now();
    }
    
    if (status === 'completed' && !task.completionTime) {
      updateFields.completionTime = completionTime || Date.now();
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'firstName lastName badgeNumber')
    .populate('assignedBy', 'firstName lastName')
    .populate('department', 'name');

    res.status(200).json({
      message: 'Task status updated successfully',
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get nearby tasks
const getNearbyTasks = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters, default 5km
    
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const tasks = await Task.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: { $in: ['pending', 'assigned'] }
    })
    .populate('assignedTo', 'firstName lastName badgeNumber')
    .populate('assignedBy', 'firstName lastName')
    .populate('department', 'name');
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByDepartment,
  getTasksByAssignee,
  updateTaskStatus,
  getNearbyTasks
};
