// Detailed unit tests for unitConversionUtils
// modify by jx: add detailed tests to identify specific conversion bugs

import { describe, it, expect } from 'vitest';
import { convertUnit } from './unitConversionUtils';

describe('UnitConversionUtils - Detailed Tests', () => {
  describe('Common Conversion Scenarios', () => {
    it('should correctly convert 1 meter to centimeters', () => {
      // 1m = 100cm
      const result = convertUnit(1, 'length', 'm', 'cm');
      expect(result).toBe(100);
    });

    it('should correctly convert 1 kilometer to meters', () => {
      // 1km = 1000m
      const result = convertUnit(1, 'length', 'km', 'm');
      expect(result).toBe(1000);
    });

    it('should correctly convert 1 kilogram to grams', () => {
      // 1kg = 1000g
      const result = convertUnit(1, 'weight', 'kg', 'g');
      expect(result).toBe(1000);
    });

    it('should correctly convert 1 ton to kilograms', () => {
      // 1t = 1000kg
      const result = convertUnit(1, 'weight', 't', 'kg');
      expect(result).toBe(1000);
    });

    it('should correctly convert 1 square meter to square centimeters', () => {
      // 1m² = 10000cm²
      const result = convertUnit(1, 'area', 'm²', 'cm²');
      expect(result).toBe(10000);
    });

    it('should correctly convert 1 liter to milliliters', () => {
      // 1L = 1000mL
      const result = convertUnit(1, 'volume', 'L', 'mL');
      expect(result).toBe(1000);
    });

    it('should correctly convert 1 liter to cubic decimeters', () => {
      // 1L = 1dm³
      const result = convertUnit(1, 'volume', 'L', 'dm³');
      expect(result).toBe(1);
    });

    it('should correctly convert 1 milliliter to cubic centimeters', () => {
      // 1mL = 1cm³
      const result = convertUnit(1, 'volume', 'mL', 'cm³');
      expect(result).toBe(1);
    });

    it('should correctly convert 1 hour to minutes', () => {
      // 1h = 60min
      const result = convertUnit(1, 'time', 'h', 'min');
      expect(result).toBe(60);
    });

    it('should correctly convert 1 hour to seconds', () => {
      // 1h = 3600s
      const result = convertUnit(1, 'time', 'h', 's');
      expect(result).toBe(3600);
    });

    it('should correctly convert 1 day to hours', () => {
      // 1d = 24h
      const result = convertUnit(1, 'time', 'd', 'h');
      expect(result).toBe(24);
    });
  });

  describe('Reverse Conversion Tests', () => {
    it('should correctly reverse convert length units', () => {
      const original = 5;
      const converted = convertUnit(original, 'length', 'm', 'cm');
      const reversed = convertUnit(converted, 'length', 'cm', 'm');
      expect(reversed).toBe(original);
    });

    it('should correctly reverse convert weight units', () => {
      const original = 3;
      const converted = convertUnit(original, 'weight', 'kg', 'g');
      const reversed = convertUnit(converted, 'weight', 'g', 'kg');
      expect(reversed).toBe(original);
    });

    it('should correctly reverse convert area units', () => {
      const original = 2;
      const converted = convertUnit(original, 'area', 'm²', 'cm²');
      const reversed = convertUnit(converted, 'area', 'cm²', 'm²');
      expect(reversed).toBe(original);
    });

    it('should correctly reverse convert volume units - L and mL', () => {
      const original = 2;
      const converted = convertUnit(original, 'volume', 'L', 'mL');
      expect(converted).toBe(2000);
      const reversed = convertUnit(converted, 'volume', 'mL', 'L');
      expect(reversed).toBe(original);
    });

    it('should correctly reverse convert volume units - L and dm³', () => {
      const original = 5;
      const converted = convertUnit(original, 'volume', 'L', 'dm³');
      expect(converted).toBe(5);
      const reversed = convertUnit(converted, 'volume', 'dm³', 'L');
      expect(reversed).toBe(original);
    });

    it('should correctly reverse convert volume units - mL and cm³', () => {
      const original = 10;
      const converted = convertUnit(original, 'volume', 'mL', 'cm³');
      expect(converted).toBe(10);
      const reversed = convertUnit(converted, 'volume', 'cm³', 'mL');
      expect(reversed).toBe(original);
    });

    it('should correctly reverse convert time units', () => {
      const original = 2;
      const converted = convertUnit(original, 'time', 'h', 'min');
      const reversed = convertUnit(converted, 'time', 'min', 'h');
      expect(reversed).toBe(original);
    });
  });

  describe('Multiple Step Conversions', () => {
    it('should correctly convert through multiple length units', () => {
      // 1km -> m -> cm
      const kmToM = convertUnit(1, 'length', 'km', 'm');
      expect(kmToM).toBe(1000);
      const mToCm = convertUnit(kmToM, 'length', 'm', 'cm');
      expect(mToCm).toBe(100000);
      // Direct conversion should match
      const direct = convertUnit(1, 'length', 'km', 'cm');
      expect(direct).toBe(100000);
    });

    it('should correctly convert through multiple weight units', () => {
      // 1t -> kg -> g
      const tToKg = convertUnit(1, 'weight', 't', 'kg');
      expect(tToKg).toBe(1000);
      const kgToG = convertUnit(tToKg, 'weight', 'kg', 'g');
      expect(kgToG).toBe(1000000);
      // Direct conversion should match
      const direct = convertUnit(1, 'weight', 't', 'g');
      expect(direct).toBe(1000000);
    });

    it('should correctly convert through multiple volume units', () => {
      // 1L -> mL -> cm³
      const lToMl = convertUnit(1, 'volume', 'L', 'mL');
      expect(lToMl).toBe(1000);
      const mlToCm3 = convertUnit(lToMl, 'volume', 'mL', 'cm³');
      expect(mlToCm3).toBe(1000);
      // Direct conversion L -> cm³
      const direct = convertUnit(1, 'volume', 'L', 'cm³');
      expect(direct).toBe(1000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      expect(convertUnit(0, 'length', 'm', 'cm')).toBe(0);
      expect(convertUnit(0, 'weight', 'kg', 'g')).toBe(0);
      expect(convertUnit(0, 'volume', 'L', 'mL')).toBe(0);
    });

    it('should handle same unit conversion', () => {
      expect(convertUnit(5, 'length', 'm', 'm')).toBe(5);
      expect(convertUnit(10, 'weight', 'kg', 'kg')).toBe(10);
    });

    it('should handle large values', () => {
      const result = convertUnit(1000, 'length', 'km', 'm');
      expect(result).toBe(1000000);
    });

    it('should handle small values', () => {
      const result = convertUnit(1, 'length', 'mm', 'cm');
      expect(result).toBe(0.1);
    });
  });
});
