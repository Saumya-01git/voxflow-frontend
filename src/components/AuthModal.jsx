import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: 'Enter a password', color: 'var(--text-muted)' };
  if (pwd.length < 6) return { score: 1, label: 'Too short (min 6 chars)', color: '#ef4444' };

  let checks = 0;
  if (pwd.length >= 8) checks++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) checks++;
  if (/[0-9]/.test(pwd)) checks++;
  if (/[^A-Za-z0-9]/.test(pwd)) checks++;

  if (checks <= 1) return { score: 1, label: 'Weak password', color: '#f87171' };
  if (checks === 2) return { score: 2, label: 'Fair strength', color: '#f59e0b' };
  if (checks === 3) return { score: 3, label: 'Good & secure', color: '#0ea5e9' };
  return { score: 4, label: 'Strong & highly secure 💪', color: '#10b981' };
}

export default function AuthModal() {
  const { authModalOpen, authModalReason, closeAuth, login, register } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuth();
      }}
    >
      <div 
        className="fairy-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 32px',
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          boxShadow: 'var(--card-shadow-hover)'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuth}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '1.3rem',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'var(--accent-gradient)',
              margin: '0 auto 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--accent-glow)'
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.55rem', margin: '0 0 8px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Free Account'}
          </h3>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {authModalReason || 'Access your personalized speech history and audio downloads.'}
          </p>
        </div>

        {/* Reason Alert Banner */}
        {authModalReason && (
          <div 
            style={{
              background: 'rgba(124, 58, 237, 0.1)',
              border: '1.5px solid rgba(124, 58, 237, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '0.92rem',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🔒</span>
            <span>{authModalReason}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div 
            className="validation-alert error"
            style={{ marginBottom: '20px', fontSize: '0.94rem' }}
          >
            <span>{error}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div 
          style={{
            display: 'flex',
            background: 'var(--bg-pill)',
            padding: '5px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '22px',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: mode === 'login' ? 'var(--accent-gradient)' : 'transparent',
              color: mode === 'login' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.98rem',
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: mode === 'login' ? '0 2px 8px rgba(124, 58, 237, 0.3)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: mode === 'register' ? 'var(--accent-gradient)' : 'transparent',
              color: mode === 'register' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.98rem',
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: mode === 'register' ? '0 2px 8px rgba(124, 58, 237, 0.3)' : 'none'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Full Name
              </label>
              <input
                type="text"
                className="tts-select"
                placeholder="e.g. Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ fontSize: '1.05rem', padding: '14px 18px', cursor: 'text' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              className="tts-select"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ fontSize: '1.05rem', padding: '14px 18px', cursor: 'text' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Password
              </label>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Min 6 characters
              </span>
            </div>

            {/* Password Input with Eye Sign Toggle Button */}
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="tts-select"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                style={{ fontSize: '1.05rem', padding: '14px 52px 14px 18px', cursor: 'text' }}
              />

              {/* Eye Toggle Key with High-Contrast Clear Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                  padding: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  transition: 'var(--transition)'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  /* Eye Slash (Open/Visible -> Click to Hide) */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  /* Eye (Hidden -> Click to Show) */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Dynamic Password Strength Checker in BOTH Login and Register (Always visible with live updates) */}
            <div style={{ marginTop: '10px' }}>
              {/* 4 Strength Segments */}
              <div style={{ display: 'flex', gap: '5px', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    style={{
                      flex: 1,
                      height: '100%',
                      borderRadius: '3px',
                      background: password ? (seg <= strength.score ? strength.color : 'rgba(148, 163, 184, 0.25)') : 'rgba(148, 163, 184, 0.2)',
                      transition: 'background-color 0.25s ease'
                    }}
                  />
                ))}
              </div>

              {/* Strength Readout Label */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.86rem' }}>
                <span style={{ color: password ? strength.color : 'var(--text-muted)', fontWeight: 700 }}>
                  {password ? strength.label : 'Strength: Enter password to evaluate'}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {password ? `${password.length} chars` : 'min 6 chars'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '6px', padding: '15px' }}
          >
            {isSubmitting ? 'Authenticating...' : mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
