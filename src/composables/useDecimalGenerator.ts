// Composable for generating decimal operation questions
// modify by jx: implement core logic for generating decimal operation questions

import { ref } from 'vue';
import type { DecimalQuestion, DecimalConfig, OperationType } from '@/types';
import { 
  generateRandomDecimal,
  roundToDecimalPlaces
} from '@/utils/decimalUtils';
import { operationToSymbol } from '@/utils/mathUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;

/**
 * Build expression string from decimal numbers and operators
 * @param numbers Array of decimal numbers
 * @param operators Array of operators
 * @param decimalPlaces Number of decimal places for display
 * @returns Expression string
 */
function buildDecimalExpression(
  numbers: number[],
  operators: OperationType[],
  decimalPlaces: number
): string {
  // modify by jx: build decimal expression string with proper formatting
  const formatNumber = (num: number) => {
    return roundToDecimalPlaces(num, decimalPlaces).toFixed(decimalPlaces).replace(/\.?0+$/, '');
  };
  
  let expression = formatNumber(numbers[0]);
  
  for (let i = 0; i < operators.length; i++) {
    const symbol = operationToSymbol(operators[i]);
    expression += ` ${symbol} ${formatNumber(numbers[i + 1])}`;
  }
  
  return expression;
}

/**
 * Generate a binary decimal operation question (2 decimals, 1 operator)
 * @param operation Operation type
 * @param config Decimal configuration
 * @returns Decimal question or null if unable to generate
 */
function generateBinaryDecimalQuestion(
  operation: OperationType,
  config: DecimalConfig
): DecimalQuestion | null {
  // modify by jx: generate binary decimal operation question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let decimal1: number;
    let decimal2: number;
    
    // Generate random decimals
    decimal1 = generateRandomDecimal(config.minValue, config.maxValue, config.decimalPlaces);
    decimal2 = generateRandomDecimal(config.minValue, config.maxValue, config.decimalPlaces);
    
    // Validate division (divisor cannot be zero)
    if (operation === 'divide' && Math.abs(decimal2) < 0.001) {
      continue;
    }
    
    // Validate subtraction (result should be non-negative for elementary school)
    if (operation === 'subtract' && decimal1 < decimal2) {
      // Swap decimals if result would be negative
      [decimal1, decimal2] = [decimal2, decimal1];
    }
    
    try {
      let answer: number;
      switch (operation) {
        case 'add':
          answer = roundToDecimalPlaces(decimal1 + decimal2, config.answerPrecision);
          break;
        case 'subtract':
          answer = roundToDecimalPlaces(decimal1 - decimal2, config.answerPrecision);
          break;
        case 'multiply':
          answer = roundToDecimalPlaces(decimal1 * decimal2, config.answerPrecision);
          break;
        case 'divide':
          answer = roundToDecimalPlaces(decimal1 / decimal2, config.answerPrecision);
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
      
      const expression = buildDecimalExpression([decimal1, decimal2], [operation], config.decimalPlaces);
      
      return {
        id: generateId(),
        expression,
        answer,
        decimals: [decimal1, decimal2],
        operators: [operation],
        decimalPlaces: config.decimalPlaces,
        answerPrecision: config.answerPrecision
      };
    } catch (error) {
      // Retry on error
      continue;
    }
  }
  
  return null;
}


/**
 * Generate decimal questions based on configuration
 * @param config Decimal configuration
 * @returns Array of decimal questions
 */
export function generateDecimalQuestions(config: DecimalConfig): DecimalQuestion[] {
  // modify by jx: generate decimal questions based on configuration
  const questions: DecimalQuestion[] = [];
  const operations = config.operations.length > 0 ? config.operations : ['add', 'subtract', 'multiply', 'divide'];
  
  for (let i = 0; i < config.questionCount; i++) {
    // Randomly select operation
    const operation = operations[Math.floor(Math.random() * operations.length)] as OperationType;
    
    // For now, generate binary questions (can be extended to ternary later)
    const question = generateBinaryDecimalQuestion(operation, config);
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Composable function for decimal question generation
 * @returns Object with generation functions and state
 */
export function useDecimalGenerator() {
  // modify by jx: create composable function for decimal question generation
  const isGenerating = ref(false);
  const questions = ref<DecimalQuestion[]>([]);
  
  /**
   * Generate decimal questions
   * @param config Decimal configuration
   */
  const generate = (config: DecimalConfig) => {
    isGenerating.value = true;
    try {
      questions.value = generateDecimalQuestions(config);
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
