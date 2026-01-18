# Backend - Real-Time Code Execution & Mentoring Platform

A comprehensive Node.js/Express backend for a collaborative coding platform with real-time features, code execution, and mentoring capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication** - JWT-based authentication with role management
- **Code Execution** - Execute code in multiple languages via Piston API
- **Real-Time Collaboration** - Socket.io for live code editing and chat
- **Problem Management** - CRUD operations for coding challenges
- **Submission Tracking** - Track and validate code submissions
- **Mentoring System** - Schedule and manage mentoring sessions
- **Achievement System** - Gamification with achievements and streaks

### Technical Features
- RESTful API with endpoints for all resources
- Real-time WebSocket communication
- MongoDB database with Mongoose ODM
- In-memory Rate limiting and security middleware
- Comprehensive error handling

## 📋 Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x
- npm or yarn

## 🛠️ Installation

```bash
# Clone the repository and navigate to backend
cd minor_backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/codeplatform

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Code Execution
PISTON_API=https://emkc.org/api/v2/piston/execute

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
minor_backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.js           # MongoDB connection
│   │   ├── storage.js      # File storage config
│   │   └── constants.js    # Constants and enums
│   │
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Problem.js
│   │   └── ...
│   │
│   ├── services/           # Business logic
│   │   ├── achievementService.js
│   │   ├── executionService.js
│   │   ├── sessionService.js
│   │   └── roomService.js
│   │
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── problems.js
│   │   ├── rooms.js
│   │   └── ...
│   │
│   ├── middleware/         # Express middleware
│   │   ├── auth.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   │
│   ├── socketHandlers.js   # Socket.io event handlers
│   └── server.js           # Express app entry point
│
├── .env                    # Environment variables
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login user
GET    /api/auth/me              # Get current user
```

### Users
```
GET    /api/users/:id            # Get user profile
GET    /api/users/search?q=      # Search users
```

### Problems
```
GET    /api/problems             # List all problems
GET    /api/problems/:id         # Get problem details
POST   /api/problems             # Create problem
```

### Submissions
```
POST   /api/submissions/submit   # Submit solution
POST   /api/submissions/execute  # Execute code
```

### Rooms
```
POST   /api/rooms                        # Create room
GET    /api/rooms/:roomId                # Get room
POST   /api/rooms/:roomId/join           # Join room
PUT    /api/rooms/:roomId/permissions
```

### Sessions
```
POST   /api/sessions                     # Create session
GET    /api/sessions/my-sessions         # Get my sessions
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## 🎯 Socket.io Events

### Room Events
```javascript
// Client → Server
'join-room'      // Join a collaboration room
'leave-room'     // Leave a room
'code-change'    // Send code changes
'chat-message'   // Send chat message

// Server → Client
'user-joined'    // User joined room
'user-left'      // User left room
'code-change'    // Receive code changes
'chat-message'   // Receive chat message
```

## 📚 Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing

### Utilities
- `axios` - HTTP client
- `dotenv` - Environment variables
- `cors` - CORS middleware
- `helmet` - Security headers
- `morgan` - HTTP logger
- `express-rate-limit` - API Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License
