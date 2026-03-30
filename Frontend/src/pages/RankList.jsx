import React, { useState } from 'react';
import { mockLeaderboard } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { FaTrophy, FaSearch, FaMedal } from 'react-icons/fa';

const RankList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeaderboard = mockLeaderboard.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.regNo.includes(searchTerm)
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaTrophy color="var(--accent)" /> Department Rank List
          </h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>Computer Science and Engineering - Batch 2021-2025</p>
        </div>
        
        <div style={styles.searchBox}>
          <FaSearch color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search by name or reg no..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: '2rem' }}>Rank</th>
              <th>Student Name</th>
              <th>Registration No.</th>
              <th style={{ textAlign: 'right', paddingRight: '2rem' }}>CGPA</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((student) => {
              const isCurrentUser = user?.regNo === student.regNo;
              const isTopThree = student.rank <= 3;
              
              return (
                <tr 
                  key={student.rank} 
                  style={{
                    backgroundColor: isCurrentUser ? '#eff6ff' : 'transparent',
                    borderLeft: isCurrentUser ? '4px solid var(--secondary)' : '4px solid transparent'
                  }}
                >
                  <td style={{ paddingLeft: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: isTopThree ? 'bold' : 'normal' }}>
                      {student.rank === 1 && <FaMedal color="#fbbf24" size={20} />}
                      {student.rank === 2 && <FaMedal color="#94a3b8" size={20} />}
                      {student.rank === 3 && <FaMedal color="#b45309" size={20} />}
                      {student.rank > 3 && <span style={{ width: '20px', textAlign: 'center' }}>{student.rank}</span>}
                    </div>
                  </td>
                  <td style={{ fontWeight: isCurrentUser ? 'bold' : '500' }}>
                    {student.name} {isCurrentUser && <span className="badge badge-success" style={{ marginLeft: '0.5rem', fontSize: '0.6rem' }}>You</span>}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '1.05rem' }}>
                    {student.regNo}
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '2rem', fontWeight: 'bold', color: isCurrentUser ? 'var(--secondary)' : 'var(--text)' }}>
                    {student.cgpa.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredLeaderboard.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    width: '300px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem'
  }
};

export default RankList;
