// Copy and paste this into your browser's console to apply the styles immediately

// Create a style element
const styleElement = document.createElement('style');

// Add the CSS
styleElement.textContent = `
/* Statistics Step Styling */
.stats-container {
  display: flex !important;
  flex-direction: column !important;
  gap: 30px !important;
  padding: 5px !important;
  max-width: 1200px !important;
  margin: 0 auto !important;
}

.stats-section {
  background: linear-gradient(to bottom, #2a2a2a, #1a1a1a) !important;
  border-radius: 12px !important;
  padding: 22px !important;
  border: 1px solid #444 !important;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4) !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  overflow: hidden !important;
}

.stats-section:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5) !important;
  border-color: rgba(255, 209, 0, 0.3) !important;
}

.stats-section::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 4px !important;
  background: linear-gradient(to right, #ffd100, #ffaa00) !important;
  border-radius: 4px 4px 0 0 !important;
}

.stats-section h3 {
  font-size: 20px !important;
  font-weight: 600 !important;
  margin: 0 0 22px 0 !important;
  color: #ffd100 !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  border-bottom: 1px solid rgba(255, 209, 0, 0.3) !important;
  padding-bottom: 10px !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7) !important;
  display: flex !important;
  align-items: center !important;
}

.stats-section h3::before {
  content: '✦' !important;
  margin-right: 10px !important;
  color: #ffaa00 !important;
  font-size: 22px !important;
}

.stats-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
  gap: 24px !important;
}

.stat-item {
  display: flex !important;
  flex-direction: column !important;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)) !important;
  border-radius: 10px !important;
  padding: 18px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.25s ease !important;
  position: relative !important;
  overflow: hidden !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

.stat-item:hover {
  border-color: rgba(255, 209, 0, 0.4) !important;
  box-shadow: 0 0 20px rgba(255, 209, 0, 0.15) !important;
  transform: translateY(-3px) !important;
}

.stat-item label {
  font-size: 15px !important;
  color: #e0e0e0 !important;
  margin-bottom: 10px !important;
  font-weight: 600 !important;
  letter-spacing: 0.6px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6) !important;
}

.stat-item input {
  background-color: rgba(0, 0, 0, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  color: #ffffff !important;
  padding: 12px !important;
  font-size: 17px !important;
  font-weight: 500 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6) !important;
  transition: all 0.25s ease !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}

.stat-item input:focus {
  border-color: #ffd100 !important;
  outline: none !important;
  box-shadow: 0 0 12px rgba(255, 209, 0, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.3) !important;
  background-color: rgba(0, 0, 0, 0.6) !important;
}

/* Damage type styling */
.damage-types-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)) !important;
  gap: 18px !important;
  margin-top: 15px !important;
}

.damage-type-item {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)) !important;
  border-radius: 10px !important;
  padding: 15px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.25s ease !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

.damage-type-item:hover {
  border-color: rgba(255, 209, 0, 0.4) !important;
  box-shadow: 0 0 20px rgba(255, 209, 0, 0.15) !important;
  transform: translateY(-3px) !important;
}

.damage-type-name {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #ffd100 !important;
  margin-bottom: 12px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6) !important;
  border-bottom: 1px solid rgba(255, 209, 0, 0.2) !important;
  padding-bottom: 8px !important;
}

.damage-type-inputs {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 15px !important;
}

.damage-input {
  flex: 1 !important;
  min-width: 100px !important;
}

.damage-input label {
  display: block !important;
  font-size: 14px !important;
  color: #e0e0e0 !important;
  margin-bottom: 8px !important;
  font-weight: 500 !important;
}

.damage-input input,
.damage-input select {
  width: 100% !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  color: #ffffff !important;
  padding: 10px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6) !important;
  transition: all 0.25s ease !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}

.damage-input input:focus,
.damage-input select:focus {
  border-color: #ffd100 !important;
  outline: none !important;
  box-shadow: 0 0 12px rgba(255, 209, 0, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.3) !important;
  background-color: rgba(0, 0, 0, 0.6) !important;
}

/* Resistance select styling */
.resistance-select {
  appearance: none !important;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 10px center !important;
  background-size: 12px !important;
  padding-right: 30px !important;
}

.resistance-select.resistant {
  color: #1eff00 !important;
  border-color: rgba(30, 255, 0, 0.4) !important;
}

.resistance-select.immune {
  color: #ffd100 !important;
  border-color: rgba(255, 209, 0, 0.4) !important;
}

.resistance-select.vulnerable {
  color: #ff4d4d !important;
  border-color: rgba(255, 77, 77, 0.4) !important;
}

/* Section description */
.section-description {
  font-size: 15px !important;
  color: #cccccc !important;
  margin: 0 0 15px 0 !important;
  font-style: italic !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6) !important;
}

/* Step title */
.step-title {
  font-size: 24px !important;
  font-weight: 700 !important;
  color: #ffd100 !important;
  margin-bottom: 25px !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7) !important;
  border-bottom: 1px solid rgba(255, 209, 0, 0.3) !important;
  padding-bottom: 10px !important;
}

/* Wizard step */
.wizard-step {
  padding: 20px !important;
  max-width: 1200px !important;
  margin: 0 auto !important;
}
`;

// Add the style element to the head
document.head.appendChild(styleElement);

// Fix the itemStore reference error
if (typeof itemStore === 'undefined' || itemStore === null) {
  console.log('Fixing itemStore reference...');
  window.itemStore = { items: [] };
}

console.log('Styles applied successfully!');
