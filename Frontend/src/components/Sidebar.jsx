import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartPie, FaListAlt, FaTrophy, FaGraduationCap } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <FaGraduationCap size={32} color="var(--accent)" />
        <div style={styles.brandText}>
          <h2 style={styles.title}>AURCC</h2>
          <span style={styles.subtitle}>Student Portal</span>
        </div>
      </div>
      
      <nav style={styles.nav}>
        <NavLink 
          to="/" 
          end
          style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}
        >
          <FaChartPie size={18} /> Dashboard
        </NavLink>
        
        <NavLink 
          to="/semesters" 
          style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}
        >
          <FaListAlt size={18} /> Semesters
        </NavLink>
        
        <NavLink 
          to="/rank-list" 
          style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}
        >
          <FaTrophy size={18} /> Rank List
        </NavLink>
      </nav>
      
      <div style={styles.footerInfo}>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>© 2026 AURCC Academic</span>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-md)',
    zIndex: 20
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  title: {
    color: 'white',
    margin: 0,
    fontSize: '1.4rem',
    lineHeight: 1.2
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--accent)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1rem',
    gap: '0.5rem',
    flex: 1
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 500,
    transition: 'all 0.2s'
  },
  activeLink: {
    backgroundColor: 'var(--secondary)',
    color: 'white',
    boxShadow: 'var(--shadow-sm)'
  },
  footerInfo: {
    padding: '1.5rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  }
};

export default Sidebar;
