import React, { useState, useRef, useEffect } from 'react';
import DownloadButton from './DownloadButton';
import { resolveAudioUrl } from '../services/api';

/**
 * Format seconds into mm:ss
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ audioData, onDownload }) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioData?.duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const audioSrc = audioData?.audioUrl && audioData.audioUrl !== 'web-speech-active'
    ? resolveAudioUrl(audioData.audioUrl)
    : null;

  // Reset states when new audio is supplied
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [audioData]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current && !audioSrc) {
      // Fallback mode: if Web Speech was used
      if ('speechSynthesis' in window && audioData?.text) {
        if (isPlaying) {
          window.speechSynthesis.pause();
          setIsPlaying(false);
        } else {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          } else {
            const utter = new SpeechSynthesisUtterance(audioData.text);
            utter.lang = audioData.language || 'en-US';
            utter.rate = playbackRate;
            utter.onend = () => setIsPlaying(false);
            window.speechSynthesis.speak(utter);
          }
          setIsPlaying(true);
        }
      }
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  // Sync current time as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Sync duration once metadata loads
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle scrubber drag / seek
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle audio end
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Change playback speed
  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 1;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  if (!audioData) return null;

  return (
    <section className="fairy-card animate-fade-in" style={{ padding: '26px 28px' }}>
      {/* Hidden audio element */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      {/* Header with Title and Playing Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--accent-glow)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Generated Audio Player</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {audioData.voice} • {audioData.language}
            </p>
          </div>
        </div>

        <div className="sound-wave" style={{ opacity: isPlaying ? 1 : 0.35 }}>
          <span className="sound-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
          <span className="sound-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
          <span className="sound-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
          <span className="sound-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
          <span className="sound-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></span>
        </div>
      </div>

      {/* Timeline Scrubber & Timestamps */}
      <div style={{ marginBottom: '18px' }}>
        <input
          type="range"
          className="audio-scrubber"
          min="0"
          max={duration || 1}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '8px' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Deck */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px' }}>
        {/* Play / Pause Primary Button & Speed presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={togglePlay}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--accent-glow)',
              transition: 'transform 0.15s ease'
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>

          {/* Speed Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[0.75, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                type="button"
                className="chip-btn"
                onClick={() => handleSpeedChange(s)}
                style={{
                  background: playbackRate === s ? 'var(--accent-primary)' : undefined,
                  borderColor: playbackRate === s ? 'var(--accent-primary)' : undefined,
                  color: playbackRate === s ? '#ffffff' : undefined,
                  fontSize: '0.86rem',
                  padding: '5px 12px',
                  fontWeight: 700
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={toggleMute}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23"/>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              style={{ width: '80px', height: '6px', cursor: 'pointer' }}
            />
          </div>

          <DownloadButton
            audioUrl={audioData.audioUrl}
            filename={`voxflow_${audioData.voice}_${Date.now()}.mp3`}
          />
        </div>
      </div>
    </section>
  );
}
