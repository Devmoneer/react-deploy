import React from 'react';
import { FiPieChart, FiDollarSign, FiFileText, FiUser, FiSettings,  } from 'react-icons/fi';
import { FaUserShield, FaUserTie } from 'react-icons/fa';
import { translations } from './utils/translations';

const Sidebar = ({ userData, language, setLanguage, activeTab, setActiveTab }) => {
  const t = translations[language];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>ACCDPU</h2>
        <p className="version-text">Version App 0.0.1</p>
        <div className="language-selector">
          <button 
            onClick={() => setLanguage('english')} 
            className={language === 'english' ? 'active' : ''}
          >EN</button>
          <button 
            onClick={() => setLanguage('arabic')} 
            className={language === 'arabic' ? 'active' : ''}
          >AR</button>
          <button 
            onClick={() => setLanguage('sorani')} 
            className={language === 'sorani' ? 'active' : ''}
          >KU</button>
        </div>
      </div>
      
      <nav>
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          <FiPieChart /> {t.dashboard}
        </button>
        <button 
          className={activeTab === 'accounting' ? 'active' : ''} 
          onClick={() => setActiveTab('accounting')}
        >
          <FiDollarSign /> {t.accounting}
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''} 
          onClick={() => setActiveTab('reports')}
        >
          <FiFileText /> {t.reports}
        </button>
        
        {userData?.role === 'owner' && (
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            <FiUser /> {t.manageUsers}
          </button>
        )}
      </nav>
      
      <div className="user-profile">
        <div className="user-info">
          <div className="user-avatar">
            {userData?.role === 'owner' ? <FaUserShield /> : <FaUserTie />}
          </div>
          <div>
            <div className="username">{userData?.username || t.loading}</div>
            <div className="user-role">
              {t.role}: {userData ? (userData.role === 'owner' ? t.owner : t.accountant) : t.loading}
            </div>
          </div>
        </div>
        <button className="settings-button">
          <FiSettings />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;