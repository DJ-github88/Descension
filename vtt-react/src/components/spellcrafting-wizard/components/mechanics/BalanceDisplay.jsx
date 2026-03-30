import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Card, Button, ButtonGroup, Tab, Tabs, Table, Row, Col, Badge } from 'react-bootstrap';
import { FaDownload, FaChartPie, FaChartLine, FaChartBar } from 'react-icons/fa';

/**
 * Component for visualizing spell balance metrics
 */
const BalanceDisplay = ({ balanceData, selectedMetric, onMetricSelect }) => {
  const [activeChart, setActiveChart] = useState('radar');
  const [showMetricDetails, setShowMetricDetails] = useState(false);

  // Early return if balance data not available yet
  if (!balanceData) {
    return <div className="loading-balance">Calculating balance data...</div>;
  }

  // Generate radar chart data from the metrics
  const generateRadarData = () => {
    if (!balanceData.metrics) return [];

    return Object.entries(balanceData.metrics).map(([metricId, metric]) => ({
      subject: metricId,
      value: metric.ratio,
      fullMark: 2,
      baseline: 1,
      actualValue: metric.spellValue,
      baselineValue: metric.baselineValue,
    }));
  };

  // Generate bar chart data for comparison view
  const generateComparisonData = () => {
    // This would normally come from a comparison with similar spells
    // For now we'll just create some comparable values 
    return [
      { name: 'Your Spell', power: balanceData.powerRatio, efficiency: balanceData.resourceEfficiency?.primaryEfficiency || 1 },
      { name: 'Similar Spell 1', power: 0.9, efficiency: 0.95 },
      { name: 'Similar Spell 2', power: 1.1, efficiency: 1.05 },
      { name: 'Similar Spell 3', power: 0.8, efficiency: 1.2 },
      { name: 'Average', power: 1.0, efficiency: 1.0 },
    ];
  };

  // Generate line chart data for power curve
  const generatePowerCurveData = () => {
    // This would show how spell scales by level
    // For now we'll create a simulated curve
    const basePower = balanceData.powerRatio;
    const spellLevel = balanceData.spellLevel || 1;
    
    return [
      { level: Math.max(1, spellLevel - 2), power: basePower * 0.7, baseline: 0.8 },
      { level: Math.max(1, spellLevel - 1), power: basePower * 0.85, baseline: 0.9 },
      { level: spellLevel, power: basePower, baseline: 1.0 },
      { level: spellLevel + 1, power: basePower * 1.1, baseline: 1.1 },
      { level: spellLevel + 2, power: basePower * 1.2, baseline: 1.2 },
      { level: spellLevel + 3, power: basePower * 1.3, baseline: 1.3 },
    ];
  };

  // Generate resource efficiency data
  const generateEfficiencyData = () => {
    const efficiency = balanceData.resourceEfficiency;
    if (!efficiency) return [];
    
    // Create data for a resource-to-power curve
    return [
      { resourceCost: Math.max(1, efficiency.currentCost * 0.7), efficiency: 1.2 },
      { resourceCost: Math.max(1, efficiency.currentCost * 0.8), efficiency: 1.1 },
      { resourceCost: efficiency.currentCost, efficiency: efficiency.primaryEfficiency, current: true },
      { resourceCost: efficiency.currentCost * 1.2, efficiency: 0.9 },
      { resourceCost: efficiency.currentCost * 1.4, efficiency: 0.8 },
    ];
  };

  // Export balance data as JSON
  const exportBalanceData = () => {
    const dataStr = JSON.stringify(balanceData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${balanceData.spellName || 'spell'}_balance_report.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Helper to get color based on ratio
  const getColorForRatio = (ratio) => {
    if (ratio >= 1.5) return '#dc3545'; // danger - significantly overpowered
    if (ratio >= 1.2) return '#ffc107'; // warning - somewhat overpowered
    if (ratio <= 0.5) return '#dc3545'; // danger - significantly underpowered
    if (ratio <= 0.8) return '#ffc107'; // warning - somewhat underpowered
    return '#28a745'; // success - well balanced
  };

  // Render different charts based on active selection
  const renderChart = () => {
    switch (activeChart) {
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={generateRadarData()}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 2]} tickCount={5} />
              <Radar
                name="Spell Power"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="Baseline"
                dataKey="baseline"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.1}
              />
              <Tooltip formatter={(value, name) => [value.toFixed(2), name]} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
        
      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={generateComparisonData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 2]} />
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend />
              <ReferenceLine y={1} stroke="#666" strokeDasharray="3 3" />
              <Bar dataKey="power" name="Power Ratio" fill="#8884d8" />
              <Bar dataKey="efficiency" name="Resource Efficiency" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'powerCurve':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={generatePowerCurveData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis domain={[0, 2]} />
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend />
              <ReferenceLine y={1} stroke="#666" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="power" name="Spell Power" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="baseline" name="Expected Power" stroke="#82ca9d" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'efficiency':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={generateEfficiencyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="resourceCost" />
              <YAxis domain={[0, 2]} />
              <Tooltip formatter={(value, name, props) => [value.toFixed(2), name]} />
              <Legend />
              <ReferenceLine y={1} stroke="#666" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                name="Efficiency" 
                stroke="#8884d8"
                dot={(props) => {
                  if (props.payload.current) {
                    return (
                      <circle cx={props.cx} cy={props.cy} r={6} fill="#8884d8" stroke="none" />
                    );
                  }
                  return (
                    <circle cx={props.cx} cy={props.cy} r={4} fill="#8884d8" stroke="none" />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  // Render detailed metrics data table
  const renderMetricDetails = () => {
    if (!balanceData.metrics) return null;
    
    return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Baseline</th>
            <th>Ratio</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(balanceData.metrics).map(([metricId, metric]) => (
            <tr 
              key={metricId} 
              className={selectedMetric === metricId ? 'table-active' : ''}
              onClick={() => onMetricSelect(metricId)}
              style={{ cursor: 'pointer' }}
            >
              <td>{metricId}</td>
              <td>{metric.spellValue?.toFixed(2) || 'N/A'}</td>
              <td>{metric.baselineValue?.toFixed(2) || 'N/A'}</td>
              <td>{metric.ratio?.toFixed(2) || 'N/A'}</td>
              <td>
                <Badge 
                  bg={getColorForRatio(metric.ratio)}
                >
                  {metric.ratio >= 1.2 ? 'High' : (metric.ratio <= 0.8 ? 'Low' : 'Balanced')}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="balance-display">
      <div className="chart-controls d-flex justify-content-between mb-3">
        <ButtonGroup>
          <Button 
            variant={activeChart === 'radar' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveChart('radar')}
          >
            <FaChartPie className="me-1" /> Power Radar
          </Button>
          <Button 
            variant={activeChart === 'comparison' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveChart('comparison')}
          >
            <FaChartBar className="me-1" /> Comparison
          </Button>
          <Button 
            variant={activeChart === 'powerCurve' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveChart('powerCurve')}
          >
            <FaChartLine className="me-1" /> Power Curve
          </Button>
          <Button 
            variant={activeChart === 'efficiency' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveChart('efficiency')}
          >
            <FaChartLine className="me-1" /> Efficiency
          </Button>
        </ButtonGroup>
        
        <Button 
          variant="outline-secondary"
          onClick={exportBalanceData}
        >
          <FaDownload className="me-1" /> Export Data
        </Button>
      </div>
      
      <Card className="mb-3">
        <Card.Body>
          {renderChart()}
        </Card.Body>
      </Card>
      
      <Row className="mb-3">
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="m-0">Spell Power Summary</h5>
              <Badge 
                bg={getColorForRatio(balanceData.powerRatio)}
                pill
              >
                {balanceData.powerRatio?.toFixed(2) || '1.00'}
              </Badge>
            </Card.Header>
            <Card.Body>
              <p><strong>Type:</strong> {balanceData.spellType || 'Unknown'}</p>
              <p><strong>Level:</strong> {balanceData.spellLevel || 1}</p>
              <p><strong>Primary Effect:</strong> {balanceData.resourceEfficiency?.primaryType || 'Mixed'}</p>
              <p><strong>Overall Balance:</strong> {balanceData.balanceStatus}</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="m-0">Resource Efficiency</h5>
              <Badge 
                bg={getColorForRatio(balanceData.resourceEfficiency?.primaryEfficiency || 1)}
                pill
              >
                {balanceData.resourceEfficiency?.primaryEfficiency?.toFixed(2) || '1.00'}
              </Badge>
            </Card.Header>
            <Card.Body>
              <p><strong>Resource Type:</strong> {balanceData.resourceEfficiency?.resourceType || 'Mana'}</p>
              <p><strong>Resource Cost:</strong> {balanceData.resourceEfficiency?.resourceCost || 0}</p>
              <p><strong>Efficiency Rating:</strong> {(balanceData.resourceEfficiency?.overallEfficiency || 1).toFixed(2)}</p>
              <p><strong>Cast Time Efficiency:</strong> {(balanceData.resourceEfficiency?.castTimeEfficiency || 1).toFixed(2)}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="m-0">Detailed Metrics</h5>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => setShowMetricDetails(!showMetricDetails)}
          >
            {showMetricDetails ? 'Hide' : 'Show'}
          </Button>
        </Card.Header>
        {showMetricDetails && (
          <Card.Body>
            {renderMetricDetails()}
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default BalanceDisplay;