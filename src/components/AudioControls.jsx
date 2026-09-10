import React from 'react';

export default function AudioControls({
  speed = 1.0,
  setSpeed,
  pitch = 0,
  setPitch,
  disabled = false
}) {
  return (
    <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Voice Modulation (Speed & Pitch)
        </span>
        <button
          type="button"
          className="chip-btn"
          onClick={() => {
            setSpeed(1.0);
            setPitch(0);
          }}
          disabled={disabled || (speed === 1.0 && pitch === 0)}
          style={{ fontSize: '0.72rem', padding: '2px 8px' }}
        >
          Reset to Default
        </button>
      </div>

      <div className="control-grid">
        {/* Speaking Speed Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Speaking Speed</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{speed.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            className="audio-scrubber"
            min="0.5"
            max="2.0"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            disabled={disabled}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>0.5x (Slow)</span>
            <span>1.0x (Normal)</span>
            <span>2.0x (Fast)</span>
          </div>
        </div>

        {/* Pitch Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Voice Pitch</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>
              {pitch > 0 ? `+${pitch}%` : `${pitch}%`}
            </span>
          </div>
          <input
            type="range"
            className="audio-scrubber"
            min="-50"
            max="50"
            step="5"
            value={pitch}
            onChange={(e) => setPitch(parseInt(e.target.value, 10))}
            disabled={disabled}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>-50% (Deep)</span>
            <span>0% (Natural)</span>
            <span>+50% (High)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
