import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../dashboard.css';
import { FiPieChart, FiDollarSign, FiFileText, FiSettings, FiUser, FiLogOut, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { FaUserShield, FaUserTie } from 'react-icons/fa';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [accountingData, setAccountingData] = useState([]);
  const [users, setUsers] = useState([]);
  const [language, setLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    role: 'accountant',
    password: ''
  });
  const navigate = useNavigate();

  const translations = {
    english: {
      welcome: 'Welcome to ACCDPU',
      ownerWelcome: 'Owner Dashboard',
      accountantWelcome: 'Accountant Dashboard',
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
      manageUsers: 'Manage Users',
      addUser: 'Add User',
      delete: 'Delete',
      edit: 'Edit',
      usersList: 'Users List',
      password: 'Password',
      addNewUser: 'Add New Accountant',
      userAdded: 'User added successfully',
      userDeleted: 'User deleted successfully',
      userUpdated: 'User updated successfully'
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
      manageUsers: 'إدارة المستخدمين',
      addUser: 'إضافة مستخدم',
      delete: 'حذف',
      edit: 'تعديل',
      usersList: 'قائمة المستخدمين',
      password: 'كلمة المرور',
      addNewUser: 'إضافة محاسب جديد',
      userAdded: 'تمت إضافة المستخدم بنجاح',
      userDeleted: 'تم حذف المستخدم بنجاح',
      userUpdated: 'تم تحديث المستخدم بنجاح'
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
      manageUsers: 'بەڕێوەبردنی بەکارهێنەران',
      addUser: 'زیادکردنی بەکارهێنەر',
      delete: 'سڕینەوە',
      edit: 'دەستکاری',
      usersList: 'لیستی بەکارهێنەران',
      password: 'پاسوۆرد',
      addNewUser: 'زیادکردنی ژمێریاری نوێ',
      userAdded: 'بەکارهێنەر بە سەرکەوتوویی زیادکرا',
      userDeleted: 'بەکارهێنەر بە سەرکەوتوویی سڕایەوە',
      userUpdated: 'بەکارهێنەر بە سەرکەوتوویی نوێکرایەوە'
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
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAccountingData(data);

        if (userDoc.data().role === 'owner') {
          const usersQuery = query(collection(db, "users"), where("role", "==", "accountant"));
          const usersSnapshot = await getDocs(usersQuery);
          const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersData);
        }
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
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { role: newRole });
      setUserData({ ...userData, role: newRole });
      setShowSettings(false);
      alert(translations[language].userUpdated);
    } catch (error) {
      console.error("Error updating role: ", error);
    }
  };

  const handleAddUser = async () => {
    try {
      // In a real app, you would create the user with Firebase Auth first
      // then add to Firestore with the same UID
      await addDoc(collection(db, "users"), {
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        createdAt: new Date()
      });
      
      setUsers([...users, { ...newUser, id: Date.now().toString() }]);
      setNewUser({
        email: '',
        username: '',
        role: 'accountant',
        password: ''
      });
      setShowAddUserModal(false);
      alert(translations[language].userAdded);
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // In a real app, you would also delete from Firebase Auth
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(user => user.id !== userId));
      alert(translations[language].userDeleted);
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-cards">
              <div className="card revenue-card">
                <h3>{translations[language].revenue}</h3>
                <p>${calculateTotals().revenue.toLocaleString()}</p>
                <div className="card-icon">
                  <FiDollarSign />
                </div>
              </div>
              <div className="card expenses-card">
                <h3>{translations[language].expenses}</h3>
                <p>${calculateTotals().expenses.toLocaleString()}</p>
                <div className="card-icon">
                  <FiDollarSign />
                </div>
              </div>
              <div className="card profit-card">
                <h3>{translations[language].profit}</h3>
                <p>${calculateTotals().profit.toLocaleString()}</p>
                <div className="card-icon">
                  <FiDollarSign />
                </div>
              </div>
            </div>

            <div className="accounting-section">
              <div className="section-header">
                <h2>{translations[language].recentTransactions}</h2>
                <button className="add-button">
                  <FiPlus /> {translations[language].addTransaction}
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
                          {transaction.type === 'revenue' ? translations[language].revenue : translations[language].expenses}
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
            <h2>{translations[language].allTransactions}</h2>
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
                        {transaction.type === 'revenue' ? translations[language].revenue : translations[language].expenses}
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
            <h2>{translations[language].reports}</h2>
            <div className="report-cards">
              <div className="report-card">
                <h3>{translations[language].cashFlow}</h3>
                <p>View cash flow statement</p>
              </div>
              <div className="report-card">
                <h3>{translations[language].balanceSheet}</h3>
                <p>View balance sheet</p>
              </div>
              <div className="report-card">
                <h3>{translations[language].incomeStatement}</h3>
                <p>View income statement</p>
              </div>
              <div className="report-card">
                <h3>{translations[language].taxReport}</h3>
                <p>Generate tax report</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="accounting-section">
            <div className="section-header">
              <h2>{translations[language].usersList}</h2>
              <button 
                className="add-button" 
                onClick={() => setShowAddUserModal(true)}
              >
                <FiPlus /> {translations[language].addUser}
              </button>
            </div>
            
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>{translations[language].username}</th>
                    <th>{translations[language].email}</th>
                    <th>{translations[language].role}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role === 'owner' ? translations[language].owner : translations[language].accountant}</td>
                      <td>
                        <button className="action-button edit">
                          <FiEdit /> {translations[language].edit}
                        </button>
                        <button 
                          className="action-button delete"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <FiTrash2 /> {translations[language].delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <FiPieChart /> {translations[language].dashboard}
          </button>
          <button 
            className={activeTab === 'accounting' ? 'active' : ''} 
            onClick={() => setActiveTab('accounting')}
          >
            <FiDollarSign /> {translations[language].accounting}
          </button>
          <button 
            className={activeTab === 'reports' ? 'active' : ''} 
            onClick={() => setActiveTab('reports')}
          >
            <FiFileText /> {translations[language].reports}
          </button>
          
          {userData?.role === 'owner' && (
            <button 
              className={activeTab === 'users' ? 'active' : ''} 
              onClick={() => setActiveTab('users')}
            >
              <FiUser /> {translations[language].manageUsers}
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
                {translations[language].role}: {userData ? (userData.role === 'owner' ? translations[language].owner : translations[language].accountant) : ''}
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
          <h1>
            {userData && userData.role === 'owner'
              ? translations[language].ownerWelcome
              : translations[language].accountantWelcome}
          </h1>
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut /> {translations[language].logout}
          </button>
        </header>
        
        {/* User Information Section */}
        {userData && (
          <div className="user-info-header" style={{ marginBottom: "1rem", padding: "1rem", background: "#eef2ff", borderRadius: "8px" }}>
            <p><strong>User:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        )}
        
        {userData && (
          <div className="profile-card">
            <h2>{translations[language].profile}</h2>
            <p><strong>{translations[language].username}:</strong> {userData.username}</p>
            <p><strong>{translations[language].email}:</strong> {userData.email}</p>
            <p><strong>{translations[language].role}:</strong> {userData.role === 'owner' ? translations[language].owner : translations[language].accountant}</p>
          </div>
        )}
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;