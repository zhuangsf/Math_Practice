// Validation utilities for mathematical operations
// modify by jx: implement validation functions for operation constraints

import type { OperationType } from '@/types';

/**
 * Calculate operation result
 * @param a First operand
 * @param b Second operand
 * @param operation Operation type
 * @returns Result of the operation
 */
function calculate(a: number, b: number, operation: OperationType): number {
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
 * Duplicate of mathUtils.calculateExpression to avoid circular dependency
 * @param numbers Array of operands
 * @param operators Array of operators
 * @returns Calculated result
 */
function calculateExpressionForValidation(numbers: number[], operators: OperationType[]): number {
  if (numbers.length === 0 || operators.length === 0) {
    throw new Error('Invalid expression: no numbers or operators');
  }

  const numList = [...numbers];
  const opList = [...operators];

  // First pass: handle multiplication and division (left to right)
  let i = 0;
  while (i < opList.length) {
    const op = opList[i];
    if (op === 'multiply' || op === 'divide') {
      const result = calculate(numList[i], numList[i + 1], op);
      numList.splice(i, 2, result);
      opList.splice(i, 1);
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
 * Validate addition result does not exceed maximum value
 * @param a First operand
 * @param b Second operand
 * @param max Maximum allowed result
 * @returns True if valid, false otherwise
 */
export function validateAddition(a: number, b: number, max: number): boolean {
  return a + b <= max;
}

/**
 * Validate subtraction result is non-negative
 * @param a Minuend (number being subtracted from)
 * @param b Subtrahend (number being subtracted)
 * @returns True if valid (a >= b), false otherwise
 */
export function validateSubtraction(a: number, b: number): boolean {
  return a >= b;
}

/**
 * Validate multiplication result does not exceed maximum value
 * @param a First operand
 * @param b Second operand
 * @param max Maximum allowed result
 * @returns True if valid, false otherwise
 */
export function validateMultiplication(a: number, b: number, max: number): boolean {
  return a * b <= max;
}

/**
 * Validate division results in an integer (no remainder)
 * @param a Dividend (number being divided)
 * @param b Divisor (number dividing by)
 * @returns True if valid (b != 0 and a % b === 0), false otherwise
 */
export function validateDivision(a: number, b: number): boolean {
  return b !== 0 && a % b === 0;
}

/**
 * Validate division with additional constraint: dividend >= divisor
 * @param a Dividend
 * @param b Divisor
 * @returns True if valid, false otherwise
 */
export function validateDivisionWithConstraint(a: number, b: number): boolean {
  return b !== 0 && a % b === 0 && a >= b;
}

/**
 * Validate operation based on type
 * @param operation Type of operation
 * @param a First operand
 * @param b Second operand
 * @param max Maximum allowed result (for addition and multiplication)
 * @returns True if valid, false otherwise
 */
export function validateOperation(
  operation: OperationType,
  a: number,
  b: number,
  max: number
): boolean {
  switch (operation) {
    case 'add':
      return validateAddition(a, b, max);
    case 'subtract':
      return validateSubtraction(a, b);
    case 'multiply':
      return validateMultiplication(a, b, max);
    case 'divide':
      return validateDivisionWithConstraint(a, b);
    default:
      return false;
  }
}

/**
 * Generate a unique ID
 * @returns Unique identifier string
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Validate that all division operations in an expression result in integers
 * This is critical for continuous division chains
 * modify by jx: add validation for continuous division results
 * @param numbers Array of operands
 * @param operators Array of operators
 * @returns True if all division steps result in integers, false otherwise
 */
export function validateDivisionResults(numbers: number[], operators: OperationType[]): boolean {
  let currentValue = numbers[0];
  
  // modify by jx: ensure first operand is not zero when first operation is division
  if (operators.length > 0 && operators[0] === 'divide' && currentValue === 0) {
    return false;
  }
  
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    const nextValue = numbers[i + 1];
    
    // Check if current value is integer before division
    if (!Number.isInteger(currentValue)) {
      return false;
    }
    
    // Perform calculation based on operator precedence
    if (operator === 'multiply' || operator === 'divide') {
      // For multiplication and division, process immediately
      if (operator === 'divide') {
        // Validate division is possible (divisor != 0 and result is integer)
        if (nextValue === 0 || currentValue % nextValue !== 0) {
          return false;
        }
        currentValue = currentValue / nextValue;
      } else {
        currentValue = currentValue * nextValue;
      }
    }
    // For addition and subtraction, continue to next step
    // (they will be processed after all multiplication/division)
  }
  
  return true;
}

/**
 * Validate expression results are all integers and within valid range
 * modify by jx: add comprehensive validation for expression results
 * @param numbers Array of operands
 * @param operators Array of operators
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns True if all results are integers and within range
 */
export function validateExpressionResults(numbers: number[], operators: OperationType[], min: number, max: number): boolean {
  // First, ensure all divisions produce integer results
  if (!validateDivisionResults(numbers, operators)) {
    return false;
  }
  
  // Calculate final result
  const finalResult = calculateExpressionForValidation(numbers, operators);
  
  // Check final result is integer and within range
  if (!Number.isInteger(finalResult)) {
    return false;
  }
  
  if (finalResult < min || finalResult > max) {
    return false;
  }
  
  return true;
}