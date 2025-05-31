import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Dashboard/Auth/Login';
import Register from './components/Dashboard/Auth/register';
import ForgotPassword from './components/Dashboard/Auth/ForgotPassword';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/Dashboard/Auth/ProtectedRoute';
import './styles/App.css';

function AppRoutes() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        {/* Unrecognized paths redirect to Dashboard */}
        <Route path="*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
