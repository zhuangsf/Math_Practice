// Unit tests for comparison utilities
// modify by jx: implement unit tests for comparison calculation functions

import { describe, it, expect } from 'vitest';
import {
  compareIntegers,
  compareDecimals,
  compareFractions,
  formatComparisonResult,
  generateRandomIntegers,
  generateRandomDecimals,
  generateRandomFractions,
  validateComparisonAnswer,
  formatFraction
} from './comparisonUtils';

describe('comparisonUtils', () => {
  describe('compareIntegers', () => {
    it('should return -1 when first number is less', () => {
      expect(compareIntegers(3, 5)).toBe(-1);
      expect(compareIntegers(0, 1)).toBe(-1);
      expect(compareIntegers(-5, -3)).toBe(-1);
    });

    it('should return 0 when numbers are equal', () => {
      expect(compareIntegers(5, 5)).toBe(0);
      expect(compareIntegers(0, 0)).toBe(0);
      expect(compareIntegers(-3, -3)).toBe(0);
    });

    it('should return 1 when first number is greater', () => {
      expect(compareIntegers(7, 3)).toBe(1);
      expect(compareIntegers(1, 0)).toBe(1);
      expect(compareIntegers(-3, -5)).toBe(1);
    });
  });

  describe('compareDecimals', () => {
    it('should compare decimals correctly with default precision', () => {
      expect(compareDecimals(3.14, 3.15)).toBe(-1);
      expect(compareDecimals(3.14, 3.14)).toBe(0);
      expect(compareDecimals(3.15, 3.14)).toBe(1);
    });

    it('should handle different precision levels', () => {
      expect(compareDecimals(3.1, 3.2, 1)).toBe(-1);
      expect(compareDecimals(3.14, 3.15, 2)).toBe(-1);
      expect(compareDecimals(3.141, 3.142, 3)).toBe(-1);
    });

    it('should round to specified precision', () => {
      // When both numbers round to the same value, they are considered equal
      expect(compareDecimals(3.14159, 3.142, 2)).toBe(0);
      // 3.149 rounds to 3.15, 3.142 rounds to 3.14, so 3.149 > 3.142
      expect(compareDecimals(3.149, 3.142, 2)).toBe(1);
      // 3.141 rounds to 3.14, 3.149 rounds to 3.15, so 3.141 < 3.149
      expect(compareDecimals(3.141, 3.149, 2)).toBe(-1);
    });

    it('should handle negative decimals', () => {
      expect(compareDecimals(-3.14, -3.15)).toBe(1);
      expect(compareDecimals(-3.15, -3.14)).toBe(-1);
      expect(compareDecimals(-3.14, -3.14)).toBe(0);
    });
  });

  describe('compareFractions', () => {
    it('should compare fractions correctly', () => {
      // 1/2 vs 1/3 = 3/6 vs 2/6
      expect(compareFractions(1, 2, 1, 3)).toBe(1);
      // 1/3 vs 1/2 = 2/6 vs 3/6
      expect(compareFractions(1, 3, 1, 2)).toBe(-1);
      // 1/2 vs 2/4 = 4/8 vs 4/8
      expect(compareFractions(1, 2, 2, 4)).toBe(0);
    });

    it('should handle larger denominators', () => {
      // 3/8 vs 5/12 = 36/96 vs 40/96
      expect(compareFractions(3, 8, 5, 12)).toBe(-1);
      // 7/12 vs 5/8 = 56/96 vs 60/96
      expect(compareFractions(7, 12, 5, 8)).toBe(-1);
    });

    it('should handle negative fractions', () => {
      expect(compareFractions(-1, 2, 1, 3)).toBe(-1);
      expect(compareFractions(1, 2, -1, 3)).toBe(1);
    });

    it('should handle equal fractions', () => {
      expect(compareFractions(2, 4, 3, 6)).toBe(0);
      expect(compareFractions(5, 10, 1, 2)).toBe(0);
    });
  });

  describe('formatComparisonResult', () => {
    it('should format comparison result correctly', () => {
      expect(formatComparisonResult(-1)).toBe('<');
      expect(formatComparisonResult(0)).toBe('=');
      expect(formatComparisonResult(1)).toBe('>');
    });
  });

  describe('generateRandomIntegers', () => {
    it('should generate integers within range', () => {
      const [a, b] = generateRandomIntegers(1, 100);
      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThanOrEqual(100);
      expect(b).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThanOrEqual(100);
    });

    it('should return integers', () => {
      const [a, b] = generateRandomIntegers(1, 100);
      expect(Number.isInteger(a)).toBe(true);
      expect(Number.isInteger(b)).toBe(true);
    });
  });

  describe('generateRandomDecimals', () => {
    it('should generate decimals within range', () => {
      const [a, b] = generateRandomDecimals(1, 100, 2);
      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThan(100);
      expect(b).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThan(100);
    });

    it('should respect decimal places', () => {
      const [a, b] = generateRandomDecimals(0, 10, 3);
      const decimalPart = a.toString().split('.')[1];
      expect(decimalPart?.length).toBeLessThanOrEqual(3);
    });
  });

  describe('generateRandomFractions', () => {
    it('should generate valid fractions', () => {
      const [[num1, den1], [num2, den2]] = generateRandomFractions(10);
      expect(den1).toBeGreaterThanOrEqual(2);
      expect(den1).toBeLessThanOrEqual(10);
      expect(num1).toBeGreaterThanOrEqual(1);
      expect(den2).toBeGreaterThanOrEqual(2);
      expect(den2).toBeLessThanOrEqual(10);
      expect(num2).toBeGreaterThanOrEqual(1);
    });

    it('should generate fractions with numerator less than or equal to denominator * 10', () => {
      const [[num1, den1], [num2, den2]] = generateRandomFractions(10);
      expect(num1).toBeLessThanOrEqual(den1 * 10);
      expect(num2).toBeLessThanOrEqual(den2 * 10);
    });
  });

  describe('validateComparisonAnswer', () => {
    it('should validate less than correctly', () => {
      expect(validateComparisonAnswer('<', -1)).toBe(true);
      expect(validateComparisonAnswer('<', 0)).toBe(false);
      expect(validateComparisonAnswer('<', 1)).toBe(false);
    });

    it('should validate equal correctly', () => {
      expect(validateComparisonAnswer('=', 0)).toBe(true);
      expect(validateComparisonAnswer('=', -1)).toBe(false);
      expect(validateComparisonAnswer('=', 1)).toBe(false);
    });

    it('should validate greater than correctly', () => {
      expect(validateComparisonAnswer('>', 1)).toBe(true);
      expect(validateComparisonAnswer('>', -1)).toBe(false);
      expect(validateComparisonAnswer('>', 0)).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(validateComparisonAnswer(' < ', -1)).toBe(true);
      expect(validateComparisonAnswer(' = ', 0)).toBe(true);
      expect(validateComparisonAnswer(' > ', 1)).toBe(true);
    });
  });

  describe('formatFraction', () => {
    it('should format fraction correctly', () => {
      expect(formatFraction(1, 2)).toBe('1/2');
      expect(formatFraction(3, 4)).toBe('3/4');
      expect(formatFraction(5, 10)).toBe('5/10');
    });

    it('should handle large numbers', () => {
      expect(formatFraction(100, 200)).toBe('100/200');
    });
  });
});
