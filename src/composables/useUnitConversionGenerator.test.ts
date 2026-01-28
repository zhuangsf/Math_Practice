// Unit tests for useUnitConversionGenerator
// modify by jx: add comprehensive tests to verify unit conversion question generation and answer accuracy

import { describe, it, expect } from 'vitest';
import { generateUnitConversionQuestions, useUnitConversionGenerator } from './useUnitConversionGenerator';
import type { UnitConversionConfig } from '@/types';
import { convertUnit } from '@/utils/unitConversionUtils';

describe('useUnitConversionGenerator', () => {
  describe('generateUnitConversionQuestions', () => {
    it('should generate questions with correct answers for length units', () => {
      const config: UnitConversionConfig = {
        unitTypes: ['length'],
        conversionDirection: 'mixed',
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generateUnitConversionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);

      // Verify each question has correct answer
      questions.forEach(question => {
        const expectedAnswer = convertUnit(
          question.value,
          question.unitType,
          question.fromUnit,
          question.toUnit
        );
        expect(question.answer).toBeCloseTo(expectedAnswer, 10);
      });
    });

    it('should generate questions with correct answers for weight units', () => {
      const config: UnitConversionConfig = {
        unitTypes: ['weight'],
        conversionDirection: 'mixed',
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generateUnitConversionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);

      questions.forEach(question => {
        const expectedAnswer = convertUnit(
          question.value,
          question.unitType,
          question.fromUnit,
          question.toUnit
        );
        expect(question.answer).toBeCloseTo(expectedAnswer, 10);
      });
    });

    it('should generate questions with correct answers for area units', () => {
      const config: UnitConversionConfig = {
        unitTypes: ['area'],
        conversionDirection: 'mixed',
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generateUnitConversionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);

      questions.forEach(question => {
        const expectedAnswer = convertUnit(
          question.value,
          question.unitType,
          question.fromUnit,
          question.toUnit
        );
        expect(question.answer).toBeCloseTo(expectedAnswer, 10);
      });
    });

    it('should generate questions with correct answers for volume units', () => {
      const config: UnitConversionConfig = {
        unitTypes: ['volume'],
        conversionDirection: 'mixed',
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generateUnitConversionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);

      questions.forEach(question => {
        const expectedAnswer = convertUnit(
          question.value,
          question.unitType,
          question.fromUnit,
          question.toUnit
        );
        // modify by jx: verify answer accuracy with tolerance for floating point precision
        expect(question.answer).toBeCloseTo(expectedAnswer, 10);
      });
    });

    it('should generate questions with correct answers for time units', () => {
      const config: UnitConversionConfig = {
        unitTypes: ['time'],
        conversionDirection: 'mixed',
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generateUnitConversionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);

      questions.forEach(question => {
        const expectedAnswer = convertUnit(
          question.value,
          question.unitType,
          question.fromUnit,
          question.toUnit
        );
        expect(question.answer).toBeCloseTo(expectedAnswer, 10);
      });
    });

    it('should respect large-to-small conversion direction', () => {
      const config: UnitConversionConfig = {
        unitTypes: ['length'],
        conversionDirection: 'large-to-small',
        valueRange: [1, 100],
        questionCount: 20
      };

      const questions = generateUnitConversionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);

      questions.forEach(question => {
        // Verify answer is larger than value (converting from large to small unit)
        expect(question.answer).toBeGreaterThan(question.value);
        
        // Verify answer is correct
        const expectedAnswer = convertUnit(
          question.value,
          question.unitType,
          question.fromUnit,
          question.toUnit
        );
        expect(question.answer).toBeCloseTo(expectedAnswer, 10);
      });
    });

    it('should respect small-to-large conversion direction', () => {
      const config: UnitConversionConfig = {
        unitTypes: ['length'],
        conversionDirection: 'small-to-large',
        valueRange: [1, 100],
        questionCount: 20
      };

      const questions = generateUnitConversionQuestions(config);
      expect(questions.length).toBeGreaterThan(0);

      questions.forEach(question => {
        // Verify answer is smaller than value (converting from small to large unit)
        expect(question.answer).toBeLessThan(question.value);
        
        // Verify answer is correct
        const expectedAnswer = convertUnit(
          question.value,
          question.unitType,
          question.fromUnit,
          question.toUnit
        );
        expect(question.answer).toBeCloseTo(expectedAnswer, 10);
      });
    });

    it('should generate specified number of questions', () => {
      const config: UnitConversionConfig = {
        unitTypes: ['length', 'weight', 'area', 'volume', 'time'],
        conversionDirection: 'mixed',
        valueRange: [1, 100],
        questionCount: 50
      };

      const questions = generateUnitConversionQuestions(config);
      expect(questions.length).toBe(50);
    });

    it('should handle specific conversion scenarios correctly', () => {
      const config: UnitConversionConfig = {
        unitTypes: ['volume'],
        conversionDirection: 'mixed',
        valueRange: [1, 10],
        questionCount: 100
      };

      const questions = generateUnitConversionQuestions(config);
      
      // Find L to mL conversions
      const lToMlQuestions = questions.filter(q => q.fromUnit === 'L' && q.toUnit === 'mL');
      if (lToMlQuestions.length > 0) {
        lToMlQuestions.forEach(q => {
          // 1L = 1000mL
          expect(q.answer).toBe(q.value * 1000);
        });
      }

      // Find mL to L conversions
      const mlToLQuestions = questions.filter(q => q.fromUnit === 'mL' && q.toUnit === 'L');
      if (mlToLQuestions.length > 0) {
        mlToLQuestions.forEach(q => {
          // 1000mL = 1L
          expect(q.answer).toBeCloseTo(q.value / 1000, 10);
        });
      }

      // Find L to dm³ conversions
      const lToDm3Questions = questions.filter(q => q.fromUnit === 'L' && q.toUnit === 'dm³');
      if (lToDm3Questions.length > 0) {
        lToDm3Questions.forEach(q => {
          // 1L = 1dm³
          expect(q.answer).toBe(q.value);
        });
      }

      // Find mL to cm³ conversions
      const mlToCm3Questions = questions.filter(q => q.fromUnit === 'mL' && q.toUnit === 'cm³');
      if (mlToCm3Questions.length > 0) {
        mlToCm3Questions.forEach(q => {
          // 1mL = 1cm³
          expect(q.answer).toBe(q.value);
        });
      }
    });
  });

  describe('useUnitConversionGenerator composable', () => {
    it('should generate questions using composable', () => {
      const { generate, questions, isGenerating } = useUnitConversionGenerator();
      
      const config: UnitConversionConfig = {
        unitTypes: ['length'],
        conversionDirection: 'mixed',
        valueRange: [1, 100],
        questionCount: 10
      };

      generate(config);
      
      expect(questions.value.length).toBe(10);
      expect(isGenerating.value).toBe(false);
    });

    it('should clear questions', () => {
      const { generate, questions, clear } = useUnitConversionGenerator();
      
      const config: UnitConversionConfig = {
        unitTypes: ['length'],
        conversionDirection: 'mixed',
        valueRange: [1, 100],
        questionCount: 10
      };

      generate(config);
      expect(questions.value.length).toBe(10);
      
      clear();
      expect(questions.value.length).toBe(0);
    });
  });
});
