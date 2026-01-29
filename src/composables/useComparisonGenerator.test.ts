// Unit tests for comparison question generation
// modify by jx: add unit tests for comparison generator

import { describe, it, expect } from 'vitest';
import type { ComparisonConfig } from '@/types';
import { 
  generateComparisonQuestions 
} from '@/composables/useComparisonGenerator';

describe('Comparison Question Generation', () => {
  // Test configuration
  const defaultConfig: ComparisonConfig = {
    questionTypes: ['integer', 'decimal', 'fraction', 'decimal-fraction'],
    valueRange: [1, 100],
    questionCount: 20,
    decimalPlaces: 2,
    maxDenominator: 10
  };

  describe('generateComparisonQuestions', () => {
    it('should generate the correct number of questions', () => {
      const config: ComparisonConfig = { ...defaultConfig, questionCount: 50 };
      const questions = generateComparisonQuestions(config);
      
      expect(questions).toHaveLength(50);
    });

    it('should generate integer questions with valid comparison', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['integer'],
        valueRange: [1, 100],
        questionCount: 30 
      };
      const questions = generateComparisonQuestions(config);
      
      expect(questions).toHaveLength(30);
      questions.forEach(q => {
        expect(q.questionType).toBe('integer');
        expect(q.numbers).toHaveLength(2);
        expect(q.numbers[0]).not.toBe(q.numbers[1]); // Numbers should not be equal
        expect(q.answer).toBeDefined();
        expect([ -1, 1 ]).toContain(q.answer); // Should be either -1 or 1
      });
    });

    it('should generate decimal questions with valid comparison', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['decimal'],
        valueRange: [1, 100],
        decimalPlaces: 2,
        questionCount: 30 
      };
      const questions = generateComparisonQuestions(config);
      
      expect(questions).toHaveLength(30);
      questions.forEach(q => {
        expect(q.questionType).toBe('decimal');
        expect(q.numbers).toHaveLength(2);
        expect(q.decimalPlaces).toBe(2);
        expect(q.answer).toBeDefined();
        expect([ -1, 1 ]).toContain(q.answer);
      });
    });

    it('should generate fraction questions with valid comparison', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['fraction'],
        maxDenominator: 12,
        questionCount: 30 
      };
      const questions = generateComparisonQuestions(config);
      
      expect(questions).toHaveLength(30);
      questions.forEach(q => {
        expect(q.questionType).toBe('fraction');
        expect(q.numbers).toHaveLength(4); // num1, den1, num2, den2
        expect(q.answer).toBeDefined();
        expect([ -1, 1 ]).toContain(q.answer);
      });
    });

    it('should generate questions of selected types only', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['integer'],
        questionCount: 20 
      };
      const questions = generateComparisonQuestions(config);
      
      expect(questions).toHaveLength(20);
      questions.forEach(q => {
        expect(q.questionType).toBe('integer');
      });
    });

    it('should handle empty question types gracefully', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: [],
        questionCount: 10 
      };
      const questions = generateComparisonQuestions(config);
      
      // When questionTypes is empty, it defaults to all types including decimal-fraction
      expect(questions).toHaveLength(10);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should generate mixed question types when multiple types selected', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['integer', 'decimal', 'fraction'],
        questionCount: 100 
      };
      const questions = generateComparisonQuestions(config);
      
      expect(questions).toHaveLength(100);
      
      const types = new Set(questions.map(q => q.questionType));
      expect(types.size).toBeGreaterThan(1);
    });

    it('should generate all questions with valid answers', () => {
      const config: ComparisonConfig = { ...defaultConfig, questionCount: 30 };
      const questions = generateComparisonQuestions(config);
      
      questions.forEach(q => {
        expect(q.id).toBeDefined();
        expect(q.expression).toBeDefined();
        expect(q.answer).toBeDefined();
        expect([ -1, 1 ]).toContain(q.answer); // Should be either -1 or 1, not 0 (equal)
      });
    });

    it('should generate questions with numbers in valid range', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['integer'],
        valueRange: [5, 15],
        questionCount: 20 
      };
      
      const questions = generateComparisonQuestions(config);
      expect(questions).toHaveLength(20);
      
      questions.forEach(q => {
        expect(q.numbers[0]).toBeGreaterThanOrEqual(5);
        expect(q.numbers[0]).toBeLessThanOrEqual(15);
        expect(q.numbers[1]).toBeGreaterThanOrEqual(5);
        expect(q.numbers[1]).toBeLessThanOrEqual(15);
      });
    });

    it('should generate fraction questions with valid denominators', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['fraction'],
        maxDenominator: 12,
        questionCount: 20 
      };
      
      const questions = generateComparisonQuestions(config);
      expect(questions).toHaveLength(20);
      
      questions.forEach(q => {
        const [num1, den1, num2, den2] = q.numbers;
        expect(den1).toBeGreaterThanOrEqual(2);
        expect(den1).toBeLessThanOrEqual(12);
        expect(den2).toBeGreaterThanOrEqual(2);
        expect(den2).toBeLessThanOrEqual(12);
      });
    });

    it('should generate decimal-fraction mixed comparison questions', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['decimal-fraction'],
        decimalPlaces: 2,
        maxDenominator: 12,
        questionCount: 30 
      };
      const questions = generateComparisonQuestions(config);
      
      expect(questions).toHaveLength(30);
      questions.forEach(q => {
        expect(q.questionType).toBe('decimal-fraction');
        expect(q.numbers).toHaveLength(3); // decimal, num, den
        expect(q.decimalPlaces).toBe(2);
        expect(q.fractionData).toBeDefined();
        expect(q.fractionData!.num1).toBeDefined();
        expect(q.fractionData!.den1).toBeDefined();
        expect(q.fractionData!.den1!).toBeGreaterThanOrEqual(2);
        expect(q.fractionData!.den1!).toBeLessThanOrEqual(12);
        expect(q.answer).toBeDefined();
        expect([ -1, 1 ]).toContain(q.answer);
        
        // Check expression format
        const parts = q.expression.split(' ? ');
        expect(parts).toHaveLength(2);
        // One part should be a decimal, the other should be a fraction
        const hasDecimal = parts[0].includes('.') || parts[1].includes('.');
        const hasFraction = parts[0].includes('/') || parts[1].includes('/');
        expect(hasDecimal).toBe(true);
        expect(hasFraction).toBe(true);
      });
    });

    it('should generate decimal-fraction questions with different decimal places', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['decimal-fraction'],
        decimalPlaces: 3,
        questionCount: 20 
      };
      
      const questions = generateComparisonQuestions(config);
      expect(questions).toHaveLength(20);
      
      questions.forEach(q => {
        expect(q.decimalPlaces).toBe(3);
        // Check that the decimal part has correct format
        const parts = q.expression.split(' ? ');
        const decimalPart = parts.find(p => p.includes('.'));
        if (decimalPart) {
          expect(decimalPart.split('.')[1].length).toBe(3);
        }
      });
    });

    it('should not generate decimal-fraction questions with equal values', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['decimal-fraction'],
        questionCount: 50 
      };
      
      const questions = generateComparisonQuestions(config);
      expect(questions).toHaveLength(50);
      
      questions.forEach(q => {
        expect(q.answer).not.toBe(0); // Should not be equal
        
        // Verify the decimal and fraction are not equal
        const [decimal, num, den] = q.numbers;
        const fractionValue = num / den;
        expect(decimal).not.toBeCloseTo(fractionValue, 5);
      });
    });

    it('should generate decimal questions with correct decimal format', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['decimal'],
        decimalPlaces: 3,
        questionCount: 20 
      };
      
      const questions = generateComparisonQuestions(config);
      expect(questions).toHaveLength(20);
      
      questions.forEach(q => {
        expect(q.decimalPlaces).toBe(3);
        // Check that the expression has correct decimal format
        const parts = q.expression.split(' ? ');
        expect(parts[0].split('.')[1].length).toBe(3);
        expect(parts[1].split('.')[1].length).toBe(3);
      });
    });

    it('should not generate questions with equal values', () => {
      const config: ComparisonConfig = { 
        ...defaultConfig, 
        questionTypes: ['integer', 'decimal', 'fraction', 'decimal-fraction'],
        questionCount: 100 
      };
      
      const questions = generateComparisonQuestions(config);
      expect(questions).toHaveLength(100);
      
      questions.forEach(q => {
        expect(q.answer).not.toBe(0); // Should not be equal
        
        // Verify for fractions
        if (q.questionType === 'fraction') {
          const [num1, den1, num2, den2] = q.numbers;
          expect(num1 * den2).not.toBe(num2 * den1);
        }
        
        // Verify for decimal-fraction
        if (q.questionType === 'decimal-fraction') {
          const [decimal, num, den] = q.numbers;
          const fractionValue = num / den;
          expect(decimal).not.toBeCloseTo(fractionValue, 5);
        }
      });
    });
  });
});
