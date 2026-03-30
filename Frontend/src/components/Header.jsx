import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { FaGraduationCap, FaEnvelope, FaPhoneAlt, FaUserCircle, FaPowerOff, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header style={styles.header}>
      {/* Top Contact Bar */}
      <div style={styles.topBar} className="top-bar">
        <div className="container" style={styles.topBarContent}>
          <div style={styles.topBarLinks}>
            <a href="#" style={styles.topLink}>Campus Directory</a>
            <span style={styles.separator}>|</span>
            <a href="#" style={styles.topLink}>Alumni Portal</a>
            <span style={styles.separator}>|</span>
            <a href="#" style={styles.topLink}>Central Library</a>
          </div>
          <div style={styles.topBarLinks}>
            <span style={styles.topLinkDesc}><FaPhoneAlt size={10} /> +91-80-23456789</span>
            <span style={styles.separator}>|</span>
            <span style={styles.topLinkDesc}><FaEnvelope size={12} /> examcell@aurcc.ac.in</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={styles.mainNav}>
        <div className="container" style={styles.navContainer}>
          {/* Brand */}
          <div style={styles.brand}>
            <FaGraduationCap size={38} color="var(--secondary)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <h1 className="header-title" style={styles.title}>AURCC</h1>
              <span className="header-subtitle" style={styles.subtitle}>Anna University Regional Campus Coimbatore</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav style={styles.navLinks} className="desktop-nav">
            {!user ? (
              <span style={styles.systemTitle}>Student Result Management System</span>
            ) : (
              <>
                <NavLink to="/" end style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>Dashboard</NavLink>
                <NavLink to="/assessment" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>Assessments</NavLink>
                <NavLink to="/semesters" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>Results</NavLink>

                <div style={styles.profileArea}>
                  <div style={styles.userInfo}>
                    <FaUserCircle size={26} color="var(--primary-light)" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary)', lineHeight: 1 }}>{user.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.regNo}</span>
                    </div>
                  </div>
                  <button className="btn btn-secondary" style={styles.logoutBtn} onClick={logout}>
                    <FaPowerOff size={13} /> Logout
                  </button>
                </div>
              </>
            )}
          </nav>

          {/* Hamburger (mobile only) */}
          {user && (
            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <span /><span /><span />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        <button className="mob-close" onClick={closeMenu} aria-label="Close menu">
          <FaTimes />
        </button>

        {/* User info on mobile */}
        {user && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{user.name}</div>
            <div style={{ fontSize: '0.85rem' }}>{user.regNo}</div>
          </div>
        )}

        <NavLink to="/" end onClick={closeMenu}>Dashboard</NavLink>
        <NavLink to="/assessment" onClick={closeMenu}>Assessments</NavLink>
        <NavLink to="/semesters" onClick={closeMenu}>Results</NavLink>

        <button className="mob-logout" onClick={() => { logout(); closeMenu(); }}>
          <FaPowerOff size={13} style={{ marginRight: 6 }} /> Logout
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: { backgroundColor: 'white', boxShadow: 'var(--shadow-md)', position: 'sticky', top: 0, zIndex: 50, display: 'flex', flexDirection: 'column' },
  topBar: { backgroundColor: 'var(--primary)', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', borderBottom: '3px solid var(--secondary)' },
  topBarContent: { display: 'flex', justifyContent: 'space-between', padding: '0.3rem 1rem' },
  topBarLinks: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  topLink: { color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: 500 },
  topLinkDesc: { display: 'flex', alignItems: 'center', gap: '0.3rem' },
  separator: { color: 'rgba(255,255,255,0.3)' },
  mainNav: { backgroundColor: '#ffffff' },
  navContainer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  title: { margin: 0, color: 'var(--primary)', fontSize: '1.8rem', lineHeight: 1, letterSpacing: '1px' },
  subtitle: { fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  systemTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-light)', fontFamily: 'var(--font-heading)' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  link: { color: 'var(--primary)', textDecoration: 'none', padding: '0.4rem 0', fontWeight: 600, fontSize: '0.9rem', borderBottom: '3px solid transparent', transition: 'border-color 0.2s, color 0.2s', textTransform: 'uppercase', letterSpacing: '0.02em' },
  activeLink: { color: 'var(--secondary)', borderBottomColor: 'var(--secondary)' },
  profileArea: { display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem', marginLeft: '0.5rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.8rem', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 'bold' },
};

export default Header;
