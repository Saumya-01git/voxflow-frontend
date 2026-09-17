import React from 'react';

export default function AudioControls({
  speed = 1.0,
  setSpeed,
  pitch = 0,
  setPitch,
  disabled = false
}) {
  return (
    <div style={{ marginTop: '22px', paddingTop: '20px', borderTop: '1.5px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-primary)' }}>
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
          style={{ fontSize: '0.86rem', padding: '5px 14px' }}
        >
          Reset to Default
        </button>
      </div>

      <div className="control-grid">
        {/* Speaking Speed Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.02rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Speaking Speed</span>
            <span style={{ fontWeight: 800, fontSize: '1.18rem', color: 'var(--accent-primary)' }}>{speed.toFixed(2)}x</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500 }}>
            <span>0.5x (Slow)</span>
            <span>1.0x (Normal)</span>
            <span>2.0x (Fast)</span>
          </div>
        </div>

        {/* Pitch Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.02rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Voice Pitch</span>
            <span style={{ fontWeight: 800, fontSize: '1.18rem', color: 'var(--accent-secondary)' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500 }}>
            <span>-50% (Deep)</span>
            <span>0% (Natural)</span>
            <span>+50% (High)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
