import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './components/Login';
import Register from './components/Register';

// Dashboard + other features
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Challenges from './components/Challenges';
import WellnessDuo from './components/WellnessDuo';
import Profile from './components/Profile';
import FAQ from './components/FAQ';
import Index from './components/Index';
import Onboarding from './components/Onboarding';
import Persona from './components/Persona';
import ChatbotPage from './components/ChatbotPage';

import './index.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/persona" element={<Persona />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenges" 
            element={
              <ProtectedRoute>
                <Challenges />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wellness-duo" 
            element={
              <ProtectedRoute>
                <WellnessDuo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
         />


          {/* Catch-all: if unknown route, redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;