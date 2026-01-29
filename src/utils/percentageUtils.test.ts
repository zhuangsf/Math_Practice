// Unit tests for percentage utilities
// modify by jx: implement unit tests for percentage calculation functions

import { describe, it, expect } from 'vitest';
import {
  decimalToPercent,
  percentToDecimal,
  fractionToPercent,
  percentToFraction,
  findPart,
  findTotal,
  findPercent,
  formatPercent,
  parsePercentAnswer,
  validatePercentAnswer
} from './percentageUtils';

describe('percentageUtils', () => {
  describe('decimalToPercent', () => {
    it('should convert decimal to percentage correctly', () => {
      expect(decimalToPercent(0.75)).toBe('75%');
      expect(decimalToPercent(0.5)).toBe('50%');
      expect(decimalToPercent(0.25)).toBe('25%');
      expect(decimalToPercent(1)).toBe('100%');
      expect(decimalToPercent(0)).toBe('0%');
    });

    it('should handle decimal with multiple decimal places', () => {
      expect(decimalToPercent(0.333)).toBe('33%');
      expect(decimalToPercent(0.666)).toBe('67%');
      expect(decimalToPercent(0.999)).toBe('100%');
    });

    it('should handle values greater than 1', () => {
      expect(decimalToPercent(1.5)).toBe('150%');
      expect(decimalToPercent(2)).toBe('200%');
    });

    it('should handle small decimal values', () => {
      expect(decimalToPercent(0.01)).toBe('1%');
      expect(decimalToPercent(0.001)).toBe('0%');
    });
  });

  describe('percentToDecimal', () => {
    it('should convert percentage string to decimal', () => {
      expect(percentToDecimal('75%')).toBe(0.75);
      expect(percentToDecimal('50%')).toBe(0.5);
      expect(percentToDecimal('25%')).toBe(0.25);
      expect(percentToDecimal('100%')).toBe(1);
      expect(percentToDecimal('0%')).toBe(0);
    });

    it('should convert percentage number to decimal', () => {
      expect(percentToDecimal(75)).toBe(0.75);
      expect(percentToDecimal(50)).toBe(0.5);
      expect(percentToDecimal(100)).toBe(1);
      expect(percentToDecimal(0)).toBe(0);
    });

    it('should handle percentage with spaces', () => {
      expect(percentToDecimal(' 75% ')).toBe(0.75);
      expect(percentToDecimal(' 50 % ')).toBe(0.5);
    });

    it('should throw error for invalid format', () => {
      expect(() => percentToDecimal('invalid')).toThrow('Invalid percentage format');
      expect(() => percentToDecimal('')).toThrow('Invalid percentage format');
    });
  });

  describe('fractionToPercent', () => {
    it('should convert fraction to percentage correctly', () => {
      expect(fractionToPercent(3, 4)).toBe('75%');
      expect(fractionToPercent(1, 2)).toBe('50%');
      expect(fractionToPercent(1, 4)).toBe('25%');
      expect(fractionToPercent(1, 1)).toBe('100%');
      expect(fractionToPercent(0, 1)).toBe('0%');
    });

    it('should handle fractions that result in decimal percentages', () => {
      expect(fractionToPercent(1, 3)).toBe('33%');
      expect(fractionToPercent(2, 3)).toBe('67%');
    });

    it('should throw error for zero denominator', () => {
      expect(() => fractionToPercent(1, 0)).toThrow('Denominator cannot be zero');
    });
  });

  describe('percentToFraction', () => {
    it('should convert percentage to simplified fraction', () => {
      const result1 = percentToFraction(75);
      expect(result1.numerator).toBe(3);
      expect(result1.denominator).toBe(4);

      const result2 = percentToFraction(50);
      expect(result2.numerator).toBe(1);
      expect(result2.denominator).toBe(2);

      const result3 = percentToFraction(25);
      expect(result3.numerator).toBe(1);
      expect(result3.denominator).toBe(4);
    });

    it('should handle 0%', () => {
      const result = percentToFraction(0);
      expect(result.numerator).toBe(0);
      expect(result.denominator).toBe(1);
    });

    it('should handle 100%', () => {
      const result = percentToFraction(100);
      expect(result.numerator).toBe(1);
      expect(result.denominator).toBe(1);
    });

    it('should handle percentage string', () => {
      const result = percentToFraction('75%');
      expect(result.numerator).toBe(3);
      expect(result.denominator).toBe(4);
    });

    it('should handle percentages that result in complex fractions', () => {
      const result = percentToFraction(33);
      expect(result.numerator).toBe(33);
      expect(result.denominator).toBe(100);
    });
  });

  describe('findPart', () => {
    it('should calculate part value correctly', () => {
      expect(findPart(25, 100)).toBe(25);
      expect(findPart(50, 200)).toBe(100);
      expect(findPart(10, 50)).toBe(5);
      expect(findPart(100, 100)).toBe(100);
      expect(findPart(0, 100)).toBe(0);
    });

    it('should handle decimal results', () => {
      expect(findPart(33, 100)).toBe(33);
      expect(findPart(30, 200)).toBe(60);
    });
  });

  describe('findTotal', () => {
    it('should calculate total value correctly', () => {
      expect(findTotal(25, 25)).toBe(100);
      expect(findTotal(50, 50)).toBe(100);
      expect(findTotal(10, 20)).toBe(50);
      expect(findTotal(100, 100)).toBe(100);
    });

    it('should throw error for zero percentage', () => {
      expect(() => findTotal(25, 0)).toThrow('Percentage cannot be zero');
    });

    it('should handle decimal results', () => {
      expect(findTotal(33, 25)).toBe(132);
    });
  });

  describe('findPercent', () => {
    it('should calculate percentage correctly', () => {
      expect(findPercent(25, 100)).toBe(25);
      expect(findPercent(50, 100)).toBe(50);
      expect(findPercent(1, 4)).toBe(25);
      expect(findPercent(0, 100)).toBe(0);
      expect(findPercent(100, 100)).toBe(100);
    });

    it('should throw error for zero total', () => {
      expect(() => findPercent(25, 0)).toThrow('Total cannot be zero');
    });

    it('should handle decimal percentages', () => {
      expect(findPercent(1, 3)).toBeCloseTo(33.333, 2);
    });
  });

  describe('formatPercent', () => {
    it('should format percentage without decimal places', () => {
      expect(formatPercent(75)).toBe('75%');
      expect(formatPercent(50)).toBe('50%');
      expect(formatPercent(100)).toBe('100%');
    });

    it('should format percentage with decimal places', () => {
      expect(formatPercent(33.333, 1)).toBe('33.3%');
      expect(formatPercent(66.667, 2)).toBe('66.67%');
      expect(formatPercent(25.5, 1)).toBe('25.5%');
    });

    it('should handle zero percentage', () => {
      expect(formatPercent(0)).toBe('0%');
    });
  });

  describe('parsePercentAnswer', () => {
    it('should parse percentage with % sign', () => {
      expect(parsePercentAnswer('75%')).toBe(75);
      expect(parsePercentAnswer('50%')).toBe(50);
      expect(parsePercentAnswer('100%')).toBe(100);
    });

    it('should parse percentage number without %', () => {
      expect(parsePercentAnswer('75')).toBe(75);
      expect(parsePercentAnswer('50')).toBe(50);
    });

    it('should convert decimal to percentage', () => {
      expect(parsePercentAnswer('0.75')).toBe(75);
      expect(parsePercentAnswer('0.5')).toBe(50);
    });

    it('should throw error for invalid format', () => {
      expect(() => parsePercentAnswer('invalid')).toThrow('Invalid percentage format');
      expect(() => parsePercentAnswer('')).toThrow('Invalid percentage format');
    });
  });

  describe('validatePercentAnswer', () => {
    it('should return true for correct answers', () => {
      expect(validatePercentAnswer('75%', '75%')).toBe(true);
      expect(validatePercentAnswer('75', 75)).toBe(true);
      expect(validatePercentAnswer(75, '75%')).toBe(true);
      expect(validatePercentAnswer(0.75, '75%')).toBe(true);
    });

    it('should return false for incorrect answers', () => {
      expect(validatePercentAnswer('50%', '75%')).toBe(false);
      expect(validatePercentAnswer(50, 75)).toBe(false);
    });

    it('should handle tolerance for close answers', () => {
      // modify by jx: use tolerance of 0.011 to account for floating point precision
      expect(validatePercentAnswer('75.01%', '75%', 0.011)).toBe(true);
      expect(validatePercentAnswer('75.02%', '75%', 0.011)).toBe(false);
    });

    it('should handle decimal answers', () => {
      expect(validatePercentAnswer('0.75', '75%')).toBe(true);
      expect(validatePercentAnswer(0.75, '75%')).toBe(true);
    });
  });
});
