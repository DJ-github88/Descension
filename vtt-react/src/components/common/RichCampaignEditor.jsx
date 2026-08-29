import React, { useState, useRef, useCallback } from 'react';
import RichLoreText from './RichLoreText';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import './RichCampaignEditor.css';

/**
 * RichCampaignEditor
 * 
 * Thematic fantasy rich-text / markdown editor with live D&D parchment rendering,
 * headers, bold/italic, read-aloud boxes, stat blocks, and image upload/insertion.
 */
const RichCampaignEditor = ({
  value = '',
  onChange,
  placeholder = 'Describe details, atmosphere, encounters, or lore...',
  rows = 3,
  minHeight,
  label,
  icon,
  className = '',
  defaultMode = 'write',
  compact = false,
  allowImageUpload = true
}) => {
  const [mode, setMode] = useState(defaultMode); // 'write' | 'preview'
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageAltInput, setImageAltInput] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { uploadImage, isUploading } = useMediaUpload();

  // Helper to insert markdown tags at cursor position
  const insertText = useCallback((prefix, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = prefix + selectedText + suffix;

    const nextValue = value.substring(0, start) + replacement + value.substring(end);
    if (onChange) {
      onChange(nextValue);
    }

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  // Insert Header
  const insertHeader = (level = 2) => {
    const hashes = '#'.repeat(level);
    insertText(hashes + ' ', '', 'Heading ' + level);
  };

  // Insert Read-Aloud Boxout
  const insertReadAloud = () => {
    insertText(':::readaloud\n', '\n:::', 'Describe what the characters see, hear, smell, and experience as they enter...');
  };

  // Insert GM Note
  const insertGmNote = () => {
    insertText(':::gmnote\n', '\n:::', 'Secret information for the Dungeon Master only...');
  };

  // Insert Table
  const insertTable = () => {
    const tableTemplate = '\n| Item / Clue | Description | Value |\n|---|---|---|\n| Ancient Relic | Pulses with pale blue light | 150 gp |\n| Rune Key | Unlocks the inner sanctum | Quest Item |\n';
    insertText(tableTemplate);
  };

  // Insert Image from Modal
  const handleConfirmImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const alt = imageAltInput.trim() || 'Campaign Illustration';
    insertText('\n![' + alt + '](' + imageUrlInput.trim() + ')\n');
    setImageUrlInput('');
    setImageAltInput('');
    setShowImageModal(false);
  };

  // Handle direct file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, 'banners');
      if (url) {
        const alt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        insertText('\n![' + alt + '](' + url + ')\n');
      }
    } catch (err) {
      console.error('Failed to upload image into text editor:', err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowImageModal(false);
    }
  };

  return (
    <div className={'rich-campaign-editor ' + className + (compact ? ' compact' : '')}>
      {/* Editor Top Bar: Label & Mode Switcher */}
      <div className="rich-editor-top-bar">
        {label ? (
          <label className="rich-editor-label">
            {icon && <i className={'fas ' + icon}></i>}
            <span>{label}</span>
          </label>
        ) : <div />}

        {/* Mode Switcher */}
        <div className="rich-mode-toggle">
          <button
            type="button"
            className={'rich-mode-btn ' + (mode === 'write' ? 'active' : '')}
            onClick={() => setMode('write')}
            title="Edit Markdown Text"
          >
            <i className="fas fa-pen"></i> <span>Write</span>
          </button>
          <button
            type="button"
            className={'rich-mode-btn ' + (mode === 'preview' ? 'active' : '')}
            onClick={() => setMode('preview')}
            title="View Thematic D&D Rendered Preview"
          >
            <i className="fas fa-eye"></i> <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Dedicated Formatting Toolbar (only in write mode) */}
      {mode === 'write' && (
        <div className="rich-editor-toolbar-strip">
          <div className="rich-tool-group">
            <button
              type="button"
              className="rich-tool-btn"
              onClick={() => insertText('**', '**', 'bold text')}
              title="Bold (**text**)"
            >
              <i className="fas fa-bold"></i>
            </button>
            <button
              type="button"
              className="rich-tool-btn"
              onClick={() => insertText('*', '*', 'italic text')}
              title="Italic (*text*)"
            >
              <i className="fas fa-italic"></i>
            </button>
            <button
              type="button"
              className="rich-tool-btn"
              onClick={() => insertText('<u>', '</u>', 'underlined')}
              title="Underline (<u>text</u>)"
            >
              <i className="fas fa-underline"></i>
            </button>
          </div>

          <div className="rich-toolbar-divider"></div>

          <div className="rich-tool-group">
            <button
              type="button"
              className="rich-tool-btn header-btn"
              onClick={() => insertHeader(2)}
              title="Section Header (## Header)"
            >
              <strong>H2</strong>
            </button>
            <button
              type="button"
              className="rich-tool-btn header-btn"
              onClick={() => insertHeader(3)}
              title="Subheader (### Header)"
            >
              <strong>H3</strong>
            </button>
          </div>

          <div className="rich-toolbar-divider"></div>

          <div className="rich-tool-group">
            <button
              type="button"
              className="rich-tool-btn narrative-btn"
              onClick={insertReadAloud}
              title="D&D Boxed Read-Aloud Text (:::readaloud)"
            >
              <i className="fas fa-book-open-reader"></i>
              <span className="btn-label-text">Read-Aloud</span>
            </button>

            <button
              type="button"
              className="rich-tool-btn secret-btn"
              onClick={insertGmNote}
              title="GM Secret Note (:::gmnote)"
            >
              <i className="fas fa-eye-slash"></i>
              <span className="btn-label-text">GM Secret</span>
            </button>

            {allowImageUpload && (
              <button
                type="button"
                className="rich-tool-btn image-btn"
                onClick={() => setShowImageModal(true)}
                title="Insert or Upload Image (![alt](url))"
              >
                <i className="fas fa-image"></i>
                <span className="btn-label-text">Image</span>
              </button>
            )}
          </div>

          <div className="rich-toolbar-divider"></div>

          <div className="rich-tool-group">
            <button
              type="button"
              className="rich-tool-btn"
              onClick={() => insertText('- ', '', 'List item')}
              title="Bullet List (- item)"
            >
              <i className="fas fa-list-ul"></i>
            </button>

            <button
              type="button"
              className="rich-tool-btn"
              onClick={insertTable}
              title="Markdown Table"
            >
              <i className="fas fa-table"></i>
            </button>

            <button
              type="button"
              className="rich-tool-btn"
              onClick={() => insertText('\n---\n')}
              title="Divider (---)"
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="rich-editor-content" style={minHeight ? { minHeight } : {}}>
        {mode === 'write' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="rich-textarea"
            style={minHeight ? { minHeight } : {}}
          />
        ) : (
          <div className="rich-rendered-preview" onClick={() => setMode('write')} title="Click anywhere to edit">
            {value && value.trim() ? (
              <RichLoreText text={value} />
            ) : (
              <div className="rich-preview-empty">
                <i className="fas fa-scroll"></i>
                <p>No content written yet. Click here to start writing!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Insert Image Mini-Modal */}
      {showImageModal && (
        <div className="rich-image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="rich-image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rich-modal-header">
              <i className="fas fa-image"></i>
              <h4>Embed Thematic Image</h4>
              <button type="button" className="btn-close-modal" onClick={() => setShowImageModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="rich-modal-body">
              <div className="form-group">
                <label>Image Caption / Alt Text</label>
                <input
                  type="text"
                  placeholder="e.g. Map of the Sunken Crypt, Ancient Sigil"
                  value={imageAltInput}
                  onChange={(e) => setImageAltInput(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Image Web URL</label>
                <input
                  type="text"
                  placeholder="https://... or paste link"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
              </div>

              <div className="modal-or-divider">
                <span>OR UPLOAD LOCAL ARTWORK</span>
              </div>

              <label className="btn-modal-upload">
                <i className={'fas ' + (isUploading ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up')}></i>
                <span>{isUploading ? 'Uploading Image...' : 'Choose Image File from Computer'}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            <div className="rich-modal-actions">
              <button type="button" className="btn-modal cancel" onClick={() => setShowImageModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal confirm"
                onClick={handleConfirmImageUrl}
                disabled={!imageUrlInput.trim()}
              >
                <i className="fas fa-plus"></i> Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichCampaignEditor;
