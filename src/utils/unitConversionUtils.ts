// Unit conversion utilities
// modify by jx: implement unit conversion functions for length, weight, area, volume and time

// Unit conversion factors
const LENGTH_UNITS: Record<string, number> = {
  'mm': 1,
  'cm': 10,
  'dm': 100,
  'm': 1000,
  'km': 1000000
};

const WEIGHT_UNITS: Record<string, number> = {
  'g': 1,
  'kg': 1000,
  't': 1000000
};

const AREA_UNITS: Record<string, number> = {
  'mm²': 1,
  'cm²': 100,
  'dm²': 10000,
  'm²': 1000000,
  'km²': 1000000000000
};

const VOLUME_UNITS: Record<string, number> = {
  'mm³': 1,
  'cm³': 1000,
  'dm³': 1000000,
  'm³': 1000000000,
  'L': 1000000,
  'mL': 1000
};

const TIME_UNITS: Record<string, number> = {
  's': 1,
  'min': 60,
  'h': 3600,
  'd': 86400
};

/**
 * Get unit factor for a specific unit (for comparison purposes)
 * @param unitType Unit type
 * @param unit Unit name
 * @returns Unit factor (relative to base unit)
 */
export function getUnitFactor(
  unitType: 'length' | 'weight' | 'area' | 'volume' | 'time',
  unit: string
): number {
  // modify by jx: export unit factor function to avoid code duplication
  let units: Record<string, number>;
  
  switch (unitType) {
    case 'length':
      units = LENGTH_UNITS;
      break;
    case 'weight':
      units = WEIGHT_UNITS;
      break;
    case 'area':
      units = AREA_UNITS;
      break;
    case 'volume':
      units = VOLUME_UNITS;
      break;
    case 'time':
      units = TIME_UNITS;
      break;
    default:
      throw new Error(`Unknown unit type: ${unitType}`);
  }
  
  return units[unit] || 1;
}

/**
 * Get unit conversion factor
 * @param unitType Unit type
 * @param fromUnit Source unit
 * @param toUnit Target unit
 * @returns Conversion factor
 */
function getConversionFactor(
  unitType: 'length' | 'weight' | 'area' | 'volume' | 'time',
  fromUnit: string,
  toUnit: string
): number {
  // modify by jx: get conversion factor between two units
  const fromFactor = getUnitFactor(unitType, fromUnit);
  const toFactor = getUnitFactor(unitType, toUnit);
  
  if (!fromFactor || !toFactor) {
    throw new Error(`Invalid units: ${fromUnit} or ${toUnit}`);
  }
  
  return fromFactor / toFactor;
}

/**
 * Convert value from one unit to another
 * @param value Original value
 * @param unitType Unit type
 * @param fromUnit Source unit
 * @param toUnit Target unit
 * @returns Converted value
 */
export function convertUnit(
  value: number,
  unitType: 'length' | 'weight' | 'area' | 'volume' | 'time',
  fromUnit: string,
  toUnit: string
): number {
  // modify by jx: convert value from one unit to another with precision fix to avoid floating point errors
  const factor = getConversionFactor(unitType, fromUnit, toUnit);
  const result = value * factor;
  
  // Fix floating point precision issues by rounding to 10 decimal places
  // This prevents issues like 1.2000000000000002 when converting 12mm to cm
  // Use Number.parseFloat to remove trailing zeros
  return Number.parseFloat(result.toFixed(10));
}

/**
 * Get all available units for a unit type
 * @param unitType Unit type
 * @returns Array of unit names
 */
export function getAvailableUnits(unitType: 'length' | 'weight' | 'area' | 'volume' | 'time'): string[] {
  // modify by jx: get all available units for a unit type
  switch (unitType) {
    case 'length':
      return Object.keys(LENGTH_UNITS);
    case 'weight':
      return Object.keys(WEIGHT_UNITS);
    case 'area':
      return Object.keys(AREA_UNITS);
    case 'volume':
      return Object.keys(VOLUME_UNITS);
    case 'time':
      return Object.keys(TIME_UNITS);
    default:
      return [];
  }
}

/**
 * Get unit display name
 * @param unit Unit name
 * @returns Display name
 */
export function getUnitDisplayName(unit: string): string {
  // modify by jx: get unit display name for Chinese
  const displayNames: Record<string, string> = {
    'mm': '毫米',
    'cm': '厘米',
    'dm': '分米',
    'm': '米',
    'km': '千米',
    'g': '克',
    'kg': '千克',
    't': '吨',
    'mm²': '平方毫米',
    'cm²': '平方厘米',
    'dm²': '平方分米',
    'm²': '平方米',
    'km²': '平方千米',
    'mm³': '立方毫米',
    'cm³': '立方厘米',
    'dm³': '立方分米',
    'm³': '立方米',
    'L': '升',
    'mL': '毫升',
    's': '秒',
    'min': '分钟',
    'h': '小时',
    'd': '天'
  };
  
  return displayNames[unit] || unit;
}

/**
 * Validate unit conversion answer
 * @param studentAnswer Student's answer
 * @param correctAnswer Correct answer
 * @param tolerance Tolerance for comparison (default: 0.01)
 * @returns True if answer is correct within tolerance
 */
export function validateUnitConversionAnswer(
  studentAnswer: number,
  correctAnswer: number,
  tolerance: number = 0.01
): boolean {
  // modify by jx: validate unit conversion answer with tolerance
  return Math.abs(studentAnswer - correctAnswer) <= tolerance;
}
