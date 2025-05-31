import React, { useEffect, useState, useMemo } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, deleteDoc, setDoc, addDoc } from 'firebase/firestore';
import { signOut, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../dashboard.css';
import { FiPieChart, FiDollarSign, FiFileText, FiSettings, FiUser, FiLogOut, FiPlus, FiTrash2 } from 'react-icons/fi';
import { FaUserShield, FaUserTie } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [accountingData, setAccountingData] = useState([]);
  const [users, setUsers] = useState([]);
  const [language, setLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    password: '',
    role: 'accountant'
  });
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: 0,
    type: 'revenue',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const navigate = useNavigate();

  const translations = useMemo(() => ({
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
      description: 'Description',
      amount: 'Amount',
      transactionType: 'Type',
      category: 'Category',
      date: 'Date',
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
      userUpdated: 'User updated successfully',
      transactionAdded: 'Transaction added successfully',
      error: 'Error occurred',
      deleteConfirm: 'Are you sure you want to delete this user?',
      noTransactions: 'No transactions found',
      noUsers: 'No users found',
      loading: 'Loading...'
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
      description: 'الوصف',
      amount: 'المبلغ',
      transactionType: 'النوع',
      category: 'الفئة',
      date: 'التاريخ',
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
      userUpdated: 'تم تحديث المستخدم بنجاح',
      transactionAdded: 'تمت إضافة المعاملة بنجاح',
      error: 'حدث خطأ',
      deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذا المستخدم؟',
      noTransactions: 'لا توجد معاملات',
      noUsers: 'لا يوجد مستخدمين',
      loading: 'جار التحميل...'
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
      description: 'پێناسە',
      amount: 'بڕ',
      transactionType: 'جۆر',
      category: 'هاوپۆل',
      date: 'بەروار',
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
      userUpdated: 'بەکارهێنەر بە سەرکەوتوویی نوێکرایەوە',
      transactionAdded: 'مامەڵە بە سەرکەوتوویی زیادکرا',
      error: 'هەڵەیەک ڕوویدا',
      deleteConfirm: 'دڵنیای لە سڕینەوەی ئەم بەکارهێنەرە؟',
      noTransactions: 'هیچ مامەڵەیەک نیە',
      noUsers: 'هیچ بەکارهێنەرێک نیە',
      loading: 'جارێ...'
    }
  }), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        if (currentUser) {
          if (!currentUser.emailVerified) {
            navigate('/login');
            return;
          }

          const userDocRef = doc(db, "users", currentUser.uid);
          const transactionsQuery = query(
            collection(db, "transactions"),
            where("userId", "==", currentUser.uid)
          );

          const [userDoc, transactionsSnapshot] = await Promise.all([
            getDoc(userDocRef),
            getDocs(transactionsQuery)
          ]);

          if (!userDoc.exists()) {
            navigate('/login');
            return;
          }

          const userData = userDoc.data();
          setUserData(userData);

          const transactionsData = transactionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAccountingData(transactionsData);

          if (userData.role === 'owner') {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersData = usersSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setUsers(usersData);
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError(translations[language].error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate, language, translations]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(translations[language].error);
    }
  };

  const calculateTotals = () => {
    const revenue = accountingData.reduce((sum, item) => item.type === 'revenue' ? sum + Number(item.amount) : sum, 0);
    const expenses = accountingData.reduce((sum, item) => item.type === 'expense' ? sum + Number(item.amount) : sum, 0);
    const profit = revenue - expenses;
    return { revenue, expenses, profit };
  };

  const handleAddTransaction = async () => {
    try {
      setLoading(true);
      const transactionData = {
        ...newTransaction,
        amount: Number(newTransaction.amount),
        userId: currentUser.uid,
        createdAt: new Date()
      };

      await addDoc(collection(db, "transactions"), transactionData);
      
      // Refresh transactions
      const transactionsQuery = query(
        collection(db, "transactions"),
        where("userId", "==", currentUser.uid)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const transactionsData = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAccountingData(transactionsData);
      
      setNewTransaction({
        description: '',
        amount: 0,
        type: 'revenue',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddTransactionModal(false);
      alert(translations[language].transactionAdded);
    } catch (error) {
      console.error("Error adding transaction: ", error);
      setError(error.message || translations[language].error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      // First create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        newUser.email, 
        newUser.password
      );
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Then add to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: newUser.username,
        email: newUser.email,
        role: 'accountant',
        emailVerified: false,
        createdAt: new Date()
      });
      
      setUsers([...users, { 
        id: userCredential.user.uid,
        username: newUser.username,
        email: newUser.email,
        role: 'accountant'
      }]);
      
      setNewUser({
        email: '',
        username: '',
        password: '',
        role: 'accountant'
      });
      setShowAddUserModal(false);
      alert(translations[language].userAdded);
    } catch (error) {
      console.error("Error adding user: ", error);
      setError(error.message || translations[language].error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm(translations[language].deleteConfirm)) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter(user => user.id !== userId));
        alert(translations[language].userDeleted);
      } catch (error) {
        console.error("Error deleting user: ", error);
        setError(translations[language].error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderTabContent = () => {
    if (dataLoading) {
      return <div className="loading-spinner">{translations[language].loading}</div>;
    }

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
                <button 
                  className="add-button"
                  onClick={() => setShowAddTransactionModal(true)}
                >
                  <FiPlus /> {translations[language].addTransaction}
                </button>
              </div>
              
              <div className="transactions-table">
                {accountingData.length === 0 ? (
                  <p className="no-data">{translations[language].noTransactions}</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>{translations[language].date}</th>
                        <th>{translations[language].description}</th>
                        <th>{translations[language].amount}</th>
                        <th>{translations[language].transactionType}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountingData.slice(0, 5).map(transaction => (
                        <tr key={transaction.id}>
                          <td>{new Date(transaction.date).toLocaleDateString()}</td>
                          <td>{transaction.description}</td>
                          <td>${Number(transaction.amount).toLocaleString()}</td>
                          <td className={`type-${transaction.type}`}>
                            {transaction.type === 'revenue' ? translations[language].revenue : translations[language].expenses}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        );
      case 'accounting':
        return (
          <div className="accounting-section">
            <div className="section-header">
              <h2>{translations[language].allTransactions}</h2>
              <button 
                className="add-button"
                onClick={() => setShowAddTransactionModal(true)}
              >
                <FiPlus /> {translations[language].addTransaction}
              </button>
            </div>
            {accountingData.length === 0 ? (
              <p className="no-data">{translations[language].noTransactions}</p>
            ) : (
              <div className="transactions-table">
                <table>
                  <thead>
                    <tr>
                      <th>{translations[language].date}</th>
                      <th>{translations[language].description}</th>
                      <th>{translations[language].amount}</th>
                      <th>{translations[language].transactionType}</th>
                      <th>{translations[language].category}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountingData.map(transaction => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>{transaction.description}</td>
                        <td>${Number(transaction.amount).toLocaleString()}</td>
                        <td className={`type-${transaction.type}`}>
                          {transaction.type === 'revenue' ? translations[language].revenue : translations[language].expenses}
                        </td>
                        <td>{transaction.category || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
              {userData?.role === 'owner' && (
                <button 
                  className="add-button" 
                  onClick={() => setShowAddUserModal(true)}
                >
                  <FiPlus /> {translations[language].addUser}
                </button>
              )}
            </div>
            
            {users.length === 0 ? (
              <p className="no-data">{translations[language].noUsers}</p>
            ) : (
              <div className="transactions-table">
                <table>
                  <thead>
                    <tr>
                      <th>{translations[language].username}</th>
                      <th>{translations[language].email}</th>
                      <th>{translations[language].role}</th>
                      {userData?.role === 'owner' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role === 'owner' ? translations[language].owner : translations[language].accountant}</td>
                        {userData?.role === 'owner' && (
                          <td>
                            <button 
                              className="action-button delete"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.role === 'owner'}
                            >
                              <FiTrash2 /> {translations[language].delete}
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
              <div className="username">{userData?.username || translations[language].loading}</div>
              <div className="user-role">
                {translations[language].role}: {userData ? (userData.role === 'owner' ? translations[language].owner : translations[language].accountant) : translations[language].loading}
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
            {userData ? (
              userData.role === 'owner'
                ? translations[language].ownerWelcome
                : translations[language].accountantWelcome
            ) : translations[language].welcome}
          </h1>
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut /> {translations[language].logout}
          </button>
        </header>
        
        {error && <div className="error-message">{error}</div>}
        
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{translations[language].addNewUser}</h2>
            <div className="form-group">
              <label>{translations[language].username}</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                placeholder={translations[language].username}
              />
            </div>
            <div className="form-group">
              <label>{translations[language].email}</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="user@example.com"
              />
            </div>
            <div className="form-group">
              <label>{translations[language].password}</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                placeholder="••••••••"
                minLength="6"
              />
            </div>
            <div className="modal-actions">
              <button 
                onClick={handleAddUser}
                disabled={loading || !newUser.username || !newUser.email || !newUser.password}
              >
                {loading ? translations[language].loading : translations[language].save}
              </button>
              <button 
                onClick={() => setShowAddUserModal(false)}
                disabled={loading}
              >
                {translations[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTransactionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{translations[language].addTransaction}</h2>
            <div className="form-group">
              <label>{translations[language].description}</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                placeholder={translations[language].description}
              />
            </div>
            <div className="form-group">
              <label>{translations[language].amount}</label>
              <input
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>{translations[language].transactionType}</label>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
              >
                <option value="revenue">{translations[language].revenue}</option>
                <option value="expense">{translations[language].expenses}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{translations[language].category}</label>
              <input
                type="text"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                placeholder={translations[language].category}
              />
            </div>
            <div className="form-group">
              <label>{translations[language].date}</label>
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button 
                onClick={handleAddTransaction}
                disabled={loading || !newTransaction.description || !newTransaction.amount}
              >
                {loading ? translations[language].loading : translations[language].save}
              </button>
              <button 
                onClick={() => setShowAddTransactionModal(false)}
                disabled={loading}
              >
                {translations[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;