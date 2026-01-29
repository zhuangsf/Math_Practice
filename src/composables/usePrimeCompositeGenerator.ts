// Composable for generating prime and composite questions
// modify by jx: implement core logic for generating prime and composite questions

import { ref } from 'vue';
import type { PrimeCompositeQuestion, PrimeCompositeConfig } from '@/types';
import { isPrime, isComposite, getPrimeFactors } from '@/utils/primeCompositeUtils';
import { randomInt } from '@/utils/numberUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;

/**
 * Generate an is-prime question
 * @param config Prime composite configuration
 * @returns Prime composite question or null if unable to generate
 */
function generateIsPrimeQuestion(config: PrimeCompositeConfig): PrimeCompositeQuestion | null {
  // modify by jx: generate is-prime question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const num = randomInt(config.valueRange[0], config.valueRange[1]);
    
    // Ensure number is in valid range for prime checking
    if (num < 2) continue;
    
    const answer = isPrime(num);
    
    return {
      id: generateId(),
      expression: `${num}是质数吗？`,
      answer: answer,
      questionType: 'is-prime',
      numbers: [num]
    };
  }
  return null;
}

/**
 * Generate an is-composite question
 * @param config Prime composite configuration
 * @returns Prime composite question or null if unable to generate
 */
function generateIsCompositeQuestion(config: PrimeCompositeConfig): PrimeCompositeQuestion | null {
  // modify by jx: generate is-composite question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const num = randomInt(config.valueRange[0], config.valueRange[1]);
    
    // Ensure number is in valid range for composite checking
    if (num < 4) continue;
    
    const answer = isComposite(num);
    
    return {
      id: generateId(),
      expression: `${num}是合数吗？`,
      answer: answer,
      questionType: 'is-composite',
      numbers: [num]
    };
  }
  return null;
}

/**
 * Generate a prime factors question
 * @param config Prime composite configuration
 * @returns Prime composite question or null if unable to generate
 */
function generatePrimeFactorsQuestion(config: PrimeCompositeConfig): PrimeCompositeQuestion | null {
  // modify by jx: generate prime factors question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const num = randomInt(config.valueRange[0], config.valueRange[1]);
    
    // Ensure number is composite and has prime factors
    if (num < 4) continue;
    
    const factors = getPrimeFactors(num);
    
    if (factors.length > 0) {
      return {
        id: generateId(),
        expression: `${num}的质因数是？`,
        answer: factors,
        questionType: 'prime-factors',
        numbers: [num]
      };
    }
  }
  return null;
}

/**
 * Generate prime and composite questions based on configuration
 * @param config Prime composite configuration
 * @returns Array of prime composite questions
 */
export function generatePrimeCompositeQuestions(config: PrimeCompositeConfig): PrimeCompositeQuestion[] {
  // modify by jx: generate prime composite questions based on configuration
  const questions: PrimeCompositeQuestion[] = [];
  const questionTypes = config.questionTypes.length > 0 
    ? config.questionTypes 
    : ['is-prime', 'is-composite', 'prime-factors'];
  
  for (let i = 0; i < config.questionCount; i++) {
    const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    let question: PrimeCompositeQuestion | null = null;
    
    switch (selectedType) {
      case 'is-prime':
        question = generateIsPrimeQuestion(config);
        break;
      case 'is-composite':
        question = generateIsCompositeQuestion(config);
        break;
      case 'prime-factors':
        question = generatePrimeFactorsQuestion(config);
        break;
    }
    
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Composable function for prime composite question generation
 * @returns Object with generation functions and state
 */
export function usePrimeCompositeGenerator() {
  // modify by jx: create composable function for prime composite question generation
  const isGenerating = ref(false);
  const questions = ref<PrimeCompositeQuestion[]>([]);
  
  /**
   * Generate prime composite questions
   * @param config Prime composite configuration
   */
  const generate = (config: PrimeCompositeConfig) => {
    isGenerating.value = true;
    try {
      questions.value = generatePrimeCompositeQuestions(config);
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
