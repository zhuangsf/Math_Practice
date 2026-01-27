// Composable for generating fraction operation questions
// modify by jx: implement core logic for generating fraction operation questions

import { ref } from 'vue';
import type { FractionQuestion, FractionConfig, Fraction, OperationType } from '@/types';
import { randomInt } from '@/utils/numberUtils';
import { 
  generateRandomFraction, 
  calculateFractionOperation,
  simplifyFraction,
  fractionToString,
  fractionsEqual
} from '@/utils/fractionUtils';
import { operationToSymbol } from '@/utils/mathUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;


/**
 * Generate a binary fraction operation question (2 fractions, 1 operator)
 * @param operation Operation type
 * @param config Fraction configuration
 * @returns Fraction question or null if unable to generate
 */
function generateBinaryFractionQuestion(
  operation: OperationType,
  config: FractionConfig
): FractionQuestion | null {
  // modify by jx: generate binary fraction operation question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let fraction1: Fraction;
    let fraction2: Fraction;
    
    // Determine question type
    const questionType = config.questionTypes.length > 0
      ? config.questionTypes[Math.floor(Math.random() * config.questionTypes.length)]
      : 'different-denominator';
    
    if (questionType === 'same-denominator') {
      // Generate fractions with same denominator
      // modify by jx: keep original denominator without simplification to ensure same denominator
      const denominator = randomInt(config.denominatorRange[0], config.denominatorRange[1]);
      const numerator1 = randomInt(config.numeratorRange[0], Math.min(config.numeratorRange[1], denominator - 1));
      const numerator2 = randomInt(config.numeratorRange[0], Math.min(config.numeratorRange[1], denominator - 1));
      
      // Don't simplify to keep same denominator
      fraction1 = { numerator: numerator1, denominator };
      fraction2 = { numerator: numerator2, denominator };
    } else {
      // Generate fractions with different denominators
      fraction1 = generateRandomFraction(config.numeratorRange, config.denominatorRange);
      fraction2 = generateRandomFraction(config.numeratorRange, config.denominatorRange);
      
      // Ensure denominators are different
      if (fraction1.denominator === fraction2.denominator) {
        const newDenominator = randomInt(config.denominatorRange[0], config.denominatorRange[1]);
        if (newDenominator !== fraction1.denominator) {
          fraction2 = simplifyFraction({ numerator: fraction2.numerator, denominator: newDenominator });
        }
      }
    }
    
    // Validate division (divisor cannot be zero)
    if (operation === 'divide' && fraction2.numerator === 0) {
      continue;
    }
    
    // Validate subtraction (result should be non-negative for elementary school)
    if (operation === 'subtract') {
      const result = calculateFractionOperation(fraction1, fraction2, operation);
      if (result.numerator < 0) {
        // Swap fractions if result would be negative
        [fraction1, fraction2] = [fraction2, fraction1];
      }
    }
    
    try {
      const answer = calculateFractionOperation(fraction1, fraction2, operation);
      
      // modify by jx: validate that answer is different from both operands to avoid trivial questions
      if (fractionsEqual(answer, fraction1) || fractionsEqual(answer, fraction2)) {
        continue;
      }
      
      const expression = `${fractionToString(fraction1)} ${operationToSymbol(operation)} ${fractionToString(fraction2)}`;
      
      return {
        id: generateId(),
        expression,
        answer,
        fractions: [fraction1, fraction2],
        operators: [operation],
        questionType: questionType === 'same-denominator' ? 'same-denominator' : 'different-denominator'
      };
    } catch (error) {
      // Retry on error
      continue;
    }
  }
  
  return null;
}

/**
 * Generate a fraction simplification question
 * @param config Fraction configuration
 * @returns Fraction question or null if unable to generate
 */
function generateSimplifyQuestion(config: FractionConfig): FractionQuestion | null {
  // modify by jx: generate fraction simplification question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // Generate a fraction that can be simplified (not already in simplest form)
    // modify by jx: generate a fraction that is guaranteed to be simplifiable by multiplying a simple fraction by a factor
    const denominator = randomInt(config.denominatorRange[0], config.denominatorRange[1]);
    
    // Try different factors to find one that produces a valid fraction
    const factors = [2, 3, 4, 5];
    let validFraction: { numerator: number; denominator: number } | null = null;
    let simpleFraction: { numerator: number; denominator: number } | null = null;
    
    for (const factor of factors) {
      // Calculate max simple numerator: multiplied numerator should be <= numeratorRange[1]
      const maxSimpleNumerator = Math.min(
        Math.floor(config.numeratorRange[1] / factor),
        denominator - 1
      );
      
      if (maxSimpleNumerator < config.numeratorRange[0]) {
        continue; // This factor won't work
      }
      
      const numerator = randomInt(
        config.numeratorRange[0], 
        maxSimpleNumerator
      );
      
      // Start with a simple fraction (already simplified)
      const simple = simplifyFraction({ numerator, denominator });
      
      // Multiply by factor to create a fraction that can be simplified
      const fraction = {
        numerator: simple.numerator * factor,
        denominator: simple.denominator * factor
      };
      
      // Check if the fraction is within the allowed range
      if (fraction.numerator <= config.numeratorRange[1] && 
          fraction.denominator <= config.denominatorRange[1]) {
        validFraction = fraction;
        simpleFraction = simple;
        break;
      }
    }
    
    if (!validFraction || !simpleFraction) {
      continue; // Could not generate valid fraction
    }
    
    const simplified = simplifyFraction(validFraction);
    
    // modify by jx: ensure the fraction can be simplified (answer must be different from original)
    // Since we multiplied a simple fraction by a factor, the simplified form should be different
    // Check that numerator or denominator changed after simplification
    if (validFraction.numerator !== simplified.numerator || 
        validFraction.denominator !== simplified.denominator) {
      // modify by jx: for simplification questions, display the original unsimplified fraction
      // Do not use fractionToString which auto-simplifies, use raw numerator/denominator instead
      // Do not include "= ?" in expression as the display component will add it automatically
      const expression = `${validFraction.numerator}/${validFraction.denominator}`;
      
      return {
        id: generateId(),
        expression,
        answer: simplified,
        fractions: [validFraction],
        operators: [],
        questionType: 'simplify'
      };
    }
  }
  
  return null;
}

/**
 * Generate fraction questions based on configuration
 * @param config Fraction configuration
 * @returns Array of fraction questions
 */
export function generateFractionQuestions(config: FractionConfig): FractionQuestion[] {
  // modify by jx: generate fraction questions based on configuration
  const questions: FractionQuestion[] = [];
  const operations = config.operations.length > 0 ? config.operations : ['add', 'subtract', 'multiply', 'divide'];
  
  for (let i = 0; i < config.questionCount; i++) {
    // Randomly select question type
    const questionTypes = config.questionTypes.length > 0 
      ? config.questionTypes 
      : ['same-denominator', 'different-denominator'];
    
    const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (selectedType === 'simplify') {
      const question = generateSimplifyQuestion(config);
      if (question) {
        questions.push(question);
      }
    } else {
      // Select random operation
      const operation = operations[Math.floor(Math.random() * operations.length)] as OperationType;
      const question = generateBinaryFractionQuestion(operation, config);
      if (question) {
        questions.push(question);
      }
    }
  }
  
  return questions;
}

/**
 * Composable function for fraction question generation
 * @returns Object with generation functions and state
 */
export function useFractionGenerator() {
  // modify by jx: create composable function for fraction question generation
  const isGenerating = ref(false);
  const questions = ref<FractionQuestion[]>([]);
  
  /**
   * Generate fraction questions
   * @param config Fraction configuration
   */
  const generate = (config: FractionConfig) => {
    isGenerating.value = true;
    try {
      questions.value = generateFractionQuestions(config);
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
