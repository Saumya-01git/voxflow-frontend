import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import AudioControls from './components/AudioControls';
import AudioPlayer from './components/AudioPlayer';
import SpeechHistory from './components/SpeechHistory';
import ErrorMessage from './components/ErrorMessage';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import FileUploader from './components/FileUploader';
import { LANGUAGES, VOICES } from './data/voices';
import { synthesizeSpeech, checkHealth, fetchUserHistory, toggleFavoriteApi, deleteHistoryApi } from './services/api';
import { useAuth } from './context/AuthContext';

const AI_PRESETS = [
  { label: '🧚 Fairy Tale / Story', speed: 0.9, pitch: 6, desc: 'Warm, enchanting & whimsical' },
  { label: '🌙 Calming Bedtime', speed: 0.85, pitch: -2, desc: 'Gentle, relaxing & deep sleep' },
  { label: '🎙️ Natural Conversation', speed: 1.0, pitch: 0, desc: 'Everyday casual human cadence' },
  { label: '💼 Enterprise & News', speed: 1.05, pitch: -4, desc: 'Authoritative & articulate' },
  { label: '🎧 Audio Book Reader', speed: 0.95, pitch: 0, desc: 'Clear, steady & expressive' }
];

const FAIRY_TALE_STORIES = [
  {
    id: 'starlight-grove',
    title: 'The Enchanted Starlight Grove',
    genre: '✨ Fairy Tale Magic',
    category: 'magic',
    excerpt: 'Long ago, beyond the whispering silver mist, there lived a gentle guardian of forgotten dreams who gathered starlight in handblown glass lanterns. Every twilight, the elder willow trees swayed softly in the evening breeze, welcoming lost travelers with glowing fireflies and tranquil peace.',
    voice: 'en-US-JennyNeural',
    language: 'en-US',
    speed: 0.9,
    pitch: 6,
    mood: 'Warm & Whimsical'
  },
  {
    id: 'whispering-pines',
    title: 'The Whispering Pines Lullaby',
    genre: '🌙 Calming Bedtime',
    category: 'bedtime',
    excerpt: 'The twilight dusk gently settles over the emerald mountains. Deep in the quiet valley, the ancient pine trees murmur soothing bedtime melodies. The gentle stream flows quietly over smooth river stones, guiding every weary heart into a state of deep, restorative rest.',
    voice: 'en-US-GuyNeural',
    language: 'en-US',
    speed: 0.85,
    pitch: -2,
    mood: 'Deep & Soothing'
  },
  {
    id: 'moonlit-mermaid',
    title: 'The Song of the Moonlit Mermaid',
    genre: '🌊 Ocean Serenity',
    category: 'meditation',
    excerpt: 'Beneath the moonlit tides of the sapphire ocean, waves shimmer like powdered silver. High upon the coral reefs, the guardian mermaid sings a timeless melody that calms raging storms and brings harmony to the deep waters.',
    voice: 'hi-IN-SwaraNeural',
    language: 'hi-IN',
    speed: 0.9,
    pitch: 4,
    mood: 'Lyrical & Dreamy'
  },
  {
    id: 'dragon-peaks',
    title: 'The Dragon of the Crystal Peaks',
    genre: '🐉 Fantasy Legend',
    category: 'magic',
    excerpt: 'High above the snow-capped summits where starlight touches crystalline glaciers, the sapphire dragon unfurls majestic wings. Its breath is not of fire, but of glowing stardust that illuminates the quiet kingdom below in radiant hues of violet and azure.',
    voice: 'en-US-ChristopherNeural',
    language: 'en-US',
    speed: 0.98,
    pitch: -4,
    mood: 'Epic & Resonant'
  },
  {
    id: 'secret-garden',
    title: 'The Secret Garden of Whispers',
    genre: '🌸 Meditative Nature',
    category: 'meditation',
    excerpt: 'Past the moss-covered stone archway, dew drops cling to fragrant rose petals in the quiet morning light. A velvet hummingbird hovers gently, welcoming a tranquil day where worries dissolve and peaceful stillness fills every corner.',
    voice: 'en-US-AriaNeural',
    language: 'en-US',
    speed: 0.92,
    pitch: 4,
    mood: 'Gentle & Peaceful'
  }
];

export default function App() {
  const { isAuthenticated, user, openAuth } = useAuth();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'fairytale' | 'vault' | 'docs' | 'showcase'

  // Fairy tale category filter
  const [fairyCategory, setFairyCategory] = useState('all');

  // Speech Generation State
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('en-US-JennyNeural');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [history, setHistory] = useState([]);

  // Check backend server health
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

  // Fetch personalized history for authenticated user
  useEffect(() => {
    async function loadUserHistory() {
      if (isAuthenticated) {
        try {
          const res = await fetchUserHistory();
          if (res?.history) {
            setHistory(res.history);
          }
        } catch (err) {
          console.warn('Failed to load user history:', err.message);
        }
      } else {
        setHistory([]);
      }
    }
    loadUserHistory();
  }, [isAuthenticated, user]);

  // Dynamically filter voices by selected language
  const availableVoices = useMemo(() => {
    return VOICES.filter((v) => v.language === selectedLanguage);
  }, [selectedLanguage]);

  const currentVoiceObj = useMemo(() => {
    return availableVoices.find((v) => v.id === selectedVoice) || availableVoices[0];
  }, [availableVoices, selectedVoice]);

  // Handle language switch and auto-select matching first voice
  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    const firstVoice = VOICES.find((v) => v.language === newLang);
    if (firstVoice) {
      setSelectedVoice(firstVoice.id);
    }
  };

  // Handle speech synthesis request
  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError({ message: 'Text input cannot be empty. Please enter or paste some text.' });
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

      const newAudioItem = {
        id: response.historyId || Date.now().toString(),
        audioUrl: response.audioUrl,
        text: text.trim(),
        language: selectedLanguage,
        voice: selectedVoice,
        duration: response.duration || 4,
        speed,
        pitch,
        mode: response.mode || 'api-generated',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFavorite: false
      };

      setGeneratedAudio(newAudioItem);

      // Only record to personal history if user is authenticated!
      if (isAuthenticated) {
        setHistory((prev) => [newAudioItem, ...prev]);
      }
    } catch (err) {
      console.error('TTS Handshake Error:', err);
      setError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle favorite in personal history
  const handleToggleFavorite = async (id) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );

    if (isAuthenticated) {
      try {
        await toggleFavoriteApi(id);
      } catch (err) {
        console.warn('Failed to sync favorite with backend:', err.message);
      }
    }
  };

  // Delete item from personal history
  const handleDeleteHistory = async (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));

    if (isAuthenticated) {
      try {
        await deleteHistoryApi(id);
      } catch (err) {
        console.warn('Failed to delete history on backend:', err.message);
      }
    }
  };

  // Re-play / load item from history
  const handleSelectHistory = (item) => {
    setText(item.text);
    setSelectedLanguage(item.language);
    setSelectedVoice(item.voice);
    setGeneratedAudio(item);
    setActiveTab('studio');
  };

  // Apply AI Style preset
  const applyPreset = (preset) => {
    setSpeed(preset.speed);
    setPitch(preset.pitch);
  };

  // Load fairy tale story into studio
  const loadFairyTaleStory = (story) => {
    setText(story.excerpt);
    setSelectedLanguage(story.language);
    setSelectedVoice(story.voice);
    setSpeed(story.speed);
    setPitch(story.pitch);
    setActiveTab('studio');
  };

  // Theme State (Light / Dark Fairy Tale)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('voxflow_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('voxflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const filteredStories = useMemo(() => {
    if (fairyCategory === 'all') return FAIRY_TALE_STORIES;
    return FAIRY_TALE_STORIES.filter((s) => s.category === fairyCategory);
  }, [fairyCategory]);

  return (
    <div className="app-container-wide">
      {/* Top Navigation Bar with Theme Toggle Key */}
      <Navbar
        serverOnline={serverOnline}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal />

      {/* User Profile & Password Update Modal */}
      <ProfileModal />

      {/* Professional Studio Tab Navigation Bar */}
      <nav className="studio-tab-bar">
        <button
          type="button"
          className={`studio-tab-item ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('studio')}
        >
          <span style={{ fontSize: '1.25rem' }}>🎙️</span>
          <span>Speech Studio</span>
        </button>

        <button
          type="button"
          className={`studio-tab-item ${activeTab === 'fairytale' ? 'active' : ''}`}
          onClick={() => setActiveTab('fairytale')}
        >
          <span style={{ fontSize: '1.25rem' }}>🧚</span>
          <span>Fairy Tale Realm</span>
          <span style={{ fontSize: '0.82rem', padding: '2px 10px', borderRadius: '10px', background: activeTab === 'fairytale' ? 'rgba(255,255,255,0.25)' : 'rgba(236, 72, 153, 0.12)', color: activeTab === 'fairytale' ? '#ffffff' : '#db2777', fontWeight: 700 }}>
            Calm Stories
          </span>
        </button>

        <button
          type="button"
          className={`studio-tab-item ${activeTab === 'vault' ? 'active' : ''}`}
          onClick={() => setActiveTab('vault')}
        >
          <span style={{ fontSize: '1.25rem' }}>📚</span>
          <span>My Audio Vault</span>
          {isAuthenticated && history.length > 0 && (
            <span style={{ fontSize: '0.82rem', padding: '2px 10px', borderRadius: '10px', background: activeTab === 'vault' ? 'rgba(255,255,255,0.25)' : 'rgba(124, 58, 237, 0.12)', color: activeTab === 'vault' ? '#ffffff' : '#7c3aed', fontWeight: 700 }}>
              {history.length}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`studio-tab-item ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <span style={{ fontSize: '1.25rem' }}>📄</span>
          <span>Document Reader</span>
        </button>

        <button
          type="button"
          className={`studio-tab-item ${activeTab === 'showcase' ? 'active' : ''}`}
          onClick={() => setActiveTab('showcase')}
        >
          <span style={{ fontSize: '1.25rem' }}>✨</span>
          <span>Persona Showcase</span>
          <span style={{ fontSize: '0.82rem', padding: '2px 10px', borderRadius: '10px', background: activeTab === 'showcase' ? 'rgba(255,255,255,0.25)' : 'rgba(2, 132, 199, 0.12)', color: activeTab === 'showcase' ? '#ffffff' : '#0284c7', fontWeight: 700 }}>
            17 Voices
          </span>
        </button>
      </nav>

      {/* Error Alert Banner */}
      <ErrorMessage
        error={error}
        onDismiss={() => setError(null)}
        onRetry={handleGenerateSpeech}
      />

      {/* ================= TAB 1: SPEECH STUDIO ================= */}
      {activeTab === 'studio' && (
        <main className="studio-workspace-grid animate-fade-in">
          {/* Left Column: Text Input, Modulation, Generator & Audio Deck */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            {/* Hero Luminous Fairytale Card */}
            <section className="fairy-card" style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
                <div style={{ maxWidth: '850px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(124, 58, 237, 0.08)', border: '1.5px solid rgba(124, 58, 237, 0.25)', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-primary)' }}>✨ Calm Fairy-Tale Neural Synthesizer</span>
                  </div>
                  <h2 style={{ fontSize: '2.35rem', lineHeight: 1.25, margin: '0 0 10px', fontWeight: 800 }}>
                    Convert Written Words into <span className="gradient-text-fairy">Living Speech</span>
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.14rem', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                    Experience emotive, human-grade voice synthesis across global accents with calm atmospheric tempo and pitch controls.
                  </p>

                  {/* Quick Story Sample Chips */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                    <span style={{ fontSize: '0.96rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Tales:</span>
                    {FAIRY_TALE_STORIES.slice(0, 3).map((story) => (
                      <button
                        key={story.id}
                        type="button"
                        className="chip-btn"
                        onClick={() => loadFairyTaleStory(story)}
                        style={{ fontSize: '0.88rem', padding: '6px 14px' }}
                      >
                        {story.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sound-wave" style={{ transform: 'scale(1.3)' }}>
                  <span className="sound-bar"></span>
                  <span className="sound-bar"></span>
                  <span className="sound-bar"></span>
                  <span className="sound-bar"></span>
                  <span className="sound-bar"></span>
                </div>
              </div>
            </section>

            {/* Modular Text Input */}
            <TextInput
              text={text}
              setText={setText}
              maxLength={2000}
              disabled={isGenerating}
            />

            {/* Voice Modulation & Generate Action Card */}
            <section className="fairy-card" style={{ padding: '26px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontSize: '1.24rem', margin: 0, fontWeight: 700 }}>
                  Acoustic Modulation & Synthesis
                </h3>
                <span style={{ fontSize: '0.96rem', color: 'var(--text-muted)' }}>
                  Active Persona: <strong style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{currentVoiceObj?.name} ({currentVoiceObj?.gender})</strong>
                </span>
              </div>

              {/* Speed & Pitch Sliders */}
              <AudioControls
                speed={speed}
                setSpeed={setSpeed}
                pitch={pitch}
                setPitch={setPitch}
                disabled={isGenerating}
              />

              {/* Generate Speech Action Button */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {generatedAudio && (
                  <span style={{ fontSize: '0.94rem', color: 'var(--success)', fontWeight: 600 }}>
                    ✓ Speech ready ({generatedAudio.timestamp})
                  </span>
                )}
                <button 
                  className="btn-primary"
                  disabled={!text.trim() || isGenerating}
                  onClick={handleGenerateSpeech}
                  style={{ minWidth: '220px', padding: '16px 36px', fontSize: '1.14rem' }}
                >
                  {isGenerating ? (
                    <>
                      <div className="sound-wave" style={{ height: '18px' }}>
                        <span className="sound-bar" style={{ background: '#fff' }}></span>
                        <span className="sound-bar" style={{ background: '#fff' }}></span>
                        <span className="sound-bar" style={{ background: '#fff' }}></span>
                      </div>
                      <span>Synthesizing Audio...</span>
                    </>
                  ) : (
                    <>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                      </svg>
                      <span>Synthesize Speech</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Seekable Audio Player Deck */}
            {generatedAudio && (
              <AudioPlayer audioData={generatedAudio} />
            )}
          </div>

          {/* Right Column: Persona Studio, AI Style Presets & Atmosphere */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            {/* Interactive Voice Persona Picker */}
            <section className="fairy-card" style={{ padding: '26px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.24rem', margin: 0, fontWeight: 700 }}>
                  Voice Personas
                </h3>
                <span style={{ fontSize: '0.92rem', color: 'var(--accent-primary)', fontWeight: 600, background: 'rgba(124, 58, 237, 0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                  {availableVoices.length} Available
                </span>
              </div>

              {/* Spoken Language Dropdown */}
              <div style={{ marginBottom: '18px' }}>
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  languages={LANGUAGES}
                  disabled={isGenerating}
                />
              </div>

              {/* Persona Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '6px' }}>
                {availableVoices.map((voice) => {
                  const isSelected = voice.id === selectedVoice;
                  return (
                    <div
                      key={voice.id}
                      className={`persona-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedVoice(voice.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: voice.gender === 'Female' ? 'rgba(236, 72, 153, 0.12)' : 'rgba(124, 58, 237, 0.12)',
                            color: voice.gender === 'Female' ? '#db2777' : '#7c3aed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1.05rem',
                            border: `1.5px solid ${voice.gender === 'Female' ? 'rgba(236, 72, 153, 0.35)' : 'rgba(124, 58, 237, 0.35)'}`
                          }}
                        >
                          {voice.name[0]}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-primary)' }}>{voice.name}</span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', background: voice.gender === 'Female' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(124, 58, 237, 0.1)', color: voice.gender === 'Female' ? '#db2777' : '#7c3aed' }}>
                              {voice.gender === 'Female' ? '♀ Female' : '♂ Male'}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '2px 0 0', lineHeight: 1.4 }}>
                            {voice.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 800 }}>
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Mood & Atmosphere Presets */}
            <section className="fairy-card" style={{ padding: '26px 28px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: 700 }}>
                Atmosphere & Mood Presets
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {AI_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-card)',
                      border: '1.5px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.02rem', fontWeight: 700 }}>{preset.label}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>{preset.desc}</div>
                    </div>
                    <span style={{ fontSize: '0.92rem', color: 'var(--accent-primary)', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: 'rgba(124, 58, 237, 0.08)' }}>Apply</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}

      {/* ================= TAB 2: FAIRY TALE REALM ================= */}
      {activeTab === 'fairytale' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <section className="fairy-card" style={{ padding: '36px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(236, 72, 153, 0.1)', border: '1.5px solid rgba(236, 72, 153, 0.3)', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#db2777' }}>🧚 Fairy Tale & Calming Storybook</span>
                </div>
                <h2 style={{ fontSize: '2.25rem', margin: '0 0 10px', fontWeight: 800 }}>
                  Calm Stories & <span className="gradient-text-fairy">Enchanted Narration</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.12rem', margin: 0, maxWidth: '680px', lineHeight: 1.6 }}>
                  Choose from serene bedtime stories, magical tales, and calming meditations. Click any story to narrate it immediately with its custom tuned vocal persona.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`chip-btn ${fairyCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setFairyCategory('all')}
                  style={fairyCategory === 'all' ? { background: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', color: '#fff' } : {}}
                >
                  All Tales
                </button>
                <button
                  type="button"
                  className={`chip-btn ${fairyCategory === 'magic' ? 'active' : ''}`}
                  onClick={() => setFairyCategory('magic')}
                  style={fairyCategory === 'magic' ? { background: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', color: '#fff' } : {}}
                >
                  ✨ Magic & Myth
                </button>
                <button
                  type="button"
                  className={`chip-btn ${fairyCategory === 'bedtime' ? 'active' : ''}`}
                  onClick={() => setFairyCategory('bedtime')}
                  style={fairyCategory === 'bedtime' ? { background: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', color: '#fff' } : {}}
                >
                  🌙 Bedtime Calm
                </button>
                <button
                  type="button"
                  className={`chip-btn ${fairyCategory === 'meditation' ? 'active' : ''}`}
                  onClick={() => setFairyCategory('meditation')}
                  style={fairyCategory === 'meditation' ? { background: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', color: '#fff' } : {}}
                >
                  🌊 Serene Meditation
                </button>
              </div>
            </div>

            {/* Stories Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
              {filteredStories.map((story) => (
                <div
                  key={story.id}
                  className="fairy-card"
                  style={{
                    padding: '26px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--border-color)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.86rem', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(124, 58, 237, 0.08)', color: 'var(--accent-primary)', fontWeight: 700 }}>
                        {story.genre}
                      </span>
                      <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {story.mood}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.32rem', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: 700 }}>
                      {story.title}
                    </h4>

                    <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                      "{story.excerpt}"
                    </p>
                  </div>

                  <div style={{ borderTop: '1.5px solid rgba(226, 232, 240, 0.9)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                      Persona: <strong style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{story.voice.split('-')[2]?.replace('Neural', '') || story.voice}</strong>
                    </div>

                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => loadFairyTaleStory(story)}
                      style={{ padding: '10px 20px', fontSize: '0.96rem' }}
                    >
                      <span>Narrate in Studio 🪄</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ================= TAB 3: MY AUDIO VAULT ================= */}
      {activeTab === 'vault' && (
        <div className="animate-fade-in">
          <SpeechHistory
            history={history}
            onSelectHistory={handleSelectHistory}
            onToggleFavorite={handleToggleFavorite}
            onDeleteHistory={handleDeleteHistory}
          />
        </div>
      )}

      {/* ================= TAB 4: DOCUMENT READER ================= */}
      {activeTab === 'docs' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <section className="fairy-card" style={{ padding: '42px', textAlign: 'center' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'var(--fairy-gradient)',
                margin: '0 auto 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--fairy-glow)'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="12" y2="12"/>
                <line x1="15" y1="15" x2="12" y2="12"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.65rem', marginBottom: '10px', fontWeight: 800 }}>
              Document Text Extractor & Speech Narrator
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', maxWidth: '580px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Upload any text file (.txt, .md) to extract its contents directly into the Speech Studio for immediate voice narration.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FileUploader
                onTextExtracted={(content) => {
                  setText(content);
                  setActiveTab('studio');
                }}
              />
            </div>
          </section>
        </div>
      )}

      {/* ================= TAB 5: PERSONA SHOWCASE ================= */}
      {activeTab === 'showcase' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <section className="fairy-card" style={{ padding: '34px 38px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '8px', fontWeight: 800 }}>
                All 17 Neural Voice Personas
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
                Explore all available neural personas across English, Hindi, Gujarati, Marathi, Spanish, French, and German. Click any voice to launch directly in Speech Studio!
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px' }}>
              {VOICES.map((v) => (
                <div
                  key={v.id}
                  className="fairy-card"
                  style={{
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--border-color)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                  onClick={() => {
                    setSelectedLanguage(v.language);
                    setSelectedVoice(v.id);
                    setActiveTab('studio');
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)' }}>{v.name}</span>
                      <span 
                        style={{ 
                          fontSize: '0.82rem', 
                          padding: '3px 10px', 
                          borderRadius: '6px', 
                          background: v.gender === 'Female' ? 'rgba(236,72,153,0.1)' : 'rgba(124,58,237,0.1)',
                          color: v.gender === 'Female' ? '#db2777' : '#7c3aed',
                          fontWeight: 700
                        }}
                      >
                        {v.gender}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.5 }}>
                      {v.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid rgba(226, 232, 240, 0.85)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {LANGUAGES.find(l => l.code === v.language)?.flag} {LANGUAGES.find(l => l.code === v.language)?.name}
                    </span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      Use Persona →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}
