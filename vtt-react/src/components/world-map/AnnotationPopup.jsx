import React, { useState, useEffect } from 'react';
import useQuestStore from '../../store/questStore';
import { ZONE_DATA } from '../../data/zoneData';
import { PIN_TYPE_OPTIONS } from './mapPinIcons';
import { notify, confirmDialog } from './MapNotify';
import './WorldMapImmerse.css';

const AnnotationPopup = ({
  isOpen,
  onClose,
  annotation,
  userId,
  onSave,
  onDelete
}) => {
  const quests = useQuestStore((state) => state.quests) || [];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [linkedQuestId, setLinkedQuestId] = useState('');
  const [linkedZoneId, setLinkedZoneId] = useState('');
  const [pinType, setPinType] = useState('custom');
  const [status, setStatus] = useState('discovered');
  const [color, setColor] = useState('rgba(196, 164, 74, 0.25)');

  const isArea = annotation && Array.isArray(annotation.points);

  useEffect(() => {
    if (annotation) {
      setTitle(annotation.title || '');
      setDescription(annotation.description || '');
      setNote(annotation.note || '');
      setVisibility(annotation.visibility || 'private');
      setLinkedQuestId(annotation.questId || '');
      setLinkedZoneId(annotation.zoneId || '');
      setPinType(annotation.pinType || 'custom');
      setStatus(annotation.status || 'discovered');
      setColor(annotation.color || 'rgba(196, 164, 74, 0.25)');
    }
  }, [annotation]);

  if (!isOpen || !annotation) return null;

  const handleSave = () => {
    if (!title.trim()) {
      notify('Please enter a title.', 'warning');
      return;
    }

    const updatedData = {
      title,
      description,
      note,
      visibility,
      questId: linkedQuestId || null,
      zoneId: linkedZoneId || null
    };

    if (isArea) {
      updatedData.status = status;
      updatedData.color = color;
    } else {
      updatedData.pinType = pinType;
    }

    onSave(annotation.id, updatedData);
    onClose();
  };

  const colors = [
    { value: 'rgba(196, 164, 74, 0.25)', label: 'Gold' },
    { value: 'rgba(74, 103, 65, 0.25)', label: 'Forest Green' },
    { value: 'rgba(139, 105, 20, 0.25)', label: 'Bronze' },
    { value: 'rgba(107, 26, 26, 0.25)', label: 'Crimson' },
    { value: 'rgba(70, 100, 130, 0.25)', label: 'Slate Blue' }
  ];

  return (
    <div className="annotation-popup-overlay animate-fade-in" onClick={onClose}>
      <div className="annotation-popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <h2 className="popup-header-title">
          <i className={isArea ? 'fas fa-draw-polygon' : 'fas fa-map-pin'}></i>
          {isArea ? ' Edit Territory' : ' Edit Marker'}
        </h2>

        <div className="popup-form-scrollable">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Secret Stash, Ambush Point"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Brief Summary</label>
            <input
              type="text"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short descriptive sentence..."
            />
          </div>

          {/* Detailed Notes (Parchment Styled textarea) */}
          <div className="form-group">
            <label className="form-label">Lore Notes & Records</label>
            <textarea
              className="form-textarea parchment-scroll"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write detailed lore findings, journal logs, or encounter details here..."
              rows={4}
            />
          </div>

          {/* Pin Type (only for pins) */}
          {!isArea && (
            <div className="form-group">
              <label className="form-label">Marker Icon</label>
              <select
                className="form-select"
                value={pinType}
                onChange={(e) => setPinType(e.target.value)}
              >
                {PIN_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status (only for areas) */}
          {isArea && (
            <div className="form-group-row">
              <div className="form-group half-width">
                <label className="form-label">Area Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="discovered">Discovered</option>
                  <option value="unexplored">Unexplored</option>
                  <option value="safe">Safe Territory</option>
                  <option value="dangerous">Hostile Territory</option>
                </select>
              </div>

              {/* Color Selector (only for areas) */}
              <div className="form-group half-width">
                <label className="form-label">Fill Color</label>
                <select
                  className="form-select"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colors.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-group-row">
            {/* Quest Linker */}
            <div className="form-group half-width">
              <label className="form-label">Link to Quest</label>
              <select
                className="form-select"
                value={linkedQuestId}
                onChange={(e) => setLinkedQuestId(e.target.value)}
              >
                <option value="">-- None --</option>
                {quests.map((q) => (
                  <option key={q.id} value={q.id}>
                    [{q.status.toUpperCase()}] {q.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone Linker */}
            <div className="form-group half-width">
              <label className="form-label">Link to Zone Lore</label>
              <select
                className="form-select"
                value={linkedZoneId}
                onChange={(e) => setLinkedZoneId(e.target.value)}
              >
                <option value="">-- None --</option>
                {ZONE_DATA.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visibility */}
          <div className="form-group">
            <label className="form-label">Visibility Controls</label>
            <div className="visibility-radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                />
                <i className="fas fa-eye-slash"></i> Private (Only Me)
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="visibility"
                  value="friends"
                  checked={visibility === 'friends'}
                  onChange={() => setVisibility('friends')}
                />
                <i className="fas fa-users"></i> Friends Only
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                />
                <i className="fas fa-globe"></i> Public
              </label>
            </div>
          </div>
        </div>

        <div className="popup-actions-footer">
          <button
            className="popup-btn delete-btn"
            onClick={() => {
              confirmDialog('Are you absolutely sure you want to delete this custom map marker?', () => {
                onDelete(annotation.id);
                onClose();
              });
            }}
          >
            <i className="fas fa-trash"></i> Delete
          </button>
          
          <div className="footer-right-actions">
            <button className="popup-btn cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="popup-btn save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationPopup;
