import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('english');
  const navigate = useNavigate();

  const translations = {
    english: {
      title: 'Create ACCDPU Account',
      email: 'Email',
      password: 'Password',
      confirm: 'Confirm Password',
      register: 'Register',
      login: 'Already have an account? Login',
      error: 'Passwords do not match',
      firebaseError: 'Registration failed'
    },
    arabic: {
      title: 'إنشاء حساب ACCDPU',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirm: 'تأكيد كلمة المرور',
      register: 'تسجيل',
      login: 'هل لديك حساب بالفعل؟ تسجيل الدخول',
      error: 'كلمات المرور غير متطابقة',
      firebaseError: 'فشل التسجيل'
    },
    sorani: {
      title: 'درووستکردنی هەژماری ACCDPU',
      email: 'ئیمەیل',
      password: 'وشەی نهێنی',
      confirm: 'پشتڕاستکردنەوەی وشەی نهێنی',
      register: 'تۆمارکردن',
      login: 'هەژمارت هەیە؟ چوونەژوورەوە',
      error: 'وشەی نهێنیەکان ناگونجێن',
      firebaseError: 'تۆمارکردن سەرنەکەوت'
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(translations[language].error);
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(translations[language].firebaseError);
    }
  };

  const t = translations[language];

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="language-selector">
          <button onClick={() => setLanguage('english')}>EN</button>
          <button onClick={() => setLanguage('arabic')}>AR</button>
          <button onClick={() => setLanguage('sorani')}>KU</button>
        </div>
        
        <h2>{t.title}</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email">{t.email}</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t.confirm}</label>
            <input 
              id="confirmPassword"
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="auth-button">{t.register}</button>
        </form>
        
        <div className="auth-links">
          <button onClick={() => navigate('/login')} className="link-button">
            {t.login}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;