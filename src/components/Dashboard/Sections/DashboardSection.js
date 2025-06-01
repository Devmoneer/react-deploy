import React from 'react';
import { FiDollarSign, FiPlus } from 'react-icons/fi';
import { calculateTotals } from '../../Dashboard/utils/calculations';
import { translations } from '../../Dashboard/utils/translations';

const DashboardSection = ({ accountingData, language, dataLoading, setShowAddTransactionModal }) => {
  const t = translations[language];
  const { revenue, expenses, profit } = calculateTotals(accountingData);

  if (dataLoading) {
    return <div className="loading-spinner">{t.loading}</div>;
  }

  return (
    <>
      <div className="dashboard-cards">
        <div className="card revenue-card">
          <h3>{t.revenue}</h3>
          <p>${revenue.toLocaleString()}</p>
          <div className="card-icon">
            <FiDollarSign />
          </div>
        </div>
        <div className="card expenses-card">
          <h3>{t.expenses}</h3>
          <p>${expenses.toLocaleString()}</p>
          <div className="card-icon">
            <FiDollarSign />
          </div>
        </div>
        <div className="card profit-card">
          <h3>{t.profit}</h3>
          <p>${profit.toLocaleString()}</p>
          <div className="card-icon">
            <FiDollarSign />
          </div>
        </div>
      </div>

      <div className="accounting-section">
        <div className="section-header">
          <h2>{t.recentTransactions}</h2>
          <button 
            className="add-button"
            onClick={() => setShowAddTransactionModal(true)}
          >
            <FiPlus /> {t.addTransaction}
          </button>
        </div>

        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>{t.description}</th>
                <th>{t.amount}</th>
                <th>{t.transactionType}</th>
                <th>{t.category}</th>
              </tr>
            </thead>
            <tbody>
              {accountingData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    {t.noTransactions || 'No transactions found'}
                  </td>
                </tr>
              ) : (
                accountingData.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description}</td>
                    <td>${Number(transaction.amount).toLocaleString()}</td>
                    <td>{transaction.type === 'revenue' ? t.revenue : t.expenses}</td>
                    <td>{transaction.category || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardSection;