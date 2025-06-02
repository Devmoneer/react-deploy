import React from 'react';
import { translations } from '../utils/translations';
import '../../../styles/AddTransactionModal.css';

const AddTransactionModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  newTransaction, 
  setNewTransaction, 
  loading, 
  language 
}) => {
  const t = translations[language];

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{t.addTransaction}</h2>
        <div className="form-group">
          <label>{t.description}</label>
          <input
            type="text"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            placeholder={t.description}
          />
        </div>
        <div className="form-group">
          <label>{t.amount}</label>
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
          <label>{t.transactionType}</label>
          <select
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
          >
            <option value="revenue">{t.revenue}</option>
            <option value="expense">{t.expenses}</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t.category}</label>
          <input
            type="text"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
            placeholder={t.category}
          />
        </div>
        <div className="form-group">
          <label>{t.date}</label>
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
          />
        </div>
        <div className="modal-actions">
          <button 
            onClick={onSubmit}
            disabled={loading || !newTransaction.description || !newTransaction.amount}
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

export default AddTransactionModal;