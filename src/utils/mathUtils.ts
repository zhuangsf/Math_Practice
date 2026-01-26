// Mathematical operation utilities
// modify by jx: implement calculation functions for mathematical operations

import type { OperationType } from '@/types';

/**
 * Convert operation type to display symbol
 * @param operation Operation type
 * @returns Symbol string
 */
export function operationToSymbol(operation: OperationType): string {
  const symbols = {
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷'
  };
  return symbols[operation];
}

/**
 * Perform a single operation on two numbers
 * @param a First operand
 * @param b Second operand
 * @param operation Operation type
 * @returns Result of the operation
 */
export function calculate(a: number, b: number, operation: OperationType): number {
  switch (operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      return a / b;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

/**
 * Calculate expression result respecting operator precedence
 * Handles multiple operations with correct precedence (multiplication/division before addition/subtraction)
 * @param numbers Array of operands
 * @param operators Array of operators
 * @returns Calculated result
 */
export function calculateExpression(numbers: number[], operators: OperationType[]): number {
  if (numbers.length === 0 || operators.length === 0) {
    throw new Error('Invalid expression: no numbers or operators');
  }

  // Create copies to avoid mutating original arrays
  const numList = [...numbers];
  const opList = [...operators];

  // First pass: handle multiplication and division (left to right)
  // modify by jx: fix calculation order for continuous division to be left-to-right
  let i = 0;
  while (i < opList.length) {
    const op = opList[i];
    if (op === 'multiply' || op === 'divide') {
      const result = calculate(numList[i], numList[i + 1], op);
      numList.splice(i, 2, result);
      opList.splice(i, 1);
      // Don't increment i, as we need to check the same position again
    } else {
      i++;
    }
  }

  // Second pass: handle addition and subtraction (left to right)
  let result = numList[0];
  for (let i = 0; i < opList.length; i++) {
    result = calculate(result, numList[i + 1], opList[i]);
  }

  return result;
}

/**
 * Build expression string from numbers and operators
 * @param numbers Array of operands
 * @param operators Array of operators
 * @returns Expression string (e.g., "25 + 37 - 12")
 */
export function buildExpression(numbers: number[], operators: OperationType[]): string {
  let expression = `${numbers[0]}`;
  
  for (let i = 0; i < operators.length; i++) {
    const symbol = operationToSymbol(operators[i]);
    expression += ` ${symbol} ${numbers[i + 1]}`;
  }
  
  return expression;
}
