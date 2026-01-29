// Unit tests for pattern utilities
// modify by jx: implement unit tests for pattern generation and calculation functions

import { describe, it, expect } from 'vitest';
import {
  generateArithmeticSequence,
  generateGeometricSequence,
  generateFibonacciSequence,
  generateSquareSequence,
  generateCubeSequence,
  calculateNextTerm,
  formatSequence,
  validatePatternAnswer,
  generateArithmeticParams,
  generateGeometricParams,
  getPatternTypeDisplayName
} from './patternUtils';

describe('patternUtils', () => {
  describe('generateArithmeticSequence', () => {
    it('should generate arithmetic sequence correctly', () => {
      expect(generateArithmeticSequence(1, 2, 5)).toEqual([1, 3, 5, 7, 9]);
      expect(generateArithmeticSequence(5, 3, 4)).toEqual([5, 8, 11, 14]);
      expect(generateArithmeticSequence(10, 1, 3)).toEqual([10, 11, 12]);
    });

    it('should handle negative difference', () => {
      expect(generateArithmeticSequence(10, -2, 4)).toEqual([10, 8, 6, 4]);
    });

    it('should handle zero difference', () => {
      expect(generateArithmeticSequence(5, 0, 3)).toEqual([5, 5, 5]);
    });
  });

  describe('generateGeometricSequence', () => {
    it('should generate geometric sequence correctly', () => {
      expect(generateGeometricSequence(1, 2, 5)).toEqual([1, 2, 4, 8, 16]);
      expect(generateGeometricSequence(3, 3, 4)).toEqual([3, 9, 27, 81]);
      expect(generateGeometricSequence(2, 4, 3)).toEqual([2, 8, 32]);
    });

    it('should handle fractional ratio', () => {
      const sequence = generateGeometricSequence(8, 0.5, 4);
      expect(sequence[0]).toBe(8);
      expect(sequence[1]).toBe(4);
      expect(sequence[2]).toBe(2);
      expect(sequence[3]).toBe(1);
    });
  });

  describe('generateFibonacciSequence', () => {
    it('should generate Fibonacci sequence correctly', () => {
      expect(generateFibonacciSequence(8)).toEqual([1, 1, 2, 3, 5, 8, 13, 21]);
      expect(generateFibonacciSequence(5, [0, 1])).toEqual([0, 1, 1, 2, 3]);
      expect(generateFibonacciSequence(6, [2, 3])).toEqual([2, 3, 5, 8, 13, 21]);
    });

    it('should handle different start values', () => {
      expect(generateFibonacciSequence(5, [1, 2])).toEqual([1, 2, 3, 5, 8]);
      expect(generateFibonacciSequence(4, [3, 5])).toEqual([3, 5, 8, 13]);
    });
  });

  describe('generateSquareSequence', () => {
    it('should generate square sequence correctly', () => {
      expect(generateSquareSequence(1, 5)).toEqual([1, 4, 9, 16, 25]);
      expect(generateSquareSequence(2, 4)).toEqual([4, 9, 16, 25]);
      expect(generateSquareSequence(5, 3)).toEqual([25, 36, 49]);
    });

    it('should generate consecutive squares', () => {
      const seq = generateSquareSequence(10, 3);
      expect(seq[0]).toBe(100);
      expect(seq[1]).toBe(121);
      expect(seq[2]).toBe(144);
    });
  });

  describe('generateCubeSequence', () => {
    it('should generate cube sequence correctly', () => {
      expect(generateCubeSequence(1, 4)).toEqual([1, 8, 27, 64]);
      expect(generateCubeSequence(2, 3)).toEqual([8, 27, 64]);
      expect(generateCubeSequence(3, 3)).toEqual([27, 64, 125]);
    });
  });

  describe('calculateNextTerm', () => {
    it('should calculate next term for arithmetic sequence', () => {
      expect(calculateNextTerm([1, 3, 5, 7], 'arithmetic')).toBe(9);
      expect(calculateNextTerm([2, 5, 8, 11], 'arithmetic')).toBe(14);
    });

    it('should calculate next term for geometric sequence', () => {
      expect(calculateNextTerm([2, 4, 8, 16], 'geometric')).toBe(32);
      expect(calculateNextTerm([3, 9, 27], 'geometric')).toBe(81);
    });

    it('should calculate next term for Fibonacci sequence', () => {
      expect(calculateNextTerm([1, 1, 2, 3, 5, 8], 'fibonacci')).toBe(13);
      expect(calculateNextTerm([0, 1, 1, 2, 3], 'fibonacci')).toBe(5);
    });

    it('should calculate next term for square sequence', () => {
      expect(calculateNextTerm([1, 4, 9, 16], 'square')).toBe(25);
      expect(calculateNextTerm([4, 9, 16, 25], 'square')).toBe(36);
    });

    it('should calculate next term for cube sequence', () => {
      expect(calculateNextTerm([1, 8, 27, 64], 'cube')).toBe(125);
      expect(calculateNextTerm([8, 27, 64], 'cube')).toBe(125);
    });
  });

  describe('formatSequence', () => {
    it('should format sequence with missing term', () => {
      expect(formatSequence([1, 3, 5, 7, 9], 2)).toBe('1, 3, ?, 7, 9');
      expect(formatSequence([2, 4, 6, 8, 10], 0)).toBe('?, 4, 6, 8, 10');
      expect(formatSequence([1, 2, 3, 4, 5], 4)).toBe('1, 2, 3, 4, ?');
    });

    it('should format complete sequence', () => {
      expect(formatSequence([1, 2, 3, 4, 5])).toBe('1, 2, 3, 4, 5');
    });
  });

  describe('validatePatternAnswer', () => {
    it('should validate correct answers', () => {
      expect(validatePatternAnswer('9', 9)).toBe(true);
      expect(validatePatternAnswer(' 9 ', 9)).toBe(true);
      expect(validatePatternAnswer('25', 25)).toBe(true);
    });

    it('should reject incorrect answers', () => {
      expect(validatePatternAnswer('8', 9)).toBe(false);
      expect(validatePatternAnswer('10', 9)).toBe(false);
      expect(validatePatternAnswer('abc', 9)).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(validatePatternAnswer(' 25 ', 25)).toBe(true);
      expect(validatePatternAnswer('\t16\t', 16)).toBe(true);
    });
  });

  describe('generateArithmeticParams', () => {
    it('should generate valid parameters', () => {
      const params = generateArithmeticParams(1, 100);
      expect(params.start).toBeGreaterThanOrEqual(1);
      expect(params.start).toBeLessThanOrEqual(100);
      expect(params.diff).toBeGreaterThanOrEqual(1);
      expect(params.diff).toBeLessThanOrEqual(5);
    });
  });

  describe('generateGeometricParams', () => {
    it('should generate valid parameters', () => {
      const params = generateGeometricParams(1000);
      expect(params.start).toBeGreaterThanOrEqual(1);
      expect(params.start).toBeLessThanOrEqual(3);
      expect(params.ratio).toBeGreaterThanOrEqual(2);
      expect(params.ratio).toBeLessThanOrEqual(4);
    });
  });

  describe('getPatternTypeDisplayName', () => {
    it('should return correct display names', () => {
      expect(getPatternTypeDisplayName('arithmetic')).toBe('等差数列');
      expect(getPatternTypeDisplayName('geometric')).toBe('等比数列');
      expect(getPatternTypeDisplayName('fibonacci')).toBe('斐波那契数列');
      expect(getPatternTypeDisplayName('square')).toBe('平方数列');
      expect(getPatternTypeDisplayName('cube')).toBe('立方数列');
    });

    it('should return original type for unknown pattern', () => {
      expect(getPatternTypeDisplayName('unknown')).toBe('unknown');
    });
  });
});
