import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { addDoc, collection, setDoc, doc, deleteDoc } from 'firebase/firestore';
import DashboardSection from './Sections/DashboardSection';
import AccountingSection from './Sections/AccountingSection';
import ReportsSection from './Sections/ReportsSection';
import UsersSection from './Sections/UsersSection';
import SettingsSection from './Sections/SettingSection';
import AddTransactionModal from './Modals/AddTransactionModal';
import AddUserModal from './Modals/AddUserModal';
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
  setUsers,
  setUserData  // For settings updates
}) => {
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'revenue',  // default type
    category: '',
    date: ''
  });

  // New state for Add User functionality
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'accountant'
  });

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

  const handleAddTransactionSubmit = async () => {
    try {
      setLoading(true);
      // Build the transaction object, including the current user's id
      const transactionToAdd = {
        ...newTransaction,
        userId: auth.currentUser.uid,
        date: new Date(newTransaction.date).toISOString()
      };
      // Add transaction to the "transactions" collection
      const docRef = await addDoc(collection(db, "transactions"), transactionToAdd);
      transactionToAdd.id = docRef.id;
      setAccountingData([...accountingData, transactionToAdd]);
      setNewTransaction({ description: '', amount: '', type: 'revenue', category: '', date: '' });
      setShowAddTransactionModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // New handler for adding a user
  const handleAddUserSubmit = async () => {
    try {
      setLoading(true);
      // Create the new user via Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      // Send email verification (optional)
      await sendEmailVerification(userCredential.user);
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        emailVerified: false,
        createdAt: new Date()
      });
      // Update local users state so the new user appears in the Users section
      setUsers([...users, { id: userCredential.user.uid, username: newUser.username, email: newUser.email, role: newUser.role }]);
      setNewUser({ username: '', email: '', password: '', role: 'accountant' });
      setShowAddUserModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Error adding user:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Handler to delete a user document from Firestore and update local state
  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "users", userId));
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setLoading(false);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message);
      setLoading(false);
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
            setShowAddTransactionModal={setShowAddTransactionModal}
          />
        );
      case 'accounting':
        return (
          <AccountingSection 
            accountingData={accountingData}
            language={language}
            dataLoading={dataLoading}
            setShowAddTransactionModal={setShowAddTransactionModal}
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
            setShowAddUserModal={setShowAddUserModal} // Pass modal setter
            handleDeleteUser={handleDeleteUser}  // Updated to pass delete handler
          />
        );
      case 'settings':
        return (
          <SettingsSection 
            userData={userData}
            language={language}
            setUserData={setUserData}
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

      {showAddTransactionModal && (
        <AddTransactionModal 
          show={showAddTransactionModal}
          onClose={() => setShowAddTransactionModal(false)}
          onSubmit={handleAddTransactionSubmit}
          newTransaction={newTransaction}
          setNewTransaction={setNewTransaction}
          loading={loading}
          language={language}
        />
      )}

      {showAddUserModal && (
        <AddUserModal 
          show={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onSubmit={handleAddUserSubmit}
          newUser={newUser}
          setNewUser={setNewUser}
          loading={loading}
          language={language}
        />
      )}
    </div>
  );
};

export default MainContent;