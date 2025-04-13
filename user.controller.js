const User = require('../models/user.model');
const Department = require('../models/department.model');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('department');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('department');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new user (admin only)
const createUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, badgeNumber, phoneNumber, role, department, rank } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }, { badgeNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      badgeNumber,
      phoneNumber,
      role,
      department,
      rank
    });

    // Save user to database
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, role, department, rank, status } = req.body;
    
    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        phoneNumber,
        role,
        department,
        rank,
        status,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user location
const updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Invalid coordinates format' });
    }
    
    // Update user location
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'lastLocation.coordinates': coordinates,
        'lastLocation.lastUpdated': Date.now()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Location updated successfully',
      location: user.lastLocation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get users by department
const getUsersByDepartment = async (req, res) => {
  try {
    const users = await User.find({ department: req.params.departmentId }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get users by role
const getUsersByRole = async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role }).select('-password').populate('department');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateLocation,
  getUsersByDepartment,
  getUsersByRole
};
