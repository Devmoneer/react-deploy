import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return currentUser ? children : null;
};

export default ProtectedRoute;