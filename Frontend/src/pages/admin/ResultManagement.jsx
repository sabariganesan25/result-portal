import React, { useState } from 'react';
import { FaSearch, FaCheckCircle, FaSpinner, FaBullhorn, FaBan } from 'react-icons/fa';

// Mock list of result batches by department and semester
const initialBatches = [
  { id: 'b1', examSession: 'Nov/Dec 2025 Tier-1', department: 'Computer Science and Engineering', semester: 3, status: 'Processing', publishDate: null },
  { id: 'b2', examSession: 'Nov/Dec 2025 Tier-1', department: 'Computer Science and Engineering', semester: 5, status: 'Published', publishDate: '2026-03-30' },
  { id: 'b3', examSession: 'Nov/Dec 2025 Tier-1', department: 'Information Technology', semester: 3, status: 'Processing', publishDate: null },
  { id: 'b4', examSession: 'Nov/Dec 2025 Tier-1', department: 'Mechanical Engineering', semester: 7, status: 'Published', publishDate: '2026-03-25' },
  { id: 'b5', examSession: 'April/May 2026 UG', department: 'Electronics and Communication', semester: 4, status: 'Processing', publishDate: null },
];

const ResultManagement = () => {
  const [batches, setBatches] = useState(initialBatches);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBatches = batches.filter(b => 
    b.department.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.examSession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePublishStatus = (id) => {
    setBatches(batches.map(batch => {
      if (batch.id === id) {
        if (batch.status === 'Processing') {
          // Publish it
          const today = new Date().toISOString().split('T')[0];
          return { ...batch, status: 'Published', publishDate: today };
        } else {
          // Revoke it
          return { ...batch, status: 'Processing', publishDate: null };
        }
      }
      return batch;
    }));
  };

  return (
    <div className="admin-result-mgmt">
      <h2 style={styles.pageTitle}>Result Batch Management</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Manage the publication phases of semester results by department.
      </p>

      <div style={styles.card}>
        
        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <FaSearch color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by Department or Exam Session..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button style={styles.primaryBtn}>
            <FaBullhorn style={{marginRight: '0.4rem'}}/> Publish All Processing
          </button>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Exam Session</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Semester</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Publish Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => (
                <tr key={batch.id} style={styles.tr}>
                  <td style={styles.td}><strong>{batch.examSession}</strong></td>
                  <td style={styles.td}>{batch.department}</td>
                  <td style={styles.td}>Semester {batch.semester}</td>
                  <td style={styles.td}>
                    {batch.status === 'Published' ? (
                      <span style={{...styles.badge, backgroundColor: '#dcfce7', color: '#16a34a', borderColor: '#16a34a'}}>
                        <FaCheckCircle style={{ marginRight: '4px' }} /> Published
                      </span>
                    ) : (
                      <span style={{...styles.badge, backgroundColor: '#fdf2f8', color: '#db2777', borderColor: '#db2777'}}>
                        <FaSpinner style={{ marginRight: '4px' }} /> Processing
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>{batch.publishDate ? batch.publishDate : '-'}</td>
                  <td style={styles.td}>
                    {batch.status === 'Processing' ? (
                      <button 
                        onClick={() => togglePublishStatus(batch.id)} 
                        style={styles.publishActionBtn} 
                        title="Release Results"
                      >
                        Publish Results
                      </button>
                    ) : (
                      <button 
                        onClick={() => togglePublishStatus(batch.id)} 
                        style={styles.revokeActionBtn} 
                        title="Revoke Publication"
                      >
                        <FaBan style={{marginRight:'4px'}}/> Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredBatches.length === 0 && (
            <div style={styles.emptyState}>No batches found matching your search.</div>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  pageTitle: {
    marginBottom: '0.5rem',
    color: '#0f172a',
    fontSize: '1.75rem'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    padding: '1.5rem'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '1rem'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#f1f5f9',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    flex: '1',
    maxWidth: '450px'
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    fontSize: '0.95rem'
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.25rem',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0'
  },
  th: {
    padding: '1rem',
    fontWeight: '600',
    color: '#475569',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tr: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '1rem',
    color: '#334155',
    fontSize: '0.95rem'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid'
  },
  publishActionBtn: {
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'opacity 0.2s'
  },
  revokeActionBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #fca5a5',
    padding: '0.35rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    color: '#94a3b8',
    fontStyle: 'italic'
  }
};

export default ResultManagement;
