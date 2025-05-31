import React from 'react';
import { translations } from '../utils/translations';

const AddUserModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  newUser, 
  setNewUser, 
  loading, 
  language 
}) => {
  const t = translations[language];

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{t.addNewUser}</h2>
        <div className="form-group">
          <label>{t.username}</label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            placeholder={t.username}
          />
        </div>
        <div className="form-group">
          <label>{t.email}</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            placeholder="user@example.com"
          />
        </div>
        <div className="form-group">
          <label>{t.password}</label>
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
            onClick={onSubmit}
            disabled={loading || !newUser.username || !newUser.email || !newUser.password}
          >
            {loading ? t.loading : t.save}
          </button>
          <button 
            onClick={onClose}
            disabled={loading}
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;