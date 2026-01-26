// Composable for generating linear equation questions
// modify by jx: implement core logic for generating linear equations with different difficulty levels

import { ref } from 'vue';
import type { EquationQuestion, EquationDifficulty } from '@/types';
import { generateId } from '@/utils/validationUtils';
import { randomInt } from '@/utils/numberUtils';

/**
 * Maximum number of retry attempts when generating a valid equation
 */
const MAX_RETRIES = 50;

/**
 * Generate a simple linear equation: ax + b = c
 * where a, b, c are small integers
 */
function generateEasyEquation(): EquationQuestion | null {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // Simple equations: ax + b = c, where a is 1-5, b and c are small
    const a = randomInt(1, 5);
    const b = randomInt(-10, 10);
    const c = randomInt(-20, 20);
    
    // Calculate x: ax + b = c => x = (c - b) / a
    const x = (c - b) / a;
    
    // Ensure x is an integer for easy difficulty
    if (Number.isInteger(x) && Math.abs(x) <= 20) {
      const equation = formatEquation(a, b, c);
      return {
        id: generateId(),
        equation,
        answer: x
      };
    }
  }
  return null;
}

/**
 * Generate a medium difficulty linear equation: ax + b = cx + d
 * with unknown on both sides
 */
function generateMediumEquation(): EquationQuestion | null {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // Medium equations: ax + b = cx + d
    // Rearranged: (a - c)x = d - b => x = (d - b) / (a - c)
    const a = randomInt(1, 10);
    const c = randomInt(1, 10);
    
    // Ensure a != c to avoid division by zero
    if (a === c) continue;
    
    const b = randomInt(-30, 30);
    const d = randomInt(-50, 50);
    
    // Calculate x: (a - c)x = d - b => x = (d - b) / (a - c)
    const numerator = d - b;
    const denominator = a - c;
    const x = numerator / denominator;
    
    // Ensure x is an integer and reasonable
    if (Number.isInteger(x) && Math.abs(x) <= 50) {
      const equation = formatComplexEquation(a, b, c, d);
      return {
        id: generateId(),
        equation,
        answer: x
      };
    }
  }
  return null;
}

/**
 * Generate a complex linear equation: a(x + b) = cx + d
 * with parentheses and unknown on both sides
 */
function generateHardEquation(): EquationQuestion | null {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // Complex equations: a(x + b) = cx + d
    // Expand left side: a(x + b) = ax + ab
    // So: ax + ab = cx + d
    // Rearranged: (a - c)x = d - ab => x = (d - ab) / (a - c)
    const a = randomInt(2, 10); // a should be at least 2 for meaningful parentheses
    const c = randomInt(1, 10);
    
    // Ensure a != c to avoid division by zero
    if (a === c) continue;
    
    // modify by jx: ensure b !== 0 to maintain parentheses form for complex difficulty
    let b = randomInt(-10, 10);
    if (b === 0) {
      // If b is 0, regenerate to ensure parentheses form
      b = randomInt(1, 10) * (Math.random() > 0.5 ? 1 : -1);
    }
    const d = randomInt(-50, 50);
    
    // Calculate ab (a * b)
    const ab = a * b;
    
    // Calculate x: (a - c)x = d - ab => x = (d - ab) / (a - c)
    const numerator = d - ab;
    const denominator = a - c;
    const x = numerator / denominator;
    
    // Ensure x is an integer and reasonable
    if (Number.isInteger(x) && Math.abs(x) <= 100) {
      const equation = formatParenthesesEquation(a, b, c, d);
      return {
        id: generateId(),
        equation,
        answer: x
      };
    }
  }
  return null;
}

/**
 * Format simple equation: ax + b = c
 */
function formatEquation(a: number, b: number, c: number): string {
  let leftSide = '';
  
  // Format ax part
  if (a === 1) {
    leftSide = 'x';
  } else if (a === -1) {
    leftSide = '-x';
  } else {
    leftSide = `${a}x`;
  }
  
  // Format + b or - b part
  if (b > 0) {
    leftSide += ` + ${b}`;
  } else if (b < 0) {
    leftSide += ` - ${Math.abs(b)}`;
  }
  
  return `${leftSide} = ${c}`;
}

/**
 * Format complex equation: ax + b = cx + d
 */
function formatComplexEquation(a: number, b: number, c: number, d: number): string {
  let leftSide = '';
  let rightSide = '';
  
  // Format left side: ax + b
  if (a === 1) {
    leftSide = 'x';
  } else if (a === -1) {
    leftSide = '-x';
  } else {
    leftSide = `${a}x`;
  }
  
  if (b > 0) {
    leftSide += ` + ${b}`;
  } else if (b < 0) {
    leftSide += ` - ${Math.abs(b)}`;
  }
  
  // Format right side: cx + d
  if (c === 1) {
    rightSide = 'x';
  } else if (c === -1) {
    rightSide = '-x';
  } else {
    rightSide = `${c}x`;
  }
  
  if (d > 0) {
    rightSide += ` + ${d}`;
  } else if (d < 0) {
    rightSide += ` - ${Math.abs(d)}`;
  }
  
  return `${leftSide} = ${rightSide}`;
}

/**
 * Format equation with parentheses: a(x + b) = cx + d
 */
function formatParenthesesEquation(a: number, b: number, c: number, d: number): string {
  let leftSide = '';
  let rightSide = '';
  
  // Format left side: a(x + b) or a(x - b)
  // modify by jx: format parentheses equation, b is guaranteed to be non-zero
  let parenthesesContent = '';
  if (b > 0) {
    parenthesesContent = `(x + ${b})`;
  } else {
    parenthesesContent = `(x - ${Math.abs(b)})`;
  }
  
  // Combine: a(x + b) or just (x + b) if a === 1
  if (a === 1) {
    leftSide = parenthesesContent;
  } else if (a === -1) {
    leftSide = `-${parenthesesContent}`;
  } else {
    leftSide = `${a}${parenthesesContent}`;
  }
  
  // Format right side: cx + d
  if (c === 1) {
    rightSide = 'x';
  } else if (c === -1) {
    rightSide = '-x';
  } else {
    rightSide = `${c}x`;
  }
  
  if (d > 0) {
    rightSide += ` + ${d}`;
  } else if (d < 0) {
    rightSide += ` - ${Math.abs(d)}`;
  }
  
  return `${leftSide} = ${rightSide}`;
}

/**
 * Generate a single equation based on difficulty
 */
function generateSingleEquation(difficulty: EquationDifficulty): EquationQuestion | null {
  switch (difficulty) {
    case 'easy':
      return generateEasyEquation();
    case 'medium':
      return generateMediumEquation();
    case 'hard':
      return generateHardEquation();
    default:
      return null;
  }
}

/**
 * Generate multiple equations based on configuration
 */
export function useEquationGenerator() {
  const isGenerating = ref(false);
  const equations = ref<EquationQuestion[]>([]);

  /**
   * Generate equations based on the provided configuration
   * @param config Equation generation configuration
   * @returns Array of generated equations
   */
  const generateEquations = (config: { difficulty: EquationDifficulty; questionCount: number }): EquationQuestion[] => {
    isGenerating.value = true;
    const generatedEquations: EquationQuestion[] = [];

    for (let i = 0; i < config.questionCount; i++) {
      let equation: EquationQuestion | null = null;
      let attempts = 0;
      const maxAttempts = 100; // Maximum attempts per equation

      // Try to generate a valid equation
      while (!equation && attempts < maxAttempts) {
        attempts++;
        equation = generateSingleEquation(config.difficulty);
      }

      if (equation) {
        generatedEquations.push(equation);
      }
    }

    equations.value = generatedEquations;
    isGenerating.value = false;

    return generatedEquations;
  };

  /**
   * Clear all generated equations
   */
  const clearEquations = () => {
    equations.value = [];
  };

  return {
    isGenerating,
    equations,
    generateEquations,
    clearEquations
  };
}
