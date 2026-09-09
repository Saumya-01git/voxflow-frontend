import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('en-US-JennyNeural');
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="app-container">
      <Navbar />

      <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Hero Section */}
        <section className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                Transform Text into <span className="gradient-text">Lifelike Speech</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '580px' }}>
                Generate crystal-clear speech across global languages and natural neural accents with instant browser playback and MP3 download.
              </p>
            </div>
            <div className="sound-wave">
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
            </div>
          </div>
        </section>

        {/* Text Input Section Container (Prepped for Day 4) */}
        <section className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <label style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Text Input
            </label>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Max 2000 characters
            </span>
          </div>

          <textarea
            className="tts-textarea"
            placeholder="Type or paste your text here to convert into natural speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>Characters: {text.length} / 2000</span>
            <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
          </div>
        </section>

        {/* Voice Configuration & Controls (Prepped for Day 5) */}
        <section className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>
            Voice & Language Settings
          </h3>
          <div className="control-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Language
              </label>
              <select 
                className="tts-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="en-US">English (United States)</option>
                <option value="hi-IN">Hindi (India)</option>
                <option value="gu-IN">Gujarati (India)</option>
                <option value="mr-IN">Marathi (India)</option>
                <option value="es-ES">Spanish (Spain)</option>
                <option value="fr-FR">French (France)</option>
                <option value="de-DE">German (Germany)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Voice Persona
              </label>
              <select 
                className="tts-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
              >
                <option value="en-US-JennyNeural">Jenny (Female - Neural)</option>
                <option value="en-US-GuyNeural">Guy (Male - Neural)</option>
                <option value="en-US-AriaNeural">Aria (Female - Expressive)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn-primary"
              disabled={!text.trim() || isGenerating}
              onClick={() => setIsGenerating(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Speech'}</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
