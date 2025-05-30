import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../dashboard.css';
import { FiPieChart, FiDollarSign, FiFileText, FiSettings, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';
import { FaUserShield, FaUserTie } from 'react-icons/fa';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [accountingData, setAccountingData] = useState([]);
  const [language, setLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [newRole, setNewRole] = useState('');
  const navigate = useNavigate();

  const translations = {
    english: {
      welcome: 'Welcome to ACCDPU',
      profile: 'Company Profile',
      username: 'Name',
      email: 'Email',
      logout: 'Logout',
      dashboard: 'Dashboard',
      reports: 'Financial Reports',
      accounting: 'Accounting',
      transactions: 'Transactions',
      revenue: 'Revenue',
      expenses: 'Expenses',
      profit: 'Profit',
      recentTransactions: 'Recent Transactions',
      addTransaction: 'Add Transaction',
      role: 'Role',
      owner: 'Company Owner',
      accountant: 'Accountant',
      settings: 'Settings',
      changeRole: 'Change Role',
      save: 'Save',
      cancel: 'Cancel',
      allTransactions: 'All Transactions',
      cashFlow: 'Cash Flow',
      balanceSheet: 'Balance Sheet',
      incomeStatement: 'Income Statement',
      taxReport: 'Tax Report',
      manageUsers: 'Manage Users'
    },
    arabic: {
      welcome: 'مرحبًا بكم في ACCDPU',
      profile: 'ملف الشركة',
      username: 'الاسم',
      email: 'البريد الإلكتروني',
      logout: 'تسجيل الخروج',
      dashboard: 'لوحة التحكم',
      reports: 'التقارير المالية',
      accounting: 'المحاسبة',
      transactions: 'المعاملات',
      revenue: 'الإيرادات',
      expenses: 'المصروفات',
      profit: 'الربح',
      recentTransactions: 'المعاملات الأخيرة',
      addTransaction: 'إضافة معاملة',
      role: 'الدور',
      owner: 'مالك الشركة',
      accountant: 'محاسب',
      settings: 'الإعدادات',
      changeRole: 'تغيير الدور',
      save: 'حفظ',
      cancel: 'إلغاء',
      allTransactions: 'جميع المعاملات',
      cashFlow: 'تدفق النقدي',
      balanceSheet: 'الميزانية العمومية',
      incomeStatement: 'بيان الدخل',
      taxReport: 'تقرير الضرائب',
      manageUsers: 'إدارة المستخدمين'
    },
    sorani: {
      welcome: 'بەخێربێن بۆ ACCDPU',
      profile: 'پرۆفایلی کۆمپانیا',
      username: 'ناو',
      email: 'ئیمەیل',
      logout: 'چوونەدەرەوە',
      dashboard: 'داشبۆرد',
      reports: 'ڕاپۆرتە داراییەکان',
      accounting: 'ژمێریاری',
      transactions: 'مامەڵەکان',
      revenue: 'داهات',
      expenses: 'خەرجی',
      profit: 'قازانج',
      recentTransactions: 'مامەڵەکانی دوایین',
      addTransaction: 'مامەڵەی زیاد بکە',
      role: 'ڕۆڵ',
      owner: 'خاوەن کۆمپانیا',
      accountant: 'ژمێریار',
      settings: 'ڕێکخستنەکان',
      changeRole: 'گۆڕینی ڕۆڵ',
      save: 'پاشەکەوت',
      cancel: 'پاشگەزبوونەوە',
      allTransactions: 'هەموو مامەڵەکان',
      cashFlow: 'ڕێڕەوی پارە',
      balanceSheet: 'باڵانسی پارە',
      incomeStatement: 'ڕاپۆرتی داهات',
      taxReport: 'ڕاپۆرتی باج',
      manageUsers: 'بەڕێوەبردنی بەکارهێنەران'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setNewRole(userDoc.data().role);
        }
        const querySnapshot = await getDocs(collection(db, "transactions"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAccountingData(data);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotals = () => {
    const revenue = accountingData.reduce((sum, item) => item.type === 'revenue' ? sum + item.amount : sum, 0);
    const expenses = accountingData.reduce((sum, item) => item.type === 'expense' ? sum + item.amount : sum, 0);
    const profit = revenue - expenses;
    return { revenue, expenses, profit };
  };

  const handleSaveRole = async () => {
    // In a real app, you would update the role in Firebase here
    setUserData({ ...userData, role: newRole });
    setShowSettings(false);
  };

  const totals = calculateTotals();
  const t = translations[language];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-cards">
              <div className="card revenue-card">
                <h3>{t.revenue}</h3>
                <p>${totals.revenue.toLocaleString()}</p>
                <div className="card-icon">
                  <FiDollarSign />
                </div>
              </div>
              <div className="card expenses-card">
                <h3>{t.expenses}</h3>
                <p>${totals.expenses.toLocaleString()}</p>
                <div className="card-icon">
                  <FiDollarSign />
                </div>
              </div>
              <div className="card profit-card">
                <h3>{t.profit}</h3>
                <p>${totals.profit.toLocaleString()}</p>
                <div className="card-icon">
                  <FiDollarSign />
                </div>
              </div>
            </div>

            <div className="accounting-section">
              <div className="section-header">
                <h2>{t.recentTransactions}</h2>
                <button className="add-button">
                  <FiPlus /> {t.addTransaction}
                </button>
              </div>
              
              <div className="transactions-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountingData.slice(0, 5).map(transaction => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>{transaction.description}</td>
                        <td>${transaction.amount.toLocaleString()}</td>
                        <td className={`type-${transaction.type}`}>
                          {transaction.type === 'revenue' ? t.revenue : t.expenses}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'accounting':
        return (
          <div className="accounting-section">
            <h2>{t.allTransactions}</h2>
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {accountingData.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.description}</td>
                      <td>${transaction.amount.toLocaleString()}</td>
                      <td className={`type-${transaction.type}`}>
                        {transaction.type === 'revenue' ? t.revenue : t.expenses}
                      </td>
                      <td>{transaction.category || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="reports-section">
            <h2>{t.reports}</h2>
            <div className="report-cards">
              <div className="report-card">
                <h3>{t.cashFlow}</h3>
                <p>View cash flow statement</p>
              </div>
              <div className="report-card">
                <h3>{t.balanceSheet}</h3>
                <p>View balance sheet</p>
              </div>
              <div className="report-card">
                <h3>{t.incomeStatement}</h3>
                <p>View income statement</p>
              </div>
              <div className="report-card">
                <h3>{t.taxReport}</h3>
                <p>Generate tax report</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`dashboard-container ${userData && userData.role === 'owner' ? 'owner-dashboard' : 'accountant-dashboard'}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>ACCDPU</h2>
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
              <div className="username">{userData?.username}</div>
              <div className="user-role">
                {t.role}: {userData ? (userData.role === 'owner' ? t.owner : t.accountant) : ''}
              </div>
            </div>
          </div>
          <button 
            className="settings-button" 
            onClick={() => setShowSettings(!showSettings)}
          >
            <FiSettings />
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <header>
          <h1>{t.welcome}</h1>
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut /> {t.logout}
          </button>
        </header>
        
        {showSettings && (
          <div className="settings-modal">
            <div className="settings-content">
              <h3>{t.settings}</h3>
              <div className="setting-item">
                <label>{t.changeRole}</label>
                <select 
                  value={newRole} 
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="owner">{t.owner}</option>
                  <option value="accountant">{t.accountant}</option>
                </select>
              </div>
              <div className="settings-buttons">
                <button onClick={handleSaveRole} className="save-button">
                  {t.save}
                </button>
                <button onClick={() => setShowSettings(false)} className="cancel-button">
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {userData && (
          <div className="profile-card">
            <h2>{t.profile}</h2>
            <p><strong>{t.username}:</strong> {userData.username}</p>
            <p><strong>{t.email}:</strong> {userData.email}</p>
            <p><strong>{t.role}:</strong> {userData.role === 'owner' ? t.owner : t.accountant}</p>
          </div>
        )}
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;