import React from 'react';
import { LANGUAGES } from '../data/voices';

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  languages = LANGUAGES,
  disabled = false
}) {
  const current = languages.find((l) => l.code === selectedLanguage) || languages[0];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Spoken Language
        </label>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {current ? `${current.flag} ${current.native}` : ''}
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <select
          className="tts-select"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={disabled}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name} ({lang.native})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
