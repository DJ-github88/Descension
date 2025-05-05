// components/mechanics/CastTimeConfig.jsx
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
  Checkbox,
  Switch,
  RadioGroup,
  Radio,
  Tooltip,
  Badge,
  Alert,
  AlertIcon,
  AlertDescription,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';

import { InfoIcon } from '@chakra-ui/icons';
import { CAST_TIME_MECHANICS, describeCastTimeMechanics } from '../../core/mechanics/castTimeSystem';

/**
 * CastTimeConfig Component
 * 
 * A component for configuring cast time spells, including cast duration,
 * interruption mechanics, partial effects, and completion behavior.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.castConfig - Current cast time configuration
 * @param {Function} props.onChange - Callback for configuration changes
 * @param {number} props.spellLevel - The spell's level
 */
const CastTimeConfig = ({
  castConfig = {},
  onChange,
  spellLevel = 1
}) => {
  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Initialize state with provided config or defaults
  const [config, setConfig] = useState({
    castTime: castConfig.castTime || 1,
    castTimeType: castConfig.castTimeType || 'NEXT_TURN',
    interruptible: castConfig.interruptible !== false, // Default to true if not specified
    allowPartialEffects: castConfig.allowPartialEffects || false,
    scalingWithCastTime: castConfig.scalingWithCastTime || null,
    partialEffectOnInterrupt: castConfig.partialEffectOnInterrupt || null,
    continueCastingOnTurnEnd: castConfig.continueCastingOnTurnEnd || false,
    castingVisibility: castConfig.castingVisibility !== false, // Default to true if not specified
    ...castConfig
  });

  // State for visualization of completion thresholds
  const [completionStages, setCompletionStages] = useState([]);
  
  // Update thresholds when config changes
  useEffect(() => {
    // Create simplified thresholds for visualization
    const thresholds = [
      { label: 'None', value: CAST_TIME_MECHANICS.COMPLETION_THRESHOLDS.NONE, color: 'gray.300' },
      { label: 'Minor', value: CAST_TIME_MECHANICS.COMPLETION_THRESHOLDS.MINOR, color: 'yellow.400' },
      { label: 'Moderate', value: CAST_TIME_MECHANICS.COMPLETION_THRESHOLDS.MODERATE, color: 'orange.400' },
      { label: 'Major', value: CAST_TIME_MECHANICS.COMPLETION_THRESHOLDS.MAJOR, color: 'red.400' },
      { label: 'Complete', value: CAST_TIME_MECHANICS.COMPLETION_THRESHOLDS.COMPLETE, color: 'green.500' }
    ];
    
    setCompletionStages(thresholds);
    
    // Notify parent of changes
    if (onChange) {
      onChange(config);
    }
  }, [config, onChange]);

  // Handle changes to configuration
  const handleChange = (field, value) => {
    setConfig(prev => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };
  
  // Handle changes to effect scaling
  const handleScalingChange = (isEnabled) => {
    if (isEnabled && !config.scalingWithCastTime) {
      // Initialize with default scaling values
      handleChange('scalingWithCastTime', { damage: 1.5, healing: 1.5, duration: 1.2 });
    } else if (!isEnabled) {
      handleChange('scalingWithCastTime', null);
    }
  };
  
  // Handle changes to partial effect configuration
  const handlePartialEffectChange = (isEnabled) => {
    if (isEnabled && !config.partialEffectOnInterrupt) {
      // Initialize with default partial effect values
      handleChange('partialEffectOnInterrupt', { damage: 0.5, healing: 0.5, duration: 0.5 });
    } else if (!isEnabled) {
      handleChange('partialEffectOnInterrupt', null);
    }
  };
  
  // Handle changes to specific scaling values
  const handleScalingValueChange = (effectType, value) => {
    setConfig(prev => {
      const updated = { 
        ...prev, 
        scalingWithCastTime: { 
          ...prev.scalingWithCastTime, 
          [effectType]: value 
        } 
      };
      return updated;
    });
  };
  
  // Handle changes to specific partial effect values
  const handlePartialEffectValueChange = (effectType, value) => {
    setConfig(prev => {
      const updated = { 
        ...prev, 
        partialEffectOnInterrupt: { 
          ...prev.partialEffectOnInterrupt, 
          [effectType]: value 
        } 
      };
      return updated;
    });
  };

  // Generate cast time mechanics description
  const mechanicsDescription = describeCastTimeMechanics(config);

  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bgColor} 
      borderColor={borderColor}
    >
      <Heading size="md" mb={4}>Cast Time Configuration</Heading>
      
      {/* Cast Time Type */}
      <FormControl mb={4}>
        <FormLabel display="flex" alignItems="center">
          Cast Time Type
          <Tooltip label="How the spell casting time is measured">
            <InfoIcon ml={2} boxSize={4} color="blue.500" />
          </Tooltip>
        </FormLabel>
        <Select 
          value={config.castTimeType} 
          onChange={(e) => handleChange('castTimeType', e.target.value)}
        >
          {Object.entries(CAST_TIME_MECHANICS.CAST_TIME_TYPES).map(([key, value]) => (
            <option key={value.id} value={value.id}>
              {value.name} - {value.description}
            </option>
          ))}
        </Select>
      </FormControl>
      
      {/* Cast Time Duration */}
      {config.castTimeType === 'X_TURNS' && (
        <FormControl mb={4}>
          <FormLabel display="flex" alignItems="center">
            Cast Time (Turns)
            <Tooltip label="Number of turns required to cast the spell">
              <InfoIcon ml={2} boxSize={4} color="blue.500" />
            </Tooltip>
          </FormLabel>
          <HStack>
            <NumberInput 
              value={config.castTime} 
              min={1} 
              max={10}
              onChange={(_, val) => handleChange('castTime', val)}
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
              value={config.castTime}
              min={1}
              max={10}
              onChange={(val) => handleChange('castTime', val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </HStack>
          
          <Badge 
            mt={2} 
            colorScheme={config.castTime > 3 ? "orange" : "blue"}
          >
            {config.castTime > 3 ? "Long Cast" : "Normal Cast"}
          </Badge>
        </FormControl>
      )}
      
      <Divider my={4} />
      
      {/* Interruption Configuration */}
      <FormControl mb={4} display="flex" alignItems="center">
        <FormLabel mb="0">
          Can be interrupted
        </FormLabel>
        <Tooltip label="If disabled, the spell cannot be interrupted by any means">
          <Switch 
            isChecked={config.interruptible} 
            onChange={(e) => handleChange('interruptible', e.target.checked)}
            colorScheme="blue"
          />
        </Tooltip>
      </FormControl>
      
      {config.interruptible && (
        <Box ml={6} mb={4}>
          <FormControl mb={3}>
            <FormLabel fontSize="sm">Interruption Vulnerability</FormLabel>
            <RadioGroup 
              value={config.interruptVulnerability || 'standard'}
              onChange={(val) => handleChange('interruptVulnerability', val)}
            >
              <Stack>
                <Radio value="low">
                  <Text fontWeight="medium">Low</Text>
                  <Text fontSize="xs" color="gray.500">+5 to concentration checks</Text>
                </Radio>
                <Radio value="standard">
                  <Text fontWeight="medium">Standard</Text>
                  <Text fontSize="xs" color="gray.500">Normal interruption chance</Text>
                </Radio>
                <Radio value="high">
                  <Text fontWeight="medium">High</Text>
                  <Text fontSize="xs" color="gray.500">-5 to concentration checks</Text>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          
          <FormControl mb={3}>
            <FormLabel fontSize="sm" display="flex" alignItems="center">
              Interrupted by Movement
              <Tooltip label="If enabled, any movement breaks casting">
                <InfoIcon ml={1} boxSize={3} color="blue.500" />
              </Tooltip>
            </FormLabel>
            <Switch 
              isChecked={config.interruptedByMovement} 
              onChange={(e) => handleChange('interruptedByMovement', e.target.checked)}
              size="sm"
              colorScheme="blue"
            />
          </FormControl>
        </Box>
      )}
      
      <Divider my={4} />
      
      {/* Partial Effects */}
      <FormControl mb={4} display="flex" alignItems="center">
        <FormLabel mb="0">
          Allow Partial Effects
        </FormLabel>
        <Tooltip label="If enabled, spell produces reduced effects when interrupted">
          <Switch 
            isChecked={config.allowPartialEffects} 
            onChange={(e) => {
              handleChange('allowPartialEffects', e.target.checked);
              handlePartialEffectChange(e.target.checked);
            }}
            colorScheme="blue"
          />
        </Tooltip>
      </FormControl>
      
      {config.allowPartialEffects && config.partialEffectOnInterrupt && (
        <Box ml={6} mb={4}>
          <Text fontSize="sm" mb={2}>Partial Effect Scaling (% of full effect)</Text>
          
          {Object.entries(config.partialEffectOnInterrupt).map(([effectType, value]) => (
            <FormControl key={effectType} mb={2}>
              <FormLabel fontSize="sm" textTransform="capitalize">{effectType}</FormLabel>
              <HStack>
                <NumberInput 
                  value={Math.round(value * 100)} 
                  min={0} 
                  max={90}
                  onChange={(_, val) => handlePartialEffectValueChange(effectType, val / 100)}
                  width="80px"
                  size="sm"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                
                <Slider
                  flex="1"
                  value={value * 100}
                  min={0}
                  max={90}
                  onChange={(val) => handlePartialEffectValueChange(effectType, val / 100)}
                  size="sm"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                
                <Text fontSize="sm" width="40px">{Math.round(value * 100)}%</Text>
              </HStack>
            </FormControl>
          ))}
          
          <Box my={3}>
            <Heading size="xs" mb={2}>Completion Thresholds</Heading>
            <Box position="relative" pt={4} pb={2}>
              <Progress value={100} size="sm" borderRadius="md" colorScheme="gray" />
              
              {completionStages.map((stage, index) => (
                <Tooltip key={index} label={`${stage.label}: ${stage.value}%`}>
                  <Box
                    position="absolute"
                    left={`${stage.value}%`}
                    top="0"
                    bottom="0"
                    borderLeftWidth={index > 0 ? "2px" : "0"}
                    borderLeftColor={stage.color}
                  >
                    {index > 0 && (
                      <Text 
                        fontSize="10px" 
                        position="absolute" 
                        top="-16px" 
                        transform="translateX(-50%)"
                        fontWeight="bold"
                      >
                        {stage.value}%
                      </Text>
                    )}
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>
      )}
      
      <Divider my={4} />
      
      {/* Cast Time Scaling */}
      <FormControl mb={4} display="flex" alignItems="center">
        <FormLabel mb="0">
          Scale Effect With Cast Time
        </FormLabel>
        <Tooltip label="If enabled, spell becomes more powerful when fully cast">
          <Switch 
            isChecked={!!config.scalingWithCastTime} 
            onChange={(e) => handleScalingChange(e.target.checked)}
            colorScheme="blue"
          />
        </Tooltip>
      </FormControl>
      
      {config.scalingWithCastTime && (
        <Box ml={6} mb={4}>
          <Text fontSize="sm" mb={2}>Full Cast Effect Multipliers</Text>
          
          {Object.entries(config.scalingWithCastTime).map(([effectType, value]) => (
            <FormControl key={effectType} mb={2}>
              <FormLabel fontSize="sm" textTransform="capitalize">{effectType}</FormLabel>
              <HStack>
                <NumberInput 
                  value={value} 
                  min={1} 
                  max={3}
                  step={0.1}
                  precision={1}
                  onChange={(_, val) => handleScalingValueChange(effectType, val)}
                  width="80px"
                  size="sm"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                
                <Slider
                  flex="1"
                  value={value}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(val) => handleScalingValueChange(effectType, val)}
                  size="sm"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                
                <Text fontSize="sm" width="40px">{value}x</Text>
              </HStack>
            </FormControl>
          ))}
          
          <Text fontSize="xs" color="gray.500" mt={2}>
            These are the multipliers applied to the effect when the spell is fully cast.
          </Text>
        </Box>
      )}
      
      <Divider my={4} />
      
      {/* Additional Options */}
      <Heading size="sm" mb={3}>Additional Options</Heading>
      
      <Stack spacing={3}>
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0" fontSize="sm">
            Casting is Visible to Others
          </FormLabel>
          <Tooltip label="If disabled, enemies cannot see you casting until the spell completes">
            <Switch 
              isChecked={config.castingVisibility} 
              onChange={(e) => handleChange('castingVisibility', e.target.checked)}
              size="sm"
              colorScheme="blue"
            />
          </Tooltip>
        </FormControl>
        
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0" fontSize="sm">
            Continue Casting When Turn Ends
          </FormLabel>
          <Tooltip label="If enabled, casting continues automatically when your turn ends">
            <Switch 
              isChecked={config.continueCastingOnTurnEnd} 
              onChange={(e) => handleChange('continueCastingOnTurnEnd', e.target.checked)}
              size="sm"
              colorScheme="blue"
            />
          </Tooltip>
        </FormControl>
      </Stack>
      
      <Divider my={4} />
      
      {/* Mechanics Description */}
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <AlertDescription>{mechanicsDescription}</AlertDescription>
      </Alert>
    </Box>
  );
};

export default CastTimeConfig;          