import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import Register from './components/register';
import ForgotPassword from './components/ForgotPassword';
import DashboardSelector from './components/DashboardSelector';
import OwnerDashboard from './components/OwnerDashboard';
import AccountantDashboard from './components/AccountantDashboard';
import ProtectedRoute from './ProtectedRoute';
import ErrorPage from './ErrorPage';
import './App.css';

function AppRoutes() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard-selector" element={
          <ProtectedRoute>
            <DashboardSelector />
          </ProtectedRoute>
        } />
        <Route path="/owner-dashboard" element={
          <ProtectedRoute>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/accountant-dashboard" element={
          <ProtectedRoute>
            <AccountantDashboard />
          </ProtectedRoute>
        } />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
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
