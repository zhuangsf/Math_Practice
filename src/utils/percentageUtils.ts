// Percentage operation utilities
// modify by jx: implement percentage calculation functions including conversion and application problems

/**
 * Convert decimal to percentage
 * @param decimal Decimal number (e.g., 0.75)
 * @returns Percentage string (e.g., "75%")
 */
export function decimalToPercent(decimal: number): string {
  // modify by jx: convert decimal to percentage string
  return `${(decimal * 100).toFixed(0)}%`;
}

/**
 * Convert percentage to decimal
 * @param percent Percentage string (e.g., "75%") or number (e.g., 75)
 * @returns Decimal number (e.g., 0.75)
 */
export function percentToDecimal(percent: string | number): number {
  // modify by jx: convert percentage to decimal number
  if (typeof percent === 'number') {
    return percent / 100;
  }
  const cleaned = percent.toString().replace('%', '').trim();
  const num = parseFloat(cleaned);
  if (isNaN(num)) {
    throw new Error(`Invalid percentage format: ${percent}`);
  }
  return num / 100;
}

/**
 * Convert fraction to percentage
 * @param numerator Numerator
 * @param denominator Denominator
 * @returns Percentage string (e.g., "75%")
 */
export function fractionToPercent(numerator: number, denominator: number): string {
  // modify by jx: convert fraction to percentage string
  if (denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  const decimal = numerator / denominator;
  return decimalToPercent(decimal);
}

/**
 * Convert percentage to fraction
 * @param percent Percentage string (e.g., "75%") or number (e.g., 75)
 * @returns Object with numerator and denominator
 */
export function percentToFraction(percent: string | number): { numerator: number; denominator: number } {
  // modify by jx: convert percentage to simplified fraction
  const decimal = percentToDecimal(percent);
  
  // Convert decimal to fraction
  // Find the number of decimal places
  const str = decimal.toString();
  const decimalPlaces = str.includes('.') ? str.split('.')[1].length : 0;
  const denominator = Math.pow(10, decimalPlaces);
  const numerator = Math.round(decimal * denominator);
  
  // Simplify fraction
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };
  const divisor = gcd(numerator, denominator);
  
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}

/**
 * Calculate percentage of a number
 * @param percent Percentage (e.g., 25 for 25%)
 * @param total Total number
 * @returns Part value
 */
export function findPart(percent: number, total: number): number {
  // modify by jx: calculate part value from percentage and total
  return (percent / 100) * total;
}

/**
 * Calculate total from part and percentage
 * @param part Part value
 * @param percent Percentage (e.g., 25 for 25%)
 * @returns Total value
 */
export function findTotal(part: number, percent: number): number {
  // modify by jx: calculate total value from part and percentage
  if (percent === 0) {
    throw new Error('Percentage cannot be zero');
  }
  return (part / percent) * 100;
}

/**
 * Calculate percentage from part and total
 * @param part Part value
 * @param total Total value
 * @returns Percentage number (e.g., 25 for 25%)
 */
export function findPercent(part: number, total: number): number {
  // modify by jx: calculate percentage from part and total
  if (total === 0) {
    throw new Error('Total cannot be zero');
  }
  return (part / total) * 100;
}

/**
 * Format percentage for display
 * @param percent Percentage number (e.g., 25 for 25%)
 * @param decimalPlaces Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercent(percent: number, decimalPlaces: number = 0): string {
  // modify by jx: format percentage number to string with specified decimal places
  return `${percent.toFixed(decimalPlaces)}%`;
}

/**
 * Parse percentage answer from string
 * @param answer Answer string (e.g., "75%", "75", "0.75")
 * @returns Percentage number (e.g., 75 for 75%)
 */
export function parsePercentAnswer(answer: string): number {
  // modify by jx: parse percentage answer from various formats
  const cleaned = answer.trim();
  
  // If contains %, parse as percentage
  if (cleaned.includes('%')) {
    const num = parseFloat(cleaned.replace('%', ''));
    if (isNaN(num)) {
      throw new Error(`Invalid percentage format: ${answer}`);
    }
    return num;
  }
  
  // If number is between 0 and 1, treat as decimal
  const num = parseFloat(cleaned);
  if (isNaN(num)) {
    throw new Error(`Invalid percentage format: ${answer}`);
  }
  
  if (num > 0 && num <= 1) {
    return num * 100;
  }
  
  // Otherwise treat as percentage
  return num;
}

/**
 * Validate percentage answer
 * @param studentAnswer Student's answer
 * @param correctAnswer Correct answer
 * @param tolerance Tolerance for comparison (default: 0.01)
 * @returns True if answer is correct within tolerance
 */
export function validatePercentAnswer(
  studentAnswer: string | number,
  correctAnswer: number | string,
  tolerance: number = 0.01
): boolean {
  // modify by jx: validate percentage answer with tolerance
  let studentNum: number;
  let correctNum: number;
  
  if (typeof studentAnswer === 'string') {
    studentNum = parsePercentAnswer(studentAnswer);
  } else {
    studentNum = studentAnswer;
  }
  
  if (typeof correctAnswer === 'string') {
    correctNum = parsePercentAnswer(correctAnswer);
  } else {
    correctNum = correctAnswer;
  }
  
  return Math.abs(studentNum - correctNum) <= tolerance;
}
