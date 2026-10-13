import React, { useState, useEffect } from 'react';
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
    <div className="cookie-consent-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-consent-content">
        <div className="cookie-consent-text">
          <p>
            We use analytics to understand how Mythrill is used and improve the experience.
            No data is sold or shared with third parties for advertising.
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button className="cookie-btn cookie-reject" onClick={handleReject}>
            Reject
          </button>
          <button className="cookie-btn cookie-accept" onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
