// Bug reproduction tests for unit conversion
// modify by jx: reproduce specific bugs reported by user

import { describe, it, expect } from 'vitest';
import { convertUnit } from './unitConversionUtils';

describe('UnitConversionUtils - Bug Reproduction', () => {
  it('should correctly convert 27 meters to centimeters', () => {
    // Bug: 27米 = ?厘米  显示答案27，应该是2700
    const result = convertUnit(27, 'length', 'm', 'cm');
    console.log('27m to cm:', result);
    expect(result).toBe(2700);
  });

  it('should correctly convert 30 decimeters to centimeters', () => {
    // Bug: 30分米 = ?厘米  显示答案3，应该是300
    const result = convertUnit(30, 'length', 'dm', 'cm');
    console.log('30dm to cm:', result);
    expect(result).toBe(300);
  });

  it('should correctly convert 85 tons to kilograms', () => {
    // Bug: 85吨 = ?千克  显示答案85，应该是85000
    const result = convertUnit(85, 'weight', 't', 'kg');
    console.log('85t to kg:', result);
    expect(result).toBe(85000);
  });

  it('should verify conversion factors are correct', () => {
    // Verify the conversion factors
    const mToCm = convertUnit(1, 'length', 'm', 'cm');
    console.log('1m to cm factor:', mToCm);
    expect(mToCm).toBe(100);

    const dmToCm = convertUnit(1, 'length', 'dm', 'cm');
    console.log('1dm to cm factor:', dmToCm);
    expect(dmToCm).toBe(10);

    const tToKg = convertUnit(1, 'weight', 't', 'kg');
    console.log('1t to kg factor:', tToKg);
    expect(tToKg).toBe(1000);
  });
});
