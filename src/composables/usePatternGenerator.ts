// Composable for generating pattern questions
// modify by jx: implement core logic for generating pattern questions

import { ref } from 'vue';
import type { PatternQuestion, PatternConfig } from '@/types';
import {
  generateArithmeticSequence,
  generateGeometricSequence,
  generateFibonacciSequence,
  generateSquareSequence,
  generateCubeSequence
} from '@/utils/patternUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;

/**
 * Generate an arithmetic sequence question
 * @param config Pattern configuration
 * @returns Pattern question or null if unable to generate
 */
function generateArithmeticPatternQuestion(config: PatternConfig): PatternQuestion | null {
  // modify by jx: generate arithmetic sequence question with consistent answer calculation
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const { start, diff } = {
      start: Math.floor(Math.random() * 10) + 1,
      diff: Math.floor(Math.random() * 5) + 1
    };
    // Generate full sequence with termsCount+1 elements
    const fullSequence = generateArithmeticSequence(start, diff, config.termsCount + 1);
    
    // Select missing index from first termsCount positions
    const missingIndex = Math.floor(Math.random() * config.termsCount);
    
    // Get the visible sequence (first termsCount elements)
    const visibleSequence = [...fullSequence.slice(0, config.termsCount)];
    
    // The answer is always the next term (fullSequence[termsCount]), not any position in the sequence
    // modify by jx: always return the next term as the answer
    const correctAnswer = fullSequence[config.termsCount];
    
    return {
      id: generateId(),
      expression: `找规律：${visibleSequence.join(', ')}, ?`,
      answer: correctAnswer,
      questionType: 'arithmetic',
      numbers: fullSequence,
      missingIndex
    };
  }
  return null;
}

/**
 * Generate a geometric sequence question
 * @param config Pattern configuration
 * @returns Pattern question or null if unable to generate
 */
function generateGeometricPatternQuestion(config: PatternConfig): PatternQuestion | null {
  // modify by jx: generate geometric sequence question with consistent answer calculation
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const { start, ratio } = {
      start: Math.floor(Math.random() * 3) + 1,
      ratio: Math.floor(Math.random() * 2) + 2 // 2 or 3
    };
    const fullSequence = generateGeometricSequence(start, ratio, config.termsCount + 1);
    // Ensure the sequence doesn't exceed reasonable bounds
    if (fullSequence.some(num => num > 10000)) continue;
    
    const missingIndex = Math.floor(Math.random() * config.termsCount);
    const visibleSequence = [...fullSequence.slice(0, config.termsCount)];
    
    // The answer is always the next term (fullSequence[termsCount])
    // modify by jx: always return the next term as the answer
    const correctAnswer = Math.round(fullSequence[config.termsCount]);
    
    return {
      id: generateId(),
      expression: `找规律：${visibleSequence.join(', ')}, ?`,
      answer: correctAnswer,
      questionType: 'geometric',
      numbers: fullSequence,
      missingIndex
    };
  }
  return null;
}

/**
 * Generate a Fibonacci sequence question
 * @param config Pattern configuration
 * @returns Pattern question or null if unable to generate
 */
function generateFibonacciPatternQuestion(config: PatternConfig): PatternQuestion | null {
  // modify by jx: generate Fibonacci sequence question with consistent answer calculation
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const startValues: [number, number] = [
      Math.floor(Math.random() * 3) + 1,
      Math.floor(Math.random() * 3) + 1
    ];
    const fullSequence = generateFibonacciSequence(config.termsCount + 1, startValues);
    // Ensure the sequence doesn't exceed reasonable bounds
    if (fullSequence.some(num => num > 1000)) continue;
    
    const missingIndex = Math.floor(Math.random() * config.termsCount);
    const visibleSequence = [...fullSequence.slice(0, config.termsCount)];
    
    // The answer is always the next term (fullSequence[termsCount])
    // modify by jx: always return the next term as the answer
    const correctAnswer = fullSequence[config.termsCount];
    
    return {
      id: generateId(),
      expression: `找规律：${visibleSequence.join(', ')}, ?`,
      answer: correctAnswer,
      questionType: 'fibonacci',
      numbers: fullSequence,
      missingIndex
    };
  }
  return null;
}

/**
 * Generate a square sequence question
 * @param config Pattern configuration
 * @returns Pattern question or null if unable to generate
 */
function generateSquarePatternQuestion(config: PatternConfig): PatternQuestion | null {
  // modify by jx: generate square sequence question with consistent answer calculation
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const start = Math.floor(Math.random() * 5) + 1;
    const fullSequence = generateSquareSequence(start, config.termsCount + 1);
    
    const missingIndex = Math.floor(Math.random() * config.termsCount);
    const visibleSequence = [...fullSequence.slice(0, config.termsCount)];
    
    // The answer is always the next term (fullSequence[termsCount])
    // modify by jx: always return the next term as the answer
    const correctAnswer = fullSequence[config.termsCount];
    
    return {
      id: generateId(),
      expression: `找规律：${visibleSequence.join(', ')}, ?`,
      answer: correctAnswer,
      questionType: 'square',
      numbers: fullSequence,
      missingIndex
    };
  }
  return null;
}

/**
 * Generate a cube sequence question
 * @param config Pattern configuration
 * @returns Pattern question or null if unable to generate
 */
function generateCubePatternQuestion(config: PatternConfig): PatternQuestion | null {
  // modify by jx: generate cube sequence question with consistent answer calculation
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const start = Math.floor(Math.random() * 3) + 1;
    const fullSequence = generateCubeSequence(start, config.termsCount + 1);
    // Ensure the sequence doesn't exceed reasonable bounds
    if (fullSequence.some(num => num > 10000)) continue;
    
    const missingIndex = Math.floor(Math.random() * config.termsCount);
    const visibleSequence = [...fullSequence.slice(0, config.termsCount)];
    
    // The answer is always the next term (fullSequence[termsCount])
    // modify by jx: always return the next term as the answer
    const correctAnswer = fullSequence[config.termsCount];
    
    return {
      id: generateId(),
      expression: `找规律：${visibleSequence.join(', ')}, ?`,
      answer: correctAnswer,
      questionType: 'cube',
      numbers: fullSequence,
      missingIndex
    };
  }
  return null;
}

/**
 * Generate pattern questions based on configuration
 * @param config Pattern configuration
 * @returns Array of pattern questions
 */
export function generatePatternQuestions(config: PatternConfig): PatternQuestion[] {
  // modify by jx: generate pattern questions based on configuration
  const questions: PatternQuestion[] = [];
  const patternTypes = config.patternTypes.length > 0 
    ? config.patternTypes 
    : ['arithmetic', 'geometric', 'fibonacci', 'square', 'cube'];
  
  // If patternTypes is empty after fallback, use arithmetic as default
  const typesToUse = patternTypes.length > 0 ? patternTypes : ['arithmetic'];
  
  for (let i = 0; i < config.questionCount; i++) {
    const selectedType = typesToUse[Math.floor(Math.random() * typesToUse.length)];
    let question: PatternQuestion | null = null;
    
    switch (selectedType) {
      case 'arithmetic':
        question = generateArithmeticPatternQuestion(config);
        break;
      case 'geometric':
        question = generateGeometricPatternQuestion(config);
        break;
      case 'fibonacci':
        question = generateFibonacciPatternQuestion(config);
        break;
      case 'square':
        question = generateSquarePatternQuestion(config);
        break;
      case 'cube':
        question = generateCubePatternQuestion(config);
        break;
    }
    
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Composable function for pattern question generation
 * @returns Object with generation functions and state
 */
export function usePatternGenerator() {
  // modify by jx: create composable function for pattern question generation
  const isGenerating = ref(false);
  const questions = ref<PatternQuestion[]>([]);
  
  /**
   * Generate pattern questions
   * @param config Pattern configuration
   */
  const generate = (config: PatternConfig) => {
    isGenerating.value = true;
    try {
      questions.value = generatePatternQuestions(config);
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
