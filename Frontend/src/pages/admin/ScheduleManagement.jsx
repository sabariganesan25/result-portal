import React, { useState } from 'react';
import { FaCalendarPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const initialSchedules = [
  { id: 1, title: 'Nov/Dec 2025 Tier-1 UG Exams', startDate: '2025-11-15', endDate: '2025-12-10', status: 'Published' },
  { id: 2, title: 'April/May 2026 UG End Semesters', startDate: '2026-04-20', endDate: '2026-05-15', status: 'Draft' },
  { id: 3, title: 'Feb 2026 Re-valuation Phase', startDate: '2026-02-10', endDate: '2026-02-25', status: 'Upcoming' }
];

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState(initialSchedules);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return '#16a34a';
      case 'Draft': return '#94a3b8';
      case 'Upcoming': return '#eab308';
      default: return '#64748b';
    }
  };

  return (
    <div className="admin-schedule-mgmt">
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Academic Schedules</h2>
        <button style={styles.primaryBtn}>
          <FaCalendarPlus /> Create New Schedule
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Schedule Title</th>
                <th style={styles.th}>Start Date</th>
                <th style={styles.th}>End Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id} style={styles.tr}>
                  <td style={styles.td}><strong>{schedule.title}</strong></td>
                  <td style={styles.td}>{schedule.startDate}</td>
                  <td style={styles.td}>{schedule.endDate}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge, 
                      borderColor: getStatusColor(schedule.status),
                      color: getStatusColor(schedule.status),
                      backgroundColor: `${getStatusColor(schedule.status)}10`
                    }}>
                      {schedule.status === 'Published' && <FaCheckCircle style={{marginRight: '4px'}} />}
                      {schedule.status === 'Draft' && <FaExclamationCircle style={{marginRight: '4px'}} />}
                      {schedule.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.iconBtnPrimary} title="Edit">
                        <FaEdit />
                      </button>
                      <button style={styles.iconBtnDanger} title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  pageTitle: {
    color: '#0f172a',
    fontSize: '1.75rem',
    margin: 0
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.25rem',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontSize: '0.95rem'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    padding: '1.5rem'
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
    fontSize: '0.9rem',
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
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: '600',
    border: '1px solid'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem'
  },
  iconBtnPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    border: '1px solid #c7d2fe',
    padding: '0.4rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  iconBtnDanger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '0.4rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default ScheduleManagement;
