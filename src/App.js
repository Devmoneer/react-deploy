import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Register from './components/register';
import ForgotPassword from './components/ForgotPassword';
import DashboardSelector from './components/DashboardSelector';
import OwnerDashboard from './components/OwnerDashboard';
import AccountantDashboard from './components/AccountantDashboard';
import './App.css';

// Simple Error Page Component
const ErrorPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>Error Occurred</h1>
      <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>
        Something went wrong. Please try again later.
      </p>
      <button 
        onClick={() => window.location.href = '/login'}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Return to Login
      </button>
    </div>
  );
};

// Auth Context Provider
const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return currentUser ? children : null;
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
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
            
            {/* Error Handling */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;