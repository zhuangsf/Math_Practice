// Comparison utilities
// modify by jx: implement comparison calculation functions for integers, decimals, and fractions

/**
 * Compare two integers
 * @param a First integer
 * @param b Second integer
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareIntegers(a: number, b: number): number {
  // modify by jx: compare two integers
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Compare two decimals with specified precision
 * @param a First decimal
 * @param b Second decimal
 * @param precision Number of decimal places to consider
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareDecimals(a: number, b: number, precision: number = 2): number {
  // modify by jx: compare two decimals with precision
  const factor = Math.pow(10, precision);
  const aRounded = Math.round(a * factor) / factor;
  const bRounded = Math.round(b * factor) / factor;
  
  if (aRounded < bRounded) return -1;
  if (aRounded > bRounded) return 1;
  return 0;
}

/**
 * Compare two fractions
 * @param num1 Numerator of first fraction
 * @param den1 Denominator of first fraction
 * @param num2 Numerator of second fraction
 * @param den2 Denominator of second fraction
 * @returns -1 if fraction1 < fraction2, 0 if equal, 1 if fraction1 > fraction2
 */
export function compareFractions(
  num1: number,
  den1: number,
  num2: number,
  den2: number
): number {
  // modify by jx: compare two fractions using cross-multiplication
  // a/b vs c/d = a*d vs b*c
  const left = num1 * den2;
  const right = num2 * den1;
  
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/**
 * Format comparison result for display
 * @param comparisonResult Comparison result (-1, 0, 1)
 * @returns Display string for comparison symbol
 */
export function formatComparisonResult(comparisonResult: number): string {
  // modify by jx: format comparison result for display
  if (comparisonResult === -1) return '<';
  if (comparisonResult === 1) return '>';
  return '=';
}

/**
 * Generate random integers for comparison
 * @param min Minimum value
 * @param max Maximum value
 * @returns Array of two random integers
 */
export function generateRandomIntegers(min: number, max: number): [number, number] {
  // modify by jx: generate two random integers
  const a = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  return [a, b];
}

/**
 * Generate random decimals for comparison
 * @param min Minimum value
 * @param max Maximum value
 * @param decimalPlaces Number of decimal places
 * @returns Array of two random decimals
 */
export function generateRandomDecimals(
  min: number,
  max: number,
  decimalPlaces: number = 2
): [number, number] {
  // modify by jx: generate two random decimals
  const factor = Math.pow(10, decimalPlaces);
  const a = Math.floor(Math.random() * (max - min) * factor) / factor + min;
  const b = Math.floor(Math.random() * (max - min) * factor) / factor + min;
  return [a, b];
}

/**
 * Generate random fractions for comparison
 * @param maxDenominator Maximum denominator
 * @returns Array of two fractions [num1, den1], [num2, den2]
 */
export function generateRandomFractions(maxDenominator: number): [[number, number], [number, number]] {
  // modify by jx: generate two random fractions for comparison
  // modify by jx: fix off-by-one error - denominator should be in range [2, maxDenominator]
  const den1 = Math.floor(Math.random() * (maxDenominator - 1)) + 2;
  const num1 = Math.floor(Math.random() * den1 * 10) + 1;
  
  const den2 = Math.floor(Math.random() * (maxDenominator - 1)) + 2;
  const num2 = Math.floor(Math.random() * den2 * 10) + 1;
  
  return [[num1, den1], [num2, den2]];
}

/**
 * Validate comparison answer
 * @param studentAnswer Student's answer ('<', '>', or '=')
 * @param correctAnswer Correct comparison result
 * @returns True if answer is correct
 */
export function validateComparisonAnswer(
  studentAnswer: string,
  correctAnswer: number
): boolean {
  // modify by jx: validate comparison answer
  const normalizedAnswer = studentAnswer.trim();
  if (normalizedAnswer === '<') return correctAnswer === -1;
  if (normalizedAnswer === '>') return correctAnswer === 1;
  if (normalizedAnswer === '=') return correctAnswer === 0;
  return false;
}

/**
 * Format fraction for display
 * @param num Numerator
 * @param den Denominator
 * @returns Formatted fraction string
 */
export function formatFraction(num: number, den: number): string {
  // modify by jx: format fraction for display
  return `${num}/${den}`;
}

/**
 * Compare a decimal with a fraction
 * @param decimal The decimal number
 * @param num Numerator of fraction
 * @param den Denominator of fraction
 * @returns -1 if decimal < fraction, 0 if equal, 1 if decimal > fraction
 */
export function compareDecimalWithFraction(
  decimal: number,
  num: number,
  den: number
): number {
  // modify by jx: compare decimal with fraction
  // Convert fraction to decimal: decimal vs num/den
  const fractionValue = num / den;
  
  if (decimal < fractionValue) return -1;
  if (decimal > fractionValue) return 1;
  return 0;
}

/**
 * Compare a fraction with a decimal
 * @param num Numerator of fraction
 * @param den Denominator of fraction
 * @param decimal The decimal number
 * @returns -1 if fraction < decimal, 0 if equal, 1 if fraction > decimal
 */
export function compareFractionWithDecimal(
  num: number,
  den: number,
  decimal: number
): number {
  // modify by jx: compare fraction with decimal
  // Convert fraction to decimal: num/den vs decimal
  const fractionValue = num / den;
  
  if (fractionValue < decimal) return -1;
  if (fractionValue > decimal) return 1;
  return 0;
}

/**
 * Generate a random decimal and a random fraction for mixed comparison
 * @param min Minimum value for decimal
 * @param max Maximum value for decimal
 * @param decimalPlaces Number of decimal places
 * @param maxDenominator Maximum denominator for fraction
 * @returns Object with decimal and fraction data
 */
export function generateRandomDecimalAndFraction(
  min: number,
  max: number,
  decimalPlaces: number = 2,
  maxDenominator: number = 10
): {
  decimal: number;
  num: number;
  den: number;
  decimalPlaces: number;
} {
  // modify by jx: generate random decimal and fraction for mixed comparison
  const factor = Math.pow(10, decimalPlaces);
  const decimal = Math.floor(Math.random() * (max - min) * factor) / factor + min;
  
  const den = Math.floor(Math.random() * (maxDenominator - 1)) + 2;
  const num = Math.floor(Math.random() * den * 10) + 1;
  
  return {
    decimal,
    num,
    den,
    decimalPlaces
  };
}

/**
 * Format mixed decimal-fraction comparison for display
 * @param decimal The decimal number
 * @param num Numerator of fraction
 * @param den Denominator of fraction
 * @param decimalPlaces Number of decimal places
 * @returns Formatted comparison expression string
 */
export function formatDecimalFractionComparison(
  decimal: number,
  num: number,
  den: number,
  decimalPlaces: number
): string {
  // modify by jx: format mixed comparison for display
  return `${decimal.toFixed(decimalPlaces)} ? ${num}/${den}`;
}
