import React, { useState, useEffect } from 'react';
import { FaServer, FaUsers, FaTachometerAlt } from 'react-icons/fa';

const TrafficWidget = () => {
  const [activeUsers, setActiveUsers] = useState(124);
  const [requestsPerSec, setRequestsPerSec] = useState(12);
  const [latency, setLatency] = useState(45);
  const [mode, setMode] = useState('Normal'); // Normal, High, Critical

  useEffect(() => {
    const interval = setInterval(() => {
      if (mode === 'Normal') {
        setActiveUsers(Math.floor(Math.random() * 50) + 100);
        setRequestsPerSec(Math.floor(Math.random() * 20) + 10);
        setLatency(Math.floor(Math.random() * 30) + 30);
      } else if (mode === 'High') {
        setActiveUsers(Math.floor(Math.random() * 1000) + 500);
        setRequestsPerSec(Math.floor(Math.random() * 200) + 100);
        setLatency(Math.floor(Math.random() * 200) + 80);
      } else {
        setActiveUsers(Math.floor(Math.random() * 5000) + 4000);
        setRequestsPerSec(Math.floor(Math.random() * 1500) + 500);
        setLatency(Math.floor(Math.random() * 800) + 300);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [mode]);

  const simulateResultDay = () => setMode('Critical');
  const simulateNormal = () => setMode('Normal');

  const getStatusColor = () => {
    if (mode === 'Critical') return 'var(--danger)';
    if (mode === 'High') return 'var(--accent)';
    return 'var(--success)';
  };

  return (
    <div className="card" style={{ ...styles.widget, borderTop: `4px solid ${getStatusColor()}` }}>
      <div style={styles.header}>
        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaServer color={getStatusColor()} /> Live Traffic Monitor
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(), display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{mode} Load</span>
        </div>
      </div>
      
      <div style={styles.metrics}>
        <div style={styles.metric}>
          <FaUsers size={20} color="var(--text-muted)" />
          <div style={styles.metricData}>
            <span style={styles.value}>{activeUsers.toLocaleString()}</span>
            <span style={styles.label}>Active Users</span>
          </div>
        </div>
        <div style={styles.metric}>
          <FaTachometerAlt size={20} color="var(--text-muted)" />
          <div style={styles.metricData}>
            <span style={styles.value}>{requestsPerSec}</span>
            <span style={styles.label}>Req / Sec</span>
          </div>
        </div>
        <div style={styles.metric}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-muted)' }}>ms</div>
          <div style={styles.metricData}>
            <span style={{...styles.value, color: latency > 300 ? 'var(--danger)' : 'var(--text)'}}>{latency}</span>
            <span style={styles.label}>Latency</span>
          </div>
        </div>
      </div>
      
      <div style={styles.actions}>
        <button onClick={simulateNormal} className="btn" style={{...styles.actionBtn, backgroundColor: '#f1f5f9', color: 'var(--text)'}}>Normal</button>
        <button onClick={() => setMode('High')} className="btn btn-accent" style={styles.actionBtn}>High Traffic</button>
        <button onClick={simulateResultDay} className="btn btn-primary" style={styles.actionBtn}>Simulate Result Day</button>
      </div>
    </div>
  );
};

const styles = {
  widget: {
    padding: '1.5rem',
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border)'
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem'
  },
  metric: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  metricData: {
    display: 'flex',
    flexDirection: 'column'
  },
  value: {
    fontSize: '1.4rem',
    fontWeight: '700',
    lineHeight: 1
  },
  label: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  actionBtn: {
    flex: 1,
    fontSize: '0.8rem',
    padding: '0.4rem'
  }
};

export default TrafficWidget;
