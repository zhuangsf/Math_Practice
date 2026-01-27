// Composable for generating math questions
// modify by jx: implement core logic for generating binary, ternary, and quaternary operations

import { ref } from 'vue';
import type { Question, QuestionConfig, OperationType } from '@/types';
import { randomInt, generateDivisibleNumbers } from '@/utils/numberUtils';
import { validateAddition, validateSubtraction, validateMultiplication, validateExpressionResults } from '@/utils/validationUtils';
import { calculateExpression, buildExpression, calculate } from '@/utils/mathUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;

/**
 * Generate a single binary operation question (2 operands, 1 operator)
 * @param operation Operation type
 * @param min Minimum value
 * @param max Maximum value
 * @returns Question object or null if unable to generate
 */
function generateBinaryQuestion(
  operation: OperationType,
  min: number,
  max: number
): Question | null {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let a: number;
    let b: number;

    if (operation === 'divide') {
      // For division, generate divisible numbers
      [a, b] = generateDivisibleNumbers(min, max);
    } else if (operation === 'multiply') {
      // For multiplication, avoid zero operands to generate meaningful problems
      // modify by jx: fix bug where zero operands result in always-zero multiplication
      const adjustedMin = Math.max(min, 1);
      a = randomInt(adjustedMin, max);
      b = randomInt(adjustedMin, max);

      // Validate multiplication result does not exceed maximum value
      if (!validateMultiplication(a, b, max)) continue;
    } else {
      // For addition and subtraction, use original range
      a = randomInt(min, max);
      b = randomInt(min, max);

      // Validate based on operation type
      switch (operation) {
        case 'add':
          if (!validateAddition(a, b, max)) continue;
          break;
        case 'subtract':
          if (!validateSubtraction(a, b)) continue;
          break;
      }
    }

    const answer = calculate(a, b, operation);
    const expression = buildExpression([a, b], [operation]);

    return {
      id: generateId(),
      expression,
      answer,
      numbers: [a, b],
      operators: [operation]
    };
  }

  return null;
}

/**
 * Generate a single ternary operation question (3 operands, 2 operators)
 * @param operations Two operation types
 * @param min Minimum value
 * @param max Maximum value
 * @returns Question object or null if unable to generate
 */
function generateTernaryQuestion(
  operations: OperationType[],
  min: number,
  max: number
): Question | null {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let numbers: number[];

    // Check if all operations are division
    const allDivisions = operations.every(op => op === 'divide');
    // Check if all operations are multiplication
    const allMultiplications = operations.every(op => op === 'multiply');

    if (allDivisions) {
      // Special handling for continuous division: a ÷ b ÷ c
      // Generate from result backwards to ensure all divisions are integers
      // modify by jx: ensure result is at least 1 to avoid zero dividend
      const adjustedMin = Math.max(min, 1);
      const result = randomInt(adjustedMin, Math.min(max, 50)); // Limit result to avoid huge numbers

      // Generate divisors from right to left
      const c = randomInt(1, 10); // Last divisor
      const b = randomInt(1, 10); // First divisor

      // Calculate backwards: a = result * c * b
      const a = result * c * b;

      // modify by jx: ensure first dividend is not zero
      if (a === 0) {
        continue;
      }

      numbers = [a, b, c];
    } else if (allMultiplications) {
      // modify by jx: fix issue where continuous multiplication fails due to exceeding max value
      // Special handling for continuous multiplication: a × b × c
      // Generate numbers forward to ensure intermediate products don't exceed max

      // Pick a and b first (use reasonable ranges)
      const a = randomInt(2, Math.min(max, 30)); // First number
      const maxB = Math.floor(max / a); // Maximum b such that a × b ≤ max
      const b = randomInt(2, Math.min(maxB, 10)); // Second number (2-10, but also within limit)

      // Calculate intermediate product
      const temp = a * b;

      // Calculate maximum c such that temp × c ≤ max
      const maxC = Math.floor(max / temp);
      if (maxC < 2) {
        continue; // Can't find a suitable c, skip this attempt
      }

      // Pick c (2 to maxC, but capped at 10 for reasonable difficulty)
      const c = randomInt(2, Math.min(maxC, 10));

      numbers = [a, b, c];
    } else {
      // Check if we need to handle division
      const hasDivision = operations.includes('divide');
      const divideIndex = operations.indexOf('divide');

      if (hasDivision && divideIndex !== -1) {
        // Generate divisible numbers for division
        const [dividend, divisor] = generateDivisibleNumbers(min, max);

        // Check if multiplication is also involved
        const hasMultiplication = operations.includes('multiply');

        // Generate other random numbers
        if (divideIndex === 0) {
          // Division is first: dividend ? divisor ? third
          // modify by jx: avoid zero for multiplication operands
          const adjustedMin = hasMultiplication ? Math.max(min, 1) : min;
          const thirdNumber = randomInt(adjustedMin, max);
          numbers = [dividend, divisor, thirdNumber];
        } else {
          // Division is second: first ? dividend ? divisor
          // modify by jx: avoid zero for multiplication operands
          const adjustedMin = hasMultiplication ? Math.max(min, 1) : min;
          const firstNumber = randomInt(adjustedMin, max);
          numbers = [firstNumber, dividend, divisor];
        }
      } else {
        // No division, generate all random numbers
        // modify by jx: fix bug where zero operands result in always-zero multiplication
        // Check if multiplication is involved
        const hasMultiplication = operations.includes('multiply');
        if (hasMultiplication) {
          // For multiplication problems, avoid zero operands
          const adjustedMin = Math.max(min, 1);
          numbers = [randomInt(adjustedMin, max), randomInt(adjustedMin, max), randomInt(adjustedMin, max)];
        } else {
          // For addition/subtraction only, use original range
          numbers = [randomInt(min, max), randomInt(min, max), randomInt(min, max)];
        }
      }
    }

    // Validate expression results (including continuous divisions)
    // modify by jx: add comprehensive validation to ensure all divisions produce integers
    if (!validateExpressionResults(numbers, operations, min, max)) {
      continue;
    }

    const answer = calculateExpression(numbers, operations);
    const expression = buildExpression(numbers, operations);

    return {
      id: generateId(),
      expression,
      answer,
      numbers,
      operators: [...operations]
    };
  }

  return null;
}

/**
 * Generate a single quaternary operation question (4 operands, 3 operators)
 * @param operations Three operation types
 * @param min Minimum value
 * @param max Maximum value
 * @returns Question object or null if unable to generate
 */
function generateQuaternaryQuestion(
  operations: OperationType[],
  min: number,
  max: number
): Question | null {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const numbers: number[] = [];

    // Check for continuous division (all operations are divide)
    const allDivisions = operations.every(op => op === 'divide');
    // Check for continuous multiplication (all operations are multiply)
    const allMultiplications = operations.every(op => op === 'multiply');

    if (allDivisions) {
      // Special handling for continuous division: a ÷ b ÷ c ÷ d
      // Generate from result backwards to ensure all divisions are integers
      // modify by jx: ensure result is at least 1 to avoid zero dividend
      const adjustedMin = Math.max(min, 1);
      const result = randomInt(adjustedMin, Math.min(max, 100)); // Limit result to avoid huge numbers

      // Generate divisors from right to left
      const d = randomInt(1, 10); // Last divisor
      const c = randomInt(1, 10); // Third divisor
      const b = randomInt(1, 10); // Second divisor

      // Calculate backwards: a = result * d * c * b
      const temp1 = result * d;
      const temp2 = temp1 * c;
      const a = temp2 * b;

      // modify by jx: ensure first dividend is not zero
      if (a === 0) {
        continue;
      }

      numbers[0] = a;
      numbers[1] = b;
      numbers[2] = c;
      numbers[3] = d;
    } else if (allMultiplications) {
      // modify by jx: fix issue where continuous multiplication fails due to exceeding max value
      // Special handling for continuous multiplication: a × b × c × d
      // Generate numbers forward to ensure intermediate products don't exceed max

      // Pick a and b first (use reasonable ranges)
      const a = randomInt(2, Math.min(max, 20)); // First number (smaller for quaternary)
      const maxB = Math.floor(max / a); // Maximum b such that a × b ≤ max
      const b = randomInt(2, Math.min(maxB, 10)); // Second number (2-5, but also within limit)

      // Calculate first intermediate product
      const temp1 = a * b;
      const maxC = Math.floor(max / temp1); // Maximum c such that temp1 × c ≤ max
      if (maxC < 2) {
        continue; // Can't find a suitable c, skip this attempt
      }

      // Pick c (2 to maxC, but capped at 5 for reasonable difficulty)
      const c = randomInt(2, Math.min(maxC, 10));

      // Calculate second intermediate product
      const temp2 = temp1 * c;
      const maxD = Math.floor(max / temp2); // Maximum d such that temp2 × d ≤ max
      if (maxD < 2) {
        continue; // Can't find a suitable d, skip this attempt
      }

      // Pick d (2 to maxD, but capped at 5 for reasonable difficulty)
      const d = randomInt(2, Math.min(maxD,10));

      numbers[0] = a;
      numbers[1] = b;
      numbers[2] = c;
      numbers[3] = d;
    } else {
      // Check for division operations
      const divisionIndices: number[] = [];
      for (let i = 0; i < operations.length; i++) {
        if (operations[i] === 'divide') {
          divisionIndices.push(i);
        }
      }

      if (divisionIndices.length > 0) {
        // Generate numbers ensuring divisible pairs for each division
        const numPositions = 4;
        const generatedNumbers = new Array(numPositions).fill(null);

        // For each division, generate divisible numbers
        for (const divIndex of divisionIndices) {
          const [dividend, divisor] = generateDivisibleNumbers(min, max);
          generatedNumbers[divIndex] = dividend;
          generatedNumbers[divIndex + 1] = divisor;
        }

        // Check if multiplication is also involved
        const hasMultiplication = operations.includes('multiply');

        // Fill remaining positions with random numbers
        // modify by jx: avoid zero for multiplication operands
        const adjustedMin = hasMultiplication ? Math.max(min, 1) : min;
        for (let i = 0; i < numPositions; i++) {
          if (generatedNumbers[i] === null) {
            generatedNumbers[i] = randomInt(adjustedMin, max);
          }
        }

        numbers.push(...generatedNumbers);
      } else {
        // No division, generate all random numbers
        // modify by jx: fix bug where zero operands result in always-zero multiplication
        // Check if multiplication is involved
        const hasMultiplication = operations.includes('multiply');
        if (hasMultiplication) {
          // For multiplication problems, avoid zero operands
          const adjustedMin = Math.max(min, 1);
          numbers.push(randomInt(adjustedMin, max));
          numbers.push(randomInt(adjustedMin, max));
          numbers.push(randomInt(adjustedMin, max));
          numbers.push(randomInt(adjustedMin, max));
        } else {
          // For addition/subtraction only, use original range
          numbers.push(randomInt(min, max));
          numbers.push(randomInt(min, max));
          numbers.push(randomInt(min, max));
          numbers.push(randomInt(min, max));
        }
      }
    }

    // Validate expression results (including continuous divisions)
    // modify by jx: add comprehensive validation to ensure all divisions produce integers
    if (!validateExpressionResults(numbers, operations, min, max)) {
      continue;
    }

    const answer = calculateExpression(numbers, operations);
    const expression = buildExpression(numbers, operations);

    return {
      id: generateId(),
      expression,
      answer,
      numbers,
      operators: [...operations]
    };
  }

  return null;
}

/**
 * Select random operations from the available operation types
 * @param availableOperations Available operation types
 * @param count Number of operations to select
 * @returns Array of selected operations
 */
function selectRandomOperations(
  availableOperations: OperationType[],
  count: number
): OperationType[] {
  const selected: OperationType[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableOperations.length);
    selected.push(availableOperations[randomIndex]);
  }
  
  return selected;
}

/**
 * Generate multiple questions based on configuration
 * @param config Question configuration
 * @returns Array of generated questions
 */
export function useQuestionGenerator() {
  const isGenerating = ref(false);
  const questions = ref<Question[]>([]);

  /**
   * Generate questions based on the provided configuration
   * @param config Question generation configuration
   * @returns Array of generated questions
   */
  const generateQuestions = (config: QuestionConfig): Question[] => {
    isGenerating.value = true;
    const generatedQuestions: Question[] = [];

    for (let i = 0; i < config.questionCount; i++) {
      let question: Question | null = null;
      let attempts = 0;
      const maxAttempts = 100; // Maximum attempts per question

      // Try to generate a valid question
      while (!question && attempts < maxAttempts) {
        attempts++;
        
        // modify by jx: support mixed mode to randomly select operand count (2, 3, or 4)
        let operandCount: 2 | 3 | 4;
        if (config.operandCount === 'mixed') {
          // Randomly select 2, 3, or 4 for mixed mode
          const random = Math.random();
          if (random < 0.33) {
            operandCount = 2;
          } else if (random < 0.67) {
            operandCount = 3;
          } else {
            operandCount = 4;
          }
        } else {
          operandCount = config.operandCount;
        }

        const ops = selectRandomOperations(config.operations, operandCount - 1);

        switch (operandCount) {
          case 2:
            question = generateBinaryQuestion(ops[0], config.minValue, config.maxValue);
            break;
          case 3:
            question = generateTernaryQuestion(ops, config.minValue, config.maxValue);
            break;
          case 4:
            question = generateQuaternaryQuestion(ops, config.minValue, config.maxValue);
            break;
        }
      }

      if (question) {
        generatedQuestions.push(question);
      }
    }

    questions.value = generatedQuestions;
    isGenerating.value = false;

    return generatedQuestions;
  };

  /**
   * Clear all generated questions
   */
  const clearQuestions = () => {
    questions.value = [];
  };

  return {
    isGenerating,
    questions,
    generateQuestions,
    clearQuestions
  };
}
