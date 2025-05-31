import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import DashboardSection from './Sections/DashboardSection';
import AccountingSection from './Sections/AccountingSection';
import ReportsSection from './Sections/ReportsSection';
import UsersSection from './Sections/UsersSection';
import { translations } from './utils/translations';
import { FiLogOut } from 'react-icons/fi';

const MainContent = ({
  userData,
  accountingData,
  users,
  language,
  activeTab,
  error,
  loading,
  dataLoading,
  setError,
  setLoading,
  setAccountingData,
  setUsers
}) => {
  const t = translations[language];
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError(t.error);
    }
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardSection 
            accountingData={accountingData}
            language={language}
            dataLoading={dataLoading}
            setShowAddTransactionModal={() => {}}
          />
        );
      case 'accounting':
        return (
          <AccountingSection 
            accountingData={accountingData}
            language={language}
            dataLoading={dataLoading}
            setShowAddTransactionModal={() => {}}
          />
        );
      case 'reports':
        return <ReportsSection language={language} />;
      case 'users':
        return (
          <UsersSection 
            users={users}
            userData={userData}
            language={language}
            dataLoading={dataLoading}
            setShowAddUserModal={() => {}}
            handleDeleteUser={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-content">
      <header>
        <h1>
          {userData ? (
            userData.role === 'owner'
              ? t.ownerWelcome
              : t.accountantWelcome
          ) : t.welcome}
        </h1>
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut /> {t.logout}
        </button>
      </header>
      
      {error && <div className="error-message">{error}</div>}
      
      {userData && (
        <div className="profile-card">
          <h2>{t.profile}</h2>
          <p><strong>{t.username}:</strong> {userData.username}</p>
          <p><strong>{t.email}:</strong> {userData.email}</p>
          <p><strong>{t.role}:</strong> {userData.role === 'owner' ? t.owner : t.accountant}</p>
        </div>
      )}
      
      {renderSection()}
    </div>
  );
};

export default MainContent;