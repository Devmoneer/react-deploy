import React, { useState } from 'react';
import { auth, sendResetEmail } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import '../../../styles/ForgotPassword.css'; // Adjust the path as necessary

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('english');

  const translations = {
    english: {
      title: 'Reset Password',
      email: 'Email',
      reset: 'Send Reset Link',
      back: 'Back to Login',
      success: 'Password reset email sent!',
      error: 'Error sending reset email'
    },
    arabic: {
      title: 'إعادة تعيين كلمة المرور',
      email: 'البريد الإلكتروني',
      reset: 'إرسال رابط الإعادة',
      back: 'العودة لتسجيل الدخول',
      success: 'تم إرسال رابط إعادة التعيين!',
      error: 'خطأ في إرسال البريد'
    },
    sorani: {
      title: 'دووبارە دانانی وشەی نهێنی',
      email: 'ئیمەیل',
      reset: 'ناردنی بەستەری دووبارەدانانەوە',
      back: 'بگەڕێوە بۆ چوونەژوورەوە',
      success: 'ئیمەیلی دووبارەدانانەوە نێردرا!',
      error: 'هەڵە لە ناردنی ئیمەیل'
    },
     badini: {
      title: 'دووبارە دانانا پەیڤا نهێنی',
      email: 'ئیمێل',
      reset: 'فرێکرنا لینکی بۆ ئیمێلی',
      back: 'زفرین بۆ چووناژوور',
      success: '! ب سەرکەفتیانە بۆ ئیمێلی هاتە فرێکرن',
      error: 'شاشی د فرێکرنا ئیمێلی دا'
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendResetEmail(auth, email);
      setMessage(translations[language].success);
      setError('');
    } catch (err) {
      setError(translations[language].error);
      setMessage('');
    }
  };

  const t = translations[language];

  return (
    <div className="auth-container">
      <img alt='logo' src='favicon.png' className='logo-acc'/>
      <div className="auth-box">
        <div className="language-selector-fg">
          <button onClick={() => setLanguage('english')}>EN</button>
          <button onClick={() => setLanguage('arabic')}>AR</button>
          <button onClick={() => setLanguage('sorani')}>KU</button>
          <button onClick={() => setLanguage('badini')}>KU-BA</button>
        </div>
        
        <h2>{t.title}</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleReset}>
          <div className="form-group">
            <label>{t.email}</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="auth-button">{t.reset}</button>
        </form>
        
        <div className="auth-links">
          <button onClick={() => navigate('/login')} className="link-button">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;