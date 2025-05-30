import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const DashboardSelector = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          setError('User data not found');
          navigate('/login');
          return;
        }

        const userData = userDoc.data();
        const userRole = userData.role;

        if (userRole === 'owner') {
          navigate('/owner-dashboard');
        } else if (userRole === 'accountant') {
          navigate('/accountant-dashboard');
        } else {
          setError('Unknown user role');
          navigate('/login');
        }
      } catch (err) {
        setError(err.message);
        navigate('/error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default DashboardSelector;