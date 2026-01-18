import React, { useRef, useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const Whiteboard = ({ roomId, isVisible, onClose }) => {
    const canvasRef = useRef(null);
    const { socket, connected, emit, on, off } = useSocket();
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Handle resizing
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Socket events
        const handleDraw = (data) => {
            const { x0, y0, x1, y1, color, width } = data;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
            ctx.closePath();
        };

        const handleClear = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        if (socket && connected) {
            on('whiteboard-draw', handleDraw);
            on('whiteboard-clear', handleClear);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (socket) {
                off('whiteboard-draw', handleDraw);
                off('whiteboard-clear', handleClear);
            }
        };
    }, [socket, connected, roomId]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Draw locally
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        // Emit if connected (need previous point logic for smooth lines, simplified here)
        // For simplicity in this v1, we might emit segments. 
        // A better approach for production: track lastX/Y
    };

    // Improved Draw Logic with previous coordinates
    const lastPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        lastPos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const drawData = {
            x0: lastPos.current.x,
            y0: lastPos.current.y,
            x1: currentX,
            y1: currentY,
            color,
            width: lineWidth
        };

        // Draw locally
        ctx.beginPath();
        ctx.moveTo(drawData.x0, drawData.y0);
        ctx.lineTo(drawData.x1, drawData.y1);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();

        // Emit
        if (socket && connected) {
            emit('whiteboard-draw', { roomId, ...drawData });
        }

        lastPos.current = { x: currentX, y: currentY };
    };

    const clearBoard = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (socket && connected) {
            emit('whiteboard-clear', { roomId });
        }
    };

    if (!isVisible) return null;

    return (
        <div className="absolute bottom-4 right-4 w-96 h-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col z-40 transition-all">
            <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Whiteboard</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-none"
                    />
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(parseInt(e.target.value))}
                        className="w-16"
                    />
                    <button onClick={clearBoard} className="text-xs text-red-500 hover:text-red-700 font-bold">Clear</button>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
                </div>
            </div>
            <div className="flex-1 relative bg-white cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export default Whiteboard;
