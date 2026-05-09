import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { FaTachometerAlt, FaUserGraduate, FaCalendarAlt, FaSignOutAlt, FaUniversity, FaBroadcastTower } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const { adminUser, logoutAdmin } = useAdminAuth();

  return (
    <div style={styles.container}>
      {/* Top Navbar */}
      <header style={styles.navbar}>
        <div style={styles.brand}>
          <FaUniversity size={24} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>Admin Portal</h2>
        </div>
        
        <nav style={styles.nav}>
          <NavLink to="/admin" end style={({isActive}) => isActive ? {...styles.navLink, ...styles.activeLink} : styles.navLink}>
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink to="/admin/results" style={({isActive}) => isActive ? {...styles.navLink, ...styles.activeLink} : styles.navLink}>
            <FaUserGraduate /> Result Management
          </NavLink>
          <NavLink to="/admin/schedules" style={({isActive}) => isActive ? {...styles.navLink, ...styles.activeLink} : styles.navLink}>
            <FaCalendarAlt /> Exam Schedules
          </NavLink>
          <NavLink to="/admin/smartops" style={({isActive}) => isActive ? {...styles.navLink, ...styles.activeLink} : styles.navLink}>
            <FaBroadcastTower /> SmartOps
          </NavLink>
        </nav>

        <div style={styles.navRight}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{adminUser?.name?.charAt(0) || 'A'}</div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{adminUser?.name || 'Administrator'}</div>
              <div style={styles.userRole}>{adminUser?.role || 'Super Admin'}</div>
            </div>
          </div>
          <button onClick={logoutAdmin} style={styles.logoutBtn} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={styles.main}>
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'var(--font-body)'
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a', // Darker oxford blue theme for admin
    color: '#ffffff',
    padding: '0 2rem',
    height: '70px',
    boxShadow: 'var(--shadow-md)',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '200px'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: '1',
    justifyContent: 'center'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    color: '#cbd5e1',
    textDecoration: 'none',
    borderRadius: '6px',
    transition: 'all 0.2s',
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  activeLink: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    minWidth: '200px',
    justifyContent: 'flex-end'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  userName: {
    fontWeight: '600',
    fontSize: '0.9rem',
    lineHeight: '1.2'
  },
  userRole: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#f87171',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '1.2rem'
  },
  main: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  }
};

export default AdminLayout;
