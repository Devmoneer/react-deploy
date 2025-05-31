import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { fetchDashboardData } from './utils/api';
import '../../styles/dashboard.css'; 

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  const [accountingData, setAccountingData] = useState([]);
  const [users, setUsers] = useState([]);
  const [language, setLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        try {
          setDataLoading(true);
          const { userData, transactionsData, usersData } = await fetchDashboardData(currentUser);
          
          setUserData(userData);
          setAccountingData(transactionsData);
          if (userData.role === 'owner') {
            setUsers(usersData);
          }
        } catch (error) {
          setError('Error loading data');
          console.error(error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    loadData();
  }, [currentUser]);

  return (
    <div className={`dashboard-container ${userData?.role === 'owner' ? 'owner-dashboard' : 'accountant-dashboard'}`}>
      <Sidebar 
        userData={userData}
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <MainContent
        userData={userData}
        accountingData={accountingData}
        users={users}
        language={language}
        activeTab={activeTab}
        error={error}
        loading={loading}
        dataLoading={dataLoading}
        setError={setError}
        setLoading={setLoading}
        setAccountingData={setAccountingData}
        setUsers={setUsers}
      />
    </div>
  );
};

export default Dashboard;