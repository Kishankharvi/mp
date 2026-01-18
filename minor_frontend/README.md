# Frontend - Real-Time Code Execution & Mentoring Platform

A modern React frontend for a collaborative coding platform with real-time features, Monaco code editor, and comprehensive mentoring system.

## 🚀 Features

### Core Functionality
- **User Authentication** - Login and registration with JWT
- **Code Editor** - Monaco Editor with syntax highlighting
- **Real-Time Collaboration** - Live code sync and chat via Socket.io
- **Problem Solving** - Browse and solve coding challenges
- **Mentoring System** - Find mentors and book sessions
- **Achievement System** - Track progress with achievements and streaks
- **User Profiles** - View stats, achievements, and submissions

### UI/UX Features
- Modern dark theme design
- Responsive layout (mobile-friendly)
- Loading states and error handling
- Toast notifications
- Modal dialogs
- Real-time updates

## 📋 Prerequisites

- Node.js >= 16.x
- npm or yarn
- Backend server running

## 🛠️ Installation

```bash
# Navigate to frontend directory
cd minor_frontend

# Install dependencies
npm install
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
minor_frontend/
├── src/
│   ├── services/              # API and Service layer
│   │   ├── api.js            # Axios configuration
│   │   ├── authService.js    # Authentication
│   │   ├── roomService.js    # Room management
│   │   └── ...
│   │
│   ├── context/              # React Context
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── SocketContext.jsx # Socket.io connection
│   │
│   ├── components/           # Shared components
│   │   ├── Navbar.jsx
│   │   └── ...
│   │
│   ├── pages/                # Page-specific code
│   │   ├── Room/             # Room Page & Components
│   │   │   ├── components/   # (Header, Sidebar, Editor, Chat)
│   │   │   └── index.jsx     # Main Room Page
│   │   │
│   │   ├── ProblemSolve/     # Problem Solve Page & Components
│   │   │   ├── components/   # (Header, Description, Workspace)
│   │   │   └── index.jsx     # Main Problem Solve Page
│   │   │
│   │   ├── Dashboard.jsx
│   │   ├── Problems.jsx
│   │   └── ...
│   │
│   ├── App.jsx               # Main Routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
│
├── .env                      # Environment variables
├── index.html
└── package.json
```

## 🎨 Pages Overview

### Authentication
- **Login** - User login with email/password
- **Register** - New user registration with role selection

### Dashboard
- User stats (problems solved, streak, achievements)
- Quick actions (solve problems, create room, find mentor)
- Upcoming sessions
- Recent submissions

### Problems
- **Problems List** - Browse coding challenges with filtering
- **Problem Solve** - Solve individual problems
  - Monaco code editor
  - Multiple language support
  - Run code functionality
  - Test case validation

### Collaboration
- **Rooms** - Create and manage collaboration rooms
- **Room** - Real-time collaborative coding
  - Live code synchronization
  - Chat functionality
  - Participant list
  - Connection status
  - Whiteboard support

### Mentoring
- **Mentors** - Discover and book mentors
- **Sessions** - Manage mentoring sessions

### User
- **Profile** - View user stats and achievements
- **Settings** - Update user preferences

## 🔄 State Management

### Auth Context
```javascript
import { useAuth } from '../context/AuthContext';
const { user, login, logout } = useAuth();
```

### Socket Context
```javascript
import { useSocket } from '../context/SocketContext';
const { socket, connected, emit, on } = useSocket();
```

## 🎯 Real-Time Features

### Socket.io Events

**Room Collaboration:**
```javascript
// Join room
emit('join-room', { roomId, userId, username });

// Send code changes
emit('code-change', { roomId, code });

// Send chat message
emit('chat-message', { roomId, message });
```

## 🎨 Styling

The project uses **Tailwind CSS** (v4) for styling.

## 🖥️ Monaco Editor

Powered by `@monaco-editor/react`. Supports multiple languages (JS, Python, Java, C++, C).

## 🔐 Protected Routes

Routes are protected using the `ProtectedRoute` component.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License
