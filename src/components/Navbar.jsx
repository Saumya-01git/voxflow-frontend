import React from 'react';

export default function Navbar({ serverOnline = false }) {
  return (
    <header className="header-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--accent-glow)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', margin: 0 }}>
            Vox<span className="gradient-text">Flow</span>
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Multilingual Text-to-Speech Platform
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: serverOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${serverOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            color: serverOnline ? '#10b981' : '#f59e0b'
          }}
        >
          <span 
            style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: serverOnline ? '#10b981' : '#f59e0b', 
              display: 'inline-block' 
            }}
          />
          {serverOnline ? 'Engine Connected' : 'Engine Standby'}
        </div>
        <span 
          style={{
            fontSize: '0.75rem',
            padding: '4px 8px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            color: 'var(--text-muted)'
          }}
        >
          v1.0.0
        </span>
      </div>
    </header>
  );
}
