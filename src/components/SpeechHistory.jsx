import React, { useState } from 'react';
import DownloadButton from './DownloadButton';

export default function SpeechHistory({
  history = [],
  onSelectHistory,
  onToggleFavorite,
  onClearHistory
}) {
  const [filterFavorites, setFilterFavorites] = useState(false);

  const displayedHistory = filterFavorites
    ? history.filter((item) => item.isFavorite)
    : history;

  if (history.length === 0) return null;

  return (
    <section className="glass-card animate-fade-in" style={{ padding: '24px' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Speech Generation History</h3>
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
            {history.length} {history.length === 1 ? 'session' : 'sessions'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="chip-btn"
            onClick={() => setFilterFavorites(false)}
            style={{
              background: !filterFavorites ? 'rgba(99, 102, 241, 0.2)' : undefined,
              borderColor: !filterFavorites ? 'var(--accent-primary)' : undefined,
              color: !filterFavorites ? '#818cf8' : undefined
            }}
          >
            All ({history.length})
          </button>

          <button
            type="button"
            className="chip-btn"
            onClick={() => setFilterFavorites(true)}
            style={{
              background: filterFavorites ? 'rgba(236, 72, 153, 0.2)' : undefined,
              borderColor: filterFavorites ? 'var(--accent-pink)' : undefined,
              color: filterFavorites ? '#f472b6' : undefined
            }}
          >
            ★ Favorites ({history.filter((h) => h.isFavorite).length})
          </button>

          <button
            type="button"
            className="chip-btn"
            onClick={onClearHistory}
            style={{ color: '#f87171' }}
            title="Clear history"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
        {displayedHistory.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '24px 0' }}>
            No favorite speech items yet. Star any generation to save it here!
          </p>
        ) : (
          displayedHistory.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                transition: 'var(--transition)',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              {/* Left Column: Metadata & Text Snippet */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.voice}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    ({item.language})
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    • {item.timestamp}
                  </span>
                </div>
                <p 
                  style={{ 
                    fontSize: '0.82rem', 
                    color: 'var(--text-secondary)', 
                    margin: 0, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: '480px'
                  }}
                  title={item.text}
                >
                  "{item.text}"
                </p>
              </div>

              {/* Right Column: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Favorite Toggle Button */}
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    color: item.isFavorite ? '#fbbf24' : 'rgba(255, 255, 255, 0.25)',
                    padding: '4px'
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
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
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
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
