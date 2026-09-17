import React, { useState } from 'react';
import DownloadButton from './DownloadButton';
import { useAuth } from '../context/AuthContext';

export default function SpeechHistory({
  history = [],
  onSelectHistory,
  onToggleFavorite,
  onDeleteHistory,
  onClearHistory
}) {
  const { isAuthenticated, user, openAuth } = useAuth();
  const [filterFavorites, setFilterFavorites] = useState(false);

  // If user is not authenticated, show personal history gate prompt (User Requirement)
  if (!isAuthenticated) {
    return (
      <section 
        className="fairy-card animate-fade-in" 
        style={{ 
          padding: '40px 32px', 
          textAlign: 'center',
          border: '2px dashed var(--accent-primary)',
          background: 'var(--bg-card)'
        }}
      >
        <div 
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(124, 58, 237, 0.1)',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7c3aed',
            fontSize: '1.5rem'
          }}
        >
          🔒
        </div>
        <h3 style={{ fontSize: '1.45rem', marginBottom: '8px', fontWeight: 800 }}>Personal Speech Vault</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Sign in or create a free account to automatically save your synthesized audio to your personal history library, star favorites, and unlock downloads.
        </p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openAuth('Sign in to access your personal speech history vault.')}
          style={{ padding: '12px 30px', fontSize: '1.02rem' }}
        >
          Sign In to Enable Vault
        </button>
      </section>
    );
  }

  const displayedHistory = filterFavorites
    ? history.filter((item) => item.isFavorite)
    : history;

  return (
    <section className="fairy-card animate-fade-in" style={{ padding: '28px 32px' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              boxShadow: 'var(--accent-glow)'
            }}
          >
            🎧
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800 }}>{user?.name ? `${user.name}'s Audio Vault` : 'Personal Speech History'}</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {history.length} {history.length === 1 ? 'saved generation' : 'saved generations'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="chip-btn"
            onClick={() => setFilterFavorites(false)}
            style={{
              background: !filterFavorites ? 'var(--accent-primary)' : undefined,
              borderColor: !filterFavorites ? 'var(--accent-primary)' : undefined,
              color: !filterFavorites ? '#ffffff' : undefined,
              padding: '8px 16px',
              fontSize: '0.94rem',
              fontWeight: 700
            }}
          >
            All ({history.length})
          </button>

          <button
            type="button"
            className="chip-btn"
            onClick={() => setFilterFavorites(true)}
            style={{
              background: filterFavorites ? 'var(--accent-secondary)' : undefined,
              borderColor: filterFavorites ? 'var(--accent-secondary)' : undefined,
              color: filterFavorites ? '#ffffff' : undefined,
              padding: '8px 16px',
              fontSize: '0.94rem',
              fontWeight: 700
            }}
          >
            ★ Favorites ({history.filter((h) => h.isFavorite).length})
          </button>

          {history.length > 0 && onClearHistory && (
            <button
              type="button"
              className="chip-btn"
              onClick={onClearHistory}
              style={{ color: '#dc2626', borderColor: '#fecaca', padding: '8px 16px', fontSize: '0.94rem' }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* History Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '440px', overflowY: 'auto', paddingRight: '6px' }}>
        {displayedHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.05rem', margin: 0 }}>
              {filterFavorites ? 'No favorites saved yet. Click the star on any item to pin it here!' : 'No speech history recorded yet. Convert some text to start building your audio library!'}
            </p>
          </div>
        ) : (
          displayedHistory.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-color)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                transition: 'var(--transition)',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              {/* Left Column: Metadata & Text Snippet */}
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.voice}
                  </span>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    ({item.language})
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    • {item.timestamp || new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p 
                  style={{ 
                    fontSize: '0.98rem', 
                    color: 'var(--text-secondary)', 
                    margin: 0, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: '520px',
                    lineHeight: 1.5
                  }}
                  title={item.text}
                >
                  "{item.text}"
                </p>
              </div>

              {/* Right Column: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Favorite Toggle Button */}
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    color: item.isFavorite ? '#f59e0b' : '#cbd5e1',
                    padding: '6px'
                  }}
                  title={item.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                >
                  {item.isFavorite ? '★' : '☆'}
                </button>

                {/* Replay / Select */}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onSelectHistory(item)}
                  style={{ padding: '8px 16px', fontSize: '0.92rem' }}
                >
                  ▶ Play
                </button>

                {/* Download Button */}
                {item.audioUrl && (
                  <DownloadButton
                    audioUrl={item.audioUrl}
                    filename={`voxflow_${item.voice}_${item.id}.mp3`}
                  />
                )}

                {/* Delete Item */}
                {onDeleteHistory && (
                  <button
                    type="button"
                    onClick={() => onDeleteHistory(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Delete item"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
