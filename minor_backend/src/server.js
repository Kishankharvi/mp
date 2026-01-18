import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimit.js";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import problemRoutes from "./routes/problems.js";
import submissionRoutes from "./routes/submissions.js";
import roomRoutes from "./routes/rooms.js";
import sessionRoutes from "./routes/sessions.js";
import achievementRoutes from "./routes/achievements.js";

// Import socket handlers
import registerSocketHandlers from "./socketHandlers.js";

const app = express();

// Security & Logging
app.use(helmet());
app.use(morgan("dev"));

// CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rate limiting
app.use("/api/", apiLimiter);

// Connect to database
try {
  await connectDB();
} catch (err) {
  console.error("Failed to start server - Database connection failed:", err.message);
  process.exit(1);
}

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Real-Time Code Execution & Mentoring Platform API",
    version: "1.0.0",
    status: "running"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/achievements", achievementRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Register socket handlers
registerSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});

export default app;
