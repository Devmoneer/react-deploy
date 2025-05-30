import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [language, setLanguage] = useState('english');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const translations = {
    english: {
      title: 'Create ACCDPU Account',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirm: 'Confirm Password',
      register: 'Register',
      login: 'Already have an account? Login',
      error: 'Passwords do not match',
      firebaseError: 'Registration failed',
      success: 'Registration successful! Please check your email for verification.',
      loading: 'Processing...',
      role: 'Role',
  owner: 'Company Owner',
  accountant: 'Accountant',
  selectRole: 'Select your role'
    },
    arabic: {
      title: 'إنشاء حساب ACCDPU',
      username: 'اسم المستخدم',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirm: 'تأكيد كلمة المرور',
      register: 'تسجيل',
      login: 'هل لديك حساب بالفعل؟ تسجيل الدخول',
      error: 'كلمات المرور غير متطابقة',
      firebaseError: 'فشل التسجيل',
      success: 'تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني لإتمام التحقق.',
      loading: 'جاري المعالجة...',
      role: 'الدور',
  owner: 'مالك الشركة',
  accountant: 'محاسب',
  selectRole: 'اختر دورك'
    },
    sorani: {
      title: 'درووستکردنی هەژماری ACCDPU',
      username: 'ناوی بەکارهێنەر',
      email: 'ئیمەیل',
      password: 'وشەی نهێنی',
      confirm: 'پشتڕاستکردنەوەی وشەی نهێنی',
      register: 'تۆمارکردن',
      login: 'هەژمارت هەیە؟ چوونەژوورەوە',
      error: 'وشەی نهێنیەکان ناگونجێن',
      firebaseError: 'تۆمارکردن سەرنەکەوت',
      success: 'تۆمارکردن سەرکەوتوو بوو! تکایە بۆ تەواوکردنی پشتڕاستکردنەوە بچۆرە ئیمەیلەکەت.',
      loading: 'لە پڕۆسەکردندایە...',
      role: 'ڕۆڵ',
  owner: 'خاوەن کۆمپانیا',
  accountant: 'ژمێریار',
  selectRole: 'ڕۆڵەکەت هەڵبژێرە'
    }
  };

  const [role, setRole] = useState('owner');

  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(translations[language].error);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Save user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
  username,
  email,
  role,
  emailVerified: false,
  createdAt: new Date()
});
      setSuccess(translations[language].success);
      setIsLoading(false);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || translations[language].firebaseError);
      setIsLoading(false);
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
        {success && <p className="success-message">{success}</p>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>{t.username}</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>{t.email}</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>{t.password}</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>{t.confirm}</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
          <label>{t.role}</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="owner">{t.owner}</option>
            <option value="accountant">{t.accountant}</option>
          </select>
        </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? t.loading : t.register}
          </button>
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