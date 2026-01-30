// Battle Engine Composable - Core logic for math battle mode
// modify by jx: implement battle engine with countdown management, damage calculation, and battle state management

import { reactive, computed, onUnmounted } from 'vue';
import type { BattleState, BattleConfig, BattleRecord, Question, BattleResult } from '@/types';

/**
 * Calculate damage based on remaining time
 * @param timeSpent - Time spent answering in seconds
 * @param maxTime - Maximum time for the question in seconds
 * @returns Damage value (remaining time rounded up to 1 decimal place)
 */
export function calculateDamage(timeSpent: number, maxTime: number): number {
  const remaining = maxTime - timeSpent;
  return Math.max(0.1, Math.ceil(remaining * 10) / 10);
}

/**
 * Update enemy attack power by increasing by 10%
 * @param currentAttack - Current attack power
 * @returns New attack power (increased by 10%, rounded to 1 decimal place)
 */
export function updateEnemyAttack(currentAttack: number): number {
  return Math.round(currentAttack * 1.1 * 10) / 10;
}

/**
 * Generate a unique battle record ID
 * @returns Unique ID string
 */
export function generateBattleRecordId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `battle_${timestamp}_${random}`;
}

/**
 * Create a battle record from current battle state
 */
export function createBattleRecord(
  state: BattleState,
  config: BattleConfig,
  questionType: string,
  questionTypeName: string,
  totalTime: number
): BattleRecord {
  const accuracy = state.questionCount > 0 
    ? Math.round((state.correctCount / state.questionCount) * 1000) / 10 
    : 0;

  return {
    id: generateBattleRecordId(),
    timestamp: new Date(),
    duration: Math.round(totalTime * 10) / 10,
    result: state.battleResult || 'retreat',
    questionType,
    questionTypeName,
    config: {
      playerHP: config.playerHP,
      enemyHP: config.enemyHP,
      enemyBaseAttack: config.enemyBaseAttack,
      questionCount: config.questionCount
      // modify by jx: removed difficulty field
    },
    stats: {
      totalQuestions: state.questionCount,
      correctAnswers: state.correctCount,
      accuracy,
      maxCombo: state.maxCombo,
      totalDamage: state.totalDamage,
      finalEnemyAttack: state.enemyAttack,
      remainingPlayerHP: state.playerHP
    }
  };
}

/**
 * Battle Engine Composable
 * Manages all battle logic including timers, damage calculation, and state transitions
 */
export function useBattleEngine(
  config: BattleConfig,
  questionType: string,
  questionTypeName: string,
  questionGenerator: () => Question[]
) {
  // Battle state
  const state = reactive<BattleState>({
    phase: 'idle',
    playerHP: config.playerHP,
    enemyHP: config.enemyHP,
    enemyAttack: config.enemyBaseAttack,
    currentQuestion: null,
    timeRemaining: 0,
    battleResult: null,
    questionCount: 0,
    correctCount: 0,
    combo: 0,
    maxCombo: 0,
    totalDamage: 0,
    isRetreated: false
  });

  // Timer references
  let prepareTimer: number | null = null;
  let questionTimer: number | null = null;
  let enemyAttackTimer: number | null = null;
  let lastTimeUpdate: number = 0;

  // Computed properties
  const playerHPPercent = computed(() => (state.playerHP / config.playerHP) * 100);
  const enemyHPPercent = computed(() => (state.enemyHP / config.enemyHP) * 100);
  const isPreparing = computed(() => state.phase === 'preparing');
  const isAnswering = computed(() => state.phase === 'answering');
  const isEnded = computed(() => state.phase === 'ended');
  const isIdle = computed(() => state.phase === 'idle');
  const battleStarted = computed(() => state.phase !== 'idle' && state.phase !== 'ended');

  // Get next question
  function getNextQuestion(): Question {
    return questionGenerator()[0] || state.currentQuestion;
  }

  // Clear all timers
  function clearAllTimers(): void {
    if (prepareTimer) {
      clearInterval(prepareTimer);
      prepareTimer = null;
    }
    if (questionTimer) {
      clearInterval(questionTimer);
      questionTimer = null;
    }
    if (enemyAttackTimer) {
      clearInterval(enemyAttackTimer);
      enemyAttackTimer = null;
    }
  }

  // Handle enemy attack
  function handleEnemyAttack(): void {
    if (state.phase !== 'answering' || state.battleResult) return;

    state.playerHP = Math.max(0, state.playerHP - state.enemyAttack);

    // Check if player is defeated
    if (state.playerHP <= 0) {
      endBattle('defeat');
    }
  }

  // Handle question timeout
  function handleTimeUp(): void {
    if (state.phase !== 'answering' || !state.currentQuestion) return;

    // Wrong answer - increase enemy attack
    state.enemyAttack = updateEnemyAttack(state.enemyAttack);
    state.combo = 0;

    // Move to next question
    state.questionCount++;
    state.currentQuestion = getNextQuestion();
    state.timeRemaining = config.questionTime;
  }

  // Submit answer
  function submitAnswer(answer: number | null): boolean {
    if (state.phase !== 'answering' || !state.currentQuestion || state.battleResult) {
      return false;
    }

    const timeSpent = config.questionTime - state.timeRemaining;
    const isCorrect = answer === state.currentQuestion.answer;

    if (isCorrect) {
      // Calculate damage based on remaining time
      const damage = calculateDamage(timeSpent, config.questionTime);
      state.enemyHP = Math.max(0, state.enemyHP - damage);
      state.totalDamage += damage;
      state.correctCount++;
      state.combo++;
      state.maxCombo = Math.max(state.maxCombo, state.combo);
    } else {
      // Wrong answer - increase enemy attack
      state.enemyAttack = updateEnemyAttack(state.enemyAttack);
      state.combo = 0;
    }

    state.questionCount++;

    // Check battle end conditions
    if (state.enemyHP <= 0) {
      endBattle('victory');
      return true;
    }

    // Check if player is defeated by enemy attack during answering
    if (state.playerHP <= 0) {
      endBattle('defeat');
      return true;
    }

    // Move to next question
    state.currentQuestion = getNextQuestion();
    state.timeRemaining = config.questionTime;

    return true;
  }

  // End battle
  function endBattle(result: BattleResult): void {
    state.phase = 'ended';
    state.battleResult = result;
    clearAllTimers();
  }

  // Retreat from battle
  function retreat(): BattleRecord {
    state.isRetreated = true;
    endBattle('retreat');
    return getBattleRecord();
  }

  // Start preparation countdown
  function startPrepareTimer(): void {
    state.phase = 'preparing';
    state.timeRemaining = config.prepareTime;
    let timeLeft = config.prepareTime;

    prepareTimer = window.setInterval(() => {
      timeLeft--;
      state.timeRemaining = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(prepareTimer!);
        startBattle();
      }
    }, 1000);
  }

  // Start battle
  function startBattle(): void {
    // Clear any existing timers
    clearAllTimers();

    // Reset state
    state.phase = 'answering';
    state.playerHP = config.playerHP;
    state.enemyHP = config.enemyHP;
    state.enemyAttack = config.enemyBaseAttack;
    state.battleResult = null;
    state.questionCount = 0;
    state.correctCount = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.totalDamage = 0;
    state.isRetreated = false;
    state.currentQuestion = getNextQuestion();
    state.timeRemaining = config.questionTime;

    lastTimeUpdate = Date.now();

    // Start question timer (precise to 0.1 second)
    questionTimer = window.setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTimeUpdate) / 1000;
      lastTimeUpdate = now;

      state.timeRemaining = Math.max(0, state.timeRemaining - delta);

      if (state.timeRemaining <= 0) {
        handleTimeUp();
      }
    }, 100);

    // Start enemy attack timer
    enemyAttackTimer = window.setInterval(() => {
      handleEnemyAttack();
    }, config.enemyAttackInterval * 1000);
  }

  // Reset battle
  function resetBattle(): void {
    clearAllTimers();

    state.phase = 'idle';
    state.playerHP = config.playerHP;
    state.enemyHP = config.enemyHP;
    state.enemyAttack = config.enemyBaseAttack;
    state.currentQuestion = null;
    state.timeRemaining = 0;
    state.battleResult = null;
    state.questionCount = 0;
    state.correctCount = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.totalDamage = 0;
    state.isRetreated = false;
  }

  // Get battle record
  function getBattleRecord(): BattleRecord {
    const endTime = Date.now();
    const startTime = endTime - 
      (state.questionCount * config.questionTime * 1000) - 
      (config.prepareTime * 1000);

    return createBattleRecord(
      state,
      config,
      questionType,
      questionTypeName,
      (endTime - startTime) / 1000
    );
  }

  // Initialize battle (show start screen)
  function initializeBattle(): void {
    resetBattle();
  }

  // Cleanup on unmount - moved to BattlePage.vue onUnmounted hook
  // modify by jx: remove onUnmounted from here to avoid "no active component instance" warning
  // The composable may be called after setup phase, so lifecycle hooks must be registered during setup
  // Timer cleanup is now handled by BattlePage.vue's onUnmounted

  return {
    // State
    state,
    
    // Computed
    playerHPPercent,
    enemyHPPercent,
    isPreparing,
    isAnswering,
    isEnded,
    isIdle,
    battleStarted,
    
    // Methods
    initializeBattle,
    startBattle,
    startPrepareTimer,
    submitAnswer,
    retreat,
    resetBattle,
    getBattleRecord,
    clearAllTimers,
    
    // Utilities
    calculateDamage,
    updateEnemyAttack
  };
}
