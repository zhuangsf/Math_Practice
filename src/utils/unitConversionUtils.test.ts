// Unit tests for unitConversionUtils
// modify by jx: add comprehensive unit tests to verify unit conversion accuracy

import { describe, it, expect } from 'vitest';
import { convertUnit, getAvailableUnits, getUnitDisplayName, validateUnitConversionAnswer } from './unitConversionUtils';

describe('UnitConversionUtils', () => {
  describe('Length Unit Conversion', () => {
    it('should convert mm to cm correctly', () => {
      // 10mm = 1cm
      expect(convertUnit(10, 'length', 'mm', 'cm')).toBe(1);
      expect(convertUnit(100, 'length', 'mm', 'cm')).toBe(10);
    });

    it('should convert cm to mm correctly', () => {
      // 1cm = 10mm
      expect(convertUnit(1, 'length', 'cm', 'mm')).toBe(10);
      expect(convertUnit(5, 'length', 'cm', 'mm')).toBe(50);
    });

    it('should convert cm to dm correctly', () => {
      // 10cm = 1dm
      expect(convertUnit(10, 'length', 'cm', 'dm')).toBe(1);
      expect(convertUnit(50, 'length', 'cm', 'dm')).toBe(5);
    });

    it('should convert dm to m correctly', () => {
      // 10dm = 1m
      expect(convertUnit(10, 'length', 'dm', 'm')).toBe(1);
      expect(convertUnit(50, 'length', 'dm', 'm')).toBe(5);
    });

    it('should convert m to cm correctly', () => {
      // 1m = 100cm
      expect(convertUnit(1, 'length', 'm', 'cm')).toBe(100);
      expect(convertUnit(2, 'length', 'm', 'cm')).toBe(200);
    });

    it('should convert m to km correctly', () => {
      // 1000m = 1km
      expect(convertUnit(1000, 'length', 'm', 'km')).toBe(1);
      expect(convertUnit(2000, 'length', 'm', 'km')).toBe(2);
    });

    it('should convert km to m correctly', () => {
      // 1km = 1000m
      expect(convertUnit(1, 'length', 'km', 'm')).toBe(1000);
      expect(convertUnit(2, 'length', 'km', 'm')).toBe(2000);
    });

    it('should handle reverse conversion correctly', () => {
      // Test bidirectional conversion
      const value = 5;
      const converted = convertUnit(value, 'length', 'm', 'cm');
      const backConverted = convertUnit(converted, 'length', 'cm', 'm');
      expect(backConverted).toBeCloseTo(value, 10);
    });
  });

  describe('Weight Unit Conversion', () => {
    it('should convert g to kg correctly', () => {
      // 1000g = 1kg
      expect(convertUnit(1000, 'weight', 'g', 'kg')).toBe(1);
      expect(convertUnit(2000, 'weight', 'g', 'kg')).toBe(2);
    });

    it('should convert kg to g correctly', () => {
      // 1kg = 1000g
      expect(convertUnit(1, 'weight', 'kg', 'g')).toBe(1000);
      expect(convertUnit(2, 'weight', 'kg', 'g')).toBe(2000);
    });

    it('should convert kg to t correctly', () => {
      // 1000kg = 1t
      expect(convertUnit(1000, 'weight', 'kg', 't')).toBe(1);
      expect(convertUnit(2000, 'weight', 'kg', 't')).toBe(2);
    });

    it('should convert t to kg correctly', () => {
      // 1t = 1000kg
      expect(convertUnit(1, 'weight', 't', 'kg')).toBe(1000);
      expect(convertUnit(2, 'weight', 't', 'kg')).toBe(2000);
    });

    it('should handle reverse conversion correctly', () => {
      const value = 3;
      const converted = convertUnit(value, 'weight', 'kg', 'g');
      const backConverted = convertUnit(converted, 'weight', 'g', 'kg');
      expect(backConverted).toBeCloseTo(value, 10);
    });
  });

  describe('Area Unit Conversion', () => {
    it('should convert mm² to cm² correctly', () => {
      // 100mm² = 1cm²
      expect(convertUnit(100, 'area', 'mm²', 'cm²')).toBe(1);
      expect(convertUnit(500, 'area', 'mm²', 'cm²')).toBe(5);
    });

    it('should convert cm² to mm² correctly', () => {
      // 1cm² = 100mm²
      expect(convertUnit(1, 'area', 'cm²', 'mm²')).toBe(100);
      expect(convertUnit(5, 'area', 'cm²', 'mm²')).toBe(500);
    });

    it('should convert cm² to dm² correctly', () => {
      // 100cm² = 1dm²
      expect(convertUnit(100, 'area', 'cm²', 'dm²')).toBe(1);
      expect(convertUnit(500, 'area', 'cm²', 'dm²')).toBe(5);
    });

    it('should convert dm² to m² correctly', () => {
      // 100dm² = 1m²
      expect(convertUnit(100, 'area', 'dm²', 'm²')).toBe(1);
      expect(convertUnit(500, 'area', 'dm²', 'm²')).toBe(5);
    });

    it('should convert m² to cm² correctly', () => {
      // 1m² = 10000cm²
      expect(convertUnit(1, 'area', 'm²', 'cm²')).toBe(10000);
      expect(convertUnit(2, 'area', 'm²', 'cm²')).toBe(20000);
    });

    it('should handle reverse conversion correctly', () => {
      const value = 2;
      const converted = convertUnit(value, 'area', 'm²', 'cm²');
      const backConverted = convertUnit(converted, 'area', 'cm²', 'm²');
      expect(backConverted).toBeCloseTo(value, 10);
    });
  });

  describe('Volume Unit Conversion', () => {
    it('should convert mm³ to cm³ correctly', () => {
      // 1000mm³ = 1cm³
      expect(convertUnit(1000, 'volume', 'mm³', 'cm³')).toBe(1);
      expect(convertUnit(5000, 'volume', 'mm³', 'cm³')).toBe(5);
    });

    it('should convert cm³ to mm³ correctly', () => {
      // 1cm³ = 1000mm³
      expect(convertUnit(1, 'volume', 'cm³', 'mm³')).toBe(1000);
      expect(convertUnit(5, 'volume', 'cm³', 'mm³')).toBe(5000);
    });

    it('should convert cm³ to dm³ correctly', () => {
      // 1000cm³ = 1dm³
      expect(convertUnit(1000, 'volume', 'cm³', 'dm³')).toBe(1);
      expect(convertUnit(5000, 'volume', 'cm³', 'dm³')).toBe(5);
    });

    it('should convert dm³ to m³ correctly', () => {
      // 1000dm³ = 1m³
      expect(convertUnit(1000, 'volume', 'dm³', 'm³')).toBe(1);
      expect(convertUnit(2000, 'volume', 'dm³', 'm³')).toBe(2);
    });

    it('should convert L to mL correctly', () => {
      // 1L = 1000mL
      expect(convertUnit(1, 'volume', 'L', 'mL')).toBe(1000);
      expect(convertUnit(2, 'volume', 'L', 'mL')).toBe(2000);
    });

    it('should convert mL to L correctly', () => {
      // 1000mL = 1L
      expect(convertUnit(1000, 'volume', 'mL', 'L')).toBe(1);
      expect(convertUnit(2000, 'volume', 'mL', 'L')).toBe(2);
    });

    it('should convert L to dm³ correctly', () => {
      // 1L = 1dm³
      expect(convertUnit(1, 'volume', 'L', 'dm³')).toBe(1);
      expect(convertUnit(2, 'volume', 'L', 'dm³')).toBe(2);
    });

    it('should convert dm³ to L correctly', () => {
      // 1dm³ = 1L
      expect(convertUnit(1, 'volume', 'dm³', 'L')).toBe(1);
      expect(convertUnit(2, 'volume', 'dm³', 'L')).toBe(2);
    });

    it('should convert mL to cm³ correctly', () => {
      // 1mL = 1cm³
      expect(convertUnit(1, 'volume', 'mL', 'cm³')).toBe(1);
      expect(convertUnit(5, 'volume', 'mL', 'cm³')).toBe(5);
    });

    it('should convert cm³ to mL correctly', () => {
      // 1cm³ = 1mL
      expect(convertUnit(1, 'volume', 'cm³', 'mL')).toBe(1);
      expect(convertUnit(5, 'volume', 'cm³', 'mL')).toBe(5);
    });

    it('should handle reverse conversion correctly', () => {
      const value = 3;
      const converted = convertUnit(value, 'volume', 'L', 'mL');
      const backConverted = convertUnit(converted, 'volume', 'mL', 'L');
      expect(backConverted).toBeCloseTo(value, 10);
    });
  });

  describe('Time Unit Conversion', () => {
    it('should convert s to min correctly', () => {
      // 60s = 1min
      expect(convertUnit(60, 'time', 's', 'min')).toBe(1);
      expect(convertUnit(120, 'time', 's', 'min')).toBe(2);
    });

    it('should convert min to s correctly', () => {
      // 1min = 60s
      expect(convertUnit(1, 'time', 'min', 's')).toBe(60);
      expect(convertUnit(2, 'time', 'min', 's')).toBe(120);
    });

    it('should convert min to h correctly', () => {
      // 60min = 1h
      expect(convertUnit(60, 'time', 'min', 'h')).toBe(1);
      expect(convertUnit(120, 'time', 'min', 'h')).toBe(2);
    });

    it('should convert h to min correctly', () => {
      // 1h = 60min
      expect(convertUnit(1, 'time', 'h', 'min')).toBe(60);
      expect(convertUnit(2, 'time', 'h', 'min')).toBe(120);
    });

    it('should convert h to s correctly', () => {
      // 1h = 3600s
      expect(convertUnit(1, 'time', 'h', 's')).toBe(3600);
      expect(convertUnit(2, 'time', 'h', 's')).toBe(7200);
    });

    it('should convert s to h correctly', () => {
      // 3600s = 1h
      expect(convertUnit(3600, 'time', 's', 'h')).toBe(1);
      expect(convertUnit(7200, 'time', 's', 'h')).toBe(2);
    });

    it('should convert d to h correctly', () => {
      // 1d = 24h
      expect(convertUnit(1, 'time', 'd', 'h')).toBe(24);
      expect(convertUnit(2, 'time', 'd', 'h')).toBe(48);
    });

    it('should handle reverse conversion correctly', () => {
      const value = 2;
      const converted = convertUnit(value, 'time', 'h', 'min');
      const backConverted = convertUnit(converted, 'time', 'min', 'h');
      expect(backConverted).toBeCloseTo(value, 10);
    });
  });

  describe('getAvailableUnits', () => {
    it('should return all length units', () => {
      const units = getAvailableUnits('length');
      expect(units).toContain('mm');
      expect(units).toContain('cm');
      expect(units).toContain('dm');
      expect(units).toContain('m');
      expect(units).toContain('km');
    });

    it('should return all weight units', () => {
      const units = getAvailableUnits('weight');
      expect(units).toContain('g');
      expect(units).toContain('kg');
      expect(units).toContain('t');
    });

    it('should return all area units', () => {
      const units = getAvailableUnits('area');
      expect(units).toContain('mm²');
      expect(units).toContain('cm²');
      expect(units).toContain('dm²');
      expect(units).toContain('m²');
      expect(units).toContain('km²');
    });

    it('should return all volume units', () => {
      const units = getAvailableUnits('volume');
      expect(units).toContain('mm³');
      expect(units).toContain('cm³');
      expect(units).toContain('dm³');
      expect(units).toContain('m³');
      expect(units).toContain('L');
      expect(units).toContain('mL');
    });

    it('should return all time units', () => {
      const units = getAvailableUnits('time');
      expect(units).toContain('s');
      expect(units).toContain('min');
      expect(units).toContain('h');
      expect(units).toContain('d');
    });
  });

  describe('getUnitDisplayName', () => {
    it('should return correct Chinese display names for length units', () => {
      expect(getUnitDisplayName('mm')).toBe('毫米');
      expect(getUnitDisplayName('cm')).toBe('厘米');
      expect(getUnitDisplayName('dm')).toBe('分米');
      expect(getUnitDisplayName('m')).toBe('米');
      expect(getUnitDisplayName('km')).toBe('千米');
    });

    it('should return correct Chinese display names for weight units', () => {
      expect(getUnitDisplayName('g')).toBe('克');
      expect(getUnitDisplayName('kg')).toBe('千克');
      expect(getUnitDisplayName('t')).toBe('吨');
    });
  });

  describe('validateUnitConversionAnswer', () => {
    it('should validate correct answers', () => {
      expect(validateUnitConversionAnswer(100, 100)).toBe(true);
      expect(validateUnitConversionAnswer(100.01, 100, 0.1)).toBe(true);
      expect(validateUnitConversionAnswer(99.99, 100, 0.1)).toBe(true);
    });

    it('should reject incorrect answers', () => {
      expect(validateUnitConversionAnswer(100, 200)).toBe(false);
      expect(validateUnitConversionAnswer(100.1, 100, 0.01)).toBe(false);
    });
  });
});
