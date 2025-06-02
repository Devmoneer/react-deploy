import React from 'react';
import { FiPieChart, FiDollarSign, FiFileText, FiSettings } from 'react-icons/fi';
import { FaUserShield, FaUserTie } from 'react-icons/fa';
import { translations } from './utils/translations';

const Sidebar = ({
  userData,
  language,
  setLanguage,
  activeTab,
  setActiveTab,
}) => {
  const t = translations[language];
  const languageOptions = [
    { code: 'english', name: 'English' },
    { code: 'arabic', name: 'العربية' },
    { code: 'sorani', name: 'سۆرانی' },
    { code: 'badini', name: 'بادینی' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="images/favicon.png" alt="logopacc" className="logo-accdpu" width={80} />
        <p className="version-text">Version App 0.0.1</p>
        {/* Removed the top language selector */}
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
        <button 
          className={activeTab === 'settings' ? 'active' : ''} 
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings /> {t.settings}
        </button>
      </nav>
      
      <div className="language-selector">
        {languageOptions.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'active' : ''}
          >
            {lang.name}
          </button>
        ))}
      </div>
      
      <div className="user-profile">
        <div className="user-info">
          <div className="user-avatar">
            {userData?.role === 'owner' ? <FaUserShield /> : <FaUserTie />}
          </div>
          <div>
            <div className="username">
              {userData?.username || t.loading}
            </div>
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