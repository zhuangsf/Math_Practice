// Unit tests for pattern generator
// modify by jx: implement unit tests for pattern question generation

import { describe, it, expect } from 'vitest';
import { generatePatternQuestions, usePatternGenerator } from './usePatternGenerator';
import type { PatternConfig } from '@/types';
import {
  generateArithmeticSequence,
  generateGeometricSequence,
  generateFibonacciSequence,
  generateSquareSequence,
  generateCubeSequence,
  calculateNextTerm,
  validatePatternAnswer
} from '@/utils/patternUtils';

describe('usePatternGenerator', () => {
  describe('generatePatternQuestions', () => {
    it('should generate arithmetic sequence questions', () => {
      const config: PatternConfig = {
        patternTypes: ['arithmetic'],
        termsCount: 4,
        questionCount: 5
      };

      const questions = generatePatternQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('arithmetic');
        expect(q.expression).toContain('找规律：');
        expect(q.expression).toContain(', ?');
        expect(typeof q.answer).toBe('number');
        // modify by jx: numbers.length should be termsCount + 1 (full sequence has one more term)
        expect(q.numbers.length).toBe(config.termsCount + 1);
        expect(q.missingIndex).toBeDefined();
      });
    });

    it('should generate geometric sequence questions', () => {
      const config: PatternConfig = {
        patternTypes: ['geometric'],
        termsCount: 4,
        questionCount: 5
      };

      const questions = generatePatternQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('geometric');
        expect(typeof q.answer).toBe('number');
        // verify answer is not NaN or Infinity
        expect(Number.isFinite(q.answer)).toBe(true);
      });
    });

    it('should generate Fibonacci sequence questions', () => {
      const config: PatternConfig = {
        patternTypes: ['fibonacci'],
        termsCount: 4,
        questionCount: 5
      };

      const questions = generatePatternQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('fibonacci');
        expect(typeof q.answer).toBe('number');
        expect(Number.isFinite(q.answer)).toBe(true);
      });
    });

    it('should generate square sequence questions', () => {
      const config: PatternConfig = {
        patternTypes: ['square'],
        termsCount: 4,
        questionCount: 5
      };

      const questions = generatePatternQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('square');
        expect(typeof q.answer).toBe('number');
        expect(q.answer).toBeGreaterThan(0);
      });
    });

    it('should generate cube sequence questions', () => {
      const config: PatternConfig = {
        patternTypes: ['cube'],
        termsCount: 4,
        questionCount: 5
      };

      const questions = generatePatternQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('cube');
        expect(typeof q.answer).toBe('number');
        expect(Number.isFinite(q.answer)).toBe(true);
      });
    });

    it('should generate correct number of questions', () => {
      const config: PatternConfig = {
        patternTypes: ['arithmetic'],
        termsCount: 4,
        questionCount: 10
      };

      const questions = generatePatternQuestions(config);
      expect(questions.length).toBe(10);
    });

    it('should generate questions with multiple pattern types', () => {
      const config: PatternConfig = {
        patternTypes: ['arithmetic', 'geometric', 'fibonacci'],
        termsCount: 4,
        questionCount: 30
      };

      const questions = generatePatternQuestions(config);
      expect(questions.length).toBe(30);

      const types = new Set(questions.map(q => q.questionType));
      expect(types.size).toBeGreaterThan(1);
    });

    it('should use default pattern types when none specified', () => {
      const config: PatternConfig = {
        patternTypes: [],
        termsCount: 4,
        questionCount: 5
      };

      const questions = generatePatternQuestions(config);
      expect(questions.length).toBe(5);
    });

    it('should include missingIndex in questions', () => {
      const config: PatternConfig = {
        patternTypes: ['arithmetic'],
        termsCount: 4,
        questionCount: 10
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        // modify by jx: check that missingIndex is a valid number within range
        expect(q.missingIndex).toBeDefined();
        expect(typeof q.missingIndex).toBe('number');
        expect(q.missingIndex).toBeGreaterThanOrEqual(0);
        expect(q.missingIndex).toBeLessThan(config.termsCount);
      });
    });
  });

  describe('usePatternGenerator composable', () => {
    it('should initialize with empty questions', () => {
      const { questions, isGenerating } = usePatternGenerator();
      expect(questions.value).toEqual([]);
      expect(isGenerating.value).toBe(false);
    });

    it('should generate questions', () => {
      const { questions, generate, isGenerating } = usePatternGenerator();
      
      const config: PatternConfig = {
        patternTypes: ['arithmetic'],
        termsCount: 4,
        questionCount: 5
      };

      generate(config);
      
      expect(questions.value.length).toBe(5);
      expect(isGenerating.value).toBe(false);
    });

    it('should clear questions', () => {
      const { questions, generate, clear } = usePatternGenerator();
      
      const config: PatternConfig = {
        patternTypes: ['arithmetic'],
        termsCount: 4,
        questionCount: 5
      };

      generate(config);
      expect(questions.value.length).toBe(5);
      
      clear();
      expect(questions.value).toEqual([]);
    });
  });

  describe('answer validation', () => {
    it('should validate arithmetic pattern answers correctly', () => {
      const config: PatternConfig = {
        patternTypes: ['arithmetic'],
        termsCount: 4,
        questionCount: 10
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        // Test with correct answer
        expect(validatePatternAnswer(q.answer.toString(), q.answer)).toBe(true);
        
        // Test with incorrect answer
        expect(validatePatternAnswer((q.answer + 1).toString(), q.answer)).toBe(false);
      });
    });

    it('should validate geometric pattern answers correctly', () => {
      const config: PatternConfig = {
        patternTypes: ['geometric'],
        termsCount: 4,
        questionCount: 10
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        expect(validatePatternAnswer(q.answer.toString(), q.answer)).toBe(true);
        expect(validatePatternAnswer((q.answer + 1).toString(), q.answer)).toBe(false);
      });
    });

    it('should validate Fibonacci pattern answers correctly', () => {
      const config: PatternConfig = {
        patternTypes: ['fibonacci'],
        termsCount: 4,
        questionCount: 10
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        expect(validatePatternAnswer(q.answer.toString(), q.answer)).toBe(true);
        expect(validatePatternAnswer((q.answer + 1).toString(), q.answer)).toBe(false);
      });
    });

    it('should validate square pattern answers correctly', () => {
      const config: PatternConfig = {
        patternTypes: ['square'],
        termsCount: 4,
        questionCount: 10
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        expect(validatePatternAnswer(q.answer.toString(), q.answer)).toBe(true);
        // Verify answer is a perfect square
        const sqrt = Math.sqrt(q.answer);
        expect(Number.isInteger(sqrt)).toBe(true);
      });
    });

    it('should validate cube pattern answers correctly', () => {
      const config: PatternConfig = {
        patternTypes: ['cube'],
        termsCount: 4,
        questionCount: 10
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        expect(validatePatternAnswer(q.answer.toString(), q.answer)).toBe(true);
        // Verify answer is a perfect cube
        const cbrt = Math.cbrt(q.answer);
        expect(Number.isInteger(cbrt)).toBe(true);
      });
    });
  });

  describe('answer consistency', () => {
    it('should generate consistent answers for arithmetic sequences', () => {
      // modify by jx: test that answer is always the next term in the sequence
      const config: PatternConfig = {
        patternTypes: ['arithmetic'],
        termsCount: 4,
        questionCount: 50
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        // Get the visible sequence
        const visibleNumbers = q.numbers.slice(0, config.termsCount);
        
        // The answer should be the next term after the visible sequence
        // For arithmetic sequence, calculate diff from visible terms
        const diff = visibleNumbers[1] - visibleNumbers[0];
        const lastVisible = visibleNumbers[config.termsCount - 1];
        const expectedAnswer = lastVisible + diff;
        
        // Verify the answer is the next term
        expect(q.answer).toBe(expectedAnswer);
        // Verify the answer is the last element of the full sequence
        expect(q.answer).toBe(q.numbers[config.termsCount]);
      });
    });

    it('should generate consistent answers for Fibonacci sequences', () => {
      const config: PatternConfig = {
        patternTypes: ['fibonacci'],
        termsCount: 4,
        questionCount: 50
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        const visibleNumbers = q.numbers.slice(0, config.termsCount);
        
        // The answer should be the next term after the visible sequence
        // For Fibonacci, it's the sum of the last two visible terms
        const expectedAnswer = visibleNumbers[config.termsCount - 1] + visibleNumbers[config.termsCount - 2];
        
        expect(q.answer).toBe(expectedAnswer);
        expect(q.answer).toBe(q.numbers[config.termsCount]);
      });
    });

    it('should generate consistent answers for square sequences', () => {
      const config: PatternConfig = {
        patternTypes: ['square'],
        termsCount: 4,
        questionCount: 50
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        const visibleNumbers = q.numbers.slice(0, config.termsCount);
        
        // The answer should be the next square number
        const lastSqrt = Math.sqrt(visibleNumbers[config.termsCount - 1]);
        const expectedAnswer = Math.pow(lastSqrt + 1, 2);
        
        expect(q.answer).toBe(expectedAnswer);
        expect(q.answer).toBe(q.numbers[config.termsCount]);
      });
    });

    it('should generate consistent answers for cube sequences', () => {
      const config: PatternConfig = {
        patternTypes: ['cube'],
        termsCount: 4,
        questionCount: 50
      };

      const questions = generatePatternQuestions(config);
      
      questions.forEach(q => {
        const visibleNumbers = q.numbers.slice(0, config.termsCount);
        
        // The answer should be the next cube number
        const lastCbrt = Math.cbrt(visibleNumbers[config.termsCount - 1]);
        const expectedAnswer = Math.pow(lastCbrt + 1, 3);
        
        expect(q.answer).toBe(expectedAnswer);
        expect(q.answer).toBe(q.numbers[config.termsCount]);
      });
    });
  });

  describe('sequence generation utilities', () => {
    it('should generate arithmetic sequences correctly', () => {
      expect(generateArithmeticSequence(1, 2, 5)).toEqual([1, 3, 5, 7, 9]);
      expect(generateArithmeticSequence(5, 3, 4)).toEqual([5, 8, 11, 14]);
    });

    it('should generate geometric sequences correctly', () => {
      expect(generateGeometricSequence(2, 2, 5)).toEqual([2, 4, 8, 16, 32]);
      expect(generateGeometricSequence(3, 3, 4)).toEqual([3, 9, 27, 81]);
    });

    it('should generate Fibonacci sequences correctly', () => {
      expect(generateFibonacciSequence(5)).toEqual([1, 1, 2, 3, 5]);
      expect(generateFibonacciSequence(6, [1, 2])).toEqual([1, 2, 3, 5, 8, 13]);
    });

    it('should generate square sequences correctly', () => {
      expect(generateSquareSequence(1, 5)).toEqual([1, 4, 9, 16, 25]);
      expect(generateSquareSequence(2, 4)).toEqual([4, 9, 16, 25]);
    });

    it('should generate cube sequences correctly', () => {
      expect(generateCubeSequence(1, 4)).toEqual([1, 8, 27, 64]);
      expect(generateCubeSequence(2, 3)).toEqual([8, 27, 64]);
    });

    it('should calculate next term correctly', () => {
      expect(calculateNextTerm([1, 3, 5, 7], 'arithmetic')).toBe(9);
      expect(calculateNextTerm([2, 4, 8, 16], 'geometric')).toBe(32);
      expect(calculateNextTerm([1, 1, 2, 3, 5], 'fibonacci')).toBe(8);
      expect(calculateNextTerm([1, 4, 9, 16], 'square')).toBe(25);
      expect(calculateNextTerm([1, 8, 27, 64], 'cube')).toBe(125);
    });
  });
});
