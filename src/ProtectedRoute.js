import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  // While still loading the auth state, render a loading indicator
  if (loading) {
    return <div className="loading-screen">Please wait, loading your data...</div>;
  }

  return currentUser ? children : null;
};

export default ProtectedRoute;