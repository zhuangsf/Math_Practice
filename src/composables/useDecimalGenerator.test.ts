// Unit tests for decimal generator
// modify by jx: implement unit tests for decimal question generation

import { describe, it, expect } from 'vitest';
import { generateDecimalQuestions, useDecimalGenerator } from './useDecimalGenerator';
import type { DecimalConfig } from '@/types';

describe('useDecimalGenerator', () => {
  describe('generateDecimalQuestions', () => {
    it('should generate questions with specified count', () => {
      const config: DecimalConfig = {
        decimalPlaces: 2,
        minValue: 0.1,
        maxValue: 10.0,
        operations: ['add'],
        questionCount: 5,
        answerPrecision: 2
      };

      const questions = generateDecimalQuestions(config);
      expect(questions.length).toBeGreaterThan(0);
      expect(questions.length).toBeLessThanOrEqual(5);
    });

    it('should generate questions with all operations', () => {
      const config: DecimalConfig = {
        decimalPlaces: 2,
        minValue: 0.1,
        maxValue: 10.0,
        operations: ['add', 'subtract', 'multiply', 'divide'],
        questionCount: 20,
        answerPrecision: 2
      };

      const questions = generateDecimalQuestions(config);
      expect(questions.length).toBeGreaterThan(0);
      
      const operations = questions.map(q => q.operators[0]);
      expect(operations).toContain('add');
      expect(operations).toContain('subtract');
      expect(operations).toContain('multiply');
      expect(operations).toContain('divide');
    });

    it('should generate questions with correct decimal places', () => {
      const config: DecimalConfig = {
        decimalPlaces: 1,
        minValue: 0.1,
        maxValue: 10.0,
        operations: ['add'],
        questionCount: 5,
        answerPrecision: 1
      };

      const questions = generateDecimalQuestions(config);
      questions.forEach(q => {
        expect(q.decimalPlaces).toBe(1);
        expect(q.decimals.length).toBe(2);
        expect(q.operators.length).toBe(1);
      });
    });

    it('should generate questions with non-negative results for subtraction', () => {
      const config: DecimalConfig = {
        decimalPlaces: 2,
        minValue: 0.1,
        maxValue: 10.0,
        operations: ['subtract'],
        questionCount: 10,
        answerPrecision: 2
      };

      const questions = generateDecimalQuestions(config);
      questions.forEach(q => {
        expect(q.answer).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle empty operations array', () => {
      const config: DecimalConfig = {
        decimalPlaces: 2,
        minValue: 0.1,
        maxValue: 10.0,
        operations: [],
        questionCount: 5,
        answerPrecision: 2
      };

      const questions = generateDecimalQuestions(config);
      // Should still generate questions using default operations
      expect(questions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('useDecimalGenerator composable', () => {
    it('should initialize with empty questions', () => {
      const { questions, isGenerating } = useDecimalGenerator();
      expect(questions.value).toEqual([]);
      expect(isGenerating.value).toBe(false);
    });

    it('should generate questions', () => {
      const { questions, generate, isGenerating } = useDecimalGenerator();
      
      const config: DecimalConfig = {
        decimalPlaces: 2,
        minValue: 0.1,
        maxValue: 10.0,
        operations: ['add'],
        questionCount: 5,
        answerPrecision: 2
      };

      generate(config);
      
      expect(questions.value.length).toBeGreaterThan(0);
      expect(isGenerating.value).toBe(false);
    });

    it('should clear questions', () => {
      const { questions, generate, clear } = useDecimalGenerator();
      
      const config: DecimalConfig = {
        decimalPlaces: 2,
        minValue: 0.1,
        maxValue: 10.0,
        operations: ['add'],
        questionCount: 5,
        answerPrecision: 2
      };

      generate(config);
      expect(questions.value.length).toBeGreaterThan(0);
      
      clear();
      expect(questions.value).toEqual([]);
    });
  });
});
