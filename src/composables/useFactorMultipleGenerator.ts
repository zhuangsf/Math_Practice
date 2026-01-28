// Composable for generating factor and multiple questions
// modify by jx: implement core logic for generating factor and multiple questions

import { ref } from 'vue';
import type { FactorMultipleQuestion, FactorMultipleConfig } from '@/types';
import { findFactors, findMultiples, gcd, lcm } from '@/utils/factorMultipleUtils';
import { randomInt } from '@/utils/numberUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;

/**
 * Generate a find multiples question
 * @param config Factor multiple configuration
 * @returns Factor multiple question or null if unable to generate
 */
function generateFindMultiplesQuestion(config: FactorMultipleConfig): FactorMultipleQuestion | null {
  // modify by jx: generate find multiples question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const num = randomInt(config.valueRange[0], config.valueRange[1]);
    const limit = num * (config.multipleCount || 10);
    const multiples = findMultiples(num, limit, config.multipleCount || 5);
    
    if (multiples.length > 0) {
      return {
        id: generateId(),
        expression: `${num}的前${config.multipleCount || 5}个倍数是？`,
        answer: multiples,
        questionType: 'find-multiples',
        numbers: [num]
      };
    }
  }
  return null;
}

/**
 * Generate a find factors question
 * @param config Factor multiple configuration
 * @returns Factor multiple question or null if unable to generate
 */
function generateFindFactorsQuestion(config: FactorMultipleConfig): FactorMultipleQuestion | null {
  // modify by jx: generate find factors question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const num = randomInt(config.valueRange[0], config.valueRange[1]);
    const factors = findFactors(num);
    
    if (factors.length > 2) { // At least 1 and itself
      return {
        id: generateId(),
        expression: `${num}的所有因数是？`,
        answer: factors,
        questionType: 'find-factors',
        numbers: [num]
      };
    }
  }
  return null;
}

/**
 * Generate a GCD question
 * @param config Factor multiple configuration
 * @returns Factor multiple question or null if unable to generate
 */
function generateGCDQuestion(config: FactorMultipleConfig): FactorMultipleQuestion | null {
  // modify by jx: generate GCD question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const num1 = randomInt(config.valueRange[0], config.valueRange[1]);
    const num2 = randomInt(config.valueRange[0], config.valueRange[1]);
    const answer = gcd(num1, num2);
    
    return {
      id: generateId(),
      expression: `${num1}和${num2}的最大公因数是？`,
      answer: answer,
      questionType: 'gcd',
      numbers: [num1, num2]
    };
  }
  return null;
}

/**
 * Generate a LCM question
 * @param config Factor multiple configuration
 * @returns Factor multiple question or null if unable to generate
 */
function generateLCMQuestion(config: FactorMultipleConfig): FactorMultipleQuestion | null {
  // modify by jx: generate LCM question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const num1 = randomInt(config.valueRange[0], config.valueRange[1]);
    const num2 = randomInt(config.valueRange[0], config.valueRange[1]);
    const answer = lcm(num1, num2);
    
    // Ensure answer is not too large
    if (answer <= config.valueRange[1] * 10) {
      return {
        id: generateId(),
        expression: `${num1}和${num2}的最小公倍数是？`,
        answer: answer,
        questionType: 'lcm',
        numbers: [num1, num2]
      };
    }
  }
  return null;
}

/**
 * Generate factor and multiple questions based on configuration
 * @param config Factor multiple configuration
 * @returns Array of factor multiple questions
 */
export function generateFactorMultipleQuestions(config: FactorMultipleConfig): FactorMultipleQuestion[] {
  // modify by jx: generate factor multiple questions based on configuration
  const questions: FactorMultipleQuestion[] = [];
  const questionTypes = config.questionTypes.length > 0 
    ? config.questionTypes 
    : ['find-multiples', 'find-factors', 'gcd', 'lcm'];
  
  for (let i = 0; i < config.questionCount; i++) {
    const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    let question: FactorMultipleQuestion | null = null;
    
    switch (selectedType) {
      case 'find-multiples':
        question = generateFindMultiplesQuestion(config);
        break;
      case 'find-factors':
        question = generateFindFactorsQuestion(config);
        break;
      case 'gcd':
        question = generateGCDQuestion(config);
        break;
      case 'lcm':
        question = generateLCMQuestion(config);
        break;
    }
    
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Composable function for factor multiple question generation
 * @returns Object with generation functions and state
 */
export function useFactorMultipleGenerator() {
  // modify by jx: create composable function for factor multiple question generation
  const isGenerating = ref(false);
  const questions = ref<FactorMultipleQuestion[]>([]);
  
  /**
   * Generate factor multiple questions
   * @param config Factor multiple configuration
   */
  const generate = (config: FactorMultipleConfig) => {
    isGenerating.value = true;
    try {
      questions.value = generateFactorMultipleQuestions(config);
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
