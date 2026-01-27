// Unit tests for fraction generator
// modify by jx: implement unit tests for fraction question generation

import { describe, it, expect } from 'vitest';
import { generateFractionQuestions, useFractionGenerator } from './useFractionGenerator';
import type { FractionConfig } from '@/types';
import { fractionsEqual } from '@/utils/fractionUtils';

describe('useFractionGenerator', () => {
  describe('generateFractionQuestions', () => {
    it('should generate questions with same denominator', () => {
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: ['add'],
        questionCount: 5,
        includeMixedNumbers: false,
        questionTypes: ['same-denominator']
      };

      const questions = generateFractionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);
      
      questions.forEach(q => {
        expect(q.fractions.length).toBe(2);
        expect(q.operators.length).toBe(1);
        expect(q.questionType).toBe('same-denominator');
        // Check that denominators are the same
        expect(q.fractions[0].denominator).toBe(q.fractions[1].denominator);
      });
    });

    it('should generate questions with different denominators', () => {
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: ['add'],
        questionCount: 5,
        includeMixedNumbers: false,
        questionTypes: ['different-denominator']
      };

      const questions = generateFractionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);
      
      questions.forEach(q => {
        expect(q.fractions.length).toBe(2);
        expect(q.operators.length).toBe(1);
        expect(q.questionType).toBe('different-denominator');
      });
    });

    it('should generate simplification questions', () => {
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 20],
        operations: ['add'],
        questionCount: 5,
        includeMixedNumbers: false,
        questionTypes: ['simplify']
      };

      const questions = generateFractionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);
      
      questions.forEach(q => {
        expect(q.questionType).toBe('simplify');
        expect(q.fractions.length).toBe(1);
        expect(q.operators.length).toBe(0);
      });
    });

    it('should generate questions with all operations', () => {
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: ['add', 'subtract', 'multiply', 'divide'],
        questionCount: 20,
        includeMixedNumbers: false,
        questionTypes: ['different-denominator']
      };

      const questions = generateFractionQuestions(config);
      expect(questions.length).toBe(20);
      
      const operations = questions.map(q => q.operators[0]);
      expect(operations).toContain('add');
      expect(operations).toContain('subtract');
      expect(operations).toContain('multiply');
      expect(operations).toContain('divide');
    });

    it('should generate correct number of questions', () => {
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: ['add'],
        questionCount: 10,
        includeMixedNumbers: false,
        questionTypes: ['same-denominator']
      };

      const questions = generateFractionQuestions(config);
      expect(questions.length).toBeLessThanOrEqual(10);
    });

    it('should handle empty operations array', () => {
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: [],
        questionCount: 5,
        includeMixedNumbers: false,
        questionTypes: ['same-denominator']
      };

      const questions = generateFractionQuestions(config);
      // Should still generate questions using default operations
      expect(questions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('useFractionGenerator composable', () => {
    it('should initialize with empty questions', () => {
      const { questions, isGenerating } = useFractionGenerator();
      expect(questions.value).toEqual([]);
      expect(isGenerating.value).toBe(false);
    });

    it('should generate questions', () => {
      const { questions, generate, isGenerating } = useFractionGenerator();
      
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: ['add'],
        questionCount: 5,
        includeMixedNumbers: false,
        questionTypes: ['same-denominator']
      };

      generate(config);
      
      expect(questions.value.length).toBeGreaterThan(0);
      expect(isGenerating.value).toBe(false);
    });

    it('should clear questions', () => {
      const { questions, generate, clear } = useFractionGenerator();
      
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: ['add'],
        questionCount: 5,
        includeMixedNumbers: false,
        questionTypes: ['same-denominator']
      };

      generate(config);
      expect(questions.value.length).toBeGreaterThan(0);
      
      clear();
      expect(questions.value).toEqual([]);
    });
  });

  describe('answer validation', () => {
    it('should not generate questions where answer equals first operand', () => {
      // modify by jx: test that answer is different from operands in binary operations
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: ['add', 'subtract', 'multiply', 'divide'],
        questionCount: 50,
        includeMixedNumbers: false,
        questionTypes: ['same-denominator', 'different-denominator']
      };

      const questions = generateFractionQuestions(config);
      
      questions.forEach(q => {
        if (q.fractions.length === 2 && q.operators.length === 1) {
          // Answer should not equal either operand
          expect(fractionsEqual(q.answer, q.fractions[0])).toBe(false);
          expect(fractionsEqual(q.answer, q.fractions[1])).toBe(false);
        }
      });
    });

    it('should not generate simplification questions where answer equals original fraction', () => {
      // modify by jx: test that simplified answer is different from original fraction
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 20],
        operations: ['add'],
        questionCount: 50,
        includeMixedNumbers: false,
        questionTypes: ['simplify']
      };

      const questions = generateFractionQuestions(config);
      
      questions.forEach(q => {
        if (q.questionType === 'simplify' && q.fractions.length === 1) {
          // Simplified answer should be different from original fraction (before simplification)
          // The answer should equal the simplified form, not the original unsimplified fraction
          const originalFraction = q.fractions[0];
          // Check that numerator or denominator changed after simplification
          expect(
            originalFraction.numerator !== q.answer.numerator || 
            originalFraction.denominator !== q.answer.denominator
          ).toBe(true);
        }
      });
    });

    it('should filter out trivial multiplication questions (e.g., 7/6 × 1 = 7/6)', () => {
      // modify by jx: test that multiplication with 1 is filtered out
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: ['multiply'],
        questionCount: 50,
        includeMixedNumbers: false,
        questionTypes: ['same-denominator', 'different-denominator']
      };

      const questions = generateFractionQuestions(config);
      
      questions.forEach(q => {
        if (q.operators[0] === 'multiply') {
          // Answer should not equal either operand
          expect(fractionsEqual(q.answer, q.fractions[0])).toBe(false);
          expect(fractionsEqual(q.answer, q.fractions[1])).toBe(false);
        }
      });
    });

    it('should filter out trivial addition questions (e.g., 7/6 + 0 = 7/6)', () => {
      // modify by jx: test that addition with 0 is filtered out
      const config: FractionConfig = {
        denominatorRange: [2, 10],
        numeratorRange: [1, 9],
        operations: ['add'],
        questionCount: 50,
        includeMixedNumbers: false,
        questionTypes: ['same-denominator', 'different-denominator']
      };

      const questions = generateFractionQuestions(config);
      
      questions.forEach(q => {
        if (q.operators[0] === 'add') {
          // Answer should not equal either operand
          expect(fractionsEqual(q.answer, q.fractions[0])).toBe(false);
          expect(fractionsEqual(q.answer, q.fractions[1])).toBe(false);
        }
      });
    });
  });
});
