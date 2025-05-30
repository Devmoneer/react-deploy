import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('english');
    const navigate = useNavigate();

    const translations = {
        english: {
            title: 'Login to ACCDPU',
            email: 'Email',
            password: 'Password',
            login: 'Login',
            register: 'Create Account',
            forgot: 'Forgot Password?',
            error: 'Invalid email or password',
            verifyError: 'Please verify your email first. Check your inbox.',
            welcome: 'Welcome Back!',
            subtitle: 'Please enter your details to access your account'
        },
        arabic: {
            title: 'تسجيل الدخول إلى ACCDPU',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            login: 'تسجيل الدخول',
            register: 'إنشاء حساب',
            forgot: 'نسيت كلمة المرور؟',
            error: 'البريد الإلكتروني أو كلمة المرور غير صالحة',
            verifyError: 'يرجى التحقق من بريدك الإلكتروني أولاً. تحقق من صندوق الوارد.',
            welcome: 'أهلاً بعودتك!',
            subtitle: 'الرجاء إدخال بياناتك للوصول إلى حسابك'
        },
        sorani: {
            title: 'چوونەژوورەوە بۆ ACCDPU',
            email: 'ئیمەیل',
            password: 'وشەی نهێنی',
            login: 'چوونەژوورەوە',
            register: 'درووستکردنی هەژمار',
            forgot: 'وشەی نهێنیت لەبیرچووە؟',
            error: 'ئیمەیل یان وشەی نهێنی نادروستە',
            verifyError: 'تکایە یەکەم پشتڕاست بکەرەوە ئیمەیلەکەت. بچۆرە ناو صندوقی نامەکان.',
            welcome: 'بەخێربێیتەوە!',
            subtitle: 'تکایە وردەکارییەکان بنووسە بۆ چوونەژوورەوە بۆ هەژمارەکەت'
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            if (!userCredential.user.emailVerified) {
                setError(translations[language].verifyError);
                return;
            }
            
            navigate('/dashboard');
        } catch (err) {
            setError(translations[language].error);
            console.error('Login error:', err);
        }
    };

    const t = translations[language];

    return (
        <div className="auth-page-container">
            <div className="auth-form-container">
                <div className="auth-box">
                    <div className="language-selector">
                        <button 
                            onClick={() => setLanguage('english')}
                            className={language === 'english' ? 'active' : ''}
                        >EN</button>
                        <button 
                            onClick={() => setLanguage('arabic')}
                            className={language === 'arabic' ? 'active' : ''}
                        >AR</button>
                        <button 
                            onClick={() => setLanguage('sorani')}
                            className={language === 'sorani' ? 'active' : ''}
                        >KU</button>
                    </div>

                    <div className="auth-header">
                        <h1>{t.welcome}</h1>
                        <p className="subtitle">{t.subtitle}</p>
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}

                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="form-group">
                            <label>{t.email}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required />
                        </div>

                        <div className="form-group">
                            <label>{t.password}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required />
                        </div>

                        <button type="submit" className="auth-button primary">
                            {t.login}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <div className="auth-links">
                            <button onClick={() => navigate('/register')} className="text-button">
                                {t.register}
                            </button>
                            <button onClick={() => navigate('/forgot-password')} className="text-button">
                                {t.forgot}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="auth-illustration">
                <img 
                    src={`${process.env.PUBLIC_URL}/images/4957136.jpg`} 
                    alt="Login illustration" 
                />
                <div className="illustration-overlay">
                    <h2>ACCDPU</h2>
                    <p>Accounting & Consulting Company Dashboard for Private Use</p>
                </div>
            </div>
        </div>
    );
}

export default Login;