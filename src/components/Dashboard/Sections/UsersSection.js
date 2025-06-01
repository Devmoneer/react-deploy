import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { translations } from '../utils/translations';

const UsersSection = ({ users, userData, language, dataLoading, setShowAddUserModal, handleDeleteUser }) => {
  const t = translations[language];

  if (dataLoading) {
    return <div className="loading-spinner">{t.loading}</div>;
  }

  // Filter to show only accountants
  const filteredUsers = users.filter(user => user.role !== 'owner');

  return (
    <div className="accounting-section">
      <div className="section-header">
        <h2>{t.usersList}</h2>
        {userData?.role === 'owner' && (
          <button 
            className="add-button" 
            onClick={() => setShowAddUserModal(true)}
          >
            <FiPlus /> {t.addUser}
          </button>
        )}
      </div>
      
      {filteredUsers.length === 0 ? (
        <p className="no-data">{t.noUsers}</p>
      ) : (
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>{t.username}</th>
                <th>{t.email}</th>
                <th>{t.role}</th>
                {userData?.role === 'owner' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{t.accountant}</td>
                  {userData?.role === 'owner' && (
                    <td>
                      <button 
                        className="action-button delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FiTrash2 /> {t.delete}
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
};

export default UsersSection;