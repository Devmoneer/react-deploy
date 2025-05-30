import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../App.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('english');
    const [loading, setLoading] = useState(false);
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
            subtitle: 'Please enter your details to access your account',
            loading: 'Logging in...',
            authError: 'Authentication error',
            docError: 'User account not properly configured'
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
            subtitle: 'الرجاء إدخال بياناتك للوصول إلى حسابك',
            loading: 'جاري تسجيل الدخول...',
            authError: 'خطأ في المصادقة',
            docError: 'حساب المستخدم غير مهيأ بشكل صحيح'
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
            subtitle: 'تکایە وردەکارییەکان بنووسە بۆ چوونەژوورەوە بۆ هەژمارەکەت',
            loading: 'چوونەژوورەوە...',
            authError: 'هەڵەی ڕاستکردنەوە',
            docError: 'هەژماری بەکارهێنەر بە شێوەیەکی ڕاست ڕێکخراو نییە'
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            
            // Sign in with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Authentication successful', userCredential.user);
            
            // Check email verification
            if (!userCredential.user.emailVerified) {
                console.log('Email not verified - sending new verification');
                await sendEmailVerification(userCredential.user);
                setError(translations[language].verifyError);
                setLoading(false);
                return;
            }
            
            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            console.log('Firestore user document:', userDoc.exists() ? userDoc.data() : 'Not found');
            
            if (!userDoc.exists()) {
                console.error('User document missing in Firestore');
                setError(translations[language].docError);
                setLoading(false);
                return;
            }
            
            // Successful login - navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err.code, err.message);
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError(translations[language].error);
            } else if (err.code === 'auth/too-many-requests') {
                setError('Account temporarily disabled due to too many login attempts');
            } else {
                setError(err.message || translations[language].authError);
            }
        } finally {
            setLoading(false);
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

                        <button 
                            type="submit" 
                            className={`auth-button primary ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    {t.loading}
                                </>
                            ) : t.login}
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