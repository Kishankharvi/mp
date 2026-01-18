import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemSolve from './pages/ProblemSolve';
import CreateProblem from './pages/CreateProblem';
import Submissions from './pages/Submissions';
import Rooms from './pages/Rooms';
import Room from './pages/Room';
import Sessions from './pages/Sessions';
import SessionDetail from './pages/SessionDetail';
import Mentors from './pages/Mentors';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Problems */}
                <Route path="/problems" element={<Problems />} />
                <Route path="/problems/create" element={<CreateProblem />} />
                <Route path="/problems/:id" element={<ProblemSolve />} />

                <Route path="/submissions" element={<Submissions />} />

                {/* Rooms */}
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/room/:roomId" element={<Room />} />

                {/* Sessions */}
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/sessions/:id" element={<SessionDetail />} />
                <Route path="/mentors" element={<Mentors />} />

                {/* Profile */}
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
