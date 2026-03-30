import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaIdBadge, FaGraduationCap, FaCodeBranch, FaCalendarAlt, FaUniversity, FaBirthdayCake } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading profile…</div>;

  const fields = [
    { icon: <FaIdBadge size={18} />,       label: 'Registration No.', value: user.regNo },
    { icon: <FaGraduationCap size={18} />, label: 'Degree',           value: user.degree },
    { icon: <FaCodeBranch size={18} />,    label: 'Branch',           value: user.branch },
    { icon: <FaCalendarAlt size={18} />,   label: 'Batch',            value: user.batch },
    { icon: <FaUniversity size={18} />,    label: 'College',          value: user.college || 'Anna University Regional Campus Coimbatore' },
    { icon: <FaBirthdayCake size={18} />,  label: 'Date of Birth',    value: user.dob },
  ];

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="animate-slide-in" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      padding: '3rem 1rem', minHeight: '80vh',
    }}>
      <div style={{
        width: '100%', maxWidth: '860px',
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,33,71,0.18)',
        background: '#fff',
      }}>

        {/* ── Hero Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #002147 0%, #0a3260 45%, #7a0016 100%)',
          padding: '3rem 3rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }} className="banner-hero">
          {/* Decorative circles */}
          <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
          <div style={{ position:'absolute', bottom:-80, left:-30, width:260, height:260, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
          <div style={{ position:'absolute', top:20, right:160, width:100, height:100, borderRadius:'50%', background:'rgba(245,158,11,0.08)' }} />

          <p style={{ margin:'0 0 1.5rem', fontSize:'0.72rem', color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'3px' }}>
            Anna University Regional Campus Coimbatore
          </p>

          {/* Avatar + Name */}
          <div style={{ display:'flex', alignItems:'center', gap:'1.75rem', position:'relative', zIndex:1 }}>
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))',
              border: '3px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', fontWeight: 800, color: 'white',
              letterSpacing: '-1px', flexShrink: 0,
              backdropFilter: 'blur(8px)',
            }}>
              {initials}
            </div>
            <div>
              <h1 style={{ margin:0, color:'white', fontSize:'2rem', fontFamily:'var(--font-heading)', letterSpacing:'-0.5px', textShadow:'0 2px 12px rgba(0,0,0,0.2)' }}>
                {user.name}
              </h1>
              <p style={{ margin:'0.4rem 0 0', color:'rgba(255,255,255,0.65)', fontSize:'0.92rem' }}>
                {user.degree} · {user.branch}
              </p>
            </div>
          </div>
        </div>

        {/* ── Pull-up card ── */}
        <div style={{
          background: '#fff',
          margin: '-2rem 2.5rem 0',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,33,71,0.12)',
          padding: '1.75rem 2rem',
          position: 'relative',
          zIndex: 2,
        }} className="pullup-card">
          <p style={{ margin:'0 0 1.25rem', fontSize:'0.72rem', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'2px', fontWeight:600 }}>
            Student Information
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.25rem' }} className="pullup-grid">
            {fields.map(({ icon, label, value }) => (
              <div key={label} style={{
                display:'flex', alignItems:'flex-start', gap:'1rem',
                padding:'1rem 1rem', borderRadius:'8px',
                transition:'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  width:38, height:38, borderRadius:'10px', flexShrink:0,
                  background:'linear-gradient(135deg,#002147,#183e6b)',
                  color:'white', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {icon}
                </span>
                <div>
                  <p style={{ margin:0, fontSize:'0.75rem', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', fontWeight:600 }}>{label}</p>
                  <p style={{ margin:'0.2rem 0 0', fontSize:'0.95rem', color:'#1e293b', fontWeight:600, lineHeight:1.4 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer strip ── */}
        <div style={{
          margin:'1.5rem 2.5rem 2.5rem',
          padding:'1rem 1.5rem',
          background:'linear-gradient(90deg,#002147,#7a0016)',
          borderRadius:'10px',
          display:'flex', alignItems:'center', justifyContent:'center',
          gap:'0.75rem',
        }} className="footer-strip">
          <FaUniversity color="rgba(255,255,255,0.7)" size={14} />
          <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.8rem', letterSpacing:'0.5px' }}>
            AURCC · Office of the Controller of Examinations · Student Academic Portal
          </span>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
