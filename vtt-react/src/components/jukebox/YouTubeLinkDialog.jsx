import React, { useState, useEffect } from 'react';
import { extractYouTubeId } from '../../services/firebase/audioService';

export default function YouTubeLinkDialog({ show, onHide, onAdd }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [previewId, setPreviewId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url) {
      const id = extractYouTubeId(url);
      setPreviewId(id);
      setError(id ? null : url.length > 5 ? 'Not a valid YouTube URL' : null);
    } else {
      setPreviewId(null);
      setError(null);
    }
  }, [url]);

  const handleSubmit = async () => {
    if (!previewId) { setError('Enter a valid YouTube URL'); return; }
    setLoading(true);
    setError(null);
    try {
      const tagArray = tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
      const result = await onAdd(url, { name: name || undefined, tags: tagArray });
      if (result && result.success) {
        setUrl(''); setName(''); setTags(''); setPreviewId(null);
        onHide();
      } else if (result && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="lutebox-dialog-overlay" onClick={onHide}>
      <div className="lutebox-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="lutebox-dialog-ornament" />
        <div className="lutebox-dialog-header" style={{ '--accent': '#ff4444' }}>
          <i className="fab fa-youtube" />
          <h3>Add from YouTube</h3>
        </div>

        <div className="lutebox-dialog-body">
          {error && (
            <div className="lutebox-dialog-error">
              <i className="fas fa-exclamation-triangle" /> {error}
            </div>
          )}

          <div className="lutebox-field">
            <label>YouTube URL</label>
            <div className="lutebox-input-group">
              <i className="fab fa-youtube" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={loading}
              />
            </div>
          </div>

          {previewId && (
            <div className="lutebox-yt-preview">
              <img
                src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`}
                alt="Video thumbnail"
              />
              <div className="lutebox-yt-badge">
                <i className="fab fa-youtube" /> Valid link detected
              </div>
            </div>
          )}

          <div className="lutebox-field">
            <label>Track Name <span className="lutebox-optional">(optional)</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Leave blank to use video title"
              disabled={loading}
            />
          </div>

          <div className="lutebox-field">
            <label>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ambient, combat, tavern..."
              disabled={loading}
            />
            <span className="lutebox-field-hint">Comma separated tags for your library</span>
          </div>
        </div>

        <div className="lutebox-dialog-footer">
          <button className="lutebox-dialog-btn lutebox-dialog-btn-cancel" onClick={onHide} disabled={loading}>
            Cancel
          </button>
          <button
            className="lutebox-dialog-btn lutebox-dialog-btn-youtube"
            onClick={handleSubmit}
            disabled={!previewId || loading}
          >
            {loading ? 'Adding...' : <><i className="fab fa-youtube" /> Add Track</>}
          </button>
        </div>
      </div>
    </div>
  );
}
