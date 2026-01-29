// Composable for generating comparison questions
// modify by jx: implement core logic for generating comparison questions

import { ref } from 'vue';
import type { ComparisonQuestion, ComparisonConfig } from '@/types';
import { 
  compareIntegers, 
  compareDecimals, 
  compareFractions,
  compareDecimalWithFraction,
  generateRandomIntegers,
  generateRandomDecimals,
  generateRandomFractions,
  generateRandomDecimalAndFraction
} from '@/utils/comparisonUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;

/**
 * Generate an integer comparison question
 * @param config Comparison configuration
 * @returns Comparison question or null if unable to generate
 */
function generateIntegerComparisonQuestion(config: ComparisonConfig): ComparisonQuestion | null {
  // modify by jx: generate integer comparison question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const [num1, num2] = generateRandomIntegers(config.valueRange[0], config.valueRange[1]);
    const comparisonResult = compareIntegers(num1, num2);
    
    // modify by jx: skip if numbers are equal (comparison result is 0)
    if (comparisonResult === 0) {
      continue;
    }
    
    return {
      id: generateId(),
      expression: `${num1} ? ${num2}`,
      answer: comparisonResult,
      questionType: 'integer',
      numbers: [num1, num2]
    };
  }
  // modify by jx: return null if unable to generate valid question after max retries
  console.warn('Failed to generate integer comparison question after max retries');
  return null;
}

/**
 * Generate a decimal comparison question
 * @param config Comparison configuration
 * @returns Comparison question or null if unable to generate
 */
function generateDecimalComparisonQuestion(config: ComparisonConfig): ComparisonQuestion | null {
  // modify by jx: generate decimal comparison question
  const decimalPlaces = config.decimalPlaces || 2;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const [num1, num2] = generateRandomDecimals(
      config.valueRange[0],
      config.valueRange[1],
      decimalPlaces
    );
    const comparisonResult = compareDecimals(num1, num2, decimalPlaces);
    
    // modify by jx: skip if numbers are equal (comparison result is 0)
    if (comparisonResult === 0) {
      continue;
    }
    
    return {
      id: generateId(),
      expression: `${num1.toFixed(decimalPlaces)} ? ${num2.toFixed(decimalPlaces)}`,
      answer: comparisonResult,
      questionType: 'decimal',
      numbers: [num1, num2],
      decimalPlaces
    };
  }
  // modify by jx: return null if unable to generate valid question after max retries
  console.warn('Failed to generate decimal comparison question after max retries');
  return null;
}

/**
 * Generate a fraction comparison question
 * @param config Comparison configuration
 * @returns Comparison question or null if unable to generate
 */
function generateFractionComparisonQuestion(config: ComparisonConfig): ComparisonQuestion | null {
  // modify by jx: generate fraction comparison question
  const maxDenominator = config.maxDenominator || 10;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const [[num1, den1], [num2, den2]] = generateRandomFractions(maxDenominator);
    
    // modify by jx: skip if fractions are equal
    if (num1 * den2 === num2 * den1) {
      continue;
    }
    
    const comparisonResult = compareFractions(num1, den1, num2, den2);
    
    return {
      id: generateId(),
      expression: `${num1}/${den1} ? ${num2}/${den2}`,
      answer: comparisonResult,
      questionType: 'fraction',
      numbers: [num1, den1, num2, den2]
    };
  }
  // modify by jx: return null if unable to generate valid question after max retries
  console.warn('Failed to generate fraction comparison question after max retries');
  return null;
}

/**
 * Generate a decimal-fraction mixed comparison question
 * @param config Comparison configuration
 * @returns Comparison question or null if unable to generate
 */
function generateDecimalFractionComparisonQuestion(config: ComparisonConfig): ComparisonQuestion | null {
  // modify by jx: generate decimal-fraction mixed comparison question
  const decimalPlaces = config.decimalPlaces || 2;
  const maxDenominator = config.maxDenominator || 10;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const { decimal, num, den } = generateRandomDecimalAndFraction(
      config.valueRange[0],
      config.valueRange[1],
      decimalPlaces,
      maxDenominator
    );
    
    // Randomly decide whether decimal comes first or fraction comes first
    const decimalFirst = Math.random() > 0.5;
    
    let comparisonResult: number;
    let expression: string;
    
    if (decimalFirst) {
      comparisonResult = compareDecimalWithFraction(decimal, num, den);
      expression = `${decimal.toFixed(decimalPlaces)} ? ${num}/${den}`;
    } else {
      comparisonResult = compareDecimalWithFraction(decimal, num, den);
      expression = `${num}/${den} ? ${decimal.toFixed(decimalPlaces)}`;
    }
    
    // modify by jx: skip if values are equal (result is 0)
    if (comparisonResult === 0) {
      continue;
    }
    
    // If fraction comes first, invert the comparison result
    if (!decimalFirst) {
      comparisonResult = -comparisonResult;
    }
    
    return {
      id: generateId(),
      expression,
      answer: comparisonResult,
      questionType: 'decimal-fraction',
      numbers: [decimal, num, den],
      decimalPlaces,
      fractionData: {
        num1: num,
        den1: den
      }
    };
  }
  // modify by jx: return null if unable to generate valid question after max retries
  console.warn('Failed to generate decimal-fraction comparison question after max retries');
  return null;
}

/**
 * Generate comparison questions based on configuration
 * @param config Comparison configuration
 * @returns Array of comparison questions
 */
export function generateComparisonQuestions(config: ComparisonConfig): ComparisonQuestion[] {
  // modify by jx: generate comparison questions based on configuration
  const questions: ComparisonQuestion[] = [];
  const questionTypes = config.questionTypes.length > 0 
    ? config.questionTypes 
    : ['integer', 'decimal', 'fraction', 'decimal-fraction'];
  
  // If questionTypes is empty after fallback, use integer as default
  const typesToUse = questionTypes.length > 0 ? questionTypes : ['integer'];
  
  for (let i = 0; i < config.questionCount; i++) {
    const selectedType = typesToUse[Math.floor(Math.random() * typesToUse.length)];
    let question: ComparisonQuestion | null = null;
    
    switch (selectedType) {
      case 'integer':
        question = generateIntegerComparisonQuestion(config);
        break;
      case 'decimal':
        question = generateDecimalComparisonQuestion(config);
        break;
      case 'fraction':
        question = generateFractionComparisonQuestion(config);
        break;
      case 'decimal-fraction':
        question = generateDecimalFractionComparisonQuestion(config);
        break;
    }
    
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Composable function for comparison question generation
 * @returns Object with generation functions and state
 */
export function useComparisonGenerator() {
  // modify by jx: create composable function for comparison question generation
  const isGenerating = ref(false);
  const questions = ref<ComparisonQuestion[]>([]);
  
  /**
   * Generate comparison questions
   * @param config Comparison configuration
   */
  const generate = (config: ComparisonConfig) => {
    isGenerating.value = true;
    try {
      questions.value = generateComparisonQuestions(config);
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
