import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserLock, FaShieldAlt, FaIdCard, FaBuilding, FaUserTie } from 'react-icons/fa';

const Login = () => {
  const [loginMode, setLoginMode] = useState('student'); // 'student' or 'admin'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  
  const { login: studentLogin, error: studentError, loading: studentLoading } = useAuth();
  const { loginAdmin, error: adminError, loading: adminLoading } = useAdminAuth();
  const navigate = useNavigate();

  const [statusMessage, setStatusMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) {
      alert('Please enter your password');
      return;
    }
    
    setStatusMessage('Connecting to secure server...');
    const slowTimer = setTimeout(() => {
      if (loading) setStatusMessage('High traffic detected, please wait...');
    }, 3000);

    const verySlowTimer = setTimeout(() => {
      if (loading) setStatusMessage('Server busy, still retrying connection...');
    }, 8000);

    if (loginMode === 'student') {
      const success = await studentLogin(userId, password);
      if (success) navigate('/');
    } else {
      const success = await loginAdmin(userId, password);
      if (success) navigate('/admin');
    }

    clearTimeout(slowTimer);
    clearTimeout(verySlowTimer);
    setStatusMessage('');
  };

  const loading = loginMode === 'student' ? studentLoading : adminLoading;
  const error = loginMode === 'student' ? studentError : adminError;

  return (
    <div style={styles.pageWrap} className="login-wrapper">
      <div style={styles.heroBg}></div>
      <div style={styles.loginContainer} className="login-container">
        
        {/* Left Informational Panel */}
        <div style={styles.infoPanel} className="login-info-panel">
          <FaBuilding size={48} color="white" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
            Office of the Controller of Examinations
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Welcome to the centralized secure portal for provisional examination results, transcripts, and student academic records.
          </p>
          
          <div style={styles.noticeBox}>
            <h4 style={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              Important Notice
            </h4>
            <ul style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Nov/Dec 2025 Tier-1 Results are now published.</li>
              <li style={{ marginBottom: '0.5rem' }}>Student IDs have been updated for result-day simulation.</li>
              <li style={{ marginBottom: '0.5rem' }}>Re-valuation portals will open from 30th March 2026.</li>
            </ul>
          </div>
        </div>

        {/* Right Authentication Panel */}
        <div style={styles.authPanel} className="login-auth-panel">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <FaUserLock size={36} color="var(--primary)" />
            <h2 style={{ color: 'var(--primary)', marginTop: '0.5rem' }}>Secure Login</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Enter your credentials to access your dashboard</p>
          </div>

          <div style={styles.toggleContainer}>
            <div 
              style={{...styles.toggleBtn, ...(loginMode === 'student' ? styles.toggleActive : {})}}
              onClick={() => { setLoginMode('student'); setUserId(''); setPassword(''); }}
            >
              <FaIdCard /> Student
            </div>
            <div 
              style={{...styles.toggleBtn, ...(loginMode === 'admin' ? styles.toggleActiveAdmin : {})}}
              onClick={() => { setLoginMode('admin'); setUserId(''); setPassword(''); }}
            >
              <FaUserTie /> Administrator
            </div>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            {error && <div style={styles.errorBox}>{error}</div>}
            {loading && statusMessage && (
              <div style={styles.statusBox}>
                <div className="spinner-small"></div>
                {statusMessage}
              </div>
            )}
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                {loginMode === 'student' ? <><FaIdCard /> Registration Number</> : <><FaUserTie /> Admin ID / Username</>}
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={loginMode === 'student' ? "e.g. 711521104001" : "Enter admin ID"}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <FaShieldAlt /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.input}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                {loginMode === 'student' ? 'Forgot Reg No?' : 'Forgot Password?'}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                ...styles.submitBtn,
                backgroundColor: loginMode === 'admin' ? 'var(--secondary)' : 'var(--primary)'
              }}
            >
              {loading ? 'Authenticating...' : `Sign In as ${loginMode === 'student' ? 'Student' : 'Admin'}`}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};


const styles = {
  statusBox: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '0.8rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    border: '1px solid #bfdbfe'
  },
  pageWrap: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '2rem'
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(to right bottom, #002147, #063162, #183e6b)',
    clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)',
    zIndex: -1
  },
  loginContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
    minHeight: '550px'
  },
  infoPanel: {
    flex: '1',
    backgroundColor: 'var(--primary)',
    padding: '4rem 3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  noticeBox: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '1.5rem',
    borderRadius: '4px',
    borderLeft: '4px solid var(--accent)'
  },
  authPanel: {
    flex: '1',
    padding: '4rem 3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 0.2s',
    outline: 'none'
  },
  captchaImage: {
    backgroundColor: '#f1f5f9',
    padding: '0.5rem 1.5rem',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontWeight: 'bold',
    letterSpacing: '3px',
    fontSize: '1.2rem',
    color: '#0f172a',
    fontStyle: 'italic',
    userSelect: 'none',
    backgroundImage: 'radial-gradient(circle, #e2e8f0 2px, transparent 2.5px)',
    backgroundSize: '10px 10px'
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    fontSize: '0.85rem',
    textAlign: 'center',
    border: '1px solid #fca5a5'
  },
  toggleContainer: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    padding: '0.25rem',
    marginBottom: '2rem'
  },
  toggleBtn: {
    flex: '1',
    padding: '0.75rem',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    color: '#64748b'
  },
  toggleActive: {
    backgroundColor: '#ffffff',
    color: 'var(--primary)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  toggleActiveAdmin: {
    backgroundColor: '#ffffff',
    color: 'var(--secondary)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
};

export default Login;
