import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Create socket connection
        const newSocket = io(SOCKET_URL, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const emit = (event, data) => {
        if (socket) {
            socket.emit(event, data);
        }
    };

    const on = (event, callback) => {
        if (socket) {
            socket.on(event, callback);
        }
    };

    const off = (event, callback) => {
        if (socket) {
            socket.off(event, callback);
        }
    };

    const joinRoom = (roomId, userData) => {
        if (socket) {
            socket.emit('join-room', { roomId, ...userData });
        }
    };

    const leaveRoom = (roomId) => {
        if (socket) {
            socket.emit('leave-room', { roomId });
        }
    };

    const value = {
        socket,
        connected,
        emit,
        on,
        off,
        joinRoom,
        leaveRoom
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export default SocketContext;
