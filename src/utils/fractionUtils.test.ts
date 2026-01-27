// Unit tests for fraction utilities
// modify by jx: implement unit tests for fraction calculation functions

import { describe, it, expect } from 'vitest';
import {
  gcd,
  lcm,
  simplifyFraction,
  fractionToString,
  parseFraction,
  fractionsEqual,
  addFractions,
  subtractFractions,
  multiplyFractions,
  divideFractions,
  calculateFractionOperation,
  integerToFraction,
  fractionToDecimal,
  generateRandomFraction
} from './fractionUtils';
import type { Fraction } from '@/types';

describe('fractionUtils', () => {
  describe('gcd', () => {
    it('should calculate GCD of two positive numbers', () => {
      expect(gcd(12, 18)).toBe(6);
      expect(gcd(48, 18)).toBe(6);
      expect(gcd(17, 13)).toBe(1);
    });

    it('should handle negative numbers', () => {
      expect(gcd(-12, 18)).toBe(6);
      expect(gcd(12, -18)).toBe(6);
      expect(gcd(-12, -18)).toBe(6);
    });

    it('should handle zero', () => {
      expect(gcd(0, 5)).toBe(5);
      expect(gcd(5, 0)).toBe(5);
    });
  });

  describe('lcm', () => {
    it('should calculate LCM of two positive numbers', () => {
      expect(lcm(12, 18)).toBe(36);
      expect(lcm(4, 6)).toBe(12);
      expect(lcm(5, 7)).toBe(35);
    });

    it('should handle negative numbers', () => {
      expect(lcm(-12, 18)).toBe(36);
      expect(lcm(12, -18)).toBe(36);
    });
  });

  describe('simplifyFraction', () => {
    it('should simplify fractions to lowest terms', () => {
      expect(simplifyFraction({ numerator: 6, denominator: 8 })).toEqual({ numerator: 3, denominator: 4 });
      expect(simplifyFraction({ numerator: 12, denominator: 18 })).toEqual({ numerator: 2, denominator: 3 });
      expect(simplifyFraction({ numerator: 5, denominator: 7 })).toEqual({ numerator: 5, denominator: 7 });
    });

    it('should handle negative fractions', () => {
      expect(simplifyFraction({ numerator: -6, denominator: 8 })).toEqual({ numerator: -3, denominator: 4 });
      expect(simplifyFraction({ numerator: 6, denominator: -8 })).toEqual({ numerator: -3, denominator: 4 });
    });

    it('should throw error for zero denominator', () => {
      expect(() => simplifyFraction({ numerator: 5, denominator: 0 })).toThrow('Denominator cannot be zero');
    });
  });

  describe('fractionToString', () => {
    it('should convert fraction to string', () => {
      expect(fractionToString({ numerator: 3, denominator: 4 })).toBe('3/4');
      expect(fractionToString({ numerator: 5, denominator: 1 })).toBe('5');
      expect(fractionToString({ numerator: 6, denominator: 8 })).toBe('3/4');
    });

    it('should convert to mixed number when requested', () => {
      expect(fractionToString({ numerator: 7, denominator: 4 }, true)).toBe('1 3/4');
      expect(fractionToString({ numerator: 5, denominator: 2 }, true)).toBe('2 1/2');
      expect(fractionToString({ numerator: 8, denominator: 4 }, true)).toBe('2');
    });

    it('should handle negative fractions', () => {
      expect(fractionToString({ numerator: -3, denominator: 4 })).toBe('-3/4');
      expect(fractionToString({ numerator: -7, denominator: 4 }, true)).toBe('-1 3/4');
    });
  });

  describe('parseFraction', () => {
    it('should parse simple fraction string', () => {
      expect(parseFraction('3/4')).toEqual({ numerator: 3, denominator: 4 });
      expect(parseFraction('5/2')).toEqual({ numerator: 5, denominator: 2 });
    });

    it('should parse mixed number string', () => {
      expect(parseFraction('1 1/2')).toEqual({ numerator: 3, denominator: 2 });
      expect(parseFraction('2 3/4')).toEqual({ numerator: 11, denominator: 4 });
    });

    it('should parse integer string', () => {
      expect(parseFraction('5')).toEqual({ numerator: 5, denominator: 1 });
      expect(parseFraction('10')).toEqual({ numerator: 10, denominator: 1 });
    });

    it('should handle negative fractions', () => {
      expect(parseFraction('-3/4')).toEqual({ numerator: -3, denominator: 4 });
      expect(parseFraction('-1 1/2')).toEqual({ numerator: -3, denominator: 2 });
    });

    it('should throw error for invalid format', () => {
      expect(() => parseFraction('invalid')).toThrow();
      expect(() => parseFraction('3/0')).toThrow('Denominator cannot be zero');
    });
  });

  describe('fractionsEqual', () => {
    it('should return true for equal fractions', () => {
      expect(fractionsEqual({ numerator: 3, denominator: 4 }, { numerator: 6, denominator: 8 })).toBe(true);
      expect(fractionsEqual({ numerator: 1, denominator: 2 }, { numerator: 2, denominator: 4 })).toBe(true);
    });

    it('should return false for different fractions', () => {
      expect(fractionsEqual({ numerator: 3, denominator: 4 }, { numerator: 1, denominator: 2 })).toBe(false);
      expect(fractionsEqual({ numerator: 5, denominator: 6 }, { numerator: 7, denominator: 8 })).toBe(false);
    });
  });

  describe('addFractions', () => {
    it('should add fractions with same denominator', () => {
      const result = addFractions({ numerator: 3, denominator: 5 }, { numerator: 2, denominator: 5 });
      expect(result).toEqual({ numerator: 1, denominator: 1 });
    });

    it('should add fractions with different denominators', () => {
      const result = addFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 });
      expect(result).toEqual({ numerator: 5, denominator: 6 });
    });

    it('should simplify result', () => {
      const result = addFractions({ numerator: 1, denominator: 4 }, { numerator: 1, denominator: 4 });
      expect(result).toEqual({ numerator: 1, denominator: 2 });
    });
  });

  describe('subtractFractions', () => {
    it('should subtract fractions with same denominator', () => {
      const result = subtractFractions({ numerator: 5, denominator: 6 }, { numerator: 2, denominator: 6 });
      expect(result).toEqual({ numerator: 1, denominator: 2 });
    });

    it('should subtract fractions with different denominators', () => {
      const result = subtractFractions({ numerator: 3, denominator: 4 }, { numerator: 1, denominator: 3 });
      expect(result).toEqual({ numerator: 5, denominator: 12 });
    });
  });

  describe('multiplyFractions', () => {
    it('should multiply fractions', () => {
      const result = multiplyFractions({ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 4 });
      expect(result).toEqual({ numerator: 1, denominator: 2 });
    });

    it('should simplify result', () => {
      const result = multiplyFractions({ numerator: 4, denominator: 5 }, { numerator: 5, denominator: 8 });
      expect(result).toEqual({ numerator: 1, denominator: 2 });
    });
  });

  describe('divideFractions', () => {
    it('should divide fractions', () => {
      const result = divideFractions({ numerator: 2, denominator: 3 }, { numerator: 1, denominator: 4 });
      expect(result).toEqual({ numerator: 8, denominator: 3 });
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divideFractions({ numerator: 2, denominator: 3 }, { numerator: 0, denominator: 1 })).toThrow('Cannot divide by zero');
    });
  });

  describe('calculateFractionOperation', () => {
    it('should perform addition', () => {
      const result = calculateFractionOperation(
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 3 },
        'add'
      );
      expect(result).toEqual({ numerator: 5, denominator: 6 });
    });

    it('should perform subtraction', () => {
      const result = calculateFractionOperation(
        { numerator: 3, denominator: 4 },
        { numerator: 1, denominator: 4 },
        'subtract'
      );
      expect(result).toEqual({ numerator: 1, denominator: 2 });
    });

    it('should perform multiplication', () => {
      const result = calculateFractionOperation(
        { numerator: 2, denominator: 3 },
        { numerator: 3, denominator: 4 },
        'multiply'
      );
      expect(result).toEqual({ numerator: 1, denominator: 2 });
    });

    it('should perform division', () => {
      const result = calculateFractionOperation(
        { numerator: 2, denominator: 3 },
        { numerator: 1, denominator: 4 },
        'divide'
      );
      expect(result).toEqual({ numerator: 8, denominator: 3 });
    });
  });

  describe('integerToFraction', () => {
    it('should convert integer to fraction', () => {
      expect(integerToFraction(5)).toEqual({ numerator: 5, denominator: 1 });
      expect(integerToFraction(0)).toEqual({ numerator: 0, denominator: 1 });
      expect(integerToFraction(-3)).toEqual({ numerator: -3, denominator: 1 });
    });
  });

  describe('fractionToDecimal', () => {
    it('should convert fraction to decimal', () => {
      expect(fractionToDecimal({ numerator: 1, denominator: 2 })).toBe(0.5);
      expect(fractionToDecimal({ numerator: 3, denominator: 4 })).toBe(0.75);
      expect(fractionToDecimal({ numerator: 5, denominator: 1 })).toBe(5);
    });
  });

  describe('generateRandomFraction', () => {
    it('should generate fraction within specified ranges', () => {
      const fraction = generateRandomFraction([1, 10], [2, 10]);
      expect(fraction.numerator).toBeGreaterThanOrEqual(1);
      expect(fraction.numerator).toBeLessThanOrEqual(10);
      expect(fraction.denominator).toBeGreaterThanOrEqual(2);
      expect(fraction.denominator).toBeLessThanOrEqual(10);
      expect(fraction.denominator).not.toBe(0);
    });

    it('should return simplified fraction', () => {
      const fraction = generateRandomFraction([1, 10], [2, 10]);
      const simplified = simplifyFraction(fraction);
      expect(fraction.numerator).toBe(simplified.numerator);
      expect(fraction.denominator).toBe(simplified.denominator);
    });
  });
});
