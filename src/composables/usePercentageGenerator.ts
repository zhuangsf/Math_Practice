// Composable for generating percentage questions
// modify by jx: implement core logic for generating percentage questions

import { ref } from 'vue';
import type { PercentageQuestion, PercentageConfig } from '@/types';
import { 
  decimalToPercent,
  percentToDecimal,
  fractionToPercent,
  percentToFraction,
  findPart,
  findTotal,
  findPercent,
  formatPercent
} from '@/utils/percentageUtils';
import { randomInt } from '@/utils/numberUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;

/**
 * Generate a decimal to percent conversion question
 * @param config Percentage configuration
 * @returns Percentage question or null if unable to generate
 */
function generateDecimalToPercentQuestion(config: PercentageConfig): PercentageQuestion | null {
  // modify by jx: generate decimal to percent conversion question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const decimal = randomInt(config.valueRange[0], config.valueRange[1]) / 100;
    const answer = decimalToPercent(decimal);
    
    // modify by jx: display decimal format instead of fraction format, format to 2 decimal places
    return {
      id: generateId(),
      expression: `${decimal.toFixed(2)} = ?%`,
      answer: answer,
      questionType: 'decimal-to-percent'
    };
  }
  return null;
}

/**
 * Generate a percent to decimal conversion question
 * @param config Percentage configuration
 * @returns Percentage question or null if unable to generate
 */
function generatePercentToDecimalQuestion(config: PercentageConfig): PercentageQuestion | null {
  // modify by jx: generate percent to decimal conversion question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const percent = randomInt(config.valueRange[0], config.valueRange[1]);
    const answer = percentToDecimal(percent);
    
    return {
      id: generateId(),
      expression: `${percent}% = ?`,
      answer: answer,
      questionType: 'percent-to-decimal'
    };
  }
  return null;
}

/**
 * Generate a fraction to percent conversion question
 * @param config Percentage configuration
 * @returns Percentage question or null if unable to generate
 */
function generateFractionToPercentQuestion(config: PercentageConfig): PercentageQuestion | null {
  // modify by jx: generate fraction to percent conversion question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const denominator = randomInt(2, 20);
    const numerator = randomInt(1, denominator - 1);
    const answer = fractionToPercent(numerator, denominator);
    
    return {
      id: generateId(),
      expression: `${numerator}/${denominator} = ?%`,
      answer: answer,
      questionType: 'fraction-to-percent'
    };
  }
  return null;
}

/**
 * Generate a percent to fraction conversion question
 * @param config Percentage configuration
 * @returns Percentage question or null if unable to generate
 */
function generatePercentToFractionQuestion(config: PercentageConfig): PercentageQuestion | null {
  // modify by jx: generate percent to fraction conversion question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const percent = randomInt(config.valueRange[0], config.valueRange[1]);
    const fraction = percentToFraction(percent);
    
    return {
      id: generateId(),
      expression: `${percent}% = ?`,
      answer: `${fraction.numerator}/${fraction.denominator}`,
      questionType: 'percent-to-fraction'
    };
  }
  return null;
}

/**
 * Generate a find percent question (what percent is A of B)
 * @param config Percentage configuration
 * @returns Percentage question or null if unable to generate
 */
function generateFindPercentQuestion(config: PercentageConfig): PercentageQuestion | null {
  // modify by jx: generate find percent application question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const total = randomInt(10, 100);
    const part = randomInt(1, total - 1);
    const answer = findPercent(part, total);
    
    return {
      id: generateId(),
      expression: `${part}是${total}的百分之几？`,
      answer: formatPercent(answer),
      questionType: 'find-percent'
    };
  }
  return null;
}

/**
 * Generate a find part question (what is X% of Y)
 * @param config Percentage configuration
 * @returns Percentage question or null if unable to generate
 */
function generateFindPartQuestion(config: PercentageConfig): PercentageQuestion | null {
  // modify by jx: generate find part application question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const percent = randomInt(config.valueRange[0], config.valueRange[1]);
    const total = randomInt(10, 100);
    const answer = findPart(percent, total);
    
    // modify by jx: change format to "数字的百分数是多少", e.g., "60的20%是多少", and round answer to 2 decimal places
    return {
      id: generateId(),
      expression: `${total}的${percent}%是多少？`,
      answer: Math.round(answer * 100) / 100,
      questionType: 'find-part'
    };
  }
  return null;
}

/**
 * Generate a find total question (X is Y% of what)
 * @param config Percentage configuration
 * @returns Percentage question or null if unable to generate
 */
function generateFindTotalQuestion(config: PercentageConfig): PercentageQuestion | null {
  // modify by jx: generate find total application question
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const percent = randomInt(config.valueRange[0], config.valueRange[1]);
    const part = randomInt(5, 50);
    const answer = findTotal(part, percent);
    
    // modify by jx: change format to "多少的百分数是数字", e.g., "多少的20%是10", and round answer to 2 decimal places
    return {
      id: generateId(),
      expression: `多少的${percent}%是${part}？`,
      answer: Math.round(answer * 100) / 100,
      questionType: 'find-total'
    };
  }
  return null;
}

/**
 * Generate percentage questions based on configuration
 * @param config Percentage configuration
 * @returns Array of percentage questions
 */
export function generatePercentageQuestions(config: PercentageConfig): PercentageQuestion[] {
  // modify by jx: generate percentage questions based on configuration
  const questions: PercentageQuestion[] = [];
  const questionTypes = config.questionTypes.length > 0 
    ? config.questionTypes 
    : ['decimal-to-percent', 'percent-to-decimal', 'find-percent', 'find-part', 'find-total'];
  
  for (let i = 0; i < config.questionCount; i++) {
    const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    let question: PercentageQuestion | null = null;
    
    switch (selectedType) {
      case 'decimal-to-percent':
        question = generateDecimalToPercentQuestion(config);
        break;
      case 'percent-to-decimal':
        question = generatePercentToDecimalQuestion(config);
        break;
      case 'fraction-to-percent':
        question = generateFractionToPercentQuestion(config);
        break;
      case 'percent-to-fraction':
        question = generatePercentToFractionQuestion(config);
        break;
      case 'find-percent':
        question = generateFindPercentQuestion(config);
        break;
      case 'find-part':
        question = generateFindPartQuestion(config);
        break;
      case 'find-total':
        question = generateFindTotalQuestion(config);
        break;
    }
    
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Composable function for percentage question generation
 * @returns Object with generation functions and state
 */
export function usePercentageGenerator() {
  // modify by jx: create composable function for percentage question generation
  const isGenerating = ref(false);
  const questions = ref<PercentageQuestion[]>([]);
  
  /**
   * Generate percentage questions
   * @param config Percentage configuration
   */
  const generate = (config: PercentageConfig) => {
    isGenerating.value = true;
    try {
      questions.value = generatePercentageQuestions(config);
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
