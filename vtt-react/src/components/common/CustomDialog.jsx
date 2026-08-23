import React, { useState, useEffect, useRef } from 'react';
import './CustomDialog.css';

const CustomDialog = ({ dialog, onClose }) => {
  const {
    id,
    type = 'confirm',
    title,
    message,
    subMessage,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    variant = isDestructive ? 'danger' : 'primary',
    icon,
    defaultValue = '',
    placeholder = '',
    inputType = 'text',
    required = false,
    backdropClose = true
  } = dialog;

  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef(null);
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    // Focus management on open
    if (type === 'prompt' && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    } else if (confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }
  }, [type]);

  // Global key listener for Escape and Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleCancel();
      } else if (e.key === 'Enter') {
        // If textarea or multiline, let standard behavior work, otherwise confirm
        if (e.target?.tagName?.toLowerCase() !== 'textarea') {
          e.preventDefault();
          e.stopPropagation();
          handleConfirm();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [inputValue, type, required]);

  const handleConfirm = () => {
    if (type === 'prompt') {
      if (required && !inputValue.trim()) {
        if (inputRef.current) inputRef.current.focus();
        return;
      }
      onClose(id, inputValue);
    } else {
      onClose(id, true);
    }
  };

  const handleCancel = () => {
    if (type === 'prompt') {
      onClose(id, null);
    } else {
      onClose(id, false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && backdropClose) {
      handleCancel();
    }
  };

  // Determine icon class
  const getIconClass = () => {
    if (icon) return icon;
    if (isDestructive) return 'fas fa-trash-alt';
    if (type === 'prompt') {
      if (inputType === 'password') return 'fas fa-key';
      return 'fas fa-pen-nib';
    }
    switch (variant) {
      case 'danger':
        return 'fas fa-exclamation-triangle';
      case 'warning':
        return 'fas fa-exclamation-circle';
      case 'success':
        return 'fas fa-check-circle';
      case 'info':
      case 'primary':
      default:
        return 'fas fa-shield-alt';
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'custom-dialog-btn-danger';
      case 'warning':
        return 'custom-dialog-btn-warning';
      case 'success':
        return 'custom-dialog-btn-success';
      case 'primary':
      default:
        return isDestructive ? 'custom-dialog-btn-danger' : 'custom-dialog-btn-primary';
    }
  };

  return (
    <div
      className="custom-dialog-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`dialog-title-${id}`}
    >
      <div className="custom-dialog-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="custom-dialog-header">
          <div className="custom-dialog-title-group">
            <div className={`custom-dialog-icon icon-${variant}`}>
              <i className={getIconClass()}></i>
            </div>
            <h3 id={`dialog-title-${id}`} className="custom-dialog-title">
              {title}
            </h3>
          </div>
          <button
            type="button"
            className="custom-dialog-close-btn"
            onClick={handleCancel}
            title="Close dialog (Esc)"
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="custom-dialog-body">
          {message && <p className="custom-dialog-message">{message}</p>}

          {subMessage && (
            <div className={`custom-dialog-submessage ${isDestructive ? 'submessage-danger' : ''}`}>
              <i
                className={`custom-dialog-submessage-icon ${
                  isDestructive ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'
                }`}
              ></i>
              <span>{subMessage}</span>
            </div>
          )}

          {type === 'prompt' && (
            <div className="custom-dialog-input-group">
              <input
                ref={inputRef}
                type={inputType}
                className="custom-dialog-input"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required={required}
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="custom-dialog-footer">
          {type !== 'alert' && (
            <button
              type="button"
              className="custom-dialog-btn custom-dialog-btn-cancel"
              onClick={handleCancel}
            >
              {cancelText}
            </button>
          )}

          <button
            ref={confirmBtnRef}
            type="button"
            className={`custom-dialog-btn ${getConfirmButtonClass()}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
