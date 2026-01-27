// Unit tests for decimal utilities
// modify by jx: implement unit tests for decimal calculation functions

import { describe, it, expect } from 'vitest';
import {
  roundToDecimalPlaces,
  formatDecimal,
  parseDecimal,
  decimalsEqual,
  addDecimals,
  subtractDecimals,
  multiplyDecimals,
  divideDecimals,
  generateRandomDecimal,
  calculateDecimalExpression,
  validateDecimalAnswer
} from './decimalUtils';

describe('decimalUtils', () => {
  describe('roundToDecimalPlaces', () => {
    it('should round to specified decimal places', () => {
      expect(roundToDecimalPlaces(3.14159, 2)).toBe(3.14);
      expect(roundToDecimalPlaces(3.145, 2)).toBe(3.15);
      expect(roundToDecimalPlaces(3.1, 2)).toBe(3.1);
    });

    it('should handle zero decimal places', () => {
      expect(roundToDecimalPlaces(3.6, 0)).toBe(4);
      expect(roundToDecimalPlaces(3.4, 0)).toBe(3);
    });

    it('should handle negative numbers', () => {
      // modify by jx: Math.round rounds towards zero for negative numbers, so -3.145 rounds to -3.14
      expect(roundToDecimalPlaces(-3.145, 2)).toBe(-3.14);
      expect(roundToDecimalPlaces(-3.146, 2)).toBe(-3.15);
    });
  });

  describe('formatDecimal', () => {
    it('should format decimal with specified places', () => {
      // modify by jx: formatDecimal now always shows specified precision including trailing zeros
      expect(formatDecimal(3.14, 2)).toBe('3.14');
      expect(formatDecimal(3.1, 2)).toBe('3.10');
      expect(formatDecimal(3.0, 2)).toBe('3.00');
      expect(formatDecimal(3.14159, 3)).toBe('3.142');
      expect(formatDecimal(3.1, 3)).toBe('3.100');
    });

    it('should always show specified precision including trailing zeros', () => {
      // modify by jx: formatDecimal now always shows specified precision for answer display
      expect(formatDecimal(3.50, 2)).toBe('3.50');
      expect(formatDecimal(3.00, 2)).toBe('3.00');
      expect(formatDecimal(5, 3)).toBe('5.000');
      expect(formatDecimal(1.2, 3)).toBe('1.200');
    });
  });

  describe('parseDecimal', () => {
    it('should parse decimal string', () => {
      expect(parseDecimal('3.14')).toBe(3.14);
      expect(parseDecimal('3')).toBe(3);
      expect(parseDecimal('0.5')).toBe(0.5);
      expect(parseDecimal('.5')).toBe(0.5);
    });

    it('should throw error for invalid format', () => {
      expect(() => parseDecimal('invalid')).toThrow();
      expect(() => parseDecimal('')).toThrow();
    });
  });

  describe('decimalsEqual', () => {
    it('should return true for equal decimals within tolerance', () => {
      expect(decimalsEqual(3.14, 3.141, 0.01)).toBe(true);
      expect(decimalsEqual(3.14, 3.15, 0.02)).toBe(true);
    });

    it('should return false for different decimals', () => {
      expect(decimalsEqual(3.14, 3.16, 0.01)).toBe(false);
    });

    it('should use default tolerance', () => {
      expect(decimalsEqual(3.14, 3.1401, 0.0001)).toBe(true);
    });
  });

  describe('addDecimals', () => {
    it('should add decimals with precision', () => {
      expect(addDecimals(3.14, 2.17, 2)).toBe(5.31);
      expect(addDecimals(0.1, 0.2, 1)).toBe(0.3);
    });

    it('should round result to specified places', () => {
      expect(addDecimals(3.141, 2.172, 2)).toBe(5.31);
    });
  });

  describe('subtractDecimals', () => {
    it('should subtract decimals with precision', () => {
      expect(subtractDecimals(5.31, 2.17, 2)).toBe(3.14);
      expect(subtractDecimals(3.0, 1.5, 1)).toBe(1.5);
    });
  });

  describe('multiplyDecimals', () => {
    it('should multiply decimals with precision', () => {
      expect(multiplyDecimals(2.5, 3.4, 2)).toBe(8.5);
      expect(multiplyDecimals(0.5, 0.5, 2)).toBe(0.25);
    });

    it('should round result to specified places', () => {
      // modify by jx: 2.555 * 3.444 = 8.79942, rounded to 2 decimal places is 8.80
      expect(multiplyDecimals(2.555, 3.444, 2)).toBe(8.8);
      // modify by jx: 2.556 * 3.444 = 8.802864, rounded to 2 decimal places is 8.80
      expect(multiplyDecimals(2.556, 3.444, 2)).toBe(8.8);
      expect(multiplyDecimals(2.56, 3.45, 2)).toBe(8.83);
    });
  });

  describe('divideDecimals', () => {
    it('should divide decimals with precision', () => {
      expect(divideDecimals(6.3, 2.1, 1)).toBe(3.0);
      expect(divideDecimals(5.0, 2.0, 2)).toBe(2.5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divideDecimals(5, 0, 2)).toThrow('Cannot divide by zero');
    });
  });

  describe('generateRandomDecimal', () => {
    it('should generate decimal within range', () => {
      const decimal = generateRandomDecimal(0.1, 10.0, 2);
      expect(decimal).toBeGreaterThanOrEqual(0.1);
      expect(decimal).toBeLessThanOrEqual(10.0);
    });

    it('should round to specified decimal places', () => {
      const decimal = generateRandomDecimal(0.1, 10.0, 1);
      const decimalStr = decimal.toString();
      const decimalPart = decimalStr.split('.')[1];
      if (decimalPart) {
        expect(decimalPart.length).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('calculateDecimalExpression', () => {
    it('should calculate simple addition', () => {
      const result = calculateDecimalExpression([3.14, 2.17], ['add'], 2);
      expect(result).toBe(5.31);
    });

    it('should calculate expression with multiplication first', () => {
      const result = calculateDecimalExpression([3.0, 2.0, 1.5], ['add', 'multiply'], 2);
      // Should be: 3 + (2 * 1.5) = 3 + 3 = 6
      expect(result).toBe(6.0);
    });

    it('should calculate expression with division first', () => {
      const result = calculateDecimalExpression([10.0, 2.0, 3.0], ['add', 'divide'], 2);
      // Should be: 10 + (2 / 3) = 10 + 0.67 = 10.67
      expect(result).toBeCloseTo(10.67, 1);
    });

    it('should handle multiple operations', () => {
      const result = calculateDecimalExpression([3.0, 2.0, 1.5, 0.5], ['add', 'multiply', 'subtract'], 2);
      // Should be: 3 + (2 * 1.5) - 0.5 = 3 + 3 - 0.5 = 5.5
      expect(result).toBe(5.5);
    });

    it('should throw error for invalid expression', () => {
      expect(() => calculateDecimalExpression([], ['add'], 2)).toThrow();
      expect(() => calculateDecimalExpression([3.14], [], 2)).toThrow();
    });
  });

  describe('validateDecimalAnswer', () => {
    it('should return true for correct answer within tolerance', () => {
      expect(validateDecimalAnswer(3.14, 3.141, 0.01)).toBe(true);
      expect(validateDecimalAnswer(3.14, 3.15, 0.02)).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      expect(validateDecimalAnswer(3.14, 3.16, 0.01)).toBe(false);
    });

    it('should use default tolerance', () => {
      expect(validateDecimalAnswer(3.14, 3.141, 0.01)).toBe(true);
    });
  });
});
