import React, { useState, useEffect } from 'react';
import { auth, db,  } from '../../../firebase';
import {
  updateEmail,
  updatePassword,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import {
  FiUser,
  FiMail,
  FiLock,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import '../../../styles/App.css';
import '../../../styles/SettingsSection.css'; // Adjust the path as necessary

const SettingsSection = () => {
  const user = auth.currentUser;

  // User settings state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Accounting preferences state
  const [currency, setCurrency] = useState('USD');
  const [fiscalYearStart, setFiscalYearStart] = useState('01-01');
  const [taxRate, setTaxRate] = useState(0);
  const [invoicePrefix, setInvoicePrefix] = useState('INV-');
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [receiptPrefix, setReceiptPrefix] = useState('RCPT-');
  const [receiptNumber, setReceiptNumber] = useState(1);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [invoiceAlerts, setInvoiceAlerts] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [expenseAlerts, setExpenseAlerts] = useState(true);

  // Business information
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessTaxId, setBusinessTaxId] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isReauthenticating, setIsReauthenticating] = useState(false);

  // Available currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setEmail(user.email);
        setEmailVerified(user.emailVerified);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || '');
          if (userData.preferences) {
            setCurrency(userData.preferences.currency || 'USD');
            setFiscalYearStart(userData.preferences.fiscalYearStart || '01-01');
            setTaxRate(userData.preferences.taxRate || 0);
            setInvoicePrefix(userData.preferences.invoicePrefix || 'INV-');
            setInvoiceNumber(userData.preferences.invoiceNumber || 1);
            setReceiptPrefix(userData.preferences.receiptPrefix || 'RCPT-');
            setReceiptNumber(userData.preferences.receiptNumber || 1);
          }
          if (userData.notifications) {
            setEmailNotifications(userData.notifications.email || true);
            setInvoiceAlerts(userData.notifications.invoiceAlerts || true);
            setPaymentReminders(userData.notifications.paymentReminders || true);
            setExpenseAlerts(userData.notifications.expenseAlerts || true);
          }
          if (userData.businessInfo) {
            setBusinessName(userData.businessInfo.name || '');
            setBusinessAddress(userData.businessInfo.address || '');
            setBusinessPhone(userData.businessInfo.phone || '');
            setBusinessEmail(userData.businessInfo.email || '');
            setBusinessTaxId(userData.businessInfo.taxId || '');
          }
        }
      }
    };
    loadUserData();
  }, [user]);

  // Verify email sending functionality
  const handleVerifyEmail = async () => {
    try {
      await sendEmailVerification(user);
      setSuccess('Verification email sent. Please check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  // Reauthenticate user for sensitive updates
  const handleReauthenticate = async () => {
    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }
    try {
      setIsReauthenticating(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      setIsReauthenticating(false);
      setSuccess('Authentication successful. You can now update your email or password.');
      setCurrentPassword('');
      return true;
    } catch (err) {
      setIsReauthenticating(false);
      setError(err.message);
      return false;
    }
  };

  // Update user's email address in both Auth and Firestore
  const handleUpdateEmail = async () => {
    if (email === user.email) {
      setError('This is already your current email');
      return;
    }
    const isAuthenticated = await handleReauthenticate();
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      await updateEmail(user, email);
      await updateDoc(doc(db, 'users', user.uid), { email });
      setSuccess('Email updated successfully. A verification email has been sent.');
      setEmailVerified(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user's password in Auth
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const isAuthenticated = await handleReauthenticate();
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save profile changes (username)
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await updateDoc(doc(db, 'users', user.uid), {
        username
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save accounting preferences changes to Firestore
  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await updateDoc(doc(db, 'users', user.uid), {
        preferences: {
          currency,
          fiscalYearStart,
          taxRate: parseFloat(taxRate),
          invoicePrefix,
          invoiceNumber: parseInt(invoiceNumber),
          receiptPrefix,
          receiptNumber: parseInt(receiptNumber)
        }
      });
      setSuccess('Accounting preferences updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save notification settings to Firestore
  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await updateDoc(doc(db, 'users', user.uid), {
        notifications: {
          email: emailNotifications,
          invoiceAlerts,
          paymentReminders,
          expenseAlerts
        }
      });
      setSuccess('Notification settings updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save business information to Firestore
  const handleSaveBusinessInfo = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await updateDoc(doc(db, 'users', user.uid), {
        businessInfo: {
          name: businessName,
          address: businessAddress,
          phone: businessPhone,
          email: businessEmail,
          taxId: businessTaxId
        }
      });
      setSuccess('Business information updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <h3>Settings</h3>
        <ul>
          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <FiUser /> Profile
          </li>
          <li className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
            <FiLock /> Security
          </li>
          <li className={activeTab === 'preferences' ? 'active' : ''} onClick={() => setActiveTab('preferences')}>
            <FiDollarSign /> Accounting Preferences
          </li>
          <li className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
            <FiFileText /> Notifications
          </li>
          <li className={activeTab === 'business' ? 'active' : ''} onClick={() => setActiveTab('business')}>
            <FiCreditCard /> Business Information
          </li>
        </ul>
      </div>
      <div className="settings-content">
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="settings-tab">
            <h2><FiUser /> Profile Settings</h2>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <FiMail />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              {!emailVerified && (
                <div className="email-verification">
                  <span className="warning">Email not verified</span>
                  <button onClick={handleVerifyEmail} className="verify-btn">
                    Verify Email
                  </button>
                </div>
              )}
            </div>
            <button onClick={handleSaveProfile} className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="settings-tab">
            <h2><FiLock /> Security Settings</h2>
            <div className="security-notice">
              <p>For security reasons, you'll need to enter your current password to make changes to your email or password.</p>
            </div>
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
                <button className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="security-actions">
              <div className="security-section">
                <h3>Change Email</h3>
                <div className="form-group">
                  <label>New Email Address</label>
                  <div className="input-with-icon">
                    <FiMail />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter new email"
                    />
                  </div>
                </div>
                <button
                  onClick={handleUpdateEmail}
                  className="security-btn"
                  disabled={loading || isReauthenticating}
                >
                  {loading ? 'Updating...' : 'Update Email'}
                </button>
              </div>
              <div className="security-section">
                <h3>Change Password</h3>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <button className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleUpdatePassword}
                  className="security-btn"
                  disabled={loading || isReauthenticating}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Accounting Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="settings-tab">
            <h2><FiDollarSign /> Accounting Preferences</h2>
            <div className="form-group">
              <label>Default Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Fiscal Year Start</label>
              <input
                type="text"
                value={fiscalYearStart}
                onChange={(e) => setFiscalYearStart(e.target.value)}
                placeholder="MM-DD"
              />
            </div>
            <div className="form-group">
              <label>Default Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div className="preferences-section">
              <h3>Invoice Settings</h3>
              <div className="form-group">
                <label>Invoice Prefix</label>
                <input type="text" value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Next Invoice Number</label>
                <input
                  type="number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <div className="preferences-section">
              <h3>Receipt Settings</h3>
              <div className="form-group">
                <label>Receipt Prefix</label>
                <input type="text" value={receiptPrefix} onChange={(e) => setReceiptPrefix(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Next Receipt Number</label>
                <input
                  type="number"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <button onClick={handleSavePreferences} className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="settings-tab">
            <h2><FiFileText /> Notification Settings</h2>
            <div className="notification-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span className="toggle-switch"></span>
                Email Notifications
              </label>
              <p className="toggle-description">Receive general notifications via email</p>
            </div>
            <div className="notification-toggle">
              <label>
                <input type="checkbox" checked={invoiceAlerts} onChange={(e) => setInvoiceAlerts(e.target.checked)} />
                <span className="toggle-switch"></span>
                Invoice Alerts
              </label>
              <p className="toggle-description">Get notified when invoices are created, paid, or overdue</p>
            </div>
            <div className="notification-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={paymentReminders}
                  onChange={(e) => setPaymentReminders(e.target.checked)}
                />
                <span className="toggle-switch"></span>
                Payment Reminders
              </label>
              <p className="toggle-description">Receive reminders for upcoming payments</p>
            </div>
            <div className="notification-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={expenseAlerts}
                  onChange={(e) => setExpenseAlerts(e.target.checked)}
                />
                <span className="toggle-switch"></span>
                Expense Alerts
              </label>
              <p className="toggle-description">Get alerts for unusual or large expenses</p>
            </div>
            <button onClick={handleSaveNotifications} className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Notification Settings'}
            </button>
          </div>
        )}
        {/* Business Information Tab */}
        {activeTab === 'business' && (
          <div className="settings-tab">
            <h2><FiCreditCard /> Business Information</h2>
            <div className="form-group">
              <label>Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
              />
            </div>
            <div className="form-group">
              <label>Business Address</label>
              <textarea
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="Full business address"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Business Phone</label>
              <input
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="Business phone number"
              />
            </div>
            <div className="form-group">
              <label>Business Email</label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="Business contact email"
              />
            </div>
            <div className="form-group">
              <label>Tax ID / VAT Number</label>
              <input
                type="text"
                value={businessTaxId}
                onChange={(e) => setBusinessTaxId(e.target.value)}
                placeholder="Business tax identification number"
              />
            </div>
            <button onClick={handleSaveBusinessInfo} className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Business Information'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;