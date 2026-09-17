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
        <label style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Spoken Language
        </label>
        <span style={{ fontSize: '0.92rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
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
