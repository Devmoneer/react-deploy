import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const ErrorPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('english');

  const translations = {
    english: {
      title: 'Error Occurred',
      message: 'Something went wrong. Please try again later.',
      home: 'Return to Home'
    },
    arabic: {
      title: 'حدث خطأ',
      message: 'حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقًا.',
      home: 'العودة إلى الصفحة الرئيسية'
    },
    sorani: {
      title: 'هەڵەیەک ڕوویدا',
      message: 'هەڵەیەک ڕوویدا. تکایە دواتر هەوڵبدەرەوە.',
      home: 'گەڕانەوە بۆ ماڵەوە'
    }
  };

  const t = translations[language];

  return (
    <div className="error-container">
      <div className="language-selector">
        <button onClick={() => setLanguage('english')}>EN</button>
        <button onClick={() => setLanguage('arabic')}>AR</button>
        <button onClick={() => setLanguage('sorani')}>KU</button>
      </div>
      
      <div className="error-content">
        <h1>{t.title}</h1>
        <p>{t.message}</p>
        <button 
          onClick={() => navigate('/login')} 
          className="auth-button"
        >
          {t.home}
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;