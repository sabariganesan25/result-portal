import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={styles.footer} className="no-print">
      <div className="container" style={styles.grid}>
        
        {/* Branding & Contact Column */}
        <div style={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <FaGraduationCap size={32} color="var(--accent)" />
            <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>AURCC</h2>
          </div>
          <p style={{ ...styles.text, marginBottom: '1.5rem' }}>
            Anna University Regional Campus Coimbatore (AURCC) is a premier autonomous institution affiliated to Anna University, committed to quality technical education and research excellence.
          </p>
          <div style={styles.contactItem}>
            <FaMapMarkerAlt color="var(--accent)" />
            <span style={styles.text}>123 Knowledge Park, Main Campus Road, Tech City - 560100</span>
          </div>
          <div style={styles.contactItem}>
            <FaPhoneAlt color="var(--accent)" />
            <span style={styles.text}>+91-80-23456789 / 90</span>
          </div>
          <div style={styles.contactItem}>
            <FaEnvelope color="var(--accent)" />
            <span style={styles.text}>controller.exams@aurcc.ac.in</span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div style={styles.column}>
          <h3 style={styles.colTitle}>Academic Links</h3>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Academic Calendar</a></li>
            <li><a href="#" style={styles.link}>Examination Timetable</a></li>
            <li><a href="#" style={styles.link}>Syllabus & Curriculum</a></li>
            <li><a href="#" style={styles.link}>Re-evaluation Form</a></li>
            <li><a href="#" style={styles.link}>Convocation Details</a></li>
            <li><a href="#" style={styles.link}>Library E-Resources</a></li>
          </ul>
        </div>

        {/* Policy & Rules Column */}
        <div style={styles.column}>
          <h3 style={styles.colTitle}>Rules & Regulations</h3>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Examination Guidelines</a></li>
            <li><a href="#" style={styles.link}>Grading System Policy</a></li>
            <li><a href="#" style={styles.link}>Anti-Ragging Act</a></li>
            <li><a href="#" style={styles.link}>Student Disciplinary Rules</a></li>
            <li><a href="#" style={styles.link}>Privacy Policy</a></li>
          </ul>
          
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Connect With Us</h4>
            <div style={styles.socialStrip}>
              <a href="#" style={styles.socialIcon}><FaFacebook size={20} /></a>
              <a href="#" style={styles.socialIcon}><FaTwitter size={20} /></a>
              <a href="#" style={styles.socialIcon}><FaLinkedin size={20} /></a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Copyright Strip */}
      <div style={styles.bottomStrip}>
        <div className="container" style={styles.bottomStripContainer}>
          <span style={styles.copyrightText}>
            &copy; {new Date().getFullYear()} Anna University Regional Campus Coimbatore (AURCC). All Rights Reserved.
          </span>
          <span style={styles.copyrightText}>
            Site Managed by Office of Controller of Examinations
          </span>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#0a192f', // A very deep blue/black
    color: '#cbd5e1',
    paddingTop: '4rem',
    marginTop: 'auto',
    fontFamily: 'var(--font-body)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '3rem',
    paddingBottom: '3rem'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  text: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#94a3b8'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  colTitle: {
    color: 'white',
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
    position: 'relative',
    paddingBottom: '0.5rem'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  link: {
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.2s',
    fontSize: '0.9rem'
  },
  socialStrip: {
    display: 'flex',
    gap: '1rem'
  },
  socialIcon: {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  bottomStrip: {
    backgroundColor: '#060f1e',
    padding: '1.5rem 0',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  bottomStripContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center'
  },
  copyrightText: {
    fontSize: '0.8rem',
    color: '#64748b'
  }
};

export default Footer;
