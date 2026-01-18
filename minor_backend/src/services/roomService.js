import Room from '../models/Room.js';
import { nanoid } from 'nanoid';

// Create a new room
export async function createRoom(userId, data) {
    const roomId = data.roomId || nanoid(10);

    const room = await Room.create({
        roomId,
        name: data.name || 'Untitled Room',
        createdBy: userId,
        language: data.language || 'javascript',
        maxUsers: data.maxUsers || 10,
        files: data.files || [{ path: 'index.js', content: '// Start coding here\n', language: 'javascript' }],
        participants: [{
            userId,
            username: data.username,
            role: 'owner',
            canEdit: true
        }],
        sessionId: data.sessionId || null,
        permissions: data.permissions || {
            allowChat: true,
            allowExecution: true,
            allowScreenShare: true
        }
    });

    return room;
}

// Get room by ID
export async function getRoomById(roomId) {
    return await Room.findOne({ roomId })
        .populate('createdBy', 'username avatar')
        .populate('participants.userId', 'username avatar')
        .populate('sessionId');
}

// Add user to room
export async function addUserToRoom(roomId, userId, username) {
    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new Error('Room not found');
    }

    if (room.status !== 'active') {
        throw new Error('Room is closed');
    }

    if (room.participants.length >= room.maxUsers) {
        throw new Error('Room is full');
    }

    // Check if user already in room
    const existing = room.participants.find(p => p.userId.toString() === userId.toString());
    if (existing) {
        return room;
    }

    room.participants.push({
        userId,
        username,
        role: 'participant',
        canEdit: true
    });

    await room.save();
    return room;
}

// Remove user from room
export async function removeUserFromRoom(roomId, userId) {
    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new Error('Room not found');
    }

    room.participants = room.participants.filter(
        p => p.userId.toString() !== userId.toString()
    );

    await room.save();
    return room;
}

// Update file content
export async function updateFileContent(roomId, filePath, content) {
    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new Error('Room not found');
    }

    const file = room.files.find(f => f.path === filePath);
    if (file) {
        file.content = content;
    } else {
        room.files.push({ path: filePath, content });
    }

    await room.save();
    return room;
}

// Toggle user edit permission
export async function toggleUserEdit(roomId, userId, canEdit) {
    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new Error('Room not found');
    }

    await room.toggleUserEdit(userId, canEdit);
    return room;
}

// Update room permissions
export async function updatePermissions(roomId, permissions) {
    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new Error('Room not found');
    }

    room.permissions = { ...room.permissions, ...permissions };
    await room.save();
    return room;
}

// Start recording
export async function startRecording(roomId) {
    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new Error('Room not found');
    }

    await room.startRecording();
    return room;
}

// Stop recording
export async function stopRecording(roomId, recordingUrl) {
    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new Error('Room not found');
    }

    await room.stopRecording(recordingUrl);
    return room;
}

// Update whiteboard
export async function updateWhiteboard(roomId, whiteboardData) {
    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new Error('Room not found');
    }

    room.whiteboard.data = whiteboardData;
    await room.save();
    return room;
}

// Close room
export async function closeRoom(roomId) {
    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new Error('Room not found');
    }

    room.status = 'closed';
    await room.save();
    return room;
}

export default {
    createRoom,
    getRoomById,
    addUserToRoom,
    removeUserFromRoom,
    updateFileContent,
    toggleUserEdit,
    updatePermissions,
    startRecording,
    stopRecording,
    updateWhiteboard,
    closeRoom
};
