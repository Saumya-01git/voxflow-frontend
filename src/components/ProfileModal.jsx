import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserPassword } from '../services/api';

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

export default function ProfileModal() {
  const { user, profileModalOpen, closeProfile, logout } = useAuth();

  // Password update form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Eye toggle visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status feedback
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!profileModalOpen || !user) return null;

  const newStrength = getPasswordStrength(newPassword);
  const isMatching = newPassword && confirmPassword && newPassword === confirmPassword;
  const isMismatch = confirmPassword && newPassword !== confirmPassword;

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateUserPassword(currentPassword, newPassword);
      if (res?.success) {
        setSuccessMessage('Your password has been successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(res?.error || 'Failed to update password.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfile();
      }}
    >
      <div 
        className="fairy-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '36px 32px',
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          boxShadow: 'var(--card-shadow-hover)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeProfile}
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
          title="Close profile"
        >
          ✕
        </button>

        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: 'var(--accent-glow)',
              flexShrink: 0
            }}
          >
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.45rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                {user.name}
              </h3>
              <span 
                style={{
                  fontSize: '0.8rem',
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(5, 150, 105, 0.12)',
                  color: 'var(--success)',
                  fontWeight: 700,
                  border: '1px solid rgba(5, 150, 105, 0.3)'
                }}
              >
                ✓ Active Account
              </span>
            </div>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Member Details Pill */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-pill)',
            border: '1px solid var(--border-color)',
            marginBottom: '26px',
            fontSize: '0.92rem'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Member Since</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
          </span>
        </div>

        {/* Password Update Section */}
        <div style={{ borderTop: '1.5px solid var(--border-color)', paddingTop: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.3rem' }}>🔐</span>
            <div>
              <h4 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
                Update Password
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Change your security credentials directly from your account.
              </p>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div 
              style={{
                background: 'rgba(5, 150, 105, 0.12)',
                border: '1.5px solid rgba(5, 150, 105, 0.35)',
                color: 'var(--success)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '18px',
                fontSize: '0.94rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              className="animate-fade-in"
            >
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div 
              className="validation-alert error"
              style={{ marginBottom: '18px', fontSize: '0.94rem' }}
            >
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Current Password Field with Eye Toggle */}
            <div>
              <label style={{ display: 'block', fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Current Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="tts-select"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ fontSize: '1.02rem', padding: '13px 48px 13px 16px', cursor: 'text' }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                    color: 'var(--accent-primary)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    transition: 'var(--transition)'
                  }}
                  title={showCurrent ? 'Hide password' : 'Show password'}
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* New Password Field with Eye Toggle & Dynamic Strength Checker */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  New Password
                </label>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Min 6 characters
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  className="tts-select"
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                  style={{ fontSize: '1.02rem', padding: '13px 48px 13px 16px', cursor: 'text' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                    color: 'var(--accent-primary)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    transition: 'var(--transition)'
                  }}
                  title={showNew ? 'Hide password' : 'Show password'}
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Checker (Always visible) */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '5px', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      style={{
                        flex: 1,
                        height: '100%',
                        borderRadius: '3px',
                        background: newPassword ? (seg <= newStrength.score ? newStrength.color : 'rgba(148, 163, 184, 0.25)') : 'rgba(148, 163, 184, 0.2)',
                        transition: 'background-color 0.25s ease'
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.84rem' }}>
                  <span style={{ color: newPassword ? newStrength.color : 'var(--text-muted)', fontWeight: 700 }}>
                    {newPassword ? newStrength.label : 'Strength: Enter new password'}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {newPassword ? `${newPassword.length} chars` : 'min 6 chars'}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm New Password Field with Eye Toggle */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Confirm New Password
                </label>
                {confirmPassword && (
                  <span style={{ fontSize: '0.82rem', color: isMatching ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                    {isMatching ? '✓ Passwords match' : '✕ Does not match'}
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="tts-select"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                  style={{ 
                    fontSize: '1.02rem', 
                    padding: '13px 48px 13px 16px',
                    borderColor: isMismatch ? 'var(--danger)' : undefined,
                    cursor: 'text'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                    color: 'var(--accent-primary)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    transition: 'var(--transition)'
                  }}
                  title={showConfirm ? 'Hide password' : 'Show password'}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isUpdating || !currentPassword || !newPassword || newPassword !== confirmPassword}
              style={{ marginTop: '8px', padding: '14px' }}
            >
              {isUpdating ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        </div>

        {/* Modal Footer Controls */}
        <div style={{ marginTop: '26px', borderTop: '1px solid var(--border-color)', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="chip-btn"
            onClick={closeProfile}
            style={{ fontSize: '0.92rem', padding: '8px 18px' }}
          >
            Close
          </button>

          <button
            type="button"
            className="chip-btn"
            onClick={logout}
            style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)', fontSize: '0.92rem', padding: '8px 18px' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
