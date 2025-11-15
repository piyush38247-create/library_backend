import {User} from '../models/User.js'
import { validationResult } from 'express-validator';

// Get all users (admin management)
export const getUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    let query = {};
    
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.isActive = status === 'active';

    const users = await User.find(query)
      .populate('studentId', 'name email')
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new admin user
export const createAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, permissions } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Only super admin can create super admin
    if (role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only super admin can create super admin users' });
    }

    const user = new User({
      email,
      password,
      role: role || 'admin',
      permissions: permissions || {}
    });

    await user.save();

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user permissions
export  const updatePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only super admin can modify super admin permissions
    if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Cannot modify super admin permissions' });
    }

    // Don't allow modifying own permissions unless super admin
    if (user._id.toString() === req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Cannot modify your own permissions' });
    }

    user.permissions = { ...user.permissions, ...permissions };
    await user.save();

    res.json({
      message: 'Permissions updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activate/Deactivate user
export const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isActive } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cannot deactivate super admin
    if (user.role === 'super_admin' && !isActive) {
      return res.status(403).json({ message: 'Cannot deactivate super admin' });
    }

    // Cannot deactivate yourself
    if (user._id.toString() === req.user.id) {
      return res.status(403).json({ message: 'Cannot deactivate your own account' });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cannot delete super admin
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete super admin' });
    }

    // Cannot delete yourself
    if (user._id.toString() === req.user.id) {
      return res.status(403).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user statistics
 export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'super_admin'] } });
    const studentUsers = await User.countDocuments({ role: 'student' });

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      studentUsers,
      usersByRole
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
