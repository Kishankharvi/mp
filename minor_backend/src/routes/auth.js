import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('achievements')
      .select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { avatar, bio } = req.body;

    const user = await User.findById(req.user._id);
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;

    await user.save();

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update mentor profile
router.put('/mentor-profile', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ error: 'Only mentors can update mentor profile' });
    }

    const { specializations, hourlyRate } = req.body;

    const user = await User.findById(req.user._id);
    if (specializations) user.mentorProfile.specializations = specializations;
    if (hourlyRate) user.mentorProfile.hourlyRate = hourlyRate;

    await user.save();

    res.json({ message: 'Mentor profile updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
