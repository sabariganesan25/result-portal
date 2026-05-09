import React from 'react';
import { FaUserGraduate, FaCalendarCheck, FaChartLine, FaCheckCircle } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2 style={styles.pageTitle}>Dashboard Overview</h2>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.iconWrapper, backgroundColor: '#e0e7ff', color: '#4f46e5'}}>
            <FaUserGraduate size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Total Students</div>
            <div style={styles.statValue}>12,450</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.iconWrapper, backgroundColor: '#dcfce7', color: '#16a34a'}}>
            <FaCheckCircle size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Overall Pass %</div>
            <div style={styles.statValue}>84.5%</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.iconWrapper, backgroundColor: '#fef3c7', color: '#d97706'}}>
            <FaCalendarCheck size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Active Schedules</div>
            <div style={styles.statValue}>3</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.iconWrapper, backgroundColor: '#fee2e2', color: '#dc2626'}}>
            <FaChartLine size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Pending Re-valuations</div>
            <div style={styles.statValue}>420</div>
          </div>
        </div>
      </div>

      <div style={styles.recentSection}>
        <h3 style={styles.sectionTitle}>Recent Activity</h3>
        <div style={styles.activityList}>
          <div style={styles.activityItem}>
            <div style={styles.activityIndicator}></div>
            <div style={styles.activityContent}>
              <strong>Nov/Dec 2025 Tier-1 Results</strong> published.
              <span style={styles.activityTime}>2 hours ago</span>
            </div>
          </div>
          <div style={styles.activityItem}>
            <div style={styles.activityIndicator}></div>
            <div style={styles.activityContent}>
              <strong>B.Tech IT 3rd Sem</strong> internal marks updated by HOD.
              <span style={styles.activityTime}>5 hours ago</span>
            </div>
          </div>
          <div style={styles.activityItem}>
            <div style={styles.activityIndicator}></div>
            <div style={styles.activityContent}>
              <strong>Exam Schedule</strong> for April/May 2026 drafted.
              <span style={styles.activityTime}>1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageTitle: {
    marginBottom: '2rem',
    color: '#0f172a',
    fontSize: '1.75rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem'
  },
  iconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '0.25rem'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a'
  },
  recentSection: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    marginBottom: '1.5rem',
    color: '#0f172a',
    fontSize: '1.25rem'
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  activityItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start'
  },
  activityIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    marginTop: '0.35rem'
  },
  activityContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    color: '#334155',
    fontSize: '0.95rem'
  },
  activityTime: {
    fontSize: '0.8rem',
    color: '#94a3b8'
  }
};

export default AdminDashboard;
