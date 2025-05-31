import React from 'react';
import { FiDollarSign, FiPlus } from 'react-icons/fi';
import { calculateTotals } from '../../Dashboard/utils/calculations';  // updated path
import { translations } from '../../Dashboard/utils/translations';         // updated path
// ...existing code...
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
        
        {/* Transactions table... */}
      </div>
    </>
  );
};

export default DashboardSection;