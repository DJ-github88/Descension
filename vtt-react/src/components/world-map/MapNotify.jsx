import React, { useState, useEffect } from 'react';
import './WorldMapImmerse.css';

// ── Module-level pub/sub ──
// Lightweight notification manager — any component can call notify() / confirmDialog()
// without prop drilling or context wrapping.
let items = [];
const listeners = new Set();

const emit = () => listeners.forEach(fn => fn([...items]));

const genId = () => Date.now() + Math.random();

export const notify = (message, type = 'info', duration = 4000) => {
  const id = genId();
  items = [...items, { id, message, type, mode: 'toast' }];
  emit();
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
};

export const dismiss = (id) => {
  items = items.filter(n => n.id !== id);
  emit();
};

export const confirmDialog = (message, onConfirm, onCancel) => {
  const id = genId();
  items = [...items, {
    id,
    message,
    type: 'warning',
    mode: 'confirm',
    onConfirm: () => { dismiss(id); onConfirm?.(); },
    onCancel: () => { dismiss(id); onCancel?.(); }
  }];
  emit();
  return id;
};

const ICONS = {
  info: 'fa-info-circle',
  warning: 'fa-exclamation-circle',
  error: 'fa-times-circle',
  success: 'fa-check-circle'
};

const ICON_COLORS = {
  info: '#81d4fa',
  warning: '#ffb74d',
  error: '#ef5350',
  success: '#66bb6a'
};

const MapNotificationContainer = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    listeners.add(setList);
    return () => { listeners.delete(setList); };
  }, []);

  const toasts = list.filter(n => n.mode === 'toast');
  const confirms = list.filter(n => n.mode === 'confirm');

  return (
    <>
      {/* Toast stack — top center */}
      <div className="map-toast-stack">
        {toasts.map(item => (
          <div key={item.id} className={`map-toast ${item.type}`}>
            <i
              className={`fas ${ICONS[item.type] || ICONS.info} map-toast-icon`}
              style={{ color: ICON_COLORS[item.type] || ICON_COLORS.info }}
            />
            <span className="map-toast-message">{item.message}</span>
            <button className="map-toast-close" onClick={() => dismiss(item.id)}>
              <i className="fas fa-times" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm dialogs — centered modal overlay */}
      {confirms.map(item => (
        <div key={item.id} className="map-confirm-overlay" onClick={item.onCancel}>
          <div className="map-confirm-card" onClick={e => e.stopPropagation()}>
            <div className="map-confirm-header">
              <i className="fas fa-exclamation-triangle" style={{ color: '#ffb74d' }} />
              <h3>Are You Sure?</h3>
            </div>
            <div className="map-confirm-body">
              <p>{item.message}</p>
            </div>
            <div className="map-confirm-actions">
              <button className="map-confirm-btn cancel" onClick={item.onCancel}>
                <i className="fas fa-times" /> Cancel
              </button>
              <button className="map-confirm-btn confirm" onClick={item.onConfirm}>
                <i className="fas fa-check" /> Confirm
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MapNotificationContainer;
