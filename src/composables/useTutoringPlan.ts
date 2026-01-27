// Composable for generating personalized tutoring plans
// modify by jx: implement tutoring plan generation based on wrong question analysis

import type { WrongQuestionStats, TutoringPlan, QuestionConfig, OperationType } from '@/types';

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
 * Composable for tutoring plan functionality
 */
export function useTutoringPlan() {
  return {
    generateTutoringPlan
  };
}
