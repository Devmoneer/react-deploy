import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../dashboard.css';

const AccountantDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [accountingData, setAccountingData] = useState([]);
  const [language, setLanguage] = useState('english');
  const navigate = useNavigate();

  const translations = {
    english: {
      welcome: 'Accountant Dashboard',
      profile: 'Your Profile',
      username: 'Name',
      email: 'Email',
      logout: 'Logout',
      dashboard: 'Dashboard',
      reports: 'Reports',
      accounting: 'Accounting',
      transactions: 'Transactions',
      manage: 'Manage Transactions',
      add: 'Add New',
      approve: 'Approve Payments',
      role: 'Role',
      owner: 'Company Owner',
      accountant: 'Accountant'
    },
    arabic: {
      welcome: 'لوحة المحاسب',
      profile: 'ملفك الشخصي',
      username: 'الاسم',
      email: 'البريد الإلكتروني',
      logout: 'تسجيل الخروج',
      dashboard: 'لوحة التحكم',
      reports: 'التقارير',
      accounting: 'المحاسبة',
      transactions: 'المعاملات',
      manage: 'إدارة المعاملات',
      add: 'إضافة جديدة',
      approve: 'الموافقة على المدفوعات',
      role: 'الدور',
      owner: 'مالك الشركة',
      accountant: 'محاسب'
    },
    sorani: {
      welcome: 'داشبۆردی ژمێریار',
      profile: 'پرۆفایلی تۆ',
      username: 'ناو',
      email: 'ئیمەیل',
      logout: 'چوونەدەرەوە',
      dashboard: 'داشبۆرد',
      reports: 'ڕاپۆرتەکان',
      accounting: 'ژمێریاری',
      transactions: 'مامەڵەکان',
      manage: 'بەڕێوەبردنی مامەڵەکان',
      add: 'زیادکردنی نوێ',
      approve: 'پەسەندکردنی پارەدانەکان',
      role: 'ڕۆڵ',
      owner: 'خاوەن کۆمپانیا',
      accountant: 'ژمێریار'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

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

  const t = translations[language];

  return (
    <div className="dashboard-container accountant-dashboard">
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
          <div className="card">
            <h3>{t.transactions}</h3>
            <p>{accountingData.length}</p>
          </div>
          <div className="card">
            <h3>{t.manage}</h3>
            <button className="card-button">{t.add}</button>
          </div>
          <div className="card">
            <h3>{t.approve}</h3>
            <button className="card-button">View</button>
          </div>
        </div>

        <div className="accounting-section">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {accountingData.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div>
                  <h4>{transaction.description}</h4>
                  <p>{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className={`amount ${transaction.type}`}>
                  ${transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;