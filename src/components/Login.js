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
            verifyError: 'Please verify your email first. Check your inbox.'
        },
        arabic: {
            title: 'تسجيل الدخول إلى ACCDPU',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            login: 'تسجيل الدخول',
            register: 'إنشاء حساب',
            forgot: 'نسيت كلمة المرور؟',
            error: 'البريد الإلكتروني أو كلمة المرور غير صالحة',
            verifyError: 'يرجى التحقق من بريدك الإلكتروني أولاً. تحقق من صندوق الوارد.'
        },
        sorani: {
            title: 'چوونەژوورەوە بۆ ACCDPU',
            email: 'ئیمەیل',
            password: 'وشەی نهێنی',
            login: 'چوونەژوورەوە',
            register: 'درووستکردنی هەژمار',
            forgot: 'وشەی نهێنیت لەبیرچووە؟',
            error: 'ئیمەیل یان وشەی نهێنی نادروستە',
            verifyError: 'تکایە یەکەم پشتڕاست بکەرەوە ئیمەیلەکەت. بچۆرە ناو صندوقی نامەکان.'
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Check if email is verified
            if (!userCredential.user.emailVerified) {
                setError(translations[language].verifyError);
                return;
            }
            
            // Redirect to dashboard selector which will determine the correct dashboard
            navigate('/dashboard-selector');
        } catch (err) {
            setError(translations[language].error);
            console.error('Login error:', err);
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

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>{t.email}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                    </div>

                    <div className="form-group">
                        <label>{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>

                    <button type="submit" className="auth-button">{t.login}</button>
                </form>

                <div className="auth-links">
                    <button onClick={() => navigate('/register')} className="link-button">
                        {t.register}
                    </button>
                    <button onClick={() => navigate('/forgot-password')} className="link-button">
                        {t.forgot}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;