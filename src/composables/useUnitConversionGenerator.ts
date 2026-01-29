// Composable for generating unit conversion questions
// modify by jx: implement core logic for generating unit conversion questions

import { ref } from 'vue';
import type { UnitConversionQuestion, UnitConversionConfig } from '@/types';
import { convertUnit, getAvailableUnits, getUnitDisplayName, getUnitFactor } from '@/utils/unitConversionUtils';
import { randomInt } from '@/utils/numberUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;

/**
 * Generate a unit conversion question
 * @param unitType Unit type
 * @param config Unit conversion configuration
 * @returns Unit conversion question or null if unable to generate
 */
function generateUnitConversionQuestion(
  unitType: 'length' | 'weight' | 'area' | 'volume' | 'time',
  config: UnitConversionConfig
): UnitConversionQuestion | null {
  // modify by jx: generate unit conversion question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const availableUnits = getAvailableUnits(unitType);
    if (availableUnits.length < 2) {
      return null;
    }
    
    // Select two different units
    const fromUnitIndex = randomInt(0, availableUnits.length - 1);
    let toUnitIndex = randomInt(0, availableUnits.length - 1);
    while (toUnitIndex === fromUnitIndex) {
      toUnitIndex = randomInt(0, availableUnits.length - 1);
    }
    
    const fromUnit = availableUnits[fromUnitIndex];
    const toUnit = availableUnits[toUnitIndex];
    
    // Determine conversion direction based on config
    let actualFromUnit = fromUnit;
    let actualToUnit = toUnit;
    
    if (config.conversionDirection === 'large-to-small') {
      // Convert from larger unit to smaller unit
      const fromFactor = getUnitFactor(unitType, fromUnit);
      const toFactor = getUnitFactor(unitType, toUnit);
      if (fromFactor < toFactor) {
        [actualFromUnit, actualToUnit] = [actualToUnit, actualFromUnit];
      }
    } else if (config.conversionDirection === 'small-to-large') {
      // Convert from smaller unit to larger unit
      const fromFactor = getUnitFactor(unitType, fromUnit);
      const toFactor = getUnitFactor(unitType, toUnit);
      if (fromFactor > toFactor) {
        [actualFromUnit, actualToUnit] = [actualToUnit, actualFromUnit];
      }
    }
    // For 'mixed', use random direction
    
    // Generate value
    const value = randomInt(config.valueRange[0], config.valueRange[1]);
    
    // Calculate answer
    const answer = convertUnit(value, unitType, actualFromUnit, actualToUnit);
    
    // Format expression
    const fromDisplay = getUnitDisplayName(actualFromUnit);
    const toDisplay = getUnitDisplayName(actualToUnit);
    const expression = `${value}${fromDisplay} = ?${toDisplay}`;
    
    return {
      id: generateId(),
      expression,
      answer,
      fromUnit: actualFromUnit,
      toUnit: actualToUnit,
      value,
      unitType
    };
  }
  
  return null;
}

// modify by jx: remove duplicate getUnitFactor function, use the one from unitConversionUtils instead

/**
 * Generate unit conversion questions based on configuration
 * @param config Unit conversion configuration
 * @returns Array of unit conversion questions
 */
export function generateUnitConversionQuestions(config: UnitConversionConfig): UnitConversionQuestion[] {
  // modify by jx: generate unit conversion questions based on configuration
  const questions: UnitConversionQuestion[] = [];
  const unitTypes = config.unitTypes.length > 0 
    ? config.unitTypes 
    : ['length', 'weight', 'area', 'volume', 'time'];
  
  for (let i = 0; i < config.questionCount; i++) {
    const selectedType = unitTypes[Math.floor(Math.random() * unitTypes.length)] as 'length' | 'weight' | 'area' | 'volume' | 'time';
    const question = generateUnitConversionQuestion(selectedType, config);
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Composable function for unit conversion question generation
 * @returns Object with generation functions and state
 */
export function useUnitConversionGenerator() {
  // modify by jx: create composable function for unit conversion question generation
  const isGenerating = ref(false);
  const questions = ref<UnitConversionQuestion[]>([]);
  
  /**
   * Generate unit conversion questions
   * @param config Unit conversion configuration
   */
  const generate = (config: UnitConversionConfig) => {
    isGenerating.value = true;
    try {
      questions.value = generateUnitConversionQuestions(config);
    } finally {
      isGenerating.value = false;
    }
  };
  
  /**
   * Clear generated questions
   */
  const clear = () => {
    questions.value = [];
  };
  
  return {
    isGenerating,
    questions,
    generate,
    clear
  };
}
