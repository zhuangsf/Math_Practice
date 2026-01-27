// Fraction operation utilities
// modify by jx: implement fraction calculation functions including addition, subtraction, multiplication, division and simplification

import type { Fraction, OperationType } from '@/types';

/**
 * Calculate greatest common divisor (GCD) using Euclidean algorithm
 * @param a First number
 * @param b Second number
 * @returns GCD of a and b
 */
export function gcd(a: number, b: number): number {
  // modify by jx: use Euclidean algorithm to calculate GCD
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Calculate least common multiple (LCM) of two numbers
 * @param a First number
 * @param b Second number
 * @returns LCM of a and b
 */
export function lcm(a: number, b: number): number {
  // modify by jx: calculate LCM using GCD formula: LCM(a,b) = |a*b| / GCD(a,b)
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Simplify a fraction to its lowest terms
 * @param fraction Fraction to simplify
 * @returns Simplified fraction
 */
export function simplifyFraction(fraction: Fraction): Fraction {
  // modify by jx: simplify fraction by dividing numerator and denominator by their GCD
  if (fraction.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  
  const divisor = gcd(fraction.numerator, fraction.denominator);
  const simplified: Fraction = {
    numerator: fraction.numerator / divisor,
    denominator: fraction.denominator / divisor
  };
  
  // Ensure denominator is positive
  if (simplified.denominator < 0) {
    simplified.numerator = -simplified.numerator;
    simplified.denominator = -simplified.denominator;
  }
  
  return simplified;
}

/**
 * Convert a fraction to string representation
 * @param fraction Fraction to convert
 * @param asMixedNumber Whether to convert to mixed number if numerator > denominator
 * @returns String representation (e.g., "3/4" or "1 1/2")
 */
export function fractionToString(fraction: Fraction, asMixedNumber: boolean = false): string {
  // modify by jx: convert fraction to string, optionally as mixed number
  const simplified = simplifyFraction(fraction);
  
  if (simplified.denominator === 1) {
    return simplified.numerator.toString();
  }
  
  if (asMixedNumber && Math.abs(simplified.numerator) > simplified.denominator) {
    const whole = Math.floor(Math.abs(simplified.numerator) / simplified.denominator);
    const remainder = Math.abs(simplified.numerator) % simplified.denominator;
    const sign = simplified.numerator < 0 ? '-' : '';
    if (remainder === 0) {
      return `${sign}${whole}`;
    }
    return `${sign}${whole} ${remainder}/${simplified.denominator}`;
  }
  
  return `${simplified.numerator}/${simplified.denominator}`;
}

/**
 * Parse a fraction string to Fraction object
 * Supports formats: "3/4", "1 1/2", "5"
 * @param str Fraction string
 * @returns Fraction object
 */
export function parseFraction(str: string): Fraction {
  // modify by jx: parse fraction string to Fraction object, support mixed numbers
  str = str.trim();
  
  // Handle integer
  if (!str.includes('/')) {
    const num = parseInt(str, 10);
    if (isNaN(num)) {
      throw new Error(`Invalid fraction format: ${str}`);
    }
    return { numerator: num, denominator: 1 };
  }
  
  // Handle mixed number (e.g., "1 1/2")
  const mixedMatch = str.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    if (den === 0) {
      throw new Error('Denominator cannot be zero');
    }
    const numerator = whole * den + (whole < 0 ? -num : num);
    return simplifyFraction({ numerator, denominator: den });
  }
  
  // Handle simple fraction (e.g., "3/4")
  const fractionMatch = str.match(/^(-?\d+)\/(\d+)$/);
  if (fractionMatch) {
    const num = parseInt(fractionMatch[1], 10);
    const den = parseInt(fractionMatch[2], 10);
    if (den === 0) {
      throw new Error('Denominator cannot be zero');
    }
    return simplifyFraction({ numerator: num, denominator: den });
  }
  
  throw new Error(`Invalid fraction format: ${str}`);
}

/**
 * Check if two fractions are equal
 * @param a First fraction
 * @param b Second fraction
 * @returns True if fractions are equal
 */
export function fractionsEqual(a: Fraction, b: Fraction): boolean {
  // modify by jx: compare two fractions by comparing simplified forms
  const aSimplified = simplifyFraction(a);
  const bSimplified = simplifyFraction(b);
  return aSimplified.numerator === bSimplified.numerator &&
         aSimplified.denominator === bSimplified.denominator;
}

/**
 * Add two fractions
 * @param a First fraction
 * @param b Second fraction
 * @returns Sum of the two fractions (simplified)
 */
export function addFractions(a: Fraction, b: Fraction): Fraction {
  // modify by jx: add two fractions by finding common denominator
  if (a.denominator === 0 || b.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  
  const commonDenominator = lcm(a.denominator, b.denominator);
  const numerator = a.numerator * (commonDenominator / a.denominator) +
                    b.numerator * (commonDenominator / b.denominator);
  
  return simplifyFraction({ numerator, denominator: commonDenominator });
}

/**
 * Subtract two fractions
 * @param a First fraction (minuend)
 * @param b Second fraction (subtrahend)
 * @returns Difference of the two fractions (simplified)
 */
export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  // modify by jx: subtract two fractions by finding common denominator
  if (a.denominator === 0 || b.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  
  const commonDenominator = lcm(a.denominator, b.denominator);
  const numerator = a.numerator * (commonDenominator / a.denominator) -
                    b.numerator * (commonDenominator / b.denominator);
  
  return simplifyFraction({ numerator, denominator: commonDenominator });
}

/**
 * Multiply two fractions
 * @param a First fraction
 * @param b Second fraction
 * @returns Product of the two fractions (simplified)
 */
export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  // modify by jx: multiply two fractions by multiplying numerators and denominators
  if (a.denominator === 0 || b.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  
  const numerator = a.numerator * b.numerator;
  const denominator = a.denominator * b.denominator;
  
  return simplifyFraction({ numerator, denominator });
}

/**
 * Divide two fractions
 * @param a First fraction (dividend)
 * @param b Second fraction (divisor)
 * @returns Quotient of the two fractions (simplified)
 */
export function divideFractions(a: Fraction, b: Fraction): Fraction {
  // modify by jx: divide two fractions by multiplying by reciprocal
  if (a.denominator === 0 || b.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  if (b.numerator === 0) {
    throw new Error('Cannot divide by zero');
  }
  
  const numerator = a.numerator * b.denominator;
  const denominator = a.denominator * b.numerator;
  
  return simplifyFraction({ numerator, denominator });
}

/**
 * Perform operation on two fractions
 * @param a First fraction
 * @param b Second fraction
 * @param operation Operation type
 * @returns Result fraction (simplified)
 */
export function calculateFractionOperation(
  a: Fraction,
  b: Fraction,
  operation: OperationType
): Fraction {
  // modify by jx: perform operation on two fractions based on operation type
  switch (operation) {
    case 'add':
      return addFractions(a, b);
    case 'subtract':
      return subtractFractions(a, b);
    case 'multiply':
      return multiplyFractions(a, b);
    case 'divide':
      return divideFractions(a, b);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

/**
 * Convert integer to fraction
 * @param num Integer number
 * @returns Fraction representation
 */
export function integerToFraction(num: number): Fraction {
  // modify by jx: convert integer to fraction with denominator 1
  return { numerator: num, denominator: 1 };
}

/**
 * Convert fraction to decimal number
 * @param fraction Fraction to convert
 * @returns Decimal number
 */
export function fractionToDecimal(fraction: Fraction): number {
  // modify by jx: convert fraction to decimal by dividing numerator by denominator
  if (fraction.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  return fraction.numerator / fraction.denominator;
}

/**
 * Generate a random fraction within specified ranges
 * @param numeratorRange Range for numerator [min, max]
 * @param denominatorRange Range for denominator [min, max]
 * @returns Random fraction (simplified)
 */
export function generateRandomFraction(
  numeratorRange: [number, number],
  denominatorRange: [number, number]
): Fraction {
  // modify by jx: generate random fraction within specified ranges
  const numerator = Math.floor(Math.random() * (numeratorRange[1] - numeratorRange[0] + 1)) + numeratorRange[0];
  const denominator = Math.floor(Math.random() * (denominatorRange[1] - denominatorRange[0] + 1)) + denominatorRange[0];
  
  if (denominator === 0) {
    // Retry if denominator is zero
    return generateRandomFraction(numeratorRange, denominatorRange);
  }
  
  return simplifyFraction({ numerator, denominator });
}
