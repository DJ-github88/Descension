import React, { useState } from 'react';
import './RoomCard.css';

/**
 * Unified RoomCard Component
 * Handles both local and multiplayer rooms with consistent pathfinder beige aesthetic
 */
const RoomCard = ({
  room,
  onJoin,
  onDelete,
  onUpdateRoom, // New prop for updating room data
  isConnecting = false,
  showDeleteButton = false,
  className = ''
}) => {
  // State for editing
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(room.description || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(room.name || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Determine room type and styling
  const isTestRoom = room.isTestRoom || room.name?.toLowerCase().includes('test');
  const isLocalRoom = room.type === 'local' || room.isLocal;
  const isMultiplayerRoom = !isLocalRoom;

  // Check if user can edit (GM for multiplayer, owner for local)
  // Test rooms should be editable in development
  const canEdit = isLocalRoom || room.userRole === 'gm' || isTestRoom;

  // Get room role information
  const getRoleInfo = () => {
    if (isLocalRoom) {
      return {
        icon: 'fas fa-user-shield',
        label: 'Solo',
        color: '#8b4513' // Use pathfinder brown color
      };
    }

    if (room.userRole === 'gm') {
      return {
        icon: 'fas fa-crown',
        label: 'GM',
        color: '#d4af37' // Use pathfinder gold color
      };
    }

    return {
      icon: 'fas fa-user',
      label: 'Player',
      color: '#8b4513' // Use pathfinder brown color
    };
  };

  // Get room status
  const getStatusInfo = () => {
    if (isLocalRoom) {
      return {
        icon: 'fas fa-circle',
        label: 'Ready',
        color: '#8b4513' // Use pathfinder brown for local rooms
      };
    }

    const isActive = room.isActive || room.status === 'active';
    return {
      icon: 'fas fa-circle',
      label: isActive ? 'Active' : 'Offline',
      color: isActive ? '#228B22' : '#6b7280' // Forest green for active, gray for offline
    };
  };

  // Format last activity
  const formatLastActivity = () => {
    if (!room.lastActivity) return 'Unknown';
    
    const date = room.lastActivity.seconds 
      ? new Date(room.lastActivity.seconds * 1000)
      : new Date(room.lastActivity);
      
    return date.toLocaleDateString();
  };

  // Get member count
  const getMemberCount = () => {
    if (isLocalRoom) {
      // For local rooms, check if anyone is currently playing
      // Since local rooms are single-player, it's either 0/1 or 1/1
      return '0/1'; // Default to 0/1 since local rooms are offline until actively played
    }

    const memberCount = room.members?.length || 0;
    const maxPlayers = (room.settings?.maxPlayers || 6) + 1; // +1 for GM
    return `${memberCount}/${maxPlayers}`;
  };

  // Compress image to fit localStorage limits
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && onUpdateRoom) {
      console.log('🖼️ Uploading image for room:', room.id, 'Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      setIsUploadingImage(true);

      try {
        // Compress the image first
        const compressedFile = await compressImage(file);
        console.log('🗜️ Image compressed from', (file.size / 1024).toFixed(1), 'KB to', (compressedFile.size / 1024).toFixed(1), 'KB');

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          const sizeKB = (imageUrl.length * 0.75 / 1024).toFixed(1); // Rough base64 size estimate
          console.log('📸 Compressed image ready, estimated size:', sizeKB, 'KB');

          try {
            onUpdateRoom(room.id, { customImage: imageUrl });
            setIsUploadingImage(false);
            console.log('✅ Image upload successful');
          } catch (error) {
            console.error('❌ Image upload failed:', error);
            setIsUploadingImage(false);
            if (error.message.includes('quota')) {
              alert('Image is still too large for storage. Please try a smaller image or lower quality photo.');
            } else {
              alert('Failed to upload image: ' + error.message);
            }
          }
        };

        reader.onerror = (error) => {
          console.error('❌ FileReader error:', error);
          setIsUploadingImage(false);
          alert('Failed to read compressed image file');
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('❌ Image compression failed:', error);
        setIsUploadingImage(false);
        alert('Failed to process image. Please try a different image.');
      }
    } else {
      console.warn('⚠️ Image upload skipped - missing file or onUpdateRoom function');
    }
  };

  // Handle description save
  const handleDescriptionSave = () => {
    if (onUpdateRoom && editedDescription !== room.description) {
      onUpdateRoom(room.id, { description: editedDescription });
    }
    setIsEditingDescription(false);
  };

  // Handle description cancel
  const handleDescriptionCancel = () => {
    setEditedDescription(room.description || '');
    setIsEditingDescription(false);
  };

  // Handle name save
  const handleNameSave = () => {
    if (onUpdateRoom && editedName !== room.name) {
      onUpdateRoom(room.id, { name: editedName });
    }
    setIsEditingName(false);
  };

  // Handle name cancel
  const handleNameCancel = () => {
    setEditedName(room.name || '');
    setIsEditingName(false);
  };

  // Get room image
  const getRoomImage = () => {
    return room.customImage || null;
  };



  const roleInfo = getRoleInfo();
  const statusInfo = getStatusInfo();

  // Handle special test room layout - use same layout as standard rooms
  if (isTestRoom) {
    return (
      <div className={`room-card room-card-standard ${className}`}>
        {/* Header */}
        <div className="room-card-header">
          {isEditingName ? (
            <div className="name-edit">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Room name..."
                maxLength={50}
                className="name-edit-input"
              />
              <div className="name-edit-actions">
                <button onClick={handleNameSave} className="save-btn-small">
                  <i className="fas fa-check"></i>
                </button>
                <button onClick={handleNameCancel} className="cancel-btn-small">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="room-title-container">
              <h3 className="room-card-title">{room.name}</h3>
              {canEdit && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="edit-name-btn"
                  title="Edit room name"
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>
          )}
          <div className="room-card-role">
            <i className="fas fa-flask" style={{ color: '#FF9800' }}></i>
            <span>Test</span>
          </div>
        </div>

        {/* Room Preview - No box, just image or upload button */}
        <div className="room-card-preview-section">
          {getRoomImage() ? (
            <div className="room-custom-image-full">
              <img src={getRoomImage()} alt="Room preview" />
              {canEdit && (
                <div className="image-overlay">
                  <label htmlFor={`image-upload-${room.id}`} className="change-image-btn">
                    <i className="fas fa-camera"></i>
                    Change Image
                  </label>
                  <input
                    id={`image-upload-${room.id}`}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="room-upload-section">
              <label htmlFor={`image-upload-${room.id}`} className="upload-image-btn-clean">
                <i className="fas fa-plus"></i>
                Add Image
              </label>
              <input
                id={`image-upload-${room.id}`}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        {/* Room Info */}
        <div className="room-card-info">
          {/* Status and Members - Stretched to sides */}
          <div className="room-card-stats">
            <div className="room-stat">
              <i className="fas fa-circle" style={{ color: '#FF9800' }}></i>
              <span>Development</span>
            </div>
            <div className="room-stat">
              <i className="fas fa-users"></i>
              <span>∞/∞</span>
            </div>
          </div>

          {/* Description - Editable */}
          <div className="room-card-description">
            {isEditingDescription ? (
              <div className="description-edit">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Add a description to intrigue your players..."
                  rows={3}
                  maxLength={200}
                />
                <div className="description-actions">
                  <button onClick={handleDescriptionSave} className="save-btn">
                    <i className="fas fa-check"></i>
                    Save
                  </button>
                  <button onClick={handleDescriptionCancel} className="cancel-btn">
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="description-display">
                <p>{room.description || 'Development environment for testing multiplayer features and game mechanics.'}</p>
                {canEdit && (
                  <button
                    onClick={() => setIsEditingDescription(true)}
                    className="edit-description-btn"
                    title="Edit description"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Last Activity */}
          <div className="room-card-activity">
            <i className="fas fa-clock"></i>
            <span>Always Available</span>
          </div>
        </div>

        {/* Actions */}
        <div className="room-card-actions">
          <button
            className="room-card-button primary"
            onClick={() => onJoin(room)}
            disabled={isConnecting}
          >
            <i className="fas fa-flask"></i>
            Enter Test Lab
          </button>
        </div>
      </div>
    );
  }

  // Standard room layout - use unified pathfinder aesthetic for both local and multiplayer
  return (
    <div className={`room-card room-card-standard ${className}`}>
      {/* Header */}
      <div className="room-card-header">
        {isEditingName ? (
          <div className="name-edit">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Room name..."
              maxLength={50}
              className="name-edit-input"
            />
            <div className="name-edit-actions">
              <button onClick={handleNameSave} className="save-btn-small">
                <i className="fas fa-check"></i>
              </button>
              <button onClick={handleNameCancel} className="cancel-btn-small">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="room-title-container">
            <h3 className="room-card-title">{room.name}</h3>
            {canEdit && (
              <button
                onClick={() => setIsEditingName(true)}
                className="edit-name-btn"
                title="Edit room name"
              >
                <i className="fas fa-edit"></i>
              </button>
            )}
          </div>
        )}
        <div className="room-card-role">
          <i className={roleInfo.icon} style={{ color: roleInfo.color }}></i>
          <span>{roleInfo.label}</span>
        </div>
      </div>

      {/* Room Preview - No box, just image or upload button */}
      <div className="room-card-preview-section">
        {getRoomImage() ? (
          <div className="room-custom-image-full">
            <img src={getRoomImage()} alt="Room preview" />
            {canEdit && (
              <div className="image-overlay">
                <label htmlFor={`image-upload-${room.id}`} className="change-image-btn">
                  <i className="fas fa-camera"></i>
                  Change Image
                </label>
                <input
                  id={`image-upload-${room.id}`}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="room-upload-section">
            <label htmlFor={`image-upload-${room.id}`} className="upload-image-btn-clean">
              <i className="fas fa-plus"></i>
              Add Image
            </label>
            <input
              id={`image-upload-${room.id}`}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>

      {/* Room Info */}
      <div className="room-card-info">
        {/* Status and Members - Stretched to sides */}
        <div className="room-card-stats">
          <div className="room-stat">
            <i className={statusInfo.icon} style={{ color: statusInfo.color }}></i>
            <span>{statusInfo.label}</span>
          </div>
          <div className="room-stat">
            <i className="fas fa-users"></i>
            <span>{getMemberCount()}</span>
          </div>
        </div>

        {/* Description - Editable */}
        <div className="room-card-description">
          {isEditingDescription ? (
            <div className="description-edit">
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add a description to intrigue your players..."
                rows={3}
                maxLength={200}
              />
              <div className="description-actions">
                <button onClick={handleDescriptionSave} className="save-btn">
                  <i className="fas fa-check"></i>
                  Save
                </button>
                <button onClick={handleDescriptionCancel} className="cancel-btn">
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="description-display">
              <p>{room.description || 'No description yet...'}</p>
              {canEdit && (
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="edit-description-btn"
                  title="Edit description"
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Last Activity */}
        <div className="room-card-activity">
          <i className="fas fa-clock"></i>
          <span>Last Activity: {formatLastActivity()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="room-card-actions">
        <button
          className="room-card-button primary"
          onClick={() => onJoin(room)}
          disabled={isConnecting}
          title={roleInfo.label === 'GM' ? 'Resume as Game Master' : 'Join as Player'}
        >
          <i className={roleInfo.label === 'GM' ? 'fas fa-crown' : 'fas fa-play'}></i>
          {roleInfo.label === 'GM' ? 'Resume as GM' : 'Join'}
        </button>
        
        {showDeleteButton && onDelete && (
          <button
            className="room-card-button danger"
            onClick={() => {
              // Handle different delete function signatures
              if (isLocalRoom) {
                onDelete(room.id); // Local rooms expect roomId
              } else {
                onDelete(room); // Multiplayer rooms expect room object
              }
            }}
            title="Delete Room"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
