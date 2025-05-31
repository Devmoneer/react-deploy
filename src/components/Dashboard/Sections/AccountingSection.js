import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { translations } from '../utils/translations';

const AccountingSection = ({ accountingData, language, dataLoading, setShowAddTransactionModal }) => {
  const t = translations[language];

  if (dataLoading) {
    return <div className="loading-spinner">{t.loading}</div>;
  }

  return (
    <div className="accounting-section">
      <div className="section-header">
        <h2>{t.allTransactions}</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddTransactionModal(true)}
        >
          <FiPlus /> {t.addTransaction}
        </button>
      </div>
      {accountingData.length === 0 ? (
        <p className="no-data">{t.noTransactions}</p>
      ) : (
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>{t.date}</th>
                <th>{t.description}</th>
                <th>{t.amount}</th>
                <th>{t.transactionType}</th>
                <th>{t.category}</th>
              </tr>
            </thead>
            <tbody>
              {accountingData.map(transaction => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>${Number(transaction.amount).toLocaleString()}</td>
                  <td className={`type-${transaction.type}`}>
                    {transaction.type === 'revenue' ? t.revenue : t.expenses}
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
};

export default AccountingSection;