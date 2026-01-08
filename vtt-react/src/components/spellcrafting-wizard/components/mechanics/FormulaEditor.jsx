import React, { useState } from 'react';
import '../../styles/FormulaEditor.css';

/**
 * FormulaEditor component
 * Provides an interface for editing formulas with templates and variables
 * 
 * @param {Object} props
 * @param {string} props.formula - Current formula
 * @param {Function} props.onFormulaChange - Callback when formula changes
 * @param {Array} props.templates - Array of formula templates
 * @param {Array} props.variables - Array of available variables
 */
const FormulaEditor = ({ 
  formula = '', 
  onFormulaChange, 
  templates = [], 
  variables = [] 
}) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  
  // Handle formula input change
  const handleFormulaChange = (e) => {
    onFormulaChange(e.target.value);
  };
  
  // Apply a template
  const applyTemplate = (template) => {
    onFormulaChange(template.formula);
    setShowTemplates(false);
  };
  
  // Insert a variable at cursor position
  const insertVariable = (variable) => {
    // Get cursor position
    const input = document.getElementById('formula-input');
    const cursorPos = input.selectionStart;
    
    // Insert variable at cursor position
    const newFormula = 
      formula.substring(0, cursorPos) + 
      variable.name + 
      formula.substring(cursorPos);
    
    onFormulaChange(newFormula);
    setShowVariables(false);
    
    // Focus back on input and set cursor after inserted variable
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(cursorPos + variable.name.length, cursorPos + variable.name.length);
    }, 0);
  };
  
  return (
    <div className="formula-editor">
      <div className="formula-input-container">
        <input
          id="formula-input"
          type="text"
          className="formula-input"
          value={formula}
          onChange={handleFormulaChange}
          placeholder="Enter formula (e.g. 2d6 + INT)"
        />
        
        <div className="formula-buttons">
          <button 
            className="formula-button"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            Templates
          </button>
          
          <button 
            className="formula-button"
            onClick={() => setShowVariables(!showVariables)}
          >
            Variables
          </button>
        </div>
      </div>
      
      {showTemplates && templates.length > 0 && (
        <div className="formula-templates">
          <h4>Formula Templates</h4>
          <div className="templates-list">
            {templates.map((template, index) => (
              <div 
                key={index} 
                className="template-item"
                onClick={() => applyTemplate(template)}
              >
                <div className="template-name">{template.name}</div>
                <div className="template-formula">{template.formula}</div>
                <div className="template-description">{template.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showVariables && variables.length > 0 && (
        <div className="formula-variables">
          <h4>Available Variables</h4>
          <div className="variables-list">
            {variables.map((variable, index) => (
              <div 
                key={index} 
                className="variable-item"
                onClick={() => insertVariable(variable)}
              >
                <div className="variable-name">{variable.name}</div>
                <div className="variable-description">{variable.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaEditor;
