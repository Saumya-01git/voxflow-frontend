import React from 'react';

export default function Footer() {
  return (
    <footer 
      style={{
        marginTop: '56px',
        paddingTop: '28px',
        borderTop: '1.5px solid var(--border-color)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '1rem'
      }}
    >
      <p style={{ marginBottom: '10px', fontWeight: 500 }}>
        Crafted with <span style={{ color: '#ec4899' }}>♥</span> for enchanting, lifelike speech synthesis
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <span>17 Neural Voice Personas</span>
        <span>•</span>
        <span>8 Global Languages</span>
        <span>•</span>
        <span>Personal Audio Vault</span>
      </div>
    </footer>
  );
}
