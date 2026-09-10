import React from 'react';

export default function VoiceSelector({
  selectedVoice,
  onVoiceChange,
  availableVoices = [],
  disabled = false
}) {
  const currentVoice = availableVoices.find((v) => v.id === selectedVoice) || availableVoices[0];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Voice Persona
        </label>
        {currentVoice && (
          <span 
            style={{ 
              fontSize: '0.72rem', 
              padding: '2px 8px', 
              borderRadius: 'var(--radius-full)', 
              background: currentVoice.gender === 'Female' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              color: currentVoice.gender === 'Female' ? '#f472b6' : '#818cf8',
              border: `1px solid ${currentVoice.gender === 'Female' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
            }}
          >
            {currentVoice.gender === 'Female' ? '♀ Female' : '♂ Male'} • Neural HD
          </span>
        )}
      </div>

      <select
        className="tts-select"
        value={selectedVoice}
        onChange={(e) => onVoiceChange(e.target.value)}
        disabled={disabled || availableVoices.length === 0}
      >
        {availableVoices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name} ({voice.gender}) — {voice.description}
          </option>
        ))}
      </select>

      {currentVoice && (
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
          💡 {currentVoice.description}
        </p>
      )}
    </div>
  );
}
