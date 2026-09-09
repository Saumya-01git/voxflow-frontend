import React from 'react';

export default function Footer() {
  return (
    <footer 
      style={{
        marginTop: '48px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}
    >
      <p style={{ marginBottom: '8px' }}>
        Built with <span style={{ color: '#ec4899' }}>♥</span> using React.js + Node.js + Express
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.78rem' }}>
        <span>REST Architecture</span>
        <span>•</span>
        <span>Multilingual Neural Voices</span>
        <span>•</span>
        <span>High-Fidelity Audio</span>
      </div>
    </footer>
  );
}
