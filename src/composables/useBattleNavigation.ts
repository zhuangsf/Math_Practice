// Battle Navigation Composable - Manage navigation state for immersive battle mode
// modify by jx: implement battle navigation state management for page transitions

import { reactive, computed, readonly } from 'vue';
import type { QuestionConfig, BattleSettings, BattleConfig, BattleQuestionType } from '@/types';

// Battle navigation state interface
interface BattleNavigationState {
  isInBattleMode: boolean;      // Whether currently in battle mode
  currentQuestionType: BattleQuestionType | null;  // Current question type
  currentQuestionTypeName: string | null;  // Current question type display name
  questionConfig: QuestionConfig | null;   // Question configuration from main page
  battleSettings: BattleSettings | null;   // Battle-specific settings
}

// Default question configuration
const defaultQuestionConfig: QuestionConfig = {
  operandCount: 2,
  minValue: 0,
  maxValue: 20,  // modify by jx: change default from 1000 to 20 for arithmetic value range max
  operations: ['add', 'subtract', 'multiply', 'divide'],
  questionCount: 20
};

// Default battle settings
const defaultBattleSettings: BattleSettings = {
  enemyHP: 50,
  questionTime: 10.0
};

// Reactive state
const state = reactive<BattleNavigationState>({
  isInBattleMode: false,
  currentQuestionType: null,
  currentQuestionTypeName: null,
  questionConfig: null,
  battleSettings: null
});

// Computed properties
const isInBattleMode = computed(() => state.isInBattleMode);
const currentQuestionType = computed(() => state.currentQuestionType);
const currentQuestionTypeName = computed(() => state.currentQuestionTypeName);
const questionConfig = computed(() => state.questionConfig);
const battleSettings = computed(() => state.battleSettings);

// Get battle configuration from question config and battle settings
const battleConfig = computed<BattleConfig>(() => {
  const config = state.questionConfig || defaultQuestionConfig;
  const settings = state.battleSettings || defaultBattleSettings;
  
  return {
    playerHP: 100,
    enemyHP: settings.enemyHP,
    enemyBaseAttack: 10,
    prepareTime: 3,
    questionTime: settings.questionTime,
    enemyAttackInterval: 10,
    questionCount: config.questionCount
  };
});

// Navigation functions
/**
 * Enter battle mode with configuration
 * @param questionType - The type of question (e.g., 'arithmetic', 'equation')
 * @param questionTypeName - Display name of the question type
 * @param config - Question configuration from main page
 * @param settings - Battle-specific settings
 */
function enterBattleMode(
  questionType: BattleQuestionType,
  questionTypeName: string,
  config: QuestionConfig,
  settings: BattleSettings
): void {
  state.isInBattleMode = true;
  state.currentQuestionType = questionType;
  state.currentQuestionTypeName = questionTypeName;
  state.questionConfig = { ...config };
  state.battleSettings = { ...settings };
  
  console.log('[BattleNavigation] Entering battle mode:', {
    questionType,
    questionTypeName,
    config,
    settings
  });
}

/**
 * Exit battle mode and return to main page
 */
function exitBattleMode(): void {
  console.log('[BattleNavigation] Exiting battle mode');
  
  state.isInBattleMode = false;
  state.currentQuestionType = null;
  state.currentQuestionTypeName = null;
  state.questionConfig = null;
  state.battleSettings = null;
}

/**
 * Update battle settings while in battle mode
 */
function updateBattleSettings(settings: Partial<BattleSettings>): void {
  if (state.battleSettings) {
    state.battleSettings = { ...state.battleSettings, ...settings };
  }
}

/**
 * Update question config while in battle mode
 */
function updateQuestionConfig(config: Partial<QuestionConfig>): void {
  if (state.questionConfig) {
    state.questionConfig = { ...state.questionConfig, ...config };
  }
}

/**
 * Get navigation history for returning to previous page
 */
function getReturnPath(): string {
  // Default return to arithmetic page
  const questionType = state.currentQuestionType || 'arithmetic';
  return `/page/${questionType}`;
}

export function useBattleNavigation() {
  return {
    // State (readonly for external use)
    isInBattleMode: readonly(isInBattleMode),
    currentQuestionType: readonly(currentQuestionType),
    currentQuestionTypeName: readonly(currentQuestionTypeName),
    questionConfig: readonly(questionConfig),
    battleSettings: readonly(battleSettings),
    battleConfig,
    
    // Actions
    enterBattleMode,
    exitBattleMode,
    updateBattleSettings,
    updateQuestionConfig,
    getReturnPath
  };
}
