import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import { POWER_ADJUSTMENT_RECOMMENDATIONS, COMPARATIVE_BALANCE } from '../../core/mechanics/balanceCalculator';
import BalanceDisplay from '../mechanics/BalanceDisplay';
import { Card, Alert, Button, ListGroup, Badge, Row, Col, ProgressBar } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaInfoCircle } from 'react-icons/fa';

const Step11Balance = () => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const [balanceReport, setBalanceReport] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [appliedAdjustments, setAppliedAdjustments] = useState([]);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  // Generate balance report when component mounts or state changes
  useEffect(() => {
    // Create a spell object from the wizard state for balance calculation
    const spellObject = createSpellObjectFromState(state);
    
    // Generate comprehensive balance analysis
    const report = POWER_ADJUSTMENT_RECOMMENDATIONS.generateBalanceReport(spellObject);
    setBalanceReport(report);
  }, [
    state.name,
    state.level,
    state.effectTypes,
    state.damageConfig,
    state.healingConfig,
    state.buffConfig,
    state.debuffConfig,
    state.utilityConfig,
    state.targetingConfig,
    state.durationConfig,
    state.resourceCost,
    state.cooldownConfig
  ]);

  // Helper function to create a spell object for balance calculation
  const createSpellObjectFromState = (state) => {
    return {
      name: state.name,
      level: state.level || 1,
      effectTypes: state.effectTypes,
      spellType: state.spellType,
      
      // Include all relevant configs
      damageConfig: state.damageConfig,
      healingConfig: state.healingConfig,
      buffConfig: state.buffConfig,
      debuffConfig: state.debuffConfig,
      utilityConfig: state.utilityConfig,
      
      targetingConfig: state.targetingConfig,
      durationConfig: state.durationConfig,
      resourceCost: state.resourceCost,
      cooldownConfig: state.cooldownConfig,
      
      // Map specific properties needed by the balance calculator
      damageAmount: state.damageConfig?.amount,
      damageType: state.damageConfig?.damageType,
      healingAmount: state.healingConfig?.amount,
      duration: state.durationConfig,
      cooldown: state.cooldownConfig,
      resourceType: state.resourceCost?.primaryResourceType,
      
      // For area effects
      targetingType: state.targetingConfig?.targetingType,
      areaSize: state.targetingConfig?.areaSize,
      targetCount: state.targetingConfig?.targetCount
    };
  };

  // Apply a suggested adjustment
  const applyAdjustment = (adjustment) => {
    // Check if this adjustment was already applied
    if (appliedAdjustments.find(a => a.id === adjustment.id)) {
      return;
    }
    
    // Based on adjustment type, dispatch appropriate action
    if (adjustment.type === 'resource') {
      dispatch(actionCreators.updateResourceCost(adjustment.payload));
    } else if (adjustment.type === 'damage') {
      dispatch(actionCreators.updateDamageConfig(adjustment.payload));
    } else if (adjustment.type === 'healing') {
      dispatch(actionCreators.updateHealingConfig(adjustment.payload));
    } else if (adjustment.type === 'duration') {
      dispatch(actionCreators.updateDurationConfig(adjustment.payload));
    } else if (adjustment.type === 'cooldown') {
      dispatch(actionCreators.updateCooldownConfig(adjustment.payload));
    } else if (adjustment.type === 'effect') {
      // For effect type adjustments, we need to determine which effect config to update
      const effectType = adjustment.effectType;
      if (effectType === 'damage') {
        dispatch(actionCreators.updateDamageConfig(adjustment.payload));
      } else if (effectType === 'healing') {
        dispatch(actionCreators.updateHealingConfig(adjustment.payload));
      } else if (effectType === 'buff') {
        dispatch(actionCreators.updateBuffConfig(adjustment.payload));
      } else if (effectType === 'debuff') {
        dispatch(actionCreators.updateDebuffConfig(adjustment.payload));
      } else if (effectType === 'utility') {
        dispatch(actionCreators.updateUtilityConfig(adjustment.payload));
      }
    }
    
    // Track applied adjustments
    setAppliedAdjustments([...appliedAdjustments, adjustment]);
  };

  // Generate specific adjustment from suggestion
  const generateAdjustmentFromSuggestion = (suggestion) => {
    // Parse the suggestion text to determine the type and values
    const costMatch = suggestion.match(/(\w+) cost from (\d+) to (\d+)/);
    if (costMatch) {
      const resourceType = costMatch[1].toLowerCase();
      const newValue = parseInt(costMatch[3], 10);
      
      return {
        id: `${resourceType}_cost_${newValue}`,
        type: 'resource',
        name: `Adjust ${resourceType} cost to ${newValue}`,
        description: suggestion,
        payload: { [resourceType === 'mana' ? 'mana' : 'classResourceCost']: newValue }
      };
    }
    
    const damageMatch = suggestion.match(/damage from (\d+) to (\d+)/);
    if (damageMatch) {
      const newValue = parseInt(damageMatch[2], 10);
      
      return {
        id: `damage_amount_${newValue}`,
        type: 'damage',
        name: `Adjust damage to ${newValue}`,
        description: suggestion,
        payload: { amount: newValue }
      };
    }
    
    const healingMatch = suggestion.match(/healing from (\d+) to (\d+)/);
    if (healingMatch) {
      const newValue = parseInt(healingMatch[2], 10);
      
      return {
        id: `healing_amount_${newValue}`,
        type: 'healing',
        name: `Adjust healing to ${newValue}`,
        description: suggestion,
        payload: { amount: newValue }
      };
    }
    
    const durationMatch = suggestion.match(/(\w+) duration by (\d+)%/);
    if (durationMatch) {
      // This is a percentage adjustment to duration
      const effectType = durationMatch[1].toLowerCase();
      const percentChange = parseInt(durationMatch[2], 10);
      
      // Current duration value
      const currentValue = state.durationConfig?.durationValue || 1;
      
      // Calculate new duration
      const newValue = Math.max(1, Math.round(currentValue * (1 + percentChange / 100)));
      
      return {
        id: `duration_${newValue}`,
        type: 'duration',
        name: `Adjust duration to ${newValue}`,
        description: suggestion,
        payload: { durationValue: newValue }
      };
    }
    
    const cooldownMatch = suggestion.match(/cooldown from (\d+) to (\d+)/);
    if (cooldownMatch) {
      const newValue = parseInt(cooldownMatch[2], 10);
      
      return {
        id: `cooldown_${newValue}`,
        type: 'cooldown',
        name: `Adjust cooldown to ${newValue}`,
        description: suggestion,
        payload: { value: newValue }
      };
    }
    
    // For more complex suggestions, return a more generic adjustment
    return {
      id: `suggestion_${suggestion.substring(0, 20).replace(/\W+/g, '_')}`,
      type: 'generic',
      name: 'Apply suggested change',
      description: suggestion,
      payload: null,
      manual: true // Flag this as requiring manual implementation
    };
  };

  // Get the power status class for styling
  const getPowerStatusClass = (ratio) => {
    if (ratio >= 1.5) return 'danger';
    if (ratio >= 1.2) return 'warning';
    if (ratio <= 0.5) return 'danger';
    if (ratio <= 0.8) return 'warning';
    return 'success';
  };

  // Get the power progress value for visualization
  const getPowerProgressValue = (ratio) => {
    return Math.min(100, Math.max(0, ratio * 50)); // Scale to 0-100 range with 50 as balanced
  };

  return (
    <div className="spell-wizard-step-content step9-balance-content">
      <div className="step9-header">
        <h3>Balance Evaluation</h3>
        <p className="step-description">Review and adjust your spell's power balance to ensure fair gameplay.</p>
      </div>

      {balanceReport ? (
        <>
          <Card className="mb-4">
            <Card.Header>
              <h4 className="m-0">Overall Balance Assessment</h4>
            </Card.Header>
            <Card.Body>
              <div className="balance-summary">
                <Row className="align-items-center">
                  <Col md={3}>
                    <div className={`balance-status-badge bg-${getPowerStatusClass(balanceReport.powerRatio)} p-2 text-white text-center rounded`}>
                      {balanceReport.balanceStatus}
                    </div>
                  </Col>
                  <Col md={9}>
                    <div className="power-meter mb-2">
                      <div className="power-labels d-flex justify-content-between mb-1">
                        <small>Underpowered</small>
                        <small>Balanced</small>
                        <small>Overpowered</small>
                      </div>
                      <ProgressBar>
                        <ProgressBar variant="danger" now={20} key={1} />
                        <ProgressBar variant="warning" now={15} key={2} />
                        <ProgressBar variant="success" now={30} key={3} />
                        <ProgressBar variant="warning" now={15} key={4} />
                        <ProgressBar variant="danger" now={20} key={5} />
                      </ProgressBar>
                      <div 
                        className="power-indicator" 
                        style={{ 
                          position: 'relative', 
                          left: `${getPowerProgressValue(balanceReport.powerRatio)}%`,
                          marginTop: '-10px',
                          width: '2px',
                          height: '20px',
                          backgroundColor: 'black'
                        }}
                      >
                        <div className="indicator-label" style={{ position: 'absolute', top: '20px', left: '-15px' }}>
                          {(balanceReport.powerRatio * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                
                <div className="primary-recommendation mt-3">
                  <Alert variant={getPowerStatusClass(balanceReport.powerRatio)}>
                    <Alert.Heading>Recommendation</Alert.Heading>
                    <p>{balanceReport.primaryRecommendation}</p>
                  </Alert>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          <Row>
            <Col lg={7}>
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h4 className="m-0">Power Analysis</h4>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                  >
                    {showDetailedBreakdown ? 'Hide Details' : 'Show Details'}
                  </Button>
                </Card.Header>
                <Card.Body>
                  <BalanceDisplay 
                    balanceData={balanceReport}
                    selectedMetric={selectedMetric}
                    onMetricSelect={setSelectedMetric}
                  />
                  
                  {showDetailedBreakdown && balanceReport.metrics && (
                    <div className="detailed-metrics mt-4">
                      <h5>Detailed Metrics</h5>
                      <ListGroup>
                        {Object.entries(balanceReport.metrics).map(([metricId, metric]) => (
                          <ListGroup.Item 
                            key={metricId}
                            className={selectedMetric === metricId ? 'active' : ''}
                            onClick={() => setSelectedMetric(metricId)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{metricId}</strong>
                                <Badge 
                                  bg={getPowerStatusClass(metric.ratio)}
                                  className="ms-2"
                                >
                                  {(metric.ratio * 100).toFixed(0)}%
                                </Badge>
                              </div>
                              <div>
                                {metric.spellValue ? metric.spellValue.toFixed(1) : '?'} / {metric.baselineValue ? metric.baselineValue.toFixed(1) : '?'}
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={5}>
              <Card className="mb-4">
                <Card.Header>
                  <h4 className="m-0">Suggested Adjustments</h4>
                </Card.Header>
                <Card.Body>
                  {balanceReport.prioritizedSuggestions && balanceReport.prioritizedSuggestions.length > 0 ? (
                    <ListGroup className="adjustment-suggestions">
                      {balanceReport.prioritizedSuggestions.map((suggestion, index) => {
                        // Generate an adjustment object from the suggestion
                        const adjustment = generateAdjustmentFromSuggestion(suggestion);
                        const isApplied = appliedAdjustments.find(a => a.id === adjustment.id);
                        
                        return (
                          <ListGroup.Item key={index} className={isApplied ? 'applied bg-light' : ''}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                {isApplied && <FaCheckCircle className="text-success me-2" />}
                                {suggestion}
                              </div>
                              <Button
                                variant={adjustment.manual ? "outline-secondary" : "outline-primary"}
                                size="sm"
                                onClick={() => applyAdjustment(adjustment)}
                                disabled={isApplied || adjustment.payload === null}
                              >
                                {adjustment.manual ? 'Manual' : 'Apply'}
                              </Button>
                            </div>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  ) : (
                    <div className="no-adjustments-needed text-center">
                      <FaCheckCircle className="text-success mb-2" size={32} />
                      <p>No balance adjustments needed. Your spell is well-balanced!</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Header>
                  <h4 className="m-0"><FaInfoCircle className="me-2" /> Balance Factors</h4>
                </Card.Header>
                <Card.Body>
                  <h5>Key Balance Considerations</h5>
                  <ul>
                    <li><strong>Resource Efficiency:</strong> Effects should be proportional to resource costs</li>
                    <li><strong>Level Appropriate:</strong> Power should match spell level</li>
                    <li><strong>Role Clarity:</strong> Excelling in one area often means compromise in others</li>
                    <li><strong>Cooldown Balance:</strong> More powerful effects need longer cooldowns</li>
                  </ul>
                  
                  <h5>Balancing Techniques</h5>
                  <ul>
                    <li><strong>Power Adjustment:</strong> Modify damage/healing amounts</li>
                    <li><strong>Cost Tuning:</strong> Adjust resource costs to match effect power</li>
                    <li><strong>Duration Control:</strong> Shorten powerful effects, extend weaker ones</li>
                    <li><strong>Limitations:</strong> Add conditions or requirements to powerful spells</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <div className="loading-balance text-center py-5">
          <p>Calculating spell balance...</p>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step11Balance;