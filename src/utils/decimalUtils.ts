// Decimal operation utilities
// modify by jx: implement decimal calculation functions including addition, subtraction, multiplication, division with precision handling

/**
 * Round a number to specified decimal places
 * @param num Number to round
 * @param decimalPlaces Number of decimal places
 * @returns Rounded number
 */
export function roundToDecimalPlaces(num: number, decimalPlaces: number): number {
  // modify by jx: round number to specified decimal places using Math.round
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

/**
 * Format decimal number to string with specified decimal places
 * @param num Number to format
 * @param decimalPlaces Number of decimal places
 * @returns Formatted string (e.g., "3.140" for 3 decimal places)
 */
export function formatDecimal(num: number, decimalPlaces: number): string {
  // modify by jx: format decimal number to string with specified precision, always show decimal places including trailing zeros
  const rounded = roundToDecimalPlaces(num, decimalPlaces);
  // Always show the specified number of decimal places, including trailing zeros
  return rounded.toFixed(decimalPlaces);
}

/**
 * Parse decimal string to number
 * Supports formats: "3.14", "3", ".5", "0.5"
 * @param str Decimal string
 * @returns Parsed number
 */
export function parseDecimal(str: string): number {
  // modify by jx: parse decimal string to number, handle various formats
  str = str.trim();
  
  // Handle empty string
  if (str === '') {
    throw new Error('Empty string cannot be parsed as decimal');
  }
  
  const num = parseFloat(str);
  if (isNaN(num)) {
    throw new Error(`Invalid decimal format: ${str}`);
  }
  
  return num;
}

/**
 * Check if two decimal numbers are equal within tolerance
 * @param a First number
 * @param b Second number
 * @param tolerance Tolerance for comparison (default: 0.0001)
 * @returns True if numbers are equal within tolerance
 */
export function decimalsEqual(a: number, b: number, tolerance: number = 0.0001): boolean {
  // modify by jx: compare two decimal numbers with tolerance to handle floating point precision issues
  return Math.abs(a - b) < tolerance;
}

/**
 * Add two decimal numbers with precision control
 * @param a First number
 * @param b Second number
 * @param decimalPlaces Number of decimal places for result
 * @returns Sum rounded to specified decimal places
 */
export function addDecimals(a: number, b: number, decimalPlaces: number): number {
  // modify by jx: add two decimal numbers and round to specified decimal places
  return roundToDecimalPlaces(a + b, decimalPlaces);
}

/**
 * Subtract two decimal numbers with precision control
 * @param a First number (minuend)
 * @param b Second number (subtrahend)
 * @param decimalPlaces Number of decimal places for result
 * @returns Difference rounded to specified decimal places
 */
export function subtractDecimals(a: number, b: number, decimalPlaces: number): number {
  // modify by jx: subtract two decimal numbers and round to specified decimal places
  return roundToDecimalPlaces(a - b, decimalPlaces);
}

/**
 * Multiply two decimal numbers with precision control
 * @param a First number
 * @param b Second number
 * @param decimalPlaces Number of decimal places for result
 * @returns Product rounded to specified decimal places
 */
export function multiplyDecimals(a: number, b: number, decimalPlaces: number): number {
  // modify by jx: multiply two decimal numbers and round to specified decimal places
  return roundToDecimalPlaces(a * b, decimalPlaces);
}

/**
 * Divide two decimal numbers with precision control
 * @param a First number (dividend)
 * @param b Second number (divisor)
 * @param decimalPlaces Number of decimal places for result
 * @returns Quotient rounded to specified decimal places
 */
export function divideDecimals(a: number, b: number, decimalPlaces: number): number {
  // modify by jx: divide two decimal numbers and round to specified decimal places
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return roundToDecimalPlaces(a / b, decimalPlaces);
}

/**
 * Generate a random decimal number within specified range
 * @param min Minimum value
 * @param max Maximum value
 * @param decimalPlaces Number of decimal places
 * @returns Random decimal number
 */
export function generateRandomDecimal(min: number, max: number, decimalPlaces: number): number {
  // modify by jx: generate random decimal number within specified range with specified decimal places
  const range = max - min;
  const random = Math.random() * range + min;
  return roundToDecimalPlaces(random, decimalPlaces);
}

/**
 * Calculate expression result with multiple decimal operations
 * Respects operator precedence: multiplication/division before addition/subtraction
 * @param numbers Array of decimal numbers
 * @param operators Array of operators ('add' | 'subtract' | 'multiply' | 'divide')
 * @param decimalPlaces Number of decimal places for result
 * @returns Calculated result rounded to specified decimal places
 */
export function calculateDecimalExpression(
  numbers: number[],
  operators: string[],
  decimalPlaces: number
): number {
  // modify by jx: calculate decimal expression respecting operator precedence
  if (numbers.length === 0 || operators.length === 0) {
    throw new Error('Invalid expression: no numbers or operators');
  }

  // Create copies to avoid mutating original arrays
  const numList = [...numbers];
  const opList = [...operators];

  // First pass: handle multiplication and division (left to right)
  let i = 0;
  while (i < opList.length) {
    const op = opList[i];
    if (op === 'multiply' || op === 'divide') {
      let result: number;
      if (op === 'multiply') {
        result = multiplyDecimals(numList[i], numList[i + 1], decimalPlaces);
      } else {
        result = divideDecimals(numList[i], numList[i + 1], decimalPlaces);
      }
      numList.splice(i, 2, result);
      opList.splice(i, 1);
      // Don't increment i, as we need to check the same position again
    } else {
      i++;
    }
  }

  // Second pass: handle addition and subtraction (left to right)
  let result = numList[0];
  for (let i = 0; i < opList.length; i++) {
    if (opList[i] === 'add') {
      result = addDecimals(result, numList[i + 1], decimalPlaces);
    } else {
      result = subtractDecimals(result, numList[i + 1], decimalPlaces);
    }
  }

  return roundToDecimalPlaces(result, decimalPlaces);
}

/**
 * Validate decimal answer with tolerance
 * @param studentAnswer Student's answer
 * @param correctAnswer Correct answer
 * @param tolerance Tolerance for comparison (default: 0.01)
 * @returns True if answer is correct within tolerance
 */
export function validateDecimalAnswer(
  studentAnswer: number,
  correctAnswer: number,
  tolerance: number = 0.01
): boolean {
  // modify by jx: validate decimal answer with tolerance to account for rounding differences
  return decimalsEqual(studentAnswer, correctAnswer, tolerance);
}
