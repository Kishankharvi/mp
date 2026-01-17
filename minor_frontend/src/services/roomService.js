import api from './api';

// Create room
export const createRoom = async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data.room;
};

// Get room
export const getRoom = async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data.room;
};

// Join room
export const joinRoom = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/join`);
    return response.data.room;
};

// Leave room
export const leaveRoom = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/leave`);
    return response.data.room;
};

// Update file content
export const updateFile = async (roomId, path, content) => {
    const response = await api.put(`/rooms/${roomId}/files`, {
        path,
        content
    });
    return response.data.room;
};

// Toggle user edit permission
export const toggleUserEdit = async (roomId, userId, canEdit) => {
    const response = await api.post(`/rooms/${roomId}/permissions/user`, {
        userId,
        canEdit
    });
    return response.data.room;
};

// Update room permissions
export const updatePermissions = async (roomId, permissions) => {
    const response = await api.put(`/rooms/${roomId}/permissions`, permissions);
    return response.data.room;
};

// Start recording
export const startRecording = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/recording/start`);
    return response.data.room;
};

// Stop recording
export const stopRecording = async (roomId, recordingUrl) => {
    const response = await api.post(`/rooms/${roomId}/recording/stop`, {
        recordingUrl
    });
    return response.data.room;
};

// Update whiteboard
export const updateWhiteboard = async (roomId, data) => {
    const response = await api.put(`/rooms/${roomId}/whiteboard`, {
        data
    });
    return response.data.room;
};

// Close room
export const closeRoom = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/close`);
    return response.data.room;
};

export default {
    createRoom,
    getRoom,
    joinRoom,
    leaveRoom,
    updateFile,
    toggleUserEdit,
    updatePermissions,
    startRecording,
    stopRecording,
    updateWhiteboard,
    closeRoom
};
