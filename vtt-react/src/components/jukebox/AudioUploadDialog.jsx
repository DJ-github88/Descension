import React, { useState, useCallback } from 'react';
import { ALLOWED_EXTENSIONS, MAX_AUDIO_FILE_SIZE } from '../../services/firebase/audioService';

const MAX_MB = MAX_AUDIO_FILE_SIZE / (1024 * 1024);

export default function AudioUploadDialog({ show, onHide, onUpload, disabled }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback((selectedFile) => {
    setError(null);
    if (!selectedFile) return;
    const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported format. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }
    if (selectedFile.size > MAX_AUDIO_FILE_SIZE) {
      setError(`File too large (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB). Max: ${MAX_MB}MB`);
      return;
    }
    setFile(selectedFile);
    if (!name) setName(selectedFile.name.replace(/\.[^/.]+$/, ''));
  }, [name]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  }, [handleFileSelect]);

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setProgress(10);
    try {
      const tagArray = tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
      setProgress(30);
      const result = await onUpload(file, { name: name || file.name, tags: tagArray });
      setProgress(100);
      if (result && result.success) {
        setTimeout(() => { setFile(null); setName(''); setTags(''); setProgress(0); onHide(); }, 500);
      } else if (result && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="lutebox-dialog-overlay" onClick={onHide}>
      <div className="lutebox-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="lutebox-dialog-ornament" />
        <div className="lutebox-dialog-header">
          <i className="fas fa-upload" />
          <h3>Upload to Songbook</h3>
        </div>

        <div className="lutebox-dialog-body">
          {error && (
            <div className="lutebox-dialog-error">
              <i className="fas fa-exclamation-triangle" /> {error}
            </div>
          )}

          <div
            className={`lutebox-dropzone ${dragOver ? 'lutebox-dropzone-active' : ''} ${file ? 'lutebox-dropzone-has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && document.getElementById('lutebox-file-input')?.click()}
          >
            {file ? (
              <div className="lutebox-dropzone-file">
                <i className="fas fa-file-audio" />
                <span className="lutebox-dropzone-filename">{file.name}</span>
                <span className="lutebox-dropzone-filesize">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className="lutebox-dropzone-prompt">
                <i className="fas fa-cloud-upload-alt" />
                <span>Drop an audio file here</span>
                <span className="lutebox-dropzone-hint">or click to browse</span>
                <span className="lutebox-dropzone-formats">MP3, WAV, OGG — Max {MAX_MB}MB</span>
              </div>
            )}
            <input
              id="lutebox-file-input"
              type="file"
              accept={ALLOWED_EXTENSIONS.join(',')}
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files[0])}
              disabled={uploading || disabled}
            />
          </div>

          <div className="lutebox-field">
            <label>Track Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What shall we call this tune?"
              disabled={uploading}
            />
          </div>

          <div className="lutebox-field">
            <label>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ambient, combat, tavern, boss..."
              disabled={uploading}
            />
            <span className="lutebox-field-hint">Comma separated — helps you find tracks later</span>
          </div>

          {uploading && (
            <div className="lutebox-progress-bar">
              <div className="lutebox-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        <div className="lutebox-dialog-footer">
          <button className="lutebox-dialog-btn lutebox-dialog-btn-cancel" onClick={onHide} disabled={uploading}>
            Cancel
          </button>
          <button
            className="lutebox-dialog-btn lutebox-dialog-btn-primary"
            onClick={handleSubmit}
            disabled={!file || uploading || disabled}
          >
            {uploading ? 'Uploading...' : <><i className="fas fa-upload" /> Upload</>}
          </button>
        </div>
      </div>
    </div>
  );
}
