// Unit tests for prime composite utilities
// modify by jx: implement unit tests for prime and composite number calculation functions

import { describe, it, expect } from 'vitest';
import {
  isPrime,
  isComposite,
  getPrimeFactors,
  getPrimesInRange,
  getCompositesInRange,
  validatePrimeCompositeAnswer,
  parsePrimeFactorsAnswer,
  formatPrimeFactors
} from './primeCompositeUtils';

describe('primeCompositeUtils', () => {
  describe('isPrime', () => {
    it('should return true for prime numbers', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(3)).toBe(true);
      expect(isPrime(5)).toBe(true);
      expect(isPrime(7)).toBe(true);
      expect(isPrime(11)).toBe(true);
      expect(isPrime(13)).toBe(true);
      expect(isPrime(17)).toBe(true);
      expect(isPrime(19)).toBe(true);
      expect(isPrime(23)).toBe(true);
      expect(isPrime(29)).toBe(true);
      expect(isPrime(31)).toBe(true);
      expect(isPrime(37)).toBe(true);
      expect(isPrime(41)).toBe(true);
      expect(isPrime(43)).toBe(true);
      expect(isPrime(47)).toBe(true);
      expect(isPrime(53)).toBe(true);
      expect(isPrime(59)).toBe(true);
      expect(isPrime(61)).toBe(true);
      expect(isPrime(67)).toBe(true);
      expect(isPrime(71)).toBe(true);
      expect(isPrime(73)).toBe(true);
      expect(isPrime(79)).toBe(true);
      expect(isPrime(83)).toBe(true);
      expect(isPrime(89)).toBe(true);
      expect(isPrime(97)).toBe(true);
    });

    it('should return false for composite numbers', () => {
      expect(isPrime(4)).toBe(false);
      expect(isPrime(6)).toBe(false);
      expect(isPrime(8)).toBe(false);
      expect(isPrime(9)).toBe(false);
      expect(isPrime(10)).toBe(false);
      expect(isPrime(12)).toBe(false);
      expect(isPrime(14)).toBe(false);
      expect(isPrime(15)).toBe(false);
      expect(isPrime(16)).toBe(false);
      expect(isPrime(18)).toBe(false);
      expect(isPrime(20)).toBe(false);
      expect(isPrime(21)).toBe(false);
      expect(isPrime(22)).toBe(false);
      expect(isPrime(24)).toBe(false);
      expect(isPrime(25)).toBe(false);
      expect(isPrime(26)).toBe(false);
      expect(isPrime(27)).toBe(false);
      expect(isPrime(28)).toBe(false);
      expect(isPrime(30)).toBe(false);
    });

    it('should return false for numbers less than 2', () => {
      expect(isPrime(0)).toBe(false);
      expect(isPrime(1)).toBe(false);
      expect(isPrime(-5)).toBe(false);
    });

    it('should handle even numbers correctly', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(4)).toBe(false);
      expect(isPrime(6)).toBe(false);
      expect(isPrime(8)).toBe(false);
    });
  });

  describe('isComposite', () => {
    it('should return true for composite numbers', () => {
      expect(isComposite(4)).toBe(true);
      expect(isComposite(6)).toBe(true);
      expect(isComposite(8)).toBe(true);
      expect(isComposite(9)).toBe(true);
      expect(isComposite(10)).toBe(true);
      expect(isComposite(12)).toBe(true);
      expect(isComposite(14)).toBe(true);
      expect(isComposite(15)).toBe(true);
      expect(isComposite(16)).toBe(true);
      expect(isComposite(18)).toBe(true);
      expect(isComposite(20)).toBe(true);
      expect(isComposite(21)).toBe(true);
      expect(isComposite(22)).toBe(true);
      expect(isComposite(24)).toBe(true);
      expect(isComposite(25)).toBe(true);
      expect(isComposite(26)).toBe(true);
      expect(isComposite(27)).toBe(true);
      expect(isComposite(28)).toBe(true);
      expect(isComposite(30)).toBe(true);
    });

    it('should return false for prime numbers', () => {
      expect(isComposite(2)).toBe(false);
      expect(isComposite(3)).toBe(false);
      expect(isComposite(5)).toBe(false);
      expect(isComposite(7)).toBe(false);
      expect(isComposite(11)).toBe(false);
      expect(isComposite(13)).toBe(false);
      expect(isComposite(17)).toBe(false);
      expect(isComposite(19)).toBe(false);
      expect(isComposite(23)).toBe(false);
      expect(isComposite(29)).toBe(false);
    });

    it('should return false for numbers less than 4', () => {
      expect(isComposite(0)).toBe(false);
      expect(isComposite(1)).toBe(false);
      expect(isComposite(2)).toBe(false);
      expect(isComposite(3)).toBe(false);
    });
  });

  describe('getPrimeFactors', () => {
    it('should return prime factors for composite numbers', () => {
      expect(getPrimeFactors(4)).toEqual([2, 2]);
      expect(getPrimeFactors(6)).toEqual([2, 3]);
      expect(getPrimeFactors(8)).toEqual([2, 2, 2]);
      expect(getPrimeFactors(9)).toEqual([3, 3]);
      expect(getPrimeFactors(10)).toEqual([2, 5]);
      expect(getPrimeFactors(12)).toEqual([2, 2, 3]);
      expect(getPrimeFactors(15)).toEqual([3, 5]);
      expect(getPrimeFactors(18)).toEqual([2, 3, 3]);
      expect(getPrimeFactors(20)).toEqual([2, 2, 5]);
      expect(getPrimeFactors(24)).toEqual([2, 2, 2, 3]);
      expect(getPrimeFactors(25)).toEqual([5, 5]);
      expect(getPrimeFactors(27)).toEqual([3, 3, 3]);
      expect(getPrimeFactors(28)).toEqual([2, 2, 7]);
      expect(getPrimeFactors(30)).toEqual([2, 3, 5]);
    });

    it('should return empty array for numbers less than 2', () => {
      expect(getPrimeFactors(0)).toEqual([]);
      expect(getPrimeFactors(1)).toEqual([]);
      expect(getPrimeFactors(-5)).toEqual([]);
    });

    it('should return array with the number itself for prime numbers', () => {
      expect(getPrimeFactors(2)).toEqual([2]);
      expect(getPrimeFactors(3)).toEqual([3]);
      expect(getPrimeFactors(5)).toEqual([5]);
      expect(getPrimeFactors(7)).toEqual([7]);
      expect(getPrimeFactors(11)).toEqual([11]);
    });

    it('should handle large composite numbers', () => {
      expect(getPrimeFactors(100)).toEqual([2, 2, 5, 5]);
      expect(getPrimeFactors(99)).toEqual([3, 3, 11]);
      expect(getPrimeFactors(64)).toEqual([2, 2, 2, 2, 2, 2]);
    });
  });

  describe('getPrimesInRange', () => {
    it('should return all primes in the specified range', () => {
      expect(getPrimesInRange(1, 10)).toEqual([2, 3, 5, 7]);
      expect(getPrimesInRange(10, 20)).toEqual([11, 13, 17, 19]);
      expect(getPrimesInRange(20, 30)).toEqual([23, 29]);
      expect(getPrimesInRange(30, 40)).toEqual([31, 37]);
    });

    it('should handle range with no primes', () => {
      expect(getPrimesInRange(14, 16)).toEqual([]);
      expect(getPrimesInRange(24, 26)).toEqual([]);
    });

    it('should handle edge cases', () => {
      expect(getPrimesInRange(1, 1)).toEqual([]);
      expect(getPrimesInRange(2, 2)).toEqual([2]);
    });

    it('should handle negative range', () => {
      expect(getPrimesInRange(-5, 5)).toEqual([2, 3, 5]);
    });
  });

  describe('getCompositesInRange', () => {
    it('should return all composites in the specified range', () => {
      expect(getCompositesInRange(4, 10)).toEqual([4, 6, 8, 9, 10]);
      expect(getCompositesInRange(10, 20)).toEqual([10, 12, 14, 15, 16, 18, 20]);
    });

    it('should handle range with no composites', () => {
      expect(getCompositesInRange(2, 3)).toEqual([]);
    });

    it('should handle edge cases', () => {
      expect(getCompositesInRange(4, 4)).toEqual([4]);
    });

    it('should handle negative range', () => {
      expect(getCompositesInRange(-5, 5)).toEqual([4]);
    });
  });

  describe('validatePrimeCompositeAnswer', () => {
    it('should validate is-prime answers correctly', () => {
      expect(validatePrimeCompositeAnswer(true, true, 'is-prime')).toBe(true);
      expect(validatePrimeCompositeAnswer(false, false, 'is-prime')).toBe(true);
      expect(validatePrimeCompositeAnswer(true, false, 'is-prime')).toBe(false);
      expect(validatePrimeCompositeAnswer(false, true, 'is-prime')).toBe(false);
    });

    it('should validate is-composite answers correctly', () => {
      expect(validatePrimeCompositeAnswer(true, true, 'is-composite')).toBe(true);
      expect(validatePrimeCompositeAnswer(false, false, 'is-composite')).toBe(true);
      expect(validatePrimeCompositeAnswer(true, false, 'is-composite')).toBe(false);
      expect(validatePrimeCompositeAnswer(false, true, 'is-composite')).toBe(false);
    });

    it('should validate prime-factors answers correctly', () => {
      expect(validatePrimeCompositeAnswer([2, 2], [2, 2], 'prime-factors')).toBe(true);
      expect(validatePrimeCompositeAnswer([2, 3], [2, 3], 'prime-factors')).toBe(true);
      expect(validatePrimeCompositeAnswer([2, 2, 3], [2, 2, 3], 'prime-factors')).toBe(true);
      expect(validatePrimeCompositeAnswer([2, 3], [2, 2, 3], 'prime-factors')).toBe(false);
    });

    it('should handle unordered prime factors', () => {
      expect(validatePrimeCompositeAnswer([2, 3], [3, 2], 'prime-factors')).toBe(true);
      expect(validatePrimeCompositeAnswer([2, 2, 3], [3, 2, 2], 'prime-factors')).toBe(true);
    });
  });

  describe('parsePrimeFactorsAnswer', () => {
    it('should parse comma-separated values', () => {
      expect(parsePrimeFactorsAnswer('2,3')).toEqual([2, 3]);
      expect(parsePrimeFactorsAnswer('2, 2, 3')).toEqual([2, 2, 3]);
      expect(parsePrimeFactorsAnswer('5,5')).toEqual([5, 5]);
    });

    it('should handle single value', () => {
      expect(parsePrimeFactorsAnswer('2')).toEqual([2]);
      expect(parsePrimeFactorsAnswer('3')).toEqual([3]);
    });

    it('should handle whitespace', () => {
      expect(parsePrimeFactorsAnswer('2 , 3')).toEqual([2, 3]);
      expect(parsePrimeFactorsAnswer(' 2 , 3 ')).toEqual([2, 3]);
    });

    it('should throw error for invalid format', () => {
      expect(() => parsePrimeFactorsAnswer('')).toThrow();
      expect(() => parsePrimeFactorsAnswer('a,b')).toThrow();
    });
  });

  describe('formatPrimeFactors', () => {
    it('should format prime factors correctly', () => {
      expect(formatPrimeFactors([2, 2])).toBe('2 × 2');
      expect(formatPrimeFactors([2, 3])).toBe('2 × 3');
      expect(formatPrimeFactors([2, 2, 3])).toBe('2 × 2 × 3');
      expect(formatPrimeFactors([5, 5])).toBe('5 × 5');
    });

    it('should handle single factor', () => {
      expect(formatPrimeFactors([2])).toBe('2');
      expect(formatPrimeFactors([3])).toBe('3');
    });

    it('should handle empty array', () => {
      expect(formatPrimeFactors([])).toBe('');
    });
  });
});
