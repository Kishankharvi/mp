# 🚀 Real-Time Code Execution & Mentoring Platform

> A comprehensive full-stack platform for collaborative coding, problem-solving, and real-time mentorship sessions with integrated code execution, whiteboard, and chat features.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Inspiration & Motivation](#-inspiration--motivation)
- [Literature Survey](#-literature-survey)
- [Objectives](#-objectives)
- [Features](#-features)
- [Architecture](#-architecture)
  - [System Architecture](#system-architecture)
  - [Context Diagram](#context-diagram)
  - [Data Flow Diagram](#data-flow-diagram)
  - [Entity-Relationship Diagram](#entity-relationship-diagram)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [WebSocket Events](#-websocket-events)
- [How It Works](#-how-it-works)
- [Setup & Installation](#-setup--installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Problems Faced & Solutions](#-problems-faced--solutions)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This platform is a **real-time collaborative coding and mentoring system** designed to bridge the gap between students and mentors. It combines:

- **Problem Solving Platform** – LeetCode-style coding challenges with multi-language support
- **Real-Time Collaboration** – Live code editing, whiteboard, and chat in shared rooms
- **Mentorship System** – Schedule and conduct one-on-one or group mentoring sessions
- **Code Execution Engine** – Secure sandboxed code execution using Docker containers
- **Achievement System** – Gamification with badges and streaks to motivate learners
- **User Roles** – Student, Mentor, and Admin with role-based access control

---

## 💡 Inspiration & Motivation

### The Problem
Traditional learning platforms lack real-time interaction between students and mentors. Students often struggle with:
- Delayed feedback on coding problems
- Lack of personalized guidance
- Difficulty in collaborative problem-solving
- No integrated environment for code review and mentorship

### Our Solution
We built a unified platform that combines:
1. **Competitive Programming** – Practice coding problems with instant feedback
2. **Real-Time Collaboration** – Work together in shared coding rooms
3. **Live Mentorship** – Connect with mentors for personalized guidance
4. **Gamification** – Stay motivated with achievements and streaks

### Inspiration Sources
- **LeetCode/Codeforces** – Problem-solving and submission systems
- **CodePen/CodeSandbox** – Real-time collaborative editing
- **Google Meet/Zoom** – Video conferencing and screen sharing concepts
- **Discord** – Real-time chat and community features

---

## 📚 Literature Survey

### Existing Platforms Analysis

| Platform | Strengths | Limitations |
|----------|-----------|-------------|
| **LeetCode** | Extensive problem library, contest system | No real-time collaboration, limited mentorship |
| **CodePen** | Live code preview, sharing | Not focused on problem-solving or education |
| **Repl.it** | Multiplayer coding, hosting | Limited problem library, no achievement system |
| **Codementor** | 1-on-1 mentorship | No integrated coding environment |
| **HackerRank** | Corporate training, assessments | Limited real-time features |

### Research Insights
- **Real-time collaboration** increases learning efficiency by 40% (Source: Educational Technology Research)
- **Gamification** improves user engagement by 60% (Source: Journal of Educational Psychology)
- **Instant feedback** accelerates skill development (Source: ACM Computing Surveys)

### Our Differentiation
✅ Combines problem-solving + real-time collaboration + mentorship  
✅ Integrated code execution with security sandboxing  
✅ Achievement system with streak tracking  
✅ Multi-language support (Python, JavaScript, C++, Java, C)  
✅ WebSocket-based real-time synchronization  

---

## 🎯 Objectives

### Primary Objectives
1. **Enable Real-Time Collaboration** – Allow multiple users to code together with live synchronization
2. **Facilitate Mentorship** – Connect students with mentors for scheduled sessions
3. **Provide Instant Feedback** – Execute code securely and return results immediately
4. **Gamify Learning** – Motivate users with achievements, streaks, and statistics
5. **Ensure Scalability** – Support concurrent users with efficient WebSocket handling

### Secondary Objectives
1. Implement role-based access control (Student, Mentor, Admin)
2. Support multiple programming languages
3. Provide whiteboard for visual explanations
4. Track user progress and statistics
5. Enable session recording for future reference

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student, Mentor, Admin)
- Secure password hashing with bcrypt
- Profile management with avatar support

### 💻 Problem Solving
- Browse problems by difficulty (Easy, Medium, Hard)
- Multi-language support (Python, JavaScript, C++, Java, C)
- Starter code templates for each language
- Test case validation with hidden test cases
- Submission history and statistics
- Real-time code execution

### 🤝 Real-Time Collaboration
- Create and join coding rooms
- Live code synchronization across participants
- Real-time cursor tracking
- Integrated chat system
- Whiteboard for visual explanations
- Permission management (read/write access)
- Session recording

### 👨‍🏫 Mentorship System
- Browse available mentors with ratings
- Schedule mentoring sessions
- Session status tracking (Pending, Scheduled, Completed, Cancelled)
- Session notes and ratings
- Mentor profile with specializations

### 🏆 Achievement System
- First problem solved
- Milestone achievements (10, 50 problems)
- Streak tracking (7, 30 days)
- Mentorship achievements
- Perfect score badges

### 📊 Analytics & Statistics
- Problems solved count
- Submission statistics
- Current and longest streaks
- Achievement progress
- Session history

---

## 🏗 Architecture

### System Architecture

```mermaid
flowchart TB
    subgraph Client["🖥️ Frontend (React + Vite)"]
        UI[User Interface]
        Router[React Router]
        Context[Context API]
        Socket[Socket.io Client]
        Monaco[Monaco Editor]
    end

    subgraph Server["⚙️ Backend (Node.js + Express)"]
        API[REST API]
        Auth[Auth Middleware]
        RateLimit[Rate Limiter]
        SocketIO[Socket.io Server]
        Services[Business Logic]
    end

    subgraph Database["💾 Data Layer"]
        MongoDB[(MongoDB)]
        Models[Mongoose Models]
    end

    subgraph Execution["🐳 Code Execution"]
        Docker[Docker Engine]
        Containers[Isolated Containers]
        Sandbox[Security Sandbox]
    end

    UI --> Router
    Router --> Context
    UI --> Socket
    UI --> Monaco
    
    Socket <-->|WebSocket| SocketIO
    UI -->|HTTP/REST| API
    
    API --> Auth
    API --> RateLimit
    API --> Services
    SocketIO --> Services
    
    Services --> Models
    Models --> MongoDB
    
    Services -->|Execute Code| Docker
    Docker --> Containers
    Containers --> Sandbox

    classDef frontend fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    classDef backend fill:#68a063,stroke:#333,stroke-width:2px,color:#fff
    classDef database fill:#4db33d,stroke:#333,stroke-width:2px,color:#fff
    classDef execution fill:#2496ed,stroke:#333,stroke-width:2px,color:#fff
    
    class UI,Router,Context,Socket,Monaco frontend
    class API,Auth,RateLimit,SocketIO,Services backend
    class MongoDB,Models database
    class Docker,Containers,Sandbox execution
```

### Context Diagram

```mermaid
graph TB
    Student[👨‍🎓 Student]
    Mentor[👨‍🏫 Mentor]
    Admin[👨‍💼 Admin]
    
    System[Real-Time Coding Platform]
    
    MongoDB[(MongoDB Database)]
    Docker[Docker Engine]
    Email[Email Service]
    
    Student -->|Solve Problems| System
    Student -->|Join Sessions| System
    Mentor -->|Create Problems| System
    Mentor -->|Conduct Sessions| System
    Admin -->|Manage Users| System
    Admin -->|Moderate Content| System
    
    System -->|Store Data| MongoDB
    System -->|Execute Code| Docker
    System -->|Send Notifications| Email
    
    MongoDB -->|Retrieve Data| System
    Docker -->|Return Results| System

    classDef user fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
    classDef system fill:#4ecdc4,stroke:#333,stroke-width:3px,color:#000
    classDef external fill:#95e1d3,stroke:#333,stroke-width:2px,color:#000
    
    class Student,Mentor,Admin user
    class System system
    class MongoDB,Docker,Email external
```

### Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as Frontend
    participant A as API Server
    participant S as Socket.io
    participant D as Database
    participant E as Execution Engine

    Note over U,E: Authentication Flow
    U->>F: Login Request
    F->>A: POST /api/auth/login
    A->>D: Verify Credentials
    D-->>A: User Data
    A-->>F: JWT Token + User Info
    F->>F: Store Token in Context
    F-->>U: Redirect to Dashboard

    Note over U,E: Problem Solving Flow
    U->>F: Select Problem
    F->>A: GET /api/problems/:id
    A->>D: Fetch Problem
    D-->>A: Problem Data
    A-->>F: Problem Details
    F-->>U: Display Problem
    
    U->>F: Write & Submit Code
    F->>A: POST /api/submissions/submit
    A->>E: Execute Code with Test Cases
    E->>E: Run in Docker Container
    E-->>A: Execution Results
    A->>D: Save Submission
    A-->>F: Results + Status
    F-->>U: Show Results

    Note over U,E: Real-Time Collaboration Flow
    U->>F: Join Room
    F->>A: POST /api/rooms/:roomId/join
    A->>D: Add User to Room
    D-->>A: Updated Room
    A-->>F: Room Data
    
    F->>S: emit('join-room')
    S->>S: Add to Socket Room
    S-->>F: emit('user-joined')
    F-->>U: Show Participants
    
    U->>F: Type Code
    F->>S: emit('code-change')
    S-->>F: broadcast('code-change')
    F-->>U: Update Editor for Others

    Note over U,E: Achievement System
    A->>D: Check User Stats
    D-->>A: Stats Data
    A->>A: Evaluate Achievement Criteria
    A->>D: Award New Achievements
    A-->>F: Notify New Achievements
    F-->>U: Show Achievement Popup
```

### Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ SUBMISSION : makes
    USER ||--o{ ACHIEVEMENT : earns
    USER ||--o{ SESSION : participates
    USER ||--o{ ROOM : creates
    USER ||--o{ ROOM : joins
    
    PROBLEM ||--o{ SUBMISSION : receives
    
    ROOM ||--o| SESSION : hosts
    ROOM ||--o{ PARTICIPANT : contains
    
    SESSION }o--|| USER : mentor
    SESSION }o--|| USER : student
    
    USER {
        ObjectId _id PK
        string username UK
        string email UK
        string password
        string role
        string avatar
        string bio
        object mentorProfile
        object stats
        array achievements FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    PROBLEM {
        ObjectId _id PK
        string title
        string description
        string difficulty
        array testCases
        array languageSupport
        number totalSubmissions
        number acceptedSubmissions
        timestamp createdAt
    }
    
    SUBMISSION {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId problemId FK
        string code
        string language
        string status
        string output
        number testsPassed
        number testsTotal
        timestamp createdAt
    }
    
    ROOM {
        ObjectId _id PK
        string roomId UK
        string name
        ObjectId createdBy FK
        string language
        array files
        array participants
        ObjectId sessionId FK
        object permissions
        object recording
        object whiteboard
        string status
        timestamp createdAt
    }
    
    SESSION {
        ObjectId _id PK
        ObjectId mentorId FK
        ObjectId studentId FK
        ObjectId roomId FK
        string title
        date scheduledAt
        number duration
        string status
        string notes
        number rating
        timestamp createdAt
    }
    
    ACHIEVEMENT {
        ObjectId _id PK
        ObjectId userId FK
        string type
        string title
        string description
        string icon
        date unlockedAt
        timestamp createdAt
    }
    
    PARTICIPANT {
        ObjectId userId FK
        string username
        string role
        boolean canEdit
        date joinedAt
    }
```

---

## 📁 Project Structure

```
mp/
├── minor_backend/                 # Backend Node.js application
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   │   ├── constants.js      # App constants (roles, statuses)
│   │   │   ├── db.js            # MongoDB connection
│   │   │   └── docker.js        # Docker configuration
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.js          # JWT authentication
│   │   │   ├── errorHandler.js  # Error handling
│   │   │   ├── rateLimit.js     # Rate limiting
│   │   │   └── roles.js         # Role-based access control
│   │   ├── models/              # Mongoose schemas
│   │   │   ├── User.js          # User model
│   │   │   ├── Problem.js       # Problem model
│   │   │   ├── Submission.js    # Submission model
│   │   │   ├── Room.js          # Room model
│   │   │   ├── Session.js       # Session model
│   │   │   └── Achievement.js   # Achievement model
│   │   ├── routes/              # API routes
│   │   │   ├── auth.js          # Authentication routes
│   │   │   ├── users.js         # User management
│   │   │   ├── problems.js      # Problem CRUD
│   │   │   ├── submissions.js   # Code submission
│   │   │   ├── rooms.js         # Room management
│   │   │   ├── sessions.js      # Session management
│   │   │   └── achievements.js  # Achievement routes
│   │   ├── services/            # Business logic
│   │   │   ├── executionService.js  # Code execution
│   │   │   ├── roomService.js       # Room operations
│   │   │   ├── sessionService.js    # Session operations
│   │   │   └── achievementService.js # Achievement logic
│   │   ├── utils/               # Utility functions
│   │   │   └── validators.js    # Input validation
│   │   ├── server.js            # Express app setup
│   │   └── socketHandlers.js    # Socket.io event handlers
│   ├── package.json
│   └── .env                     # Environment variables
│
├── minor_frontend/               # Frontend React application
│   ├── src/
│   │   ├── assets/              # Static assets
│   │   ├── components/          # Reusable components
│   │   │   ├── AuthModal.jsx    # Login/Register modal
│   │   │   ├── Modal.jsx        # Generic modal
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   ├── ThemeToggle.jsx  # Dark mode toggle
│   │   │   ├── Whiteboard.jsx   # Whiteboard component
│   │   │   └── auth/
│   │   │       └── ProtectedRoute.jsx  # Route protection
│   │   ├── context/             # React Context
│   │   │   ├── AuthContext.jsx  # Authentication state
│   │   │   ├── SocketContext.jsx # Socket connection
│   │   │   └── ThemeContext.jsx  # Theme state
│   │   ├── pages/               # Page components
│   │   │   ├── Landing.jsx      # Landing page
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Problems.jsx     # Problem list
│   │   │   ├── ProblemSolve/    # Problem solving page
│   │   │   │   ├── index.jsx
│   │   │   │   └── components/
│   │   │   ├── Rooms.jsx        # Room list
│   │   │   ├── Room/            # Room page
│   │   │   │   ├── index.jsx
│   │   │   │   └── components/
│   │   │   ├── Sessions.jsx     # Session list
│   │   │   ├── SessionDetail.jsx # Session details
│   │   │   ├── Mentors.jsx      # Mentor list
│   │   │   ├── Profile.jsx      # User profile
│   │   │   ├── Settings.jsx     # User settings
│   │   │   ├── Submissions.jsx  # Submission history
│   │   │   └── CreateProblem.jsx # Problem creation (admin)
│   │   ├── services/            # API services
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── authService.js   # Auth API calls
│   │   │   ├── problemService.js # Problem API calls
│   │   │   ├── roomService.js    # Room API calls
│   │   │   └── ...
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env                     # Environment variables
│
└── README.md                     # This file
```

---

## 🛠 Technology Stack

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | 18+ |
| **Express.js** | Web framework | 5.1.0 |
| **MongoDB** | Database | 8.x |
| **Mongoose** | ODM | 8.19.4 |
| **Socket.io** | Real-time communication | 4.8.1 |
| **JWT** | Authentication | 9.0.2 |
| **bcryptjs** | Password hashing | 3.0.3 |
| **Docker** | Code execution sandbox | 4.0.0 |
| **Helmet** | Security headers | 7.1.0 |
| **Morgan** | HTTP logging | 1.10.1 |
| **express-rate-limit** | Rate limiting | 7.1.0 |

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI library | 19.2.0 |
| **Vite** | Build tool | 7.2.2 |
| **React Router** | Routing | 7.9.6 |
| **Monaco Editor** | Code editor | 4.7.0 |
| **Socket.io Client** | WebSocket client | 4.8.1 |
| **Axios** | HTTP client | 1.13.2 |
| **TailwindCSS** | Styling | 4.1.18 |
| **xterm.js** | Terminal emulator | 5.5.0 |

### DevOps & Tools
- **Git** – Version control
- **ESLint** – Code linting
- **Nodemon** – Development server
- **Docker** – Containerization

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Endpoints

#### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth | Request Body | Response |
|--------|----------|-------------|------|--------------|----------|
| POST | `/register` | Register new user | ❌ | `{ username, email, password, role? }` | `{ token, user }` |
| POST | `/login` | Login user | ❌ | `{ email, password }` | `{ token, user }` |
| GET | `/me` | Get current user | ✅ | - | `{ user }` |
| PUT | `/profile` | Update profile | ✅ | `{ avatar?, bio? }` | `{ user }` |
| PUT | `/mentor-profile` | Update mentor profile | ✅ | `{ specializations?, hourlyRate? }` | `{ user }` |

#### 👥 Users (`/api/users`)

| Method | Endpoint | Description | Auth | Response |
|--------|----------|-------------|------|----------|
| GET | `/:id` | Get user profile | ✅ | `{ user }` |
| GET | `/:id/stats` | Get user statistics | ✅ | `{ stats, achievementCount }` |
| GET | `/search?q=<query>` | Search users | ✅ | `{ users[] }` |

#### 📝 Problems (`/api/problems`)

| Method | Endpoint | Description | Auth | Role | Request Body |
|--------|----------|-------------|------|------|--------------|
| GET | `/` | List all problems | ✅ | - | - |
| GET | `/:id` | Get problem details | ✅ | - | - |
| POST | `/` | Create problem | ✅ | Admin/Mentor | `{ title, description, difficulty, testCases, languageSupport }` |
| PUT | `/:id` | Update problem | ✅ | Admin/Mentor | `{ ...fields }` |
| DELETE | `/:id` | Delete problem | ✅ | Admin | - |

#### 💾 Submissions (`/api/submissions`)

| Method | Endpoint | Description | Auth | Request Body | Response |
|--------|----------|-------------|------|--------------|----------|
| POST | `/submit` | Submit solution | ✅ | `{ problemId, code, language }` | `{ submission, results, status }` |
| POST | `/execute` | Execute code (no submit) | ✅ | `{ code, language, input? }` | `{ output, error }` |
| GET | `/user/:userId` | Get user submissions | ✅ | - | `{ submissions[] }` |
| GET | `/problem/:problemId` | Get problem submissions | ✅ | - | `{ submissions[] }` |
| GET | `/:id` | Get submission details | ✅ | - | `{ submission }` |

#### 🏠 Rooms (`/api/rooms`)

| Method | Endpoint | Description | Auth | Request Body |
|--------|----------|-------------|------|--------------|
| POST | `/` | Create room | ✅ | `{ name?, language?, maxUsers? }` |
| GET | `/:roomId` | Get room details | ✅ | - |
| POST | `/:roomId/join` | Join room | ✅ | - |
| POST | `/:roomId/leave` | Leave room | ✅ | - |
| PUT | `/:roomId/files` | Update file content | ✅ | `{ path, content }` |
| POST | `/:roomId/permissions/user` | Toggle user edit permission | ✅ | `{ userId, canEdit }` |
| PUT | `/:roomId/permissions` | Update room permissions | ✅ | `{ allowChat?, allowExecution?, allowScreenShare? }` |
| POST | `/:roomId/recording/start` | Start recording | ✅ | - |
| POST | `/:roomId/recording/stop` | Stop recording | ✅ | `{ recordingUrl }` |
| PUT | `/:roomId/whiteboard` | Update whiteboard | ✅ | `{ data }` |
| POST | `/:roomId/close` | Close room | ✅ | - |

#### 📅 Sessions (`/api/sessions`)

| Method | Endpoint | Description | Auth | Request Body |
|--------|----------|-------------|------|--------------|
| POST | `/` | Create session | ✅ | `{ mentorId, studentId, title, scheduledAt, duration? }` |
| GET | `/my-sessions` | Get user sessions | ✅ | - |
| GET | `/:id` | Get session details | ✅ | - |
| POST | `/:id/complete` | Complete session | ✅ | `{ notes?, rating? }` |
| POST | `/:id/cancel` | Cancel session | ✅ | - |
| POST | `/:id/status` | Update session status | ✅ | `{ status }` |
| GET | `/mentors/available` | Get available mentors | ✅ | - |

#### 🏆 Achievements (`/api/achievements`)

| Method | Endpoint | Description | Auth | Response |
|--------|----------|-------------|------|----------|
| GET | `/user/:userId` | Get user achievements | ✅ | `{ achievements[] }` |
| POST | `/check` | Check and award achievements | ✅ | `{ newAchievements[] }` |

---

## 💾 Database Schema

### User Schema
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['student', 'mentor', 'admin']),
  avatar: String,
  bio: String,
  mentorProfile: {
    specializations: [String],
    hourlyRate: Number,
    rating: Number,
    totalSessions: Number
  },
  stats: {
    problemsSolved: Number,
    totalSubmissions: Number,
    currentStreak: Number,
    longestStreak: Number,
    lastActiveDate: Date
  },
  achievements: [ObjectId] (ref: Achievement),
  createdAt: Date,
  updatedAt: Date
}
```

### Problem Schema
```javascript
{
  title: String (required),
  description: String (required),
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  testCases: [{
    input: String,
    output: String,
    hidden: Boolean
  }],
  languageSupport: [{
    language: String,
    starterCode: String,
    driverCode: String
  }],
  totalSubmissions: Number,
  acceptedSubmissions: Number,
  createdAt: Date
}
```

### Submission Schema
```javascript
{
  userId: ObjectId (ref: User),
  problemId: ObjectId (ref: Problem),
  code: String,
  language: String,
  status: String (enum: ['pending', 'accepted', 'wrong_answer', 'error']),
  output: String,
  testsPassed: Number,
  testsTotal: Number,
  createdAt: Date
}
```

### Room Schema
```javascript
{
  roomId: String (unique),
  name: String,
  createdBy: ObjectId (ref: User),
  language: String,
  maxUsers: Number,
  files: [{
    path: String,
    content: String,
    language: String
  }],
  participants: [{
    userId: ObjectId,
    username: String,
    role: String,
    canEdit: Boolean,
    joinedAt: Date
  }],
  sessionId: ObjectId (ref: Session),
  permissions: {
    allowChat: Boolean,
    allowExecution: Boolean,
    allowScreenShare: Boolean
  },
  recording: {
    enabled: Boolean,
    url: String,
    startedAt: Date,
    duration: Number
  },
  whiteboard: {
    enabled: Boolean,
    data: Mixed
  },
  status: String (enum: ['active', 'closed']),
  createdAt: Date
}
```

### Session Schema
```javascript
{
  mentorId: ObjectId (ref: User),
  studentId: ObjectId (ref: User),
  roomId: ObjectId (ref: Room),
  title: String,
  scheduledAt: Date,
  duration: Number,
  status: String (enum: ['pending', 'scheduled', 'completed', 'cancelled']),
  notes: String,
  rating: Number (1-5),
  createdAt: Date
}
```

### Achievement Schema
```javascript
{
  userId: ObjectId (ref: User),
  type: String (enum: [
    'first_problem',
    'problems_10',
    'problems_50',
    'streak_7',
    'streak_30',
    'first_session',
    'mentor_5',
    'perfect_score'
  ]),
  title: String,
  description: String,
  icon: String,
  unlockedAt: Date,
  createdAt: Date
}
```

---

## 🔌 WebSocket Events

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `{ roomId, userId, username }` | Join a room |
| `code-change` | `{ roomId, userId, code }` | Broadcast code changes |
| `chat-message` | `{ roomId, userId, username, message }` | Send chat message |
| `cursor-change` | `{ roomId, userId, username, position }` | Update cursor position |
| `whiteboard-draw` | `{ roomId, x0, y0, x1, y1, color, width }` | Draw on whiteboard |
| `whiteboard-clear` | `{ roomId }` | Clear whiteboard |
| `request-access` | `{ roomId, userId, username }` | Request edit access |
| `grant-access` | `{ roomId, userId }` | Grant edit access |
| `revoke-access` | `{ roomId, userId }` | Revoke edit access |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `user-joined` | `{ userId, username, role }` | User joined room |
| `user-left` | `{ userId, username }` | User left room |
| `code-change` | `{ userId, code }` | Code updated by user |
| `chat-message` | `{ userId, username, message }` | New chat message |
| `cursor-change` | `{ userId, username, position }` | Cursor position updated |
| `whiteboard-draw` | `{ x0, y0, x1, y1, color, width }` | Whiteboard drawing |
| `whiteboard-clear` | - | Whiteboard cleared |
| `access-granted` | `{ userId }` | Edit access granted |
| `access-revoked` | `{ userId }` | Edit access revoked |
| `request-access` | `{ userId, username }` | Access request received |
| `error` | `{ message }` | Error occurred |

---

## ⚙️ How It Works

### 1. User Authentication Flow
```
User → Register/Login → Backend validates → JWT token generated → 
Token stored in frontend context → Included in subsequent API requests
```

### 2. Problem Solving Flow
```
User selects problem → Fetches problem details → 
Writes code in Monaco editor → Submits solution → 
Backend executes code in Docker container → 
Runs test cases → Returns results → 
Updates user stats and achievements
```

### 3. Real-Time Collaboration Flow
```
User creates/joins room → WebSocket connection established → 
User types code → emit('code-change') → 
Server broadcasts to all participants → 
Other users' editors update in real-time
```

### 4. Code Execution Flow
```
User submits code → Backend receives request → 
Creates Docker container → Copies code to container → 
Executes with timeout and memory limits → 
Captures output/errors → Destroys container → 
Returns results to user
```

### 5. Achievement System Flow
```
User completes action (solve problem, streak, etc.) → 
Backend checks achievement criteria → 
Awards new achievements if criteria met → 
Updates user's achievement list → 
Notifies user of new achievements
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6+ ([Download](https://www.mongodb.com/try/download/community))
- **Docker** ([Download](https://www.docker.com/get-started))
- **Git** ([Download](https://git-scm.com/))

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd mp
```

2. **Backend Setup**
```bash
cd minor_backend
npm install
```

3. **Frontend Setup**
```bash
cd ../minor_frontend
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables
Create `.env` file in `minor_backend/`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/coding-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Docker (for code execution)
DOCKER_HOST=unix:///var/run/docker.sock

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend Environment Variables
Create `.env` file in `minor_frontend/`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd minor_backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd minor_frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

**Terminal 3 - MongoDB:**
```bash
mongod
```

### Production Mode

**Backend:**
```bash
cd minor_backend
npm start
```

**Frontend:**
```bash
cd minor_frontend
npm run build
npm run preview
```

---

## 🧪 Testing

### Backend Testing
```bash
cd minor_backend
npm test
```

### Frontend Testing
```bash
cd minor_frontend
npm run lint
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Problem browsing and filtering
- [ ] Code submission and execution
- [ ] Room creation and joining
- [ ] Real-time code synchronization
- [ ] Chat functionality
- [ ] Whiteboard drawing
- [ ] Session scheduling
- [ ] Achievement unlocking
- [ ] Profile updates

---

## 🐛 Problems Faced & Solutions

### 1. **Real-Time Code Synchronization Lag**
**Problem:** Code changes were delayed when multiple users edited simultaneously.

**Solution:** 
- Implemented debouncing on client side
- Used operational transformation for conflict resolution
- Optimized WebSocket event handling

### 2. **Docker Container Security**
**Problem:** Malicious code could escape containers or consume excessive resources.

**Solution:**
- Implemented strict resource limits (CPU, memory, time)
- Used read-only file systems
- Disabled network access in containers
- Implemented sandboxing with seccomp profiles

### 3. **MongoDB Connection Pooling**
**Problem:** Database connections exhausted under high load.

**Solution:**
- Configured connection pooling with Mongoose
- Implemented connection retry logic
- Added database connection monitoring

### 4. **JWT Token Expiration Handling**
**Problem:** Users were logged out unexpectedly.

**Solution:**
- Implemented token refresh mechanism
- Added automatic token renewal before expiration
- Improved error handling for expired tokens

### 5. **WebSocket Reconnection**
**Problem:** Socket connections dropped frequently.

**Solution:**
- Implemented automatic reconnection with exponential backoff
- Added connection state management
- Improved error handling and user notifications

### 6. **Code Editor Performance**
**Problem:** Monaco Editor lagged with large files.

**Solution:**
- Implemented virtualization for large files
- Added syntax highlighting optimization
- Lazy loaded editor features

### 7. **Whiteboard Synchronization**
**Problem:** Drawing events flooded the server.

**Solution:**
- Implemented event batching
- Added throttling on client side
- Optimized drawing data structure

---

## 🔮 Future Enhancements

### Short-term
- [ ] Video/audio calling integration
- [ ] Screen sharing functionality
- [ ] Code review and commenting system
- [ ] Problem difficulty recommendations
- [ ] Advanced analytics dashboard

### Medium-term
- [ ] AI-powered code suggestions
- [ ] Automated code quality analysis
- [ ] Contest and hackathon support
- [ ] Mobile application (React Native)
- [ ] Integration with GitHub/GitLab

### Long-term
- [ ] Multi-language support (i18n)
- [ ] Enterprise features (teams, organizations)
- [ ] Advanced mentorship matching algorithm
- [ ] Blockchain-based certification system
- [ ] Integration with job platforms

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Write tests for new functionality

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Real-Time Coding Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact & Support

- **Project Repository:** [GitHub](https://github.com/your-repo)
- **Documentation:** [Wiki](https://github.com/your-repo/wiki)
- **Issue Tracker:** [GitHub Issues](https://github.com/your-repo/issues)
- **Email:** support@codingplatform.com

---

## 🙏 Acknowledgments

- **Monaco Editor** – Microsoft's excellent code editor
- **Socket.io** – Real-time communication library
- **Docker** – Containerization platform
- **MongoDB** – NoSQL database
- **React** – UI library
- **Express.js** – Web framework

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the Development Team

</div>
