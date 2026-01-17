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
│   ├── services/              # API service layer
│   │   ├── api.js            # Axios configuration
│   │   ├── authService.js    # Authentication
│   │   ├── userService.js    # User operations
│   │   ├── problemService.js # Problem management
│   │   ├── submissionService.js
│   │   ├── roomService.js    # Room management
│   │   ├── sessionService.js # Session management
│   │   └── achievementService.js
│   │
│   ├── context/              # React Context
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── SocketContext.jsx # Socket.io connection
│   │
│   ├── components/           # Reusable components
│   │   └── auth/
│   │       └── ProtectedRoute.jsx
│   │
│   ├── pages/                # Page components
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Problems.jsx      # Problem list
│   │   ├── ProblemSolve.jsx  # Problem solving (Monaco)
│   │   ├── Submissions.jsx   # Submission history
│   │   ├── Rooms.jsx         # Room list
│   │   ├── Room.jsx          # Collaborative room
│   │   ├── Sessions.jsx      # Session list
│   │   ├── SessionDetail.jsx # Session details
│   │   ├── Mentors.jsx       # Mentor discovery
│   │   ├── Profile.jsx       # User profile
│   │   └── Settings.jsx      # User settings
│   │
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
│
├── .env                      # Environment variables
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js        # Tailwind CSS config
├── vite.config.js            # Vite configuration
└── README.md
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
- **Problems List** - Browse all coding challenges
  - Search functionality
  - Difficulty filter
  - Acceptance rate display
- **Problem Solve** - Solve individual problems
  - Monaco code editor
  - Multiple language support
  - Run code functionality
  - Submit with test case validation

### Collaboration
- **Rooms** - Create and manage collaboration rooms
- **Room** - Real-time collaborative coding
  - Live code synchronization
  - Chat functionality
  - Participant list
  - Connection status

### Mentoring
- **Mentors** - Discover and book mentors
  - Mentor profiles with ratings
  - Specializations display
  - Session booking modal
- **Sessions** - Manage mentoring sessions
  - Filter by status
  - View session details
- **Session Detail** - Complete and rate sessions

### User
- **Profile** - View user stats and achievements
  - Stats grid
  - Achievement showcase
  - Mentor profile (if mentor)
- **Settings** - Update user preferences
  - Profile settings
  - Mentor settings
  - Account management

## 🔌 API Integration

All API calls are handled through service files in `src/services/`:

```javascript
// Example: Using auth service
import * as authService from '../services/authService';

const handleLogin = async (email, password) => {
  const data = await authService.login(email, password);
  // Token automatically stored in localStorage
};
```

### Service Methods

**authService**
- `register(username, email, password, role)`
- `login(email, password)`
- `getCurrentUser()`
- `updateProfile(avatar, bio)`
- `logout()`

**problemService**
- `getProblems(difficulty, search)`
- `getProblem(id)`
- `createProblem(data)`

**submissionService**
- `submitSolution(problemId, code, language)`
- `executeCode(code, language, input)`
- `getUserSubmissions(userId)`

**roomService**
- `createRoom(data)`
- `getRoom(roomId)`
- `joinRoom(roomId)`
- `updateFile(roomId, path, content)`

**sessionService**
- `createSession(data)`
- `getMySessions()`
- `completeSession(id, notes, rating)`

## 🔄 State Management

### Auth Context
```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  // Use authentication state
};
```

### Socket Context
```javascript
import { useSocket } from '../context/SocketContext';

const MyComponent = () => {
  const { socket, connected, emit, on } = useSocket();
  
  useEffect(() => {
    on('event-name', handleEvent);
    return () => off('event-name', handleEvent);
  }, []);
};
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

// Listen for updates
on('user-joined', (data) => { /* ... */ });
on('code-change', (data) => { /* ... */ });
on('chat-message', (data) => { /* ... */ });
```

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling:

```javascript
// Example component
<div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
  <h2 className="text-xl font-bold text-white mb-4">Title</h2>
  <p className="text-gray-300">Content</p>
</div>
```

### Color Scheme
- **Background**: Gray-900 (#111827)
- **Cards**: Gray-800 (#1F2937)
- **Borders**: Gray-700 (#374151)
- **Primary**: Blue-600 (#2563EB)
- **Success**: Green-600 (#16A34A)
- **Warning**: Yellow-500 (#EAB308)
- **Error**: Red-600 (#DC2626)

## 🖥️ Monaco Editor

### Configuration
```javascript
import Editor from '@monaco-editor/react';

<Editor
  height="100%"
  language={language}
  value={code}
  onChange={handleChange}
  theme="vs-dark"
  options={{
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true
  }}
/>
```

### Supported Languages
- JavaScript
- Python
- Java
- C++
- C

## 🔐 Protected Routes

Routes are protected using the `ProtectedRoute` component:

```javascript
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/problems" element={<Problems />} />
  {/* Other protected routes */}
</Route>
```

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Single column layout
- **Tablet**: 2-column grid
- **Desktop**: 3-4 column grid

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `VITE_API_URL` - Your backend API URL
- `VITE_SOCKET_URL` - Your Socket.io server URL

## 🐛 Troubleshooting

### API Connection Issues
```javascript
// Check API URL in .env
VITE_API_URL=http://localhost:5000/api

// Verify backend is running
curl http://localhost:5000/health
```

### Socket.io Not Connecting
- Check `VITE_SOCKET_URL` in .env
- Verify backend Socket.io server is running
- Check CORS settings on backend

### Monaco Editor Not Loading
```bash
# Reinstall Monaco editor
npm uninstall @monaco-editor/react
npm install @monaco-editor/react
```

## 📚 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client
- `socket.io-client` - Real-time communication
- `@monaco-editor/react` - Code editor

### Styling
- `tailwindcss` - Utility-first CSS
- `postcss` - CSS processing
- `autoprefixer` - CSS vendor prefixes

### Build Tools
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite

## 🎯 Key Features Implementation

### Code Execution
1. User writes code in Monaco editor
2. Click "Run Code" or "Submit"
3. Code sent to backend via `submissionService`
4. Results displayed in output panel

### Real-Time Collaboration
1. User creates/joins room
2. Socket.io connection established
3. Code changes broadcast to all participants
4. Chat messages synced in real-time

### Mentoring System
1. Browse available mentors
2. View mentor profiles and ratings
3. Book session with date/time
4. Complete and rate session

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 👥 Authors

Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing library
- Monaco Editor for the code editor
- Tailwind CSS for the styling system
- Socket.io for real-time features
