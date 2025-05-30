import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../dashboard.css';

const OwnerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [accountingData, setAccountingData] = useState([]);
  const [language, setLanguage] = useState('english');
  const navigate = useNavigate();

  const translations = {
    english: {
      welcome: 'Welcome to ACCDPU',
      profile: 'Company Profile',
      username: 'Owner Name',
      email: 'Email',
      logout: 'Logout',
      dashboard: 'Dashboard',
      reports: 'Financial Reports',
      accounting: 'Accounting',
      employees: 'Employees',
      transactions: 'Transactions',
      revenue: 'Revenue',
      expenses: 'Expenses',
      profit: 'Profit',
      recentTransactions: 'Recent Transactions',
      addTransaction: 'Add Transaction'
    },
    arabic: {
      welcome: 'مرحبًا بكم في ACCDPU',
      profile: 'ملف الشركة',
      username: 'اسم المالك',
      email: 'البريد الإلكتروني',
      logout: 'تسجيل الخروج',
      dashboard: 'لوحة التحكم',
      reports: 'التقارير المالية',
      accounting: 'المحاسبة',
      employees: 'الموظفون',
      transactions: 'المعاملات',
      revenue: 'الإيرادات',
      expenses: 'المصروفات',
      profit: 'الربح',
      recentTransactions: 'المعاملات الأخيرة',
      addTransaction: 'إضافة معاملة'
    },
    sorani: {
      welcome: 'بەخێربێن بۆ ACCDPU',
      profile: 'پرۆفایلی کۆمپانیا',
      username: 'ناوی خاوەن',
      email: 'ئیمەیل',
      logout: 'چوونەدەرەوە',
      dashboard: 'داشبۆرد',
      reports: 'ڕاپۆرتە داراییەکان',
      accounting: 'ژمێریاری',
      employees: 'کارمەندەکان',
      transactions: 'مامەڵەکان',
      revenue: 'داهات',
      expenses: 'خەرجی',
      profit: 'قازانج',
      recentTransactions: 'مامەڵەکانی دوایین',
      addTransaction: 'مامەڵەی زیاد بکە'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        // زانیاریێن بکارهێنەری
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // زانیاریێن محاسەبی
        const querySnapshot = await getDocs(collection(db, "transactions"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
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

  const totals = calculateTotals();
  const t = translations[language];

  return (
    <div className="dashboard-container owner-dashboard">
      <div className="sidebar">
        <h2>ACCDPU</h2>
        <div className="language-selector">
          <button onClick={() => setLanguage('english')}>EN</button>
          <button onClick={() => setLanguage('arabic')}>AR</button>
          <button onClick={() => setLanguage('sorani')}>KU</button>
        </div>
        <nav>
          <button className="active">{t.dashboard}</button>
          <button>{t.accounting}</button>
          <button>{t.reports}</button>
          <button>{t.employees}</button>
        </nav>
      </div>
      
      <div className="main-content">
        <header>
          <h1>{t.welcome}</h1>
          <button onClick={handleLogout} className="logout-button">
            {t.logout}
          </button>
        </header>
        
        {userData && (
          <div className="profile-card">
            <h2>{t.profile}</h2>
            <p><strong>{t.username}:</strong> {userData.username}</p>
            <p><strong>{t.email}:</strong> {userData.email}</p>
            <p><strong>{t.role}:</strong> {userData.role === 'owner' ? t.owner : t.accountant}</p>
          </div>
        )}
        
        <div className="dashboard-cards">
          <div className="card revenue-card">
            <h3>{t.revenue}</h3>
            <p>${totals.revenue.toLocaleString()}</p>
          </div>
          <div className="card expenses-card">
            <h3>{t.expenses}</h3>
            <p>${totals.expenses.toLocaleString()}</p>
          </div>
          <div className="card profit-card">
            <h3>{t.profit}</h3>
            <p>${totals.profit.toLocaleString()}</p>
          </div>
        </div>

        <div className="accounting-section">
          <div className="section-header">
            <h2>{t.recentTransactions}</h2>
            <button className="add-button">{t.addTransaction}</button>
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
                    <td>${transaction.amount}</td>
                    <td className={`type-${transaction.type}`}>
                      {transaction.type === 'revenue' ? t.revenue : t.expenses}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;