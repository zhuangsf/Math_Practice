// Composable for generating personalized tutoring plans
// modify by jx: implement tutoring plan generation based on wrong question analysis

import type { 
  WrongQuestionStats, 
  TutoringPlan, 
  QuestionConfig, 
  OperationType,
  FractionWrongQuestionStats,
  FractionTutoringPlan,
  FractionConfig,
  DecimalWrongQuestionStats,
  DecimalTutoringPlan,
  DecimalConfig,
  PercentageWrongQuestionStats,
  PercentageTutoringPlan,
  PercentageConfig,
  UnitConversionWrongQuestionStats,
  UnitConversionTutoringPlan,
  UnitConversionConfig,
  GeometryWrongQuestionStats,
  GeometryTutoringPlan,
  GeometryConfig,
  FactorMultipleWrongQuestionStats,
  FactorMultipleTutoringPlan,
  FactorMultipleConfig,
  PrimeCompositeWrongQuestionStats,
  PrimeCompositeTutoringPlan,
  PrimeCompositeConfig,
  ComparisonWrongQuestionStats,
  ComparisonTutoringPlan,
  ComparisonConfig,
  PatternWrongQuestionStats,
  PatternTutoringPlan,
  PatternConfig
} from '@/types';

/**
 * Generate tutoring plan based on wrong question statistics
 * @param stats Wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns TutoringPlan object
 */
export function generateTutoringPlan(
  stats: WrongQuestionStats,
  totalQuestions: number
): TutoringPlan {
  const weakAreas = {
    operationTypes: [] as OperationType[],
    operandCounts: [] as (2 | 3 | 4)[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze operation types
  const operationTypeCounts = [
    { type: 'add' as OperationType, count: stats.byOperationType.add },
    { type: 'subtract' as OperationType, count: stats.byOperationType.subtract },
    { type: 'multiply' as OperationType, count: stats.byOperationType.multiply },
    { type: 'divide' as OperationType, count: stats.byOperationType.divide }
  ];

  // Find weak operation types
  operationTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.operationTypes.push(type);
      
      const typeName = getOperationTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在${typeName}方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${typeName}方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Analyze operand counts
  const operandCountCounts = [
    { count: 2 as const, wrong: stats.byOperandCount.binary },
    { count: 3 as const, wrong: stats.byOperandCount.ternary },
    { count: 4 as const, wrong: stats.byOperandCount.quaternary }
  ];

  // Find weak operand counts
  operandCountCounts.forEach(({ count, wrong }) => {
    const countErrorRate = wrong / totalQuestions;
    if (countErrorRate >= weakThreshold) {
      weakAreas.operandCounts.push(count);
      
      const countName = getOperandCountDisplayName(count);
      if (countErrorRate >= severeThreshold) {
        suggestions.push(`您在${countName}上错误较多，建议从简单题目开始练习`);
      } else {
        suggestions.push(`您在${countName}上需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<QuestionConfig> | undefined;
  
  if (weakAreas.operationTypes.length > 0 || weakAreas.operandCounts.length > 0) {
    recommendedConfig = {
      operations: weakAreas.operationTypes.length > 0 
        ? weakAreas.operationTypes 
        : undefined,
      operandCount: weakAreas.operandCounts.length > 0
        ? weakAreas.operandCounts[0] // Use the first weak operand count
        : undefined,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Get operation type display name
 * @param type Operation type
 * @returns Display name
 */
function getOperationTypeDisplayName(type: OperationType): string {
  const nameMap: Record<OperationType, string> = {
    add: '加法',
    subtract: '减法',
    multiply: '乘法',
    divide: '除法'
  };
  return nameMap[type] || type;
}

/**
 * Get operand count display name
 * @param count Number of operands
 * @returns Display name
 */
function getOperandCountDisplayName(count: 2 | 3 | 4): string {
  const nameMap: Record<number, string> = {
    2: '二元运算',
    3: '三元运算',
    4: '四元运算'
  };
  return nameMap[count] || `${count}元运算`;
}

/**
 * Generate fraction tutoring plan based on wrong question statistics
 * modify by jx: add function to generate fraction tutoring plan
 * @param stats Fraction wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns FractionTutoringPlan object
 */
export function generateFractionTutoringPlan(
  stats: FractionWrongQuestionStats,
  totalQuestions: number
): FractionTutoringPlan {
  const weakAreas = {
    operationTypes: [] as OperationType[],
    questionTypes: [] as ('same-denominator' | 'different-denominator' | 'mixed' | 'simplify')[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze operation types
  const operationTypeCounts = [
    { type: 'add' as OperationType, count: stats.byOperationType.add },
    { type: 'subtract' as OperationType, count: stats.byOperationType.subtract },
    { type: 'multiply' as OperationType, count: stats.byOperationType.multiply },
    { type: 'divide' as OperationType, count: stats.byOperationType.divide }
  ];

  // Find weak operation types
  operationTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.operationTypes.push(type);
      
      const typeName = getOperationTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在分数${typeName}方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在分数${typeName}方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Analyze question types
  const questionTypeCounts = [
    { type: 'same-denominator' as const, count: stats.byQuestionType['same-denominator'] },
    { type: 'different-denominator' as const, count: stats.byQuestionType['different-denominator'] },
    { type: 'mixed' as const, count: stats.byQuestionType['mixed'] },
    { type: 'simplify' as const, count: stats.byQuestionType['simplify'] }
  ];

  // Find weak question types
  questionTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.questionTypes.push(type);
      
      const typeName = getFractionQuestionTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在${typeName}方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${typeName}方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<FractionConfig> | undefined;
  
  if (weakAreas.operationTypes.length > 0 || weakAreas.questionTypes.length > 0) {
    recommendedConfig = {
      operations: weakAreas.operationTypes.length > 0 
        ? weakAreas.operationTypes 
        : undefined,
      questionTypes: weakAreas.questionTypes.length > 0
        ? weakAreas.questionTypes
        : undefined,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Generate decimal tutoring plan based on wrong question statistics
 * modify by jx: add function to generate decimal tutoring plan
 * @param stats Decimal wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns DecimalTutoringPlan object
 */
export function generateDecimalTutoringPlan(
  stats: DecimalWrongQuestionStats,
  totalQuestions: number
): DecimalTutoringPlan {
  const weakAreas = {
    operationTypes: [] as OperationType[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze operation types
  const operationTypeCounts = [
    { type: 'add' as OperationType, count: stats.byOperationType.add },
    { type: 'subtract' as OperationType, count: stats.byOperationType.subtract },
    { type: 'multiply' as OperationType, count: stats.byOperationType.multiply },
    { type: 'divide' as OperationType, count: stats.byOperationType.divide }
  ];

  // Find weak operation types
  operationTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.operationTypes.push(type);
      
      const typeName = getOperationTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在小数${typeName}方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在小数${typeName}方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<DecimalConfig> | undefined;
  
  if (weakAreas.operationTypes.length > 0) {
    recommendedConfig = {
      operations: weakAreas.operationTypes,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Get fraction question type display name
 * modify by jx: add function to get fraction question type display name
 * @param type Question type
 * @returns Display name
 */
function getFractionQuestionTypeDisplayName(
  type: 'same-denominator' | 'different-denominator' | 'mixed' | 'simplify'
): string {
  const nameMap: Record<string, string> = {
    'same-denominator': '同分母分数',
    'different-denominator': '异分母分数',
    'mixed': '带分数',
    'simplify': '分数化简'
  };
  return nameMap[type] || type;
}

/**
 * Generate percentage tutoring plan based on wrong question statistics
 * modify by jx: add function to generate percentage tutoring plan
 * @param stats Percentage wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns PercentageTutoringPlan object
 */
export function generatePercentageTutoringPlan(
  stats: PercentageWrongQuestionStats,
  totalQuestions: number
): PercentageTutoringPlan {
  const weakAreas = {
    questionTypes: [] as ('decimal-to-percent' | 'percent-to-decimal' | 'fraction-to-percent' | 'percent-to-fraction' | 'find-percent' | 'find-part' | 'find-total')[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze question types
  const questionTypeCounts = [
    { type: 'decimal-to-percent' as const, count: stats.byQuestionType['decimal-to-percent'] },
    { type: 'percent-to-decimal' as const, count: stats.byQuestionType['percent-to-decimal'] },
    { type: 'fraction-to-percent' as const, count: stats.byQuestionType['fraction-to-percent'] },
    { type: 'percent-to-fraction' as const, count: stats.byQuestionType['percent-to-fraction'] },
    { type: 'find-percent' as const, count: stats.byQuestionType['find-percent'] },
    { type: 'find-part' as const, count: stats.byQuestionType['find-part'] },
    { type: 'find-total' as const, count: stats.byQuestionType['find-total'] }
  ];

  // Find weak question types
  questionTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.questionTypes.push(type);
      
      const typeName = getPercentageQuestionTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在${typeName}方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${typeName}方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<PercentageConfig> | undefined;
  
  if (weakAreas.questionTypes.length > 0) {
    recommendedConfig = {
      questionTypes: weakAreas.questionTypes,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Generate unit conversion tutoring plan based on wrong question statistics
 * modify by jx: add function to generate unit conversion tutoring plan
 * @param stats Unit conversion wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns UnitConversionTutoringPlan object
 */
export function generateUnitConversionTutoringPlan(
  stats: UnitConversionWrongQuestionStats,
  totalQuestions: number
): UnitConversionTutoringPlan {
  const weakAreas = {
    unitTypes: [] as ('length' | 'weight' | 'area' | 'volume' | 'time')[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze unit types
  const unitTypeCounts = [
    { type: 'length' as const, count: stats.byUnitType.length },
    { type: 'weight' as const, count: stats.byUnitType.weight },
    { type: 'area' as const, count: stats.byUnitType.area },
    { type: 'volume' as const, count: stats.byUnitType.volume },
    { type: 'time' as const, count: stats.byUnitType.time }
  ];

  // Find weak unit types
  unitTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.unitTypes.push(type);
      
      const typeName = getUnitTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在${typeName}单位换算方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${typeName}单位换算方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<UnitConversionConfig> | undefined;
  
  if (weakAreas.unitTypes.length > 0) {
    recommendedConfig = {
      unitTypes: weakAreas.unitTypes,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Generate geometry tutoring plan based on wrong question statistics
 * modify by jx: add function to generate geometry tutoring plan
 * @param stats Geometry wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns GeometryTutoringPlan object
 */
export function generateGeometryTutoringPlan(
  stats: GeometryWrongQuestionStats,
  totalQuestions: number
): GeometryTutoringPlan {
  const weakAreas = {
    shapes: [] as ('rectangle' | 'square' | 'triangle' | 'circle' | 'cuboid' | 'cube')[],
    calculationTypes: [] as ('perimeter' | 'area' | 'volume')[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze shapes
  const shapeCounts = [
    { shape: 'rectangle' as const, count: stats.byShape.rectangle },
    { shape: 'square' as const, count: stats.byShape.square },
    { shape: 'triangle' as const, count: stats.byShape.triangle },
    { shape: 'circle' as const, count: stats.byShape.circle },
    { shape: 'cuboid' as const, count: stats.byShape.cuboid },
    { shape: 'cube' as const, count: stats.byShape.cube }
  ];

  // Find weak shapes
  shapeCounts.forEach(({ shape, count }) => {
    const shapeErrorRate = count / totalQuestions;
    if (shapeErrorRate >= weakThreshold) {
      weakAreas.shapes.push(shape);
      
      const shapeName = getShapeDisplayName(shape);
      if (shapeErrorRate >= severeThreshold) {
        suggestions.push(`您在${shapeName}计算方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${shapeName}计算方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Analyze calculation types
  const calculationTypeCounts = [
    { type: 'perimeter' as const, count: stats.byCalculationType.perimeter },
    { type: 'area' as const, count: stats.byCalculationType.area },
    { type: 'volume' as const, count: stats.byCalculationType.volume }
  ];

  // Find weak calculation types
  calculationTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.calculationTypes.push(type);
      
      const typeName = getCalculationTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在${typeName}计算方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${typeName}计算方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<GeometryConfig> | undefined;
  
  if (weakAreas.shapes.length > 0 || weakAreas.calculationTypes.length > 0) {
    recommendedConfig = {
      shapes: weakAreas.shapes.length > 0 ? weakAreas.shapes : undefined,
      calculationTypes: weakAreas.calculationTypes.length > 0 ? weakAreas.calculationTypes : undefined,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Generate factor multiple tutoring plan based on wrong question statistics
 * modify by jx: add function to generate factor multiple tutoring plan
 * @param stats Factor multiple wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns FactorMultipleTutoringPlan object
 */
export function generateFactorMultipleTutoringPlan(
  stats: FactorMultipleWrongQuestionStats,
  totalQuestions: number
): FactorMultipleTutoringPlan {
  const weakAreas = {
    questionTypes: [] as ('find-multiples' | 'find-factors' | 'gcd' | 'lcm')[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze question types
  const questionTypeCounts = [
    { type: 'find-multiples' as const, count: stats.byQuestionType['find-multiples'] },
    { type: 'find-factors' as const, count: stats.byQuestionType['find-factors'] },
    { type: 'gcd' as const, count: stats.byQuestionType['gcd'] },
    { type: 'lcm' as const, count: stats.byQuestionType['lcm'] }
  ];

  // Find weak question types
  questionTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.questionTypes.push(type);
      
      const typeName = getFactorMultipleQuestionTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在${typeName}方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${typeName}方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<FactorMultipleConfig> | undefined;
  
  if (weakAreas.questionTypes.length > 0) {
    recommendedConfig = {
      questionTypes: weakAreas.questionTypes,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Get percentage question type display name
 * modify by jx: add function to get percentage question type display name
 * @param type Question type
 * @returns Display name
 */
function getPercentageQuestionTypeDisplayName(
  type: 'decimal-to-percent' | 'percent-to-decimal' | 'fraction-to-percent' | 'percent-to-fraction' | 'find-percent' | 'find-part' | 'find-total'
): string {
  const nameMap: Record<string, string> = {
    'decimal-to-percent': '小数转百分数',
    'percent-to-decimal': '百分数转小数',
    'fraction-to-percent': '分数转百分数',
    'percent-to-fraction': '百分数转分数',
    'find-percent': '求百分数',
    'find-part': '求部分',
    'find-total': '求总数'
  };
  return nameMap[type] || type;
}

/**
 * Get unit type display name
 * modify by jx: add function to get unit type display name
 * @param type Unit type
 * @returns Display name
 */
function getUnitTypeDisplayName(
  type: 'length' | 'weight' | 'area' | 'volume' | 'time'
): string {
  const nameMap: Record<string, string> = {
    'length': '长度',
    'weight': '重量',
    'area': '面积',
    'volume': '体积',
    'time': '时间'
  };
  return nameMap[type] || type;
}

/**
 * Get shape display name
 * modify by jx: add function to get shape display name
 * @param shape Shape type
 * @returns Display name
 */
function getShapeDisplayName(
  shape: 'rectangle' | 'square' | 'triangle' | 'circle' | 'cuboid' | 'cube'
): string {
  const nameMap: Record<string, string> = {
    'rectangle': '长方形',
    'square': '正方形',
    'triangle': '三角形',
    'circle': '圆形',
    'cuboid': '长方体',
    'cube': '正方体'
  };
  return nameMap[shape] || shape;
}

/**
 * Get calculation type display name
 * modify by jx: add function to get calculation type display name
 * @param type Calculation type
 * @returns Display name
 */
function getCalculationTypeDisplayName(
  type: 'perimeter' | 'area' | 'volume'
): string {
  const nameMap: Record<string, string> = {
    'perimeter': '周长',
    'area': '面积',
    'volume': '体积'
  };
  return nameMap[type] || type;
}

/**
 * Get factor multiple question type display name
 * modify by jx: add function to get factor multiple question type display name
 * @param type Question type
 * @returns Display name
 */
function getFactorMultipleQuestionTypeDisplayName(
  type: 'find-multiples' | 'find-factors' | 'gcd' | 'lcm'
): string {
  const nameMap: Record<string, string> = {
    'find-multiples': '找倍数',
    'find-factors': '找因数',
    'gcd': '最大公因数',
    'lcm': '最小公倍数'
  };
  return nameMap[type] || type;
}

/**
 * Generate prime composite tutoring plan based on wrong question statistics
 * modify by jx: add function to generate prime composite tutoring plan
 * @param stats Prime composite wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns PrimeCompositeTutoringPlan object
 */
export function generatePrimeCompositeTutoringPlan(
  stats: PrimeCompositeWrongQuestionStats,
  totalQuestions: number
): PrimeCompositeTutoringPlan {
  const weakAreas = {
    questionTypes: [] as ('is-prime' | 'is-composite' | 'prime-factors')[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze question types
  const questionTypeCounts = [
    { type: 'is-prime' as const, count: stats.byQuestionType['is-prime'] },
    { type: 'is-composite' as const, count: stats.byQuestionType['is-composite'] },
    { type: 'prime-factors' as const, count: stats.byQuestionType['prime-factors'] }
  ];

  // Find weak question types
  questionTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.questionTypes.push(type);
      
      const typeName = getPrimeCompositeQuestionTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在${typeName}方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${typeName}方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<PrimeCompositeConfig> | undefined;
  
  if (weakAreas.questionTypes.length > 0) {
    recommendedConfig = {
      questionTypes: weakAreas.questionTypes,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Get prime composite question type display name
 * modify by jx: add function to get prime composite question type display name
 * @param type Question type
 * @returns Display name
 */
function getPrimeCompositeQuestionTypeDisplayName(
  type: 'is-prime' | 'is-composite' | 'prime-factors'
): string {
  const nameMap: Record<string, string> = {
    'is-prime': '判断质数',
    'is-composite': '判断合数',
    'prime-factors': '质因数分解'
  };
  return nameMap[type] || type;
}

/**
 * Generate comparison tutoring plan based on wrong question statistics
 * modify by jx: add function to generate comparison tutoring plan
 * @param stats Comparison wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns ComparisonTutoringPlan object
 */
export function generateComparisonTutoringPlan(
  stats: ComparisonWrongQuestionStats,
  totalQuestions: number
): ComparisonTutoringPlan {
  const weakAreas = {
    questionTypes: [] as ('integer' | 'decimal' | 'fraction')[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze question types
  const questionTypeCounts = [
    { type: 'integer' as const, count: stats.byQuestionType['integer'] },
    { type: 'decimal' as const, count: stats.byQuestionType['decimal'] },
    { type: 'fraction' as const, count: stats.byQuestionType['fraction'] }
  ];

  // Find weak question types
  questionTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.questionTypes.push(type);
      
      const typeName = getComparisonQuestionTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在${typeName}方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${typeName}方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<ComparisonConfig> | undefined;
  
  if (weakAreas.questionTypes.length > 0) {
    recommendedConfig = {
      questionTypes: weakAreas.questionTypes,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Get comparison question type display name
 * modify by jx: add function to get comparison question type display name
 * @param type Question type
 * @returns Display name
 */
function getComparisonQuestionTypeDisplayName(
  type: 'integer' | 'decimal' | 'fraction'
): string {
  const nameMap: Record<string, string> = {
    'integer': '整数比较',
    'decimal': '小数比较',
    'fraction': '分数比较'
  };
  return nameMap[type] || type;
}

/**
 * Generate pattern tutoring plan based on wrong question statistics
 * modify by jx: add function to generate pattern tutoring plan
 * @param stats Pattern wrong question statistics
 * @param totalQuestions Total number of questions
 * @returns PatternTutoringPlan object
 */
export function generatePatternTutoringPlan(
  stats: PatternWrongQuestionStats,
  totalQuestions: number
): PatternTutoringPlan {
  const weakAreas = {
    patternTypes: [] as ('arithmetic' | 'geometric' | 'fibonacci' | 'square' | 'cube')[]
  };
  const suggestions: string[] = [];

  // Calculate error rates
  const errorRate = stats.total / totalQuestions;
  
  // Threshold for weak area: error rate > 30%
  const weakThreshold = 0.3;
  // Threshold for severe weak area: error rate > 50%
  const severeThreshold = 0.5;

  // Analyze pattern types
  const patternTypeCounts = [
    { type: 'arithmetic' as const, count: stats.byPatternType['arithmetic'] },
    { type: 'geometric' as const, count: stats.byPatternType['geometric'] },
    { type: 'fibonacci' as const, count: stats.byPatternType['fibonacci'] },
    { type: 'square' as const, count: stats.byPatternType['square'] },
    { type: 'cube' as const, count: stats.byPatternType['cube'] }
  ];

  // Find weak pattern types
  patternTypeCounts.forEach(({ type, count }) => {
    const typeErrorRate = count / totalQuestions;
    if (typeErrorRate >= weakThreshold) {
      weakAreas.patternTypes.push(type);
      
      const typeName = getPatternTypeDisplayName(type);
      if (typeErrorRate >= severeThreshold) {
        suggestions.push(`您在${typeName}方面错误较多，建议重点加强练习`);
      } else {
        suggestions.push(`您在${typeName}方面需要加强，建议多练习相关题目`);
      }
    }
  });

  // Generate general suggestions
  if (stats.total === 0) {
    suggestions.push('恭喜！您全部答对了，可以尝试增加难度或题目数量');
  } else if (errorRate < weakThreshold) {
    suggestions.push('您的表现不错，继续保持！可以适当增加题目难度');
  } else if (errorRate >= severeThreshold) {
    suggestions.push('建议从基础题目开始练习，逐步提高难度');
  }

  // Generate recommended configuration
  let recommendedConfig: Partial<PatternConfig> | undefined;
  
  if (weakAreas.patternTypes.length > 0) {
    recommendedConfig = {
      patternTypes: weakAreas.patternTypes,
      questionCount: 20 // Default to 20 questions for focused practice
    };
  }

  return {
    weakAreas,
    suggestions,
    recommendedConfig
  };
}

/**
 * Get pattern type display name
 * modify by jx: add function to get pattern type display name
 * @param type Pattern type
 * @returns Display name
 */
function getPatternTypeDisplayName(
  type: 'arithmetic' | 'geometric' | 'fibonacci' | 'square' | 'cube'
): string {
  const nameMap: Record<string, string> = {
    'arithmetic': '等差数列',
    'geometric': '等比数列',
    'fibonacci': '斐波那契数列',
    'square': '平方数列',
    'cube': '立方数列'
  };
  return nameMap[type] || type;
}

/**
 * Composable for tutoring plan functionality
 */
export function useTutoringPlan() {
  return {
    generateTutoringPlan,
    generateFractionTutoringPlan,
    generateDecimalTutoringPlan,
    generatePercentageTutoringPlan,
    generateUnitConversionTutoringPlan,
    generateGeometryTutoringPlan,
    generateFactorMultipleTutoringPlan,
    generatePrimeCompositeTutoringPlan,
    generateComparisonTutoringPlan,
    generatePatternTutoringPlan
  };
}
