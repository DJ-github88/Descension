import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

import { safeLocalStorageItem, safeLocalStorageGet } from '../../utils/storageUtils';

const CONSENT_KEY = 'mythrill_cookie_consent';

export function hasConsent() {
  try {
    const stored = safeLocalStorageGet(CONSENT_KEY);
    if (!stored) return false;
    return JSON.parse(stored);
  } catch {
    return false;
  }
}

export function getConsentChoice() {
  try {
    const stored = safeLocalStorageGet(CONSENT_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = safeLocalStorageGet(CONSENT_KEY);
      if (stored === null) {
        setVisible(true);
      }
    } catch {
      setVisible(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      safeLocalStorageItem(CONSENT_KEY, JSON.stringify(true));
    } catch (err) {
      console.warn('Unable to persist cookie consent:', err);
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent('consent-change', { detail: { accepted: true } }));
  };

  const handleReject = () => {
    try {
      safeLocalStorageItem(CONSENT_KEY, JSON.stringify(false));
    } catch (err) {
      console.warn('Unable to persist cookie rejection:', err);
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent('consent-change', { detail: { accepted: false } }));
  };

  if (!visible) return null;

  return (
    <aside
      className="cookie-consent-banner"
      role="dialog"
      aria-label="Analytics & Privacy Consent"
      aria-describedby="cookie-consent-desc"
    >
      <div className="cookie-consent-frame">
        <div className="cookie-consent-leading">
          <div className="cookie-consent-seal" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2h8a2 2 0 0 1 2 2v14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V4a2 2 0 0 1 2-2z" />
              <path d="M8 6h8" />
              <path d="M8 10h8" />
              <path d="M8 14h5" />
            </svg>
          </div>
          <div className="cookie-consent-text">
            <span className="cookie-consent-title">Telemetry &amp; Scribe Records</span>
            <p id="cookie-consent-desc">
              We collect anonymized session metrics to refine dice mechanics, room stability, and performance.
              No player data is sold or shared for advertising.{' '}
              <Link to="/privacy" className="cookie-policy-link">
                Review our Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="cookie-consent-actions">
          <button
            type="button"
            className="cookie-btn cookie-reject"
            onClick={handleReject}
            aria-label="Decline analytics tracking"
          >
            Decline
          </button>
          <button
            type="button"
            className="cookie-btn cookie-accept"
            onClick={handleAccept}
            aria-label="Accept analytics tracking"
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
}
