import React from 'react';

export default function ErrorMessage({ error, onDismiss, onRetry }) {
  if (!error) return null;

  // Determine error category
  const isNetwork = typeof error === 'string' 
    ? error.toLowerCase().includes('network') 
    : error.message?.toLowerCase().includes('network') || error.statusCode === 0;

  const isRateLimit = typeof error === 'object' && error.statusCode === 429;

  const message = typeof error === 'string' ? error : error.message || 'An unknown error occurred.';

  return (
    <div 
      className="glass-card animate-fade-in"
      role="alert"
      style={{
        padding: '16px 20px',
        borderLeft: '4px solid var(--danger)',
        background: 'rgba(239, 68, 68, 0.08)',
        borderColor: 'rgba(239, 68, 68, 0.25)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '14px',
        marginBottom: '4px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div 
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#ef4444'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f87171', margin: 0 }}>
              {isNetwork ? 'Network Connection Error' : isRateLimit ? 'Rate Limit Exceeded' : 'Request Error'}
            </h4>
            {error.statusCode && (
              <span 
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'rgba(239, 68, 68, 0.25)',
                  color: '#fca5a5'
                }}
              >
                HTTP {error.statusCode}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            {message}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onRetry && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onRetry}
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Dismiss alert"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
