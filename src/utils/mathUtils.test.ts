// Unit tests for mathUtils
// modify by jx: add unit tests to verify division constraints and calculation accuracy

import { describe, it, expect } from 'vitest';
import { calculate, calculateExpression } from './mathUtils';
import { validateDivision } from './validationUtils';

describe('MathUtils', () => {
  describe('calculate - Basic Operations', () => {
    it('should correctly perform addition', () => {
      expect(calculate(5, 3, 'add')).toBe(8);
      expect(calculate(25, 37, 'add')).toBe(62);
    });

    it('should correctly perform subtraction', () => {
      expect(calculate(10, 3, 'subtract')).toBe(7);
      expect(calculate(100, 45, 'subtract')).toBe(55);
    });

    it('should correctly perform multiplication', () => {
      expect(calculate(5, 3, 'multiply')).toBe(15);
      expect(calculate(12, 8, 'multiply')).toBe(96);
    });

    it('should correctly perform division with integers', () => {
      expect(calculate(10, 2, 'divide')).toBe(5);
      expect(calculate(100, 4, 'divide')).toBe(25);
    });

    it('should handle division that results in decimal', () => {
      expect(calculate(374, 562, 'divide')).toBe(374 / 562);
    });
  });

  describe('calculateExpression - Multiple Operations', () => {
    it('should correctly calculate binary expression', () => {
      expect(calculateExpression([25, 37], ['add'])).toBe(62);
      expect(calculateExpression([100, 25], ['subtract'])).toBe(75);
      expect(calculateExpression([12, 8], ['multiply'])).toBe(96);
      expect(calculateExpression([100, 25], ['divide'])).toBe(4);
    });

    it('should correctly calculate ternary expression with addition/subtraction', () => {
      expect(calculateExpression([10, 5, 3], ['add', 'subtract'])).toBe(12); // 10 + 5 - 3 = 12
      expect(calculateExpression([20, 5, 8], ['subtract', 'add'])).toBe(23); // 20 - 5 + 8 = 23
    });

    it('should correctly calculate ternary expression with multiplication/division', () => {
      // (20 × 5) ÷ 2 = 100 ÷ 2 = 50
      expect(calculateExpression([20, 5, 2], ['multiply', 'divide'])).toBe(50);
      // (48 ÷ 6) × 4 = 8 × 4 = 32
      expect(calculateExpression([48, 6, 4], ['divide', 'multiply'])).toBe(32);
    });

    it('should correctly calculate ternary expression with mixed operations', () => {
      expect(calculateExpression([10, 5, 3], ['multiply', 'add'])).toBe(50 + 3); // 10 × 5 + 3 = 50 + 3 = 53
      expect(calculateExpression([10, 5, 3], ['multiply', 'add'])).toBe(53);
      expect(calculateExpression([20, 5, 3], ['add', 'multiply'])).toBe(20 + 15); // 20 + 5 × 3 = 20 + 15 = 35
      expect(calculateExpression([20, 5, 3], ['add', 'multiply'])).toBe(35);
    });

    it('should correctly calculate quaternary expression', () => {
      // 10 + 5 - 3 × 2 = 10 + 5 - 6 = 9 (multiplication has precedence)
      expect(calculateExpression([10, 5, 3, 2], ['add', 'subtract', 'multiply'])).toBe(9);
    });

    it('should handle multiple divisions correctly', () => {
      // 648 ÷ 81 ÷ 2 = 8 ÷ 2 = 4 (all integers)
      const result = calculateExpression([648, 81, 2], ['divide', 'divide']);
      expect(result).toBe(4);
      expect(result % 1).toBe(0); // should be integer
    });

    it('should detect non-integer result in continuous division', () => {
      // 374 ÷ 562 ÷ 648 ÷ 81
      // Step 1: 374 ÷ 562 ≈ 0.665 (not integer!)
      const result = calculateExpression([374, 562, 648, 81], ['divide', 'divide', 'divide']);
      const isInteger = result % 1 === 0;
      
      // This should fail because 374 is not divisible by 562
      expect(isInteger).toBe(false);
    });

    it('should handle division after division when first is not integer', () => {
      // 10 ÷ 3 ÷ 2
      // Step 1: 10 ÷ 3 ≈ 3.333...
      // Step 2: 3.333... ÷ 2 ≈ 1.666...
      const result = calculateExpression([10, 3, 2], ['divide', 'divide']);
      expect(result).toBeCloseTo(10 / 3 / 2, 10);
    });

    it('should correctly handle all divisions with integers', () => {
      // 1000 ÷ 10 ÷ 5 ÷ 2 = 100 ÷ 5 ÷ 2 = 20 ÷ 2 = 10
      const result = calculateExpression([1000, 10, 5, 2], ['divide', 'divide', 'divide']);
      expect(result).toBe(10);
      expect(result % 1).toBe(0); // should be integer
    });

    it('should correctly validate divisible pairs', () => {
      // These should be divisible
      expect(validateDivision(100, 10)).toBe(true);
      expect(validateDivision(648, 81)).toBe(true);
      expect(validateDivision(1000, 10)).toBe(true);

      // These should not be divisible
      expect(validateDivision(374, 562)).toBe(false);
      expect(validateDivision(10, 3)).toBe(false);
    });
  });

  describe('PRD Requirements - 100% Accuracy', () => {
    it('should ensure all division results are integers for generated questions', () => {
      // Test case from the bug report
      const numbers = [374, 562, 648, 81];
      const operators = ['divide', 'divide', 'divide'];

      // Check each division step
      let current = numbers[0];
      let allIntegerResults = true;

      for (let i = 0; i < operators.length; i++) {
        if (operators[i] === 'divide') {
          const nextNum = numbers[i + 1];
          
          // Check if current is divisible by next number
          const isDivisible = validateDivision(current, nextNum);
          
          if (!isDivisible) {
            allIntegerResults = false;
            break;
          }

          current = current / nextNum;
          
          // Check if result is still integer
          if (current % 1 !== 0) {
            allIntegerResults = false;
            break;
          }
        }
      }

      // This test case should FAIL because 374 is not divisible by 562
      expect(allIntegerResults).toBe(false);
    });

    it('should detect continuous division constraint violation', () => {
      // Example: 100 ÷ 20 ÷ 3
      // 100 ÷ 20 = 5 (integer ✓)
      // 5 ÷ 3 ≈ 1.666... (not integer ✗)
      const numbers = [100, 20, 3];
      const operators = ['divide', 'divide'];

      let current = numbers[0];
      let allIntegerResults = true;

      for (let i = 0; i < operators.length; i++) {
        if (operators[i] === 'divide') {
          const nextNum = numbers[i + 1];
          
          if (!validateDivision(current, nextNum) || current % 1 !== 0) {
            allIntegerResults = false;
            break;
          }

          current = current / nextNum;
        }
      }

      expect(allIntegerResults).toBe(false);
    });

    it('should pass continuous division with all integers', () => {
      // Example: 1000 ÷ 10 ÷ 5 ÷ 2
      // 1000 ÷ 10 = 100 (integer ✓)
      // 100 ÷ 5 = 20 (integer ✓)
      // 20 ÷ 2 = 10 (integer ✓)
      const numbers = [1000, 10, 5, 2];
      const operators = ['divide', 'divide', 'divide'];

      let current = numbers[0];
      let allIntegerResults = true;

      for (let i = 0; i < operators.length; i++) {
        if (operators[i] === 'divide') {
          const nextNum = numbers[i + 1];
          
          if (!validateDivision(current, nextNum) || current % 1 !== 0) {
            allIntegerResults = false;
            break;
          }

          current = current / nextNum;
        }
      }

      expect(allIntegerResults).toBe(true);
      expect(current).toBe(10);
    });
  });
});
