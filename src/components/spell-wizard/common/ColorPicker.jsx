import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Preset colors for common themes and elements
const PRESET_COLORS = [
  // Fire colors
  '#FF4400', '#FF6600', '#FF8800', '#FFAA00',
  // Ice colors
  '#00CCFF', '#00AAFF', '#0088FF', '#0066FF',
  // Nature colors
  '#00FF00', '#44FF44', '#88FF88', '#CCFFCC',
  // Arcane colors
  '#FF00FF', '#FF44FF', '#FF88FF', '#FFCCFF',
  // Holy colors
  '#FFFF00', '#FFDD00', '#FFBB00', '#FF9900',
  // Shadow colors
  '#660066', '#880088', '#AA00AA', '#CC00CC'
];

// Checks if a string is a valid hex color
const isValidHexColor = (color) => {
  return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
};

const ColorPicker = ({ 
  color = '#FFFFFF',
  onChange = () => {},
  showPresets = true,
  showGradient = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [recentColors, setRecentColors] = useState([]);
  const [error, setError] = useState(null);
  const pickerRef = useRef(null);

  // Update internal state when prop changes
  useEffect(() => {
    if (color !== currentColor) {
      setCurrentColor(color);
    }
  }, [color]);

  // Handle clicks outside to close the picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle color change from any control
  const handleColorChange = (newColor) => {
    // Basic validation for hex colors
    if (newColor.startsWith('#')) {
      if (!isValidHexColor(newColor)) {
        setError('Invalid hex color format');
        setCurrentColor(newColor); // Still update the input
        return;
      }
    }
    
    setError(null);
    setCurrentColor(newColor);
    onChange(newColor);
    
    // Update recent colors
    if (isValidHexColor(newColor)) {
      setRecentColors(prev => {
        const updated = [newColor, ...prev.filter(c => c !== newColor)].slice(0, 5);
        return updated;
      });
    }
  };

  // Handle color selection from gradient
  const handleGradientClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Calculate hue based on position (0-360)
    const hue = Math.round((x / width) * 360);
    const newColor = `hsl(${hue}, 100%, 50%)`;
    
    // Convert HSL to hex
    const tempEl = document.createElement('div');
    tempEl.style.color = newColor;
    document.body.appendChild(tempEl);
    const rgbColor = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    
    // Parse RGB and convert to hex
    const rgbMatch = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
      handleColorChange(hexColor);
    }
  };

  // Toggle the picker visibility
  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="color-picker" ref={pickerRef}>
      <button
        className="color-preview"
        onClick={togglePicker}
        type="button"
      >
        <div 
          className="color-swatch"
          style={{ backgroundColor: currentColor }}
        ></div>
        <span className="color-value">{currentColor}</span>
      </button>

      {isOpen && (
        <div className="color-picker-popup">
          {showGradient && (
            <div 
              className="color-gradient"
              onClick={handleGradientClick}
            ></div>
          )}

          {showPresets && (
            <>
              <div className="color-section">
                <h4>Preset Colors</h4>
                <div className="color-grid">
                  {PRESET_COLORS.map(presetColor => (
                    <button
                      key={presetColor}
                      className="color-swatch"
                      style={{ backgroundColor: presetColor }}
                      onClick={() => handleColorChange(presetColor)}
                      type="button"
                    ></button>
                  ))}
                </div>
              </div>

              {recentColors.length > 0 && (
                <div className="color-section">
                  <h4>Recent Colors</h4>
                  <div className="color-grid">
                    {recentColors.map(recentColor => (
                      <button
                        key={recentColor}
                        className="color-swatch"
                        style={{ backgroundColor: recentColor }}
                        onClick={() => handleColorChange(recentColor)}
                        type="button"
                      ></button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="color-input">
            <input
              type="text"
              value={currentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#RRGGBB"
            />
            <input
              type="color"
              value={isValidHexColor(currentColor) ? currentColor : '#FFFFFF'}
              onChange={(e) => handleColorChange(e.target.value.toUpperCase())}
            />
          </div>
          
          {error && <div className="error">{error}</div>}
        </div>
      )}
    </div>
  );
};

ColorPicker.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func,
  showPresets: PropTypes.bool,
  showGradient: PropTypes.bool
};

export default ColorPicker;