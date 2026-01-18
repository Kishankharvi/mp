import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createRoomLimiter } from '../middleware/rateLimit.js';
import * as roomService from '../services/roomService.js';

const router = express.Router();

// Create room
router.post('/', authenticate, createRoomLimiter, async (req, res) => {
  try {
    const room = await roomService.createRoom(req.user._id, {
      ...req.body,
      username: req.user.username
    });

    res.status(201).json({ message: 'Room created', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get room
router.get('/:roomId', authenticate, async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join room
router.post('/:roomId/join', authenticate, async (req, res) => {
  try {
    const room = await roomService.addUserToRoom(
      req.params.roomId,
      req.user._id,
      req.user.username
    );

    res.json({ message: 'Joined room', room });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Leave room
router.post('/:roomId/leave', authenticate, async (req, res) => {
  try {
    const room = await roomService.removeUserFromRoom(
      req.params.roomId,
      req.user._id
    );

    res.json({ message: 'Left room', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update file
router.put('/:roomId/files', authenticate, async (req, res) => {
  try {
    const { path, content } = req.body;

    const room = await roomService.updateFileContent(
      req.params.roomId,
      path,
      content
    );

    res.json({ message: 'File updated', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle user edit permission
router.post('/:roomId/permissions/user', authenticate, async (req, res) => {
  try {
    const { userId, canEdit } = req.body;

    const room = await roomService.toggleUserEdit(
      req.params.roomId,
      userId,
      canEdit
    );

    res.json({ message: 'Permission updated', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update room permissions
router.put('/:roomId/permissions', authenticate, async (req, res) => {
  try {
    const room = await roomService.updatePermissions(
      req.params.roomId,
      req.body
    );

    res.json({ message: 'Permissions updated', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start recording
router.post('/:roomId/recording/start', authenticate, async (req, res) => {
  try {
    const room = await roomService.startRecording(req.params.roomId);

    res.json({ message: 'Recording started', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop recording
router.post('/:roomId/recording/stop', authenticate, async (req, res) => {
  try {
    const { recordingUrl } = req.body;

    const room = await roomService.stopRecording(
      req.params.roomId,
      recordingUrl
    );

    res.json({ message: 'Recording stopped', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update whiteboard
router.put('/:roomId/whiteboard', authenticate, async (req, res) => {
  try {
    const room = await roomService.updateWhiteboard(
      req.params.roomId,
      req.body.data
    );

    res.json({ message: 'Whiteboard updated', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close room
router.post('/:roomId/close', authenticate, async (req, res) => {
  try {
    const room = await roomService.closeRoom(req.params.roomId);

    res.json({ message: 'Room closed', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
