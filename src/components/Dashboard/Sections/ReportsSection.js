import React from 'react';
import { translations } from '../utils/translations';

const ReportsSection = ({ language }) => {
  const t = translations[language];

  return (
    <div className="reports-section">
      <h2>{t.reports}</h2>
      <div className="report-cards">
        <div className="report-card">
          <h3>{t.cashFlow}</h3>
          <p>View cash flow statement</p>
        </div>
        <div className="report-card">
          <h3>{t.balanceSheet}</h3>
          <p>View balance sheet</p>
        </div>
        <div className="report-card">
          <h3>{t.incomeStatement}</h3>
          <p>View income statement</p>
        </div>
        <div className="report-card">
          <h3>{t.taxReport}</h3>
          <p>Generate tax report</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;