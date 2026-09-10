import React from 'react';

const SAMPLES = [
  {
    label: 'English Intro',
    text: 'Welcome to VoxFlow. Our advanced neural text-to-speech platform transforms written words into rich, lifelike human speech instantly.'
  },
  {
    label: 'Hindi Greeting',
    text: 'नमस्ते! वोक्सफ्लो में आपका स्वागत है। हमारी न्यूरल स्पीच तकनीक शब्दों को सहज मानवीय आवाज़ में बदलती है।'
  },
  {
    label: 'Spanish Quote',
    text: 'Hola y bienvenidos a VoxFlow. Convierte cualquier texto escrito en una voz humana completamente natural y expresiva.'
  }
];

export default function TextInput({ text, setText, maxLength = 2000, disabled = false }) {
  const charCount = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const estimatedSeconds = Math.max(1, Math.round(words / 2.5)); // avg 150 words per minute
  const progressPercent = Math.min(100, (charCount / maxLength) * 100);

  // Dynamic progress color
  let progressColor = '#10b981'; // green
  if (charCount > maxLength * 0.85) progressColor = '#ef4444'; // red
  else if (charCount > maxLength * 0.7) progressColor = '#f59e0b'; // amber

  const handleClear = () => {
    setText('');
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        const combined = (text + ' ' + clipText).trim().slice(0, maxLength);
        setText(combined);
      }
    } catch (err) {
      console.warn('Clipboard access denied or unavailable', err);
    }
  };

  const handleSample = (sampleText) => {
    setText(sampleText);
  };

  return (
    <section className="glass-card" style={{ padding: '24px' }}>
      {/* Header & Quick Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Text Input
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
            Max {maxLength.toLocaleString()} chars
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="chip-btn"
            onClick={handlePaste}
            disabled={disabled || charCount >= maxLength}
            title="Paste text from your clipboard"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            </svg>
            Paste
          </button>

          <button
            type="button"
            className="chip-btn"
            onClick={handleClear}
            disabled={disabled || charCount === 0}
            title="Clear current text"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
            Clear
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <textarea
        className="tts-textarea"
        placeholder="Enter or paste any text to convert into high-quality spoken audio..."
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxLength))}
        maxLength={maxLength}
        disabled={disabled}
        rows={6}
      />

      {/* Character Progress Bar */}
      <div className="char-progress-bar">
        <div 
          className="char-progress-fill" 
          style={{ width: `${progressPercent}%`, backgroundColor: progressColor }}
        />
      </div>

      {/* Live Statistics & Quick Presets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span style={{ color: charCount >= maxLength ? '#ef4444' : 'inherit', fontWeight: charCount >= maxLength ? 600 : 400 }}>
            {charCount.toLocaleString()} / {maxLength.toLocaleString()} characters
          </span>
          <span>•</span>
          <span>{words.toLocaleString()} {words === 1 ? 'word' : 'words'}</span>
          <span>•</span>
          <span>~{estimatedSeconds}s spoken time</span>
        </div>

        {/* Sample Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Samples:</span>
          {SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="chip-btn"
              style={{ fontSize: '0.72rem', padding: '2px 8px' }}
              onClick={() => handleSample(sample.text)}
              disabled={disabled}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Boundary Warning Alert */}
      {charCount >= maxLength && (
        <div className="validation-alert warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>Maximum text limit reached ({maxLength} characters). Additional characters will not be added.</span>
        </div>
      )}
    </section>
  );
}
