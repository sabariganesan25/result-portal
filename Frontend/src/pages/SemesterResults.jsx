import React from 'react';
import { useAuth } from '../context/AuthContext';
import { semesterResults } from '../data/mockData';
import { FaPrint, FaDownload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const SemesterResults = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading student record...
      </div>
    );
  }

  // Using Mock Data instead of backend
  const activeSem = 6;
  const data = semesterResults.find(s => s.semester === activeSem) || semesterResults[0];
  const subjects = data.subjects || [];
  const totalCredits = subjects.reduce((sum, sub) => sum + sub.credits, 0) || 22;

  // Compute SGPA strictly for realism
  let earnedPoints = 0;
  subjects.forEach(sub => {
    let points = 0;
    if (sub.grade === 'O') points = 10;
    else if (sub.grade === 'S' || sub.grade === 'A+') points = 10; // adapting dummy grades
    else if (sub.grade === 'A') points = 9;
    else if (sub.grade === 'B+' || sub.grade === 'B') points = 8;
    else if (sub.grade === 'C+' || sub.grade === 'C') points = 7;
    else if (sub.grade === 'D') points = 6;
    else if (sub.grade === 'E') points = 5;
    else if (sub.grade === 'P') points = 4;
    else points = 0; // U / F
    
    earnedPoints += points * sub.credits;
  });
  
  const sgpa = (earnedPoints / totalCredits).toFixed(2);
  // Ensure we use the backend CGPA representation if available
  const displaySgpa = isNaN(sgpa) ? (user.cgpa || 0.00).toFixed(2) : sgpa;

  const handlePrint = () => {
    window.print();
  };

  const isFailed = (grade) => ['U', 'F', 'RA', 'AB'].includes(grade.toUpperCase());

  return (
    <div style={styles.container}>
      {/* Control Actions - Hidden when printing */}
      <div style={styles.actionRow} className="no-print">
        <h2 style={{ margin: 0, color: 'var(--primary)' }}>Academic Results</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" style={styles.actionBtn} onClick={handlePrint}>
            <FaPrint /> Print Result
          </button>
        </div>
      </div>
      
      {/* Official Result Document Wrapper */}
      <div className="card watermark-bg" style={styles.documentCard}>
        
        {/* University Header */}
        <div style={styles.docHeader}>
          <div style={styles.logoPlaceholder}>AURCC</div>
          <div style={styles.docHeaderText}>
            <h1 style={styles.univName}>ANNA UNIVERSITY REGIONAL CAMPUS COIMBATORE</h1>
            <p style={styles.univDesc}>(An Autonomous Institution affiliated to Anna University, Chennai)</p>
            <h3 style={styles.docTitle}>PROVISIONAL SEMESTER GRADE SHEET</h3>
            <p style={styles.examSession}>Examinations Session: NOV/DEC 2025</p>
          </div>
        </div>

        {/* Candidate Details Table */}
        <div style={styles.candidateSection}>
          <table style={styles.detailsTable}>
            <tbody>
              <tr>
                <td style={styles.detailsLabel}>Register Number</td>
                <td style={styles.detailsValue}>{user.regNo}</td>
                <td style={styles.detailsLabel}>Semester</td>
                <td style={styles.detailsValue}>{activeSem}</td>
              </tr>
              <tr>
                <td style={styles.detailsLabel}>Candidate Name</td>
                <td style={styles.detailsValue}>{user.name}</td>
                <td style={styles.detailsLabel}>Programme</td>
                <td style={styles.detailsValue}>B.Tech</td>
              </tr>
              <tr>
                <td style={styles.detailsLabel}>Branch/Department</td>
                <td colSpan="3" style={styles.detailsValue}>{user.branch || user.dept}</td>
              </tr>
              <tr>
                <td style={styles.detailsLabel}>Institution Code</td>
                <td style={styles.detailsValue}>7115</td>
                <td style={styles.detailsLabel}>Result Date</td>
                <td style={styles.detailsValue}>Mar 24, 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Marks Table */}
        <div style={styles.marksSection}>
          <table style={styles.marksTable}>
            <thead>
              <tr>
                <th style={{ width: '20%', textAlign: 'center' }}>Subject Code</th>
                <th style={{ width: '60%' }}>Subject Name</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Grade</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => {
                const failed = isFailed(sub.grade);
                return (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{sub.code}</td>
                    <td>{sub.name}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{sub.grade}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: failed ? 'var(--danger)' : 'var(--success)' }}>
                      {failed ? 'FAIL' : 'PASS'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>



        {/* Strict Disclaimers */}
        <div style={styles.disclaimerSection}>
          <p style={styles.disclaimerTitle}>
            <FaExclamationTriangle size={12} /> DISCLAIMER
          </p>
          <p style={styles.disclaimerText}>
            1. The results published online are provisional and are strictly for immediate information to the examinees. These cannot be treated as original mark sheets. Original mark sheets will be issued by the University separately.
          </p>
          <p style={styles.disclaimerText}>
            2. The University is not responsible for any inadvertent errors that may have crept into the results being published on the internet.
          </p>
          <p style={styles.disclaimerText}>
            3. Minimum pass requires 50% aggregate with a minimum of 45% in external examination. Detailed internal and external marks are available under the 'Assessment Marks' section.
          </p>
          
          <div style={styles.footerSignature}>
            <div style={styles.sigBox}>
              <span style={{ borderTop: '1px solid black', paddingTop: '0.2rem' }}>Controller of Examinations</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '3rem'
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border)'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 'normal'
  },
  documentCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    borderRadius: '2px', // more paper-like
    padding: '3rem !important', // will be expanded during print
    position: 'relative',
    overflow: 'hidden'
  },
  docHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: '2px solid black',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
    position: 'relative',
    zIndex: 1
  },
  logoPlaceholder: {
    position: 'absolute',
    left: '1rem',
    top: '0',
    width: '60px',
    height: '60px',
    border: '2px solid var(--primary)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'var(--primary)',
    fontSize: '0.8rem'
  },
  docHeaderText: {
    textAlign: 'center'
  },
  univName: {
    margin: 0,
    fontSize: '1.4rem',
    fontFamily: 'var(--font-heading)',
    color: 'black',
    textTransform: 'uppercase'
  },
  univDesc: {
    margin: '0.25rem 0 0.75rem',
    fontSize: '0.8rem',
    color: '#4b5563'
  },
  docTitle: {
    margin: 0,
    fontSize: '1.1rem',
    textDecoration: 'underline',
    color: 'black'
  },
  examSession: {
    margin: '0.25rem 0 0',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: 'black'
  },
  candidateSection: {
    marginBottom: '1.5rem',
    position: 'relative',
    zIndex: 1
  },
  detailsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid black',
    fontSize: '0.85rem'
  },
  detailsLabel: {
    width: '15%',
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    color: 'black',
    border: '1px solid black',
    padding: '0.4rem 0.5rem',
    whiteSpace: 'nowrap'
  },
  detailsValue: {
    width: '35%',
    color: 'black',
    border: '1px solid black',
    padding: '0.4rem 0.5rem',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  marksSection: {
    marginBottom: '1.5rem',
    position: 'relative',
    zIndex: 1
  },
  marksTable: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid black',
    fontSize: '0.85rem'
  },
  summarySection: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '2rem',
    position: 'relative',
    zIndex: 1
  },
  aggregateBox: {
    display: 'flex',
    gap: '2rem',
    padding: '0.75rem 1.5rem',
    border: '1px solid black',
    backgroundColor: '#f9fafb'
  },
  aggItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'black',
    fontSize: '0.8rem'
  },
  disclaimerSection: {
    borderTop: '1px dashed #9ca3af',
    paddingTop: '1rem',
    position: 'relative',
    zIndex: 1
  },
  disclaimerTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#b91c1c',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  disclaimerText: {
    margin: '0 0 0.3rem 0',
    fontSize: '0.65rem',
    color: '#4b5563',
    lineHeight: 1.4,
    textAlign: 'justify'
  },
  footerSignature: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '3rem'
  },
  sigBox: {
    width: '180px',
    textAlign: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: 'black'
  }
};

export default SemesterResults;
