import React from 'react';
import { FiDollarSign, FiPlus } from 'react-icons/fi';
import { calculateTotals } from '../../Dashboard/utils/calculations';
import { translations } from '../../Dashboard/utils/translations';

const DashboardSection = ({ accountingData, language, currency, dataLoading, setShowAddTransactionModal }) => {
  const t = translations[language];
  const { revenue, expenses, profit } = calculateTotals(accountingData);

  // Set a conversion rate for dollars to dinar.
  const conversionRate = currency === 'dinar' ? 0.31 : 1;

  const getCurrencySymbol = (currencyCode) => {
    if (currencyCode === 'dollar') return '$';
    if (currencyCode === 'dinar') return 'د.د';
    return '';
  };

  const symbol = getCurrencySymbol(currency);

  // Convert the totals using the conversion rate.
  const convertedRevenue = revenue * conversionRate;
  const convertedExpenses = expenses * conversionRate;
  const convertedProfit = profit * conversionRate;

  // Filter only transactions from the last 2 days
  const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const recentTransactions = accountingData.filter(transaction => {
    const txTime = new Date(transaction.date).getTime();
    return now - txTime <= twoDaysInMs;
  });

  if (dataLoading) {
    return <div className="loading-spinner">{t.loading}</div>;
  }

  return (
    <>
      <div className="dashboard-cards">
        <div className="card revenue-card">
          <h3>{t.revenue}</h3>
          <p>{symbol}{convertedRevenue.toLocaleString()}</p>
          <div className="card-icon">
            <FiDollarSign />
          </div>
        </div>
        <div className="card expenses-card">
          <h3>{t.expenses}</h3>
          <p>{symbol}{convertedExpenses.toLocaleString()}</p>
          <div className="card-icon">
            <FiDollarSign />
          </div>
        </div>
        <div className="card profit-card">
          <h3>{t.profit}</h3>
          <p>{symbol}{convertedProfit.toLocaleString()}</p>
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
                <th>{t.date}</th>
                <th>{t.description}</th>
                <th>{t.amount}</th>
                <th>{t.transactionType}</th>
                <th>{t.category}</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    {t.noTransactions || 'No recent transactions found'}
                  </td>
                </tr>
              ) : (
                recentTransactions.map(transaction => {
                  const convertedAmount = Number(transaction.amount) * conversionRate;
                  return (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.description}</td>
                      <td>{symbol}{convertedAmount.toLocaleString()}</td>
                      <td>{transaction.type === 'revenue' ? t.revenue : t.expenses}</td>
                      <td>{transaction.category || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardSection;