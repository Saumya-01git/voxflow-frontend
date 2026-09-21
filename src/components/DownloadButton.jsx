import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { resolveAudioUrl } from '../services/api';

export default function DownloadButton({ audioUrl, filename = 'voxflow_speech.mp3', disabled = false }) {
  const { isAuthenticated, openAuth } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    // If not authenticated, require login/signup as requested!
    if (!isAuthenticated) {
      openAuth('Sign in or create a free account to download generated MP3 audio files.');
      return;
    }

    if (!audioUrl || disabled) return;

    setIsDownloading(true);

    try {
      const targetUrl = resolveAudioUrl(audioUrl);
      if (targetUrl.startsWith('http') || targetUrl.startsWith('/audio/')) {
        const res = await fetch(targetUrl);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename.endsWith('.mp3') ? filename : `${filename}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = filename.endsWith('.mp3') ? filename : `${filename}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.warn('Direct download fetch failed, opening link directly:', err);
      window.open(targetUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      className="btn-secondary"
      onClick={handleDownload}
      disabled={disabled || !audioUrl || isDownloading}
      title={isAuthenticated ? 'Download synthesized audio (MP3)' : 'Sign in to download MP3'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        borderRadius: 'var(--radius-md)',
        fontWeight: 500,
        fontSize: '0.82rem',
        border: !isAuthenticated ? '1px solid rgba(245, 158, 11, 0.4)' : undefined
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={!isAuthenticated ? '#fbbf24' : 'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      <span>
        {isDownloading ? 'Downloading...' : !isAuthenticated ? '🔒 Download MP3' : 'Download MP3'}
      </span>
    </button>
  );
}
