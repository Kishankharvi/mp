# Real-Time Code Execution & Mentoring Platform

A comprehensive full-stack MERN application for collaborative coding, real-time code execution, and mentoring with gamification features.

![Platform](https://img.shields.io/badge/Platform-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Development-orange)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [System Design](#system-design)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

A modern, scalable platform that combines:
- **Real-time collaborative coding** with live synchronization
- **Code execution** in multiple programming languages
- **Mentoring system** for knowledge sharing
- **Problem solving** with automated test case validation
- **Gamification** with achievements and streak tracking

### Key Highlights
- 🚀 **RESTful API endpoints**
- 💬 **Real-time collaboration** via Socket.io
- 🎨 **Modern UI** with Monaco code editor
- 🏆 **Achievement system**
- 👨‍🏫 **Mentoring platform** with booking and ratings
- 📊 **Progress tracking** with stats and streaks

## ✨ Features

### For Students
- ✅ Solve coding problems with instant feedback
- ✅ Real-time collaborative coding rooms
- ✅ Book mentoring sessions with experts
- ✅ Track progress with achievements and streaks
- ✅ View submission history and stats

### For Mentors
- ✅ Create and manage coding problems
- ✅ Host mentoring sessions
- ✅ Track student progress
- ✅ Earn ratings and build reputation
- ✅ Set hourly rates and specializations

### For Admins
- ✅ Full platform management
- ✅ User and content moderation
- ✅ Analytics and reporting
- ✅ System configuration

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │ Monaco Editor│  │  Socket.io   │      │
│  │  (Tailwind)  │  │   (Code)     │  │   Client     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     CORS     │  │ Rate Limiter │  │    Helmet    │      │
│  │   Middleware │  │  Protection  │  │   Security   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     REST     │  │  Socket.io   │  │     JWT      │      │
│  │     API      │  │   WebSocket  │  │     Auth     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Services   │  │  Validation  │  │ Achievement  │      │
│  │   (Logic)    │  │   (Rules)    │  │   System     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Access Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Mongoose   │  │              │  │   Piston     │      │
│  │     ODM      │  │              │  │  Code Exec   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Storage Layer                         │
│  ┌──────────────┐                                            │
│  │   MongoDB    │                                            │
│  │  (Database)  │                                            │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Frontend (React)
├── Pages
│   ├── Authentication (Login, Register)
│   ├── Dashboard
│   ├── Problems (List, Solve)
│   ├── Collaboration (Rooms, Room)
│   ├── Mentoring (Sessions, Mentors)
│   └── User (Profile, Settings)
│
├── Context Providers
│   ├── AuthContext (User state)
│   └── SocketContext (Real-time)
│
└── Services
    ├── API Layer (axios)
    └── Business Logic

Backend (Node.js/Express)
├── Routes
│   ├── Authentication
│   ├── Users
│   ├── Problems
│   ├── Submissions
│   ├── Rooms
│   ├── Sessions
│   └── Achievements
│
├── Services
│   ├── Achievement Service
│   ├── Execution Service
│   ├── Session Service
│   └── Room Service
│
├── Models
│   ├── User
│   ├── Room
│   ├── Problem
│   ├── Submission
│   ├── Session
│   └── Achievement
│
└── Middleware
    ├── Authentication
    ├── Authorization
    ├── Rate Limiting
    └── Error Handling
```

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Monaco Editor | Code Editor |
| Socket.io Client | Real-time |
| Axios | HTTP Client |
| React Router | Routing |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| Socket.io | WebSocket |
| JWT | Authentication |
| bcrypt | Password Hashing |

### External Services
| Service | Purpose |
|---------|---------|
| Piston API | Code Execution |
| MongoDB Atlas | Database Hosting (optional) |

## 📊 System Design

### Data Flow

#### 1. Authentication Flow
```
User → Login Page → POST /api/auth/login
                    ↓
              Validate Credentials
                    ↓
              Generate JWT Token
                    ↓
              Store in localStorage
                    ↓
              Redirect to Dashboard
```

#### 2. Code Execution Flow
```
User → Write Code → Submit
                    ↓
              POST /api/submissions/submit
                    ↓
              Validate Input
                    ↓
              Send to Piston API
                    ↓
              Run Test Cases
                    ↓
              Update Stats & Achievements
                    ↓
              Return Results
```

#### 3. Real-Time Collaboration Flow
```
User A → Join Room → Socket: join-room
                      ↓
                 Add to Room
                      ↓
                 Broadcast: user-joined
                      ↓
User A → Edit Code → Socket: code-change
                      ↓
                 Broadcast to Room
                      ↓
User B ← Receive Update ← Socket: code-change
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │────────▶│ Achievement │         │   Problem   │
│             │ 1    N  │             │         │             │
│ - username  │         │ - type      │         │ - title     │
│ - email     │         │ - title     │         │ - difficulty│
│ - role      │         │ - icon      │         │ - testCases │
│ - stats     │         └─────────────┘         └─────────────┘
└─────────────┘                                        │
      │ 1                                              │ 1
      │                                                │
      │ N                                              │ N
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Submission  │────────▶│   Problem   │         │   Session   │
│             │ N    1  │             │         │             │
│ - code      │         │             │         │ - mentorId  │
│ - language  │         │             │         │ - studentId │
│ - status    │         │             │         │ - rating    │
└─────────────┘         └─────────────┘         └─────────────┘
      │ N                                              │ 1
      │                                                │
      │ 1                                              │ 1
┌─────────────┐                                 ┌─────────────┐
│    User     │                                 │    Room     │
│             │                                 │             │
│             │────────────────────────────────▶│ - roomId    │
│             │ 1                           N   │ - files     │
│             │                                 │ - participants
└─────────────┘                                 └─────────────┘
```

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token:
```
Authorization: Bearer <token>
```

## 🚀 Installation

### Prerequisites
- Node.js 16.x or higher
- MongoDB 5.x or higher
- npm or yarn
- Git

### Clone Repository
```bash
git clone <repository-url>
cd minor
```

### Backend Setup
```bash
cd minor_backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/codeplatform
JWT_SECRET=your_secret_key
PISTON_API=https://emkc.org/api/v2/piston/execute
CORS_ORIGIN=http://localhost:5173
EOF

# Start server
npm run dev
```

### Frontend Setup
```bash
cd minor_frontend
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
EOF

# Start development server
npm run dev
```

### Access Application
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 💻 Usage

### For Students
1. **Register** as a student
2. **Browse problems** and filter by difficulty
3. **Solve problems** using Monaco editor
4. **Submit solutions** and view test results
5. **Track progress** on dashboard
6. **Join rooms** for collaboration
7. **Book sessions** with mentors

### For Mentors
1. **Register** as a mentor
2. **Set up profile** with specializations and rate
3. **Create problems** for students
4. **Host sessions** and help students
5. **Earn ratings** and build reputation

### For Admins
1. **Manage users** and content
2. **Monitor platform** activity
3. **Configure** system settings

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Piston API** - Code execution service
- **MongoDB** - Database platform
- **Socket.io** - Real-time engine
- **Monaco Editor** - Code editor
- **Tailwind CSS** - Styling framework
- **React Team** - UI library
