import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('accountant');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [language, setLanguage] = useState('english');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const translations = {
        english: {
            title: 'Create Account',
            username: 'Username',
            email: 'Email',
            password: 'Password',
            confirm: 'Confirm Password',
            role: 'Role',
            register: 'Register',
            login: 'Already have an account? Login',
            error: 'Passwords do not match',
            firebaseError: 'Registration failed',
            success: 'Registration successful! Please check your email for verification.',
            loading: 'Processing...',
            welcome: 'Get Started',
            subtitle: 'Create an account to access all features',
            passwordError: 'Password must be at least 6 characters',
            docError: 'Failed to create user profile'
        },
        arabic: {
            title: 'إنشاء حساب',
            username: 'اسم المستخدم',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            confirm: 'تأكيد كلمة المرور',
            role: 'الدور',
            register: 'تسجيل',
            login: 'هل لديك حساب بالفعل؟ تسجيل الدخول',
            error: 'كلمات المرور غير متطابقة',
            firebaseError: 'فشل التسجيل',
            success: 'تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني لإتمام التحقق.',
            loading: 'جاري المعالجة...',
            welcome: 'ابدأ رحلتك',
            subtitle: 'أنشئ حسابًا للوصول إلى جميع الميزات',
            passwordError: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل',
            docError: 'فشل إنشاء ملف تعريف المستخدم'
        },
        sorani: {
            title: 'درووستکردنی هەژمار',
            username: 'ناوی بەکارهێنەر',
            email: 'ئیمەیل',
            password: 'وشەی نهێنی',
            confirm: 'پشتڕاستکردنەوەی وشەی نهێنی',
            role: 'ڕۆڵ',
            register: 'تۆمارکردن',
            login: 'هەژمارت هەیە؟ چوونەژوورەوە',
            error: 'وشەی نهێنیەکان ناگونجێن',
            firebaseError: 'تۆمارکردن سەرنەکەوت',
            success: 'تۆمارکردن سەرکەوتوو بوو! تکایە بۆ تەواوکردنی پشتڕاستکردنەوە بچۆرە ئیمەیلەکەت.',
            loading: 'لە پڕۆسەکردندایە...',
            welcome: 'دەستپێبکە',
            subtitle: 'هەژمارێک درووست بکە بۆ چوونە ناو هەموو تایبەتمەندییەکان',
            passwordError: 'وشەی نهێنی پێویستە کەمترین 6 پیت بێت',
            docError: 'سەرکەوتوو نەبوو لە درووستکردنی پرۆفایلی بەکارهێنەر'
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError(translations[language].error);
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            setError(translations[language].passwordError);
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Auth user created:', userCredential.user.uid);
            
            // Send verification email
            await sendEmailVerification(userCredential.user);
            console.log('Verification email sent');
            
            // Create user document in Firestore
            const userDocRef = doc(db, "users", userCredential.user.uid);
            await setDoc(userDocRef, {
                username,
                email,
                role,
                emailVerified: false,
                createdAt: new Date()
            });
            console.log('Firestore document created');

            setSuccess(translations[language].success);
            setIsLoading(false);

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Registration error:', err.code, err.message);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email address is already in use');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak');
            } else {
                setError(err.message || translations[language].firebaseError);
            }
            setIsLoading(false);
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
                    {success && <p className="success-message">{success}</p>}
                    
                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="form-group">
                            <label>{t.username}</label>
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="john_doe"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>{t.email}</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="example@email.com"
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
                                <option value="accountant">Accountant</option>
                                <option value="owner">Company Owner</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>{t.password}</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>{t.confirm}</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`auth-button primary ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    {t.loading}
                                </>
                            ) : t.register}
                        </button>
                    </form>
                    
                    <div className="auth-footer">
                        <button onClick={() => navigate('/login')} className="text-button">
                            {t.login}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="auth-illustration">
                <img 
                    src={`${process.env.PUBLIC_URL}/images/4957136.jpg`} 
                    alt="Register illustration" 
                />
                <div className="illustration-overlay">
                    <h2>Join ACCDPU</h2>
                    <p>Start managing your accounting processes efficiently</p>
                </div>
            </div>
        </div>
    );
};

export default Register;