// Geometry calculation utilities
// modify by jx: implement geometry calculation functions for perimeter, area and volume

/**
 * Calculate rectangle perimeter
 * @param length Length
 * @param width Width
 * @returns Perimeter
 */
export function calculateRectanglePerimeter(length: number, width: number): number {
  // modify by jx: calculate rectangle perimeter: 2 * (length + width)
  return 2 * (length + width);
}

/**
 * Calculate rectangle area
 * @param length Length
 * @param width Width
 * @returns Area
 */
export function calculateRectangleArea(length: number, width: number): number {
  // modify by jx: calculate rectangle area: length * width
  return length * width;
}

/**
 * Calculate square perimeter
 * @param side Side length
 * @returns Perimeter
 */
export function calculateSquarePerimeter(side: number): number {
  // modify by jx: calculate square perimeter: 4 * side
  return 4 * side;
}

/**
 * Calculate square area
 * @param side Side length
 * @returns Area
 */
export function calculateSquareArea(side: number): number {
  // modify by jx: calculate square area: side * side
  return side * side;
}

/**
 * Calculate triangle perimeter
 * @param side1 First side
 * @param side2 Second side
 * @param side3 Third side
 * @returns Perimeter
 */
export function calculateTrianglePerimeter(side1: number, side2: number, side3: number): number {
  // modify by jx: calculate triangle perimeter: sum of all sides
  return side1 + side2 + side3;
}

/**
 * Calculate triangle area (using base and height)
 * @param base Base length
 * @param height Height
 * @returns Area
 */
export function calculateTriangleArea(base: number, height: number): number {
  // modify by jx: calculate triangle area: 0.5 * base * height
  return 0.5 * base * height;
}

/**
 * Calculate circle perimeter (circumference)
 * @param radius Radius
 * @param piValue Pi value (default: 3.14)
 * @returns Perimeter (circumference)
 */
export function calculateCirclePerimeter(radius: number, piValue: number = 3.14): number {
  // modify by jx: calculate circle perimeter: 2 * π * radius
  return 2 * piValue * radius;
}

/**
 * Calculate circle area
 * @param radius Radius
 * @param piValue Pi value (default: 3.14)
 * @returns Area
 */
export function calculateCircleArea(radius: number, piValue: number = 3.14): number {
  // modify by jx: calculate circle area: π * radius^2
  return piValue * radius * radius;
}

/**
 * Calculate cuboid volume
 * @param length Length
 * @param width Width
 * @param height Height
 * @returns Volume
 */
export function calculateCuboidVolume(length: number, width: number, height: number): number {
  // modify by jx: calculate cuboid volume: length * width * height
  return length * width * height;
}

/**
 * Calculate cuboid surface area
 * @param length Length
 * @param width Width
 * @param height Height
 * @returns Surface area
 */
export function calculateCuboidSurfaceArea(length: number, width: number, height: number): number {
  // modify by jx: calculate cuboid surface area: 2 * (length*width + length*height + width*height)
  return 2 * (length * width + length * height + width * height);
}

/**
 * Calculate cube volume
 * @param side Side length
 * @returns Volume
 */
export function calculateCubeVolume(side: number): number {
  // modify by jx: calculate cube volume: side^3
  return side * side * side;
}

/**
 * Calculate cube surface area
 * @param side Side length
 * @returns Surface area
 */
export function calculateCubeSurfaceArea(side: number): number {
  // modify by jx: calculate cube surface area: 6 * side^2
  return 6 * side * side;
}

/**
 * Validate geometry answer
 * @param studentAnswer Student's answer
 * @param correctAnswer Correct answer
 * @param tolerance Tolerance for comparison (default: 0.01)
 * @returns True if answer is correct within tolerance
 */
export function validateGeometryAnswer(
  studentAnswer: number,
  correctAnswer: number,
  tolerance: number = 0.01
): boolean {
  // modify by jx: validate geometry answer with tolerance
  return Math.abs(studentAnswer - correctAnswer) <= tolerance;
}
