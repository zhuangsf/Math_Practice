// Composable for generating geometry questions
// modify by jx: implement core logic for generating geometry questions

import { ref } from 'vue';
import type { GeometryQuestion, GeometryConfig } from '@/types';
import {
  calculateRectanglePerimeter,
  calculateRectangleArea,
  calculateSquarePerimeter,
  calculateSquareArea,
  calculateTrianglePerimeter,
  calculateTriangleArea,
  calculateCirclePerimeter,
  calculateCircleArea,
  calculateCuboidVolume,
  calculateCuboidSurfaceArea,
  calculateCubeVolume,
  calculateCubeSurfaceArea
} from '@/utils/geometryUtils';
import { randomInt } from '@/utils/numberUtils';
import { generateId } from '@/utils/validationUtils';

/**
 * Maximum number of retry attempts when generating a valid question
 */
const MAX_RETRIES = 50;

/**
 * Generate a geometry question
 * @param shape Shape type
 * @param calculationType Calculation type
 * @param config Geometry configuration
 * @returns Geometry question or null if unable to generate
 */
function generateGeometryQuestion(
  shape: 'rectangle' | 'square' | 'triangle' | 'circle' | 'cuboid' | 'cube',
  calculationType: 'perimeter' | 'area' | 'volume',
  config: GeometryConfig
): GeometryQuestion | null {
  // modify by jx: generate geometry question based on shape and calculation type
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let expression = '';
    let answer = 0;
    const parameters: Record<string, number> = {};
    
    switch (shape) {
      case 'rectangle':
        if (calculationType === 'perimeter') {
          const length = randomInt(config.parameterRange[0], config.parameterRange[1]);
          const width = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.length = length;
          parameters.width = width;
          answer = calculateRectanglePerimeter(length, width);
          expression = `长方形长${length}m，宽${width}m，求周长`;
        } else if (calculationType === 'area') {
          const length = randomInt(config.parameterRange[0], config.parameterRange[1]);
          const width = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.length = length;
          parameters.width = width;
          answer = calculateRectangleArea(length, width);
          expression = `长方形长${length}m，宽${width}m，求面积`;
        }
        break;
        
      case 'square':
        if (calculationType === 'perimeter') {
          const side = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.side = side;
          answer = calculateSquarePerimeter(side);
          expression = `正方形边长${side}m，求周长`;
        } else if (calculationType === 'area') {
          const side = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.side = side;
          answer = calculateSquareArea(side);
          expression = `正方形边长${side}m，求面积`;
        }
        break;
        
      case 'triangle':
        if (calculationType === 'perimeter') {
          const side1 = randomInt(config.parameterRange[0], config.parameterRange[1]);
          const side2 = randomInt(config.parameterRange[0], config.parameterRange[1]);
          const side3 = randomInt(config.parameterRange[0], config.parameterRange[1]);
          // Ensure triangle inequality
          if (side1 + side2 > side3 && side1 + side3 > side2 && side2 + side3 > side1) {
            parameters.side1 = side1;
            parameters.side2 = side2;
            parameters.side3 = side3;
            answer = calculateTrianglePerimeter(side1, side2, side3);
            expression = `三角形三边长分别为${side1}m、${side2}m、${side3}m，求周长`;
          } else {
            continue;
          }
        } else if (calculationType === 'area') {
          const base = randomInt(config.parameterRange[0], config.parameterRange[1]);
          const height = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.base = base;
          parameters.height = height;
          answer = calculateTriangleArea(base, height);
          expression = `三角形底边${base}m，高${height}m，求面积`;
        }
        break;
        
      case 'circle':
        if (calculationType === 'perimeter') {
          const radius = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.radius = radius;
          answer = calculateCirclePerimeter(radius, config.piValue);
          expression = `圆的半径${radius}m，求周长（π=${config.piValue}）`;
        } else if (calculationType === 'area') {
          const radius = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.radius = radius;
          answer = calculateCircleArea(radius, config.piValue);
          expression = `圆的半径${radius}m，求面积（π=${config.piValue}）`;
        }
        break;
        
      case 'cuboid':
        if (calculationType === 'volume') {
          const length = randomInt(config.parameterRange[0], config.parameterRange[1]);
          const width = randomInt(config.parameterRange[0], config.parameterRange[1]);
          const height = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.length = length;
          parameters.width = width;
          parameters.height = height;
          answer = calculateCuboidVolume(length, width, height);
          expression = `长方体长${length}m，宽${width}m，高${height}m，求体积`;
        } else if (calculationType === 'area') {
          const length = randomInt(config.parameterRange[0], config.parameterRange[1]);
          const width = randomInt(config.parameterRange[0], config.parameterRange[1]);
          const height = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.length = length;
          parameters.width = width;
          parameters.height = height;
          answer = calculateCuboidSurfaceArea(length, width, height);
          expression = `长方体长${length}m，宽${width}m，高${height}m，求表面积`;
        }
        break;
        
      case 'cube':
        if (calculationType === 'volume') {
          const side = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.side = side;
          answer = calculateCubeVolume(side);
          expression = `正方体边长${side}m，求体积`;
        } else if (calculationType === 'area') {
          const side = randomInt(config.parameterRange[0], config.parameterRange[1]);
          parameters.side = side;
          answer = calculateCubeSurfaceArea(side);
          expression = `正方体边长${side}m，求表面积`;
        }
        break;
    }
    
    if (expression && answer > 0) {
      return {
        id: generateId(),
        expression,
        answer,
        shape,
        calculationType,
        parameters
      };
    }
  }
  
  return null;
}

/**
 * Generate geometry questions based on configuration
 * @param config Geometry configuration
 * @returns Array of geometry questions
 */
export function generateGeometryQuestions(config: GeometryConfig): GeometryQuestion[] {
  // modify by jx: generate geometry questions based on configuration, ensure exact question count
  const questions: GeometryQuestion[] = [];
  const shapes = config.shapes.length > 0 
    ? config.shapes 
    : ['rectangle', 'square', 'triangle', 'circle', 'cuboid', 'cube'];
  const calculationTypes = config.calculationTypes.length > 0
    ? config.calculationTypes
    : ['perimeter', 'area', 'volume'];
  
  // Filter valid combinations
  const validCombinations: Array<{ shape: typeof shapes[number]; calculationType: typeof calculationTypes[number] }> = [];
  for (const shape of shapes) {
    for (const calculationType of calculationTypes) {
      // Validate shape and calculation type combination
      if (shape === 'circle' && calculationType === 'volume') {
        continue; // Circle doesn't have volume
      }
      if (shape === 'triangle' && calculationType === 'volume') {
        continue; // Triangle doesn't have volume
      }
      if ((shape === 'cuboid' || shape === 'cube') && calculationType === 'perimeter') {
        continue; // 3D shapes don't have perimeter
      }
      validCombinations.push({ shape, calculationType });
    }
  }
  
  if (validCombinations.length === 0) {
    return questions; // No valid combinations
  }
  
  // Generate questions until we have the required count
  let attempts = 0;
  const maxAttempts = config.questionCount * 10; // Prevent infinite loop
  while (questions.length < config.questionCount && attempts < maxAttempts) {
    attempts++;
    const combination = validCombinations[Math.floor(Math.random() * validCombinations.length)];
    const question = generateGeometryQuestion(combination.shape as 'rectangle' | 'square' | 'triangle' | 'circle' | 'cuboid' | 'cube', combination.calculationType as 'perimeter' | 'area' | 'volume', config);
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

/**
 * Composable function for geometry question generation
 * @returns Object with generation functions and state
 */
export function useGeometryGenerator() {
  // modify by jx: create composable function for geometry question generation
  const isGenerating = ref(false);
  const questions = ref<GeometryQuestion[]>([]);
  
  /**
   * Generate geometry questions
   * @param config Geometry configuration
   */
  const generate = (config: GeometryConfig) => {
    isGenerating.value = true;
    try {
      questions.value = generateGeometryQuestions(config);
    } finally {
      isGenerating.value = false;
    }
  };
  
  /**
   * Clear generated questions
   */
  const clear = () => {
    questions.value = [];
  };
  
  return {
    isGenerating,
    questions,
    generate,
    clear
  };
}
