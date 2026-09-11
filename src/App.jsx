import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import VoiceSelector from './components/VoiceSelector';
import AudioControls from './components/AudioControls';
import ErrorMessage from './components/ErrorMessage';
import { LANGUAGES, VOICES } from './data/voices';
import { synthesizeSpeech, checkHealth } from './services/api';

export default function App() {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('en-US-JennyNeural');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);

  // Check backend server health on mount
  useEffect(() => {
    async function verifyHealth() {
      try {
        await checkHealth();
        setServerOnline(true);
      } catch {
        setServerOnline(false);
      }
    }
    verifyHealth();
  }, []);

  // Dynamically filter voices by selected language
  const availableVoices = useMemo(() => {
    return VOICES.filter((v) => v.language === selectedLanguage);
  }, [selectedLanguage]);

  // Handle language switch and auto-select matching first voice
  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    const firstVoice = VOICES.find((v) => v.language === newLang);
    if (firstVoice) {
      setSelectedVoice(firstVoice.id);
    }
  };

  // Handle speech synthesis request (REST API call)
  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError({ message: 'Text input cannot be empty. Please type or paste some text.' });
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await synthesizeSpeech({
        text: text.trim(),
        language: selectedLanguage,
        voice: selectedVoice,
        speed,
        pitch
      });

      console.log('Synthesis successful:', response);
    } catch (err) {
      console.error('TTS Synthesis error:', err);
      setError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar serverOnline={serverOnline} />

      <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Error Alert Banner */}
        <ErrorMessage
          error={error}
          onDismiss={() => setError(null)}
          onRetry={handleGenerateSpeech}
        />

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

        {/* Modular Text Input Component (Day 4) */}
        <TextInput
          text={text}
          setText={setText}
          maxLength={2000}
          disabled={isGenerating}
        />

        {/* Voice & Language Configuration (Day 5) */}
        <section className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
              Voice & Language Settings
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {availableVoices.length} voices available for this language
            </span>
          </div>

          <div className="control-grid">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              languages={LANGUAGES}
              disabled={isGenerating}
            />

            <VoiceSelector
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              availableVoices={availableVoices}
              disabled={isGenerating}
            />
          </div>

          {/* Speed & Pitch Customization */}
          <AudioControls
            speed={speed}
            setSpeed={setSpeed}
            pitch={pitch}
            setPitch={setPitch}
            disabled={isGenerating}
          />

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn-primary"
              disabled={!text.trim() || isGenerating}
              onClick={handleGenerateSpeech}
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
