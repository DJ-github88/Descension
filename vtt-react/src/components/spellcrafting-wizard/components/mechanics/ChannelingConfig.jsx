// components/mechanics/ChannelingConfig.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  FormLabel, 
  Select, 
  NumberInput, 
  NumberInputField, 
  NumberInputStepper, 
  NumberIncrementStepper, 
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stack,
  Heading,
  Text,
  Divider,
  HStack,
  RadioGroup,
  Radio,
  Tooltip,
  Badge,
  Alert,
  AlertIcon,
  AlertDescription,
  useColorModeValue
} from '@chakra-ui/react';

import { InfoIcon } from '@chakra-ui/icons';
import { CHANNELING_MECHANICS } from '../../core/mechanics/channelingSystem';
import { visualizeChannelProgression, describeChannelingMechanics } from '../../core/mechanics/channelingSystem';

/**
 * ChannelingConfig Component
 * 
 * A component for configuring channeled spells, including duration, tick frequency,
 * effect scaling, concentration mechanics, and break effects.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.channelConfig - Current channel configuration
 * @param {Function} props.onChange - Callback for configuration changes
 * @param {number} props.spellLevel - The spell's level (affects max duration)
 * @param {Object} props.baseEffects - Base effect values to visualize scaling
 */
const ChannelingConfig = ({ 
  channelConfig = {}, 
  onChange, 
  spellLevel = 1,
  baseEffects = { damage: 10 }
}) => {
  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Initialize state with provided config or defaults
  const [config, setConfig] = useState({
    maxDuration: channelConfig.maxDuration || 3,
    tickFrequency: channelConfig.tickFrequency || 'end_of_turn',
    scalingType: channelConfig.scalingType || 'consistent',
    breakEffectType: channelConfig.breakEffectType || 'none',
    resourceRefundType: channelConfig.resourceRefundType || 'none',
    concentrationDC: channelConfig.concentrationDC || 10,
    ...channelConfig
  });

  // State for visualization
  const [visualization, setVisualization] = useState(null);

  // Get max possible duration based on spell level
  const maxPossibleDuration = CHANNELING_MECHANICS.ticks.MAX_CHANNEL_DURATION[spellLevel] || 
                            CHANNELING_MECHANICS.ticks.MAX_CHANNEL_DURATION[0];

  // Update visualization when config changes
  useEffect(() => {
    // Create visualization data for the current configuration
    const vizData = visualizeChannelProgression({
      ...config,
      baseEffects
    });
    setVisualization(vizData);
    
    // Notify parent of changes
    if (onChange) {
      onChange(config);
    }
  }, [config, baseEffects, onChange]);

  // Handle changes to configuration
  const handleChange = (field, value) => {
    setConfig(prev => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };

  // Generate channel mechanics description
  const mechanicsDescription = describeChannelingMechanics(config);

  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bgColor} 
      borderColor={borderColor}
    >
      <Heading size="md" mb={4}>Channel Configuration</Heading>
      
      {/* Duration Configuration */}
      <FormControl mb={4}>
        <FormLabel display="flex" alignItems="center">
          Channel Duration (Turns)
          <Tooltip label="Maximum number of turns the spell can be channeled">
            <InfoIcon ml={2} boxSize={4} color="blue.500" />
          </Tooltip>
        </FormLabel>
        <HStack>
          <NumberInput 
            value={config.maxDuration} 
            min={1} 
            max={maxPossibleDuration}
            onChange={(_, val) => handleChange('maxDuration', val)}
            width="100px"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          
          <Slider
            ml={2}
            flex="1"
            value={config.maxDuration}
            min={1}
            max={maxPossibleDuration}
            onChange={(val) => handleChange('maxDuration', val)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          
          <Badge ml={2} colorScheme="blue">
            Max: {maxPossibleDuration}
          </Badge>
        </HStack>
        <Text fontSize="sm" color="gray.500" mt={1}>
          Based on spell level {spellLevel}
        </Text>
      </FormControl>
      
      <Divider my={4} />
      
      {/* Tick Frequency */}
      <FormControl mb={4}>
        <FormLabel display="flex" alignItems="center">
          Tick Frequency
          <Tooltip label="When the channeled spell effect triggers">
            <InfoIcon ml={2} boxSize={4} color="blue.500" />
          </Tooltip>
        </FormLabel>
        <Select 
          value={config.tickFrequency} 
          onChange={(e) => handleChange('tickFrequency', e.target.value)}
        >
          {Object.entries(CHANNELING_MECHANICS.ticks.TICK_FREQUENCIES).map(([key, value]) => (
            <option key={value.id} value={value.id}>
              {value.name} - {value.description}
            </option>
          ))}
        </Select>
      </FormControl>
      
      {/* Effect Scaling */}
      <FormControl mb={4}>
        <FormLabel display="flex" alignItems="center">
          Effect Scaling
          <Tooltip label="How the effect strength changes over the channel duration">
            <InfoIcon ml={2} boxSize={4} color="blue.500" />
          </Tooltip>
        </FormLabel>
        <Select 
          value={config.scalingType} 
          onChange={(e) => handleChange('scalingType', e.target.value)}
        >
          {Object.entries(CHANNELING_MECHANICS.ticks.TICK_SCALING).map(([key, value]) => (
            <option key={value.id} value={value.id}>
              {value.name} - {value.description}
            </option>
          ))}
        </Select>
      </FormControl>
      
      {/* Concentration Check Difficulty */}
      <FormControl mb={4}>
        <FormLabel display="flex" alignItems="center">
          Base Concentration DC
          <Tooltip label="Difficulty check when taking damage while channeling">
            <InfoIcon ml={2} boxSize={4} color="blue.500" />
          </Tooltip>
        </FormLabel>
        <NumberInput 
          value={config.concentrationDC} 
          min={5} 
          max={25}
          onChange={(_, val) => handleChange('concentrationDC', val)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Text fontSize="sm" color="gray.500" mt={1}>
          Final DC may be higher based on damage taken
        </Text>
      </FormControl>
      
      <Divider my={4} />
      
      {/* Break Effect Configuration */}
      <FormControl mb={4}>
        <FormLabel display="flex" alignItems="center">
          Break Effect
          <Tooltip label="What happens when concentration is broken">
            <InfoIcon ml={2} boxSize={4} color="blue.500" />
          </Tooltip>
        </FormLabel>
        <RadioGroup 
          value={config.breakEffectType}
          onChange={(val) => handleChange('breakEffectType', val)}
        >
          <Stack>
            {Object.entries(CHANNELING_MECHANICS.breaks.BREAK_EFFECT_TYPES).map(([key, value]) => (
              <Radio key={value.id} value={value.id}>
                <Box>
                  <Text fontWeight="medium">{value.name}</Text>
                  <Text fontSize="sm" color="gray.500">{value.description}</Text>
                </Box>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>
      
      {/* Resource Refund Configuration */}
      <FormControl mb={4}>
        <FormLabel display="flex" alignItems="center">
          Resource Refund
          <Tooltip label="Resources refunded when channel breaks or ends early">
            <InfoIcon ml={2} boxSize={4} color="blue.500" />
          </Tooltip>
        </FormLabel>
        <RadioGroup 
          value={config.resourceRefundType}
          onChange={(val) => handleChange('resourceRefundType', val)}
        >
          <Stack>
            {Object.entries(CHANNELING_MECHANICS.breaks.RESOURCE_REFUND).map(([key, value]) => (
              <Radio key={value.id} value={value.id}>
                <Box>
                  <Text fontWeight="medium">{value.name}</Text>
                  <Text fontSize="sm" color="gray.500">{value.description}</Text>
                </Box>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>
      
      <Divider my={4} />
      
      {/* Channel Visualization */}
      {visualization && (
        <Box mb={4}>
          <Heading size="sm" mb={2}>Channel Effect Visualization</Heading>
          <Box 
            p={3} 
            borderWidth="1px" 
            borderRadius="md"
            borderColor={borderColor}
            bg={useColorModeValue('white', 'gray.800')}
          >
            <Text mb={2} fontWeight="medium">
              {visualization.visualProperties.scalingTypeName} Scaling
            </Text>
            
            {/* Simple visualization of channel ticks */}
            <Box position="relative" h="60px" mb={3}>
              {visualization.dataPoints.map((point, index) => {
                // Calculate color based on relative strength
                const colorIndex = Math.min(
                  Math.floor(
                    (point.relativeStrength / visualization.visualProperties.maxEffect) * 
                    (visualization.visualProperties.colorGradient.length - 1)
                  ),
                  visualization.visualProperties.colorGradient.length - 1
                );
                
                const color = visualization.visualProperties.colorGradient[colorIndex];
                
                return (
                  <Tooltip 
                    key={index}
                    label={`Tick ${point.tick}: ${(point.relativeStrength * 100).toFixed(0)}% strength`}
                  >
                    <Box
                      position="absolute"
                      left={`${(index / (config.maxDuration - 1)) * 100}%`}
                      bottom="0"
                      height={`${(point.relativeStrength / visualization.visualProperties.maxEffect) * 50}px`}
                      width="16px"
                      bg={color}
                      borderRadius="sm"
                      transform="translateX(-8px)"
                    />
                  </Tooltip>
                );
              })}
            </Box>
            
            <Text fontSize="sm">
              {visualization.visualProperties.trendDescription}
            </Text>
          </Box>
        </Box>
      )}
      
      {/* Mechanics Description */}
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <AlertDescription>{mechanicsDescription}</AlertDescription>
      </Alert>
    </Box>
  );
};

export default ChannelingConfig;