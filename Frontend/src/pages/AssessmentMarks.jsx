import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaPrint, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const AssessmentMarks = () => {
  const { user } = useAuth();
  const [activeSem, setActiveSem] = useState(6);
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await api.get(`/results/${user.registration_no}`);
        if (response.data.success) {
          setResultsData(response.data);
        }
      } catch (err) {
        console.error('Failed to load assessment marks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  if (!user || loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        {loading ? <FaSpinner className="spinner" /> : null}
        <p>{loading ? 'Loading marks...' : 'Access Denied'}</p>
      </div>
    );
  }

  const allResults = resultsData?.results || [];
  const subjects = allResults.filter(s => s.semester === activeSem);
  
  // If no subjects for selected sem, show first available sem or empty
  const displaySubjects = subjects.length > 0 ? subjects : (allResults.length > 0 ? allResults.filter(s => s.semester === allResults[0].semester) : []);
  
  const semList = [...new Set(allResults.map(s => s.semester))].sort((a, b) => a - b);

  const isFailed = (grade) => ['U', 'F', 'RA', 'AB'].includes(grade.toUpperCase());

  return (
    <div style={styles.container}>

      {/* Page Title Bar */}
      <div style={styles.actionRow} className="no-print">
        <h2 style={{ margin: 0, color: 'var(--primary)' }}>Assessment Marks</h2>
        <button className="btn btn-primary" style={styles.actionBtn} onClick={() => window.print()}>
          <FaPrint /> Print
        </button>
      </div>

      {/* Document Card */}
      <div className="card watermark-bg" style={styles.documentCard}>

        {/* University Header */}
        <div style={styles.docHeader}>
          <div style={styles.logoPlaceholder} className="doc-logo">AURCC</div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={styles.univName}>ANNA UNIVERSITY REGIONAL CAMPUS COIMBATORE</h1>
            <p style={styles.univDesc}>(An Autonomous Institution affiliated to Anna University, Chennai)</p>
            <h3 style={styles.docTitle}>INTERNAL & EXTERNAL ASSESSMENT MARKS</h3>
            <p style={styles.examSession}>Examinations Session: NOV/DEC 2025</p>
          </div>
        </div>



        {/* Semester Tabs — no-print */}
        <div className="no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {semList.map(sem => (
            <button key={sem} onClick={() => setActiveSem(sem)} style={{
              padding: '0.35rem 1rem', borderRadius: '4px', border: '1px solid',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              background: activeSem === sem ? '#002147' : '#f1f5f9',
              color: activeSem === sem ? 'white' : '#64748b',
              borderColor: activeSem === sem ? '#002147' : '#e2e8f0',
              transition: 'all 0.2s',
            }}>
              Sem {sem}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div className="table-responsive">
          <table style={styles.marksTable}>
            <thead>
              <tr>
                <th style={{ width: '14%', textAlign: 'center' }}>Subject Code</th>
                <th style={{ width: '50%' }}>Subject Name</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Int<br /><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>(50)</span></th>
                <th style={{ width: '12%', textAlign: 'center' }}>Ext<br /><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>(50)</span></th>
                <th style={{ width: '12%', textAlign: 'center' }}>Total<br /><span style={{ fontSize: '0.65rem', fontWeight: 400 }}>(100)</span></th>
              </tr>
            </thead>
            <tbody>
              {displaySubjects.map((sub, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{sub.subject_code}</td>
                  <td>{sub.subject_name}</td>
                  <td style={{ textAlign: 'center' }}>{sub.internal_marks}</td>
                  <td style={{ textAlign: 'center' }}>{sub.external_marks}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{sub.internal_marks + sub.external_marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>




        {/* Disclaimer */}
        <div style={{ borderTop: '1px dashed #9ca3af', paddingTop: '1rem', position: 'relative', zIndex: 1 }}>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', fontWeight: 'bold', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FaExclamationTriangle size={12} /> DISCLAIMER
          </p>
          <p style={styles.disclaimerText}>1. The results published online are provisional and strictly for immediate information to examinees. These cannot be treated as original mark sheets.</p>
          <p style={styles.disclaimerText}>2. Int = Internal Assessment Marks (max 50), Ext = External End-Semester Examination Marks (max 50), Total = Int + Ext (max 100). Minimum pass requires 50% aggregate with at least 45% in the external examination.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }}>
            <div style={{ width: 180, textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'black' }}>
              <span style={{ borderTop: '1px solid black', paddingTop: '0.2rem' }}>Controller of Examinations</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' },
  actionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' },
  documentCard: { backgroundColor: '#fff', border: '1px solid #d1d5db', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '2px', padding: '3rem', position: 'relative', overflow: 'hidden' },
  docHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '2px solid black', paddingBottom: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 },
  logoPlaceholder: { position: 'absolute', left: '1rem', top: 0, width: 60, height: 60, border: '2px solid var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.8rem' },
  univName: { margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'black', textTransform: 'uppercase' },
  univDesc: { margin: '0.25rem 0 0.75rem', fontSize: '0.8rem', color: '#4b5563' },
  docTitle: { margin: 0, fontSize: '1.1rem', textDecoration: 'underline', color: 'black' },
  examSession: { margin: '0.25rem 0 0', fontSize: '0.9rem', fontWeight: 'bold', color: 'black' },
  detailsTable: { width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '0.85rem' },
  detailsLabel: { width: '15%', backgroundColor: '#f3f4f6', fontWeight: 'bold', color: 'black', border: '1px solid black', padding: '0.4rem 0.5rem', whiteSpace: 'nowrap' },
  detailsValue: { width: '35%', color: 'black', border: '1px solid black', padding: '0.4rem 0.5rem', textTransform: 'uppercase', fontWeight: 600 },
  marksTable: { width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '0.85rem' },
  aggItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black', fontSize: '0.8rem' },
  disclaimerText: { margin: '0 0 0.3rem', fontSize: '0.65rem', color: '#4b5563', lineHeight: 1.4, textAlign: 'justify' },
};

export default AssessmentMarks;
