import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ serverOnline = false, theme = 'light', onToggleTheme }) {
  const { user, isAuthenticated, logout, openAuth, openProfile } = useAuth();

  return (
    <header className="header-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div 
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--accent-glow)'
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 800 }}>
              Vox<span className="gradient-text">Flow</span>
            </h1>
            <span 
              style={{
                fontSize: '0.82rem',
                padding: '3px 10px',
                borderRadius: '8px',
                background: 'rgba(124, 58, 237, 0.12)',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              AI STUDIO
            </span>
          </div>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)', margin: '3px 0 0', fontWeight: 500 }}>
            Neural Multilingual Speech Platform
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Theme Toggle Key (Light / Dark Mode) */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="chip-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{
              padding: '7px 16px',
              fontSize: '0.94rem',
              fontWeight: 700,
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '1.15rem' }}>{theme === 'light' ? '🌙' : '☀️'}</span>
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        )}

        {/* Engine Status Pill */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.92rem',
            fontWeight: 600,
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            background: serverOnline ? 'rgba(5, 150, 105, 0.12)' : 'rgba(217, 119, 6, 0.12)',
            border: `1.5px solid ${serverOnline ? 'rgba(5, 150, 105, 0.35)' : 'rgba(217, 119, 6, 0.35)'}`,
            color: serverOnline ? 'var(--success)' : 'var(--warning)'
          }}
        >
          <span 
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: serverOnline ? 'var(--success)' : 'var(--warning)', 
              display: 'inline-block' 
            }}
          />
          {serverOnline ? 'Neural Connected' : 'Engine Standby'}
        </div>

        {/* User Account Controls */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button"
              onClick={openProfile}
              className="chip-btn"
              title="Click to view Profile & change password"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-color)',
                padding: '6px 14px 6px 8px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'pointer'
              }}
            >
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.88rem',
                  fontWeight: 700
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.name || 'Account'}
              </span>
              <span style={{ fontSize: '0.84rem', color: 'var(--accent-primary)', fontWeight: 700, background: 'rgba(124, 58, 237, 0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                Profile ⚙️
              </span>
            </button>

            <button
              type="button"
              className="chip-btn"
              onClick={logout}
              style={{ color: 'var(--danger)', fontSize: '0.92rem', padding: '8px 16px' }}
              title="Log out of account"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={() => openAuth()}
            style={{ padding: '11px 24px', fontSize: '0.98rem' }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
