<template>
  <div class="arithmetic-page" :class="{ 'battle-mode': answerMode === 'battle' }">
    
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h2 class="title">四则运算题目生成</h2>
        <p class="subtitle">支持加减乘除多种运算模式</p>
      </div>
      <div class="header-right">
        <el-button
          class="settings-button"
          circle
          @click="showSettingsDialog = true"
        >
          <el-icon><Setting /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Control Panel -->
    <div class="control-panel-section">
      <ControlPanel
        v-model="config"
        v-model:show-answers="showAnswers"
        v-model:answer-mode="answerMode"
        v-model:battle-settings="battleSettings"
        question-type="arithmetic"
        question-type-name="四则运算"
        @update:battle-settings="handleBattleSettingsUpdate"
        @enter-battle="handleEnterBattle"
      />
    </div>

    <!-- Battle Mode Actions -->
    <div v-if="answerMode === 'battle' && battleState.phase === 'idle'" class="battle-start-section">
      <el-button type="primary" size="large" @click="handleStartBattle">
        ⚔️ 开始战斗
      </el-button>
      <p class="battle-hint">快速解答题目，驯服能量团！</p>
    </div>

    <!-- Battle Mode (when active) -->
    <div v-if="answerMode === 'battle' && battleState.phase !== 'idle'" class="battle-container">
      <!-- Battle HUD -->
      <BattleHUD
        :state="battleState"
        :player-max-hp="battleConfig.playerHP"
        :enemy-max-hp="battleConfig.enemyHP"
        :total-questions="battleConfig.questionCount"
      />

      <!-- Battle Enemy - modify by jx: pass shake-enabled for entrance shake; hit shake always plays on correct answer -->
      <BattleEnemy
        :hp="battleState.enemyHP"
        :max-hp="battleConfig.enemyHP"
        :attack="battleState.enemyAttack"
        :is-hit="isEnemyHit"
        :is-attacking="isEnemyAttacking"
        :shake-enabled="shakeEnabled"
        @hit-animation-end="isEnemyHit = false"
        @attack-animation-end="isEnemyAttacking = false"
      />

      <!-- Battle Timer -->
      <BattleTimer
        :time-remaining="battleState.timeRemaining"
        :max-time="battleConfig.questionTime"
      />

      <!-- Battle Question - modify by jx: wrap submit to log when event is received -->
      <BattleQuestion
        v-if="battleState.currentQuestion"
        :question="battleState.currentQuestion"
        :question-number="battleState.questionCount + 1"
        :is-submitting="isSubmittingAnswer"
        @submit="onBattleQuestionSubmit"
        @retreat="handleRetreat"
        ref="battleQuestionRef"
      />

      <!-- Battle Info -->
      <div class="battle-info">
        <span>总伤害: {{ battleState.totalDamage.toFixed(1) }}</span>
        <span>正确: {{ battleState.correctCount }}</span>
      </div>
    </div>

    <!-- Answer Mode Actions (non-battle) -->
    <div v-if="answerMode === 'answering' && questions.length > 0 && battleState.phase === 'idle'" class="answer-actions-section">
      <el-button
        type="primary"
        size="large"
        :disabled="!isAllAnswered || isSubmitted"
        @click="handleSubmitAnswers"
      >
        提交答案
      </el-button>
      <el-button
        v-if="isSubmitted"
        size="large"
        @click="handleResetAnswers"
      >
        重新答题
      </el-button>
    </div>

    <!-- Action Buttons (non-battle) -->
    <div v-if="answerMode !== 'battle' || battleState.phase === 'idle'" class="action-buttons-section">
      <ActionButtons
        :is-generating="isGenerating"
        :is-exporting="isExporting"
        :questions="questions"
        :show-answers="showAnswers"
        @generate="handleGenerate"
        @export-txt="handleExportTxt"
        @export-pdf="handleExportPdf"
        @export-excel="handleExportExcel"
        @print="handlePrint"
      />
    </div>

    <!-- Score Display -->
    <div v-if="score && isSubmitted && answerMode !== 'battle'" class="score-section">
      <ScoreDisplay :score="score" />
    </div>

    <!-- Wrong Question Analysis -->
    <div v-if="wrongQuestionStats && isSubmitted && answerMode !== 'battle'" class="analysis-section">
      <WrongQuestionAnalysis
        :stats="wrongQuestionStats"
        :wrong-questions="wrongQuestions"
        @view-wrong-questions="handleViewWrongQuestions"
      />
    </div>

    <!-- Tutoring Plan -->
    <div v-if="tutoringPlan && isSubmitted && answerMode !== 'battle'" class="tutoring-plan-section">
      <TutoringPlanComponent
        :plan="tutoringPlan"
        @apply-recommended-config="handleApplyRecommendedConfig"
      />
    </div>

    <!-- Question Display (non-battle) -->
    <div v-if="answerMode !== 'battle' || battleState.phase === 'idle'" class="question-display-section">
      <QuestionDisplay
        :questions="questions"
        :show-answers="showAnswers"
        :answer-mode="answerMode === 'battle' ? 'practice' : answerMode"
        :student-answers="studentAnswersMap"
        :is-submitted="isSubmitted"
        @answer-change="handleAnswerChange"
      />
    </div>

    <!-- Battle Result Dialog: only render when record and result exist to avoid null prop warning -->
    <BattleResult
      v-if="battleRecord && battleResult"
      v-model="showBattleResult"
      :record="battleRecord"
      :result="battleResult"
      @rematch="handleRematch"
      @return="handleReturnFromBattle"
    />

    <!-- Settings Dialog -->
    <SettingsDialog
      v-model="showSettingsDialog"
      v-model:shake-enabled="shakeEnabled"
      @confirm="handleSettingsConfirm"
    />
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement arithmetic page with battle mode support

import { ref, computed, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Setting } from '@element-plus/icons-vue';
import ControlPanel from '@/components/ControlPanel.vue';
import QuestionDisplay from '@/components/QuestionDisplay.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import ScoreDisplay from '@/components/ScoreDisplay.vue';
import WrongQuestionAnalysis from '@/components/WrongQuestionAnalysis.vue';
import TutoringPlanComponent from '@/components/TutoringPlan.vue';
import BattleHUD from '@/components/battle/BattleHUD.vue';
import BattleEnemy from '@/components/battle/BattleEnemy.vue';
import BattleTimer from '@/components/battle/BattleTimer.vue';
import BattleQuestion from '@/components/battle/BattleQuestion.vue';
import BattleResult from '@/components/battle/BattleResult.vue';
import SettingsDialog from '@/components/SettingsDialog.vue';
import { useQuestionGenerator } from '@/composables/useQuestionGenerator';
import { useExport } from '@/composables/useExport';
import { useAnswering } from '@/composables/useAnswering';
import { calculateScore } from '@/composables/useScoring';
import { extractWrongQuestions, calculateWrongQuestionStats } from '@/composables/useWrongQuestionAnalysis';
import { generateTutoringPlan } from '@/composables/useTutoringPlan';
import { useBattleEngine } from '@/composables/useBattleEngine';
import { useGameSettings } from '@/composables/useGameSettings';
import type { QuestionConfig, ScoreResult, WrongQuestionStats, WrongQuestion, TutoringPlan, BattleConfig, BattleSettings, BattleRecord, BattleResult as BattleResultType } from '@/types';

// Debug logging
function logDebug(...args: any[]) {
  console.log('[ArithmeticPage]', ...args);
}

// Default configuration
const defaultConfig: QuestionConfig = {
  operandCount: 2,
  minValue: 0,
  maxValue: 1000,
  operations: ['add', 'subtract', 'multiply', 'divide'],
  questionCount: 20
};

// Default battle configuration
const defaultBattleConfig: BattleConfig = {
  playerHP: 100,
  enemyHP: 50,
  enemyBaseAttack: 10,
  prepareTime: 3,
  questionTime: 10.0,
  enemyAttackInterval: 10,
  questionCount: 20
  // modify by jx: removed difficulty field
};

// Reactive state
const config = ref<QuestionConfig>({ ...defaultConfig });
const showAnswers = ref(false);
const answerMode = ref<'practice' | 'answering' | 'battle'>('practice');

// Battle settings
const battleSettings = ref<BattleSettings>({
  enemyHP: 50,
  questionTime: 10.0
});

// Settings state
const showSettingsDialog = ref(false);

// Get game settings - modify by jx: use global settings state with proper reactivity
const gameSettingsRef = useGameSettings();
const shakeEnabled = computed({
  get: () => gameSettingsRef.value?.shakeEnabled ?? false,  // modify by jx: default off to disable energy orb shake after starting battle
  set: (val: boolean) => {
    if (gameSettingsRef.value) {
      gameSettingsRef.value.shakeEnabled = val;
    }
  }
});

// Battle configuration based on settings
const battleConfig = computed<BattleConfig>(() => {
  return {
    ...defaultBattleConfig,
    enemyHP: battleSettings.value.enemyHP,
    questionTime: battleSettings.value.questionTime
    // modify by jx: removed difficulty, questions use main config
  };
});

// Use question generator composable
const { isGenerating, questions, generateQuestions, clearQuestions } = useQuestionGenerator();

// Use export composable
const { isExporting, exportToTxt, exportToPdf, exportToExcel, printQuestions } = useExport();

// Battle state and engine
const battleEngine = ref<ReturnType<typeof useBattleEngine> | null>(null);
const battleRecord = ref<BattleRecord | null>(null);
const battleResult = ref<BattleResultType>(null);
const showBattleResult = ref(false);
const isEnemyHit = ref(false);
const isEnemyAttacking = ref(false);
const isSubmittingAnswer = ref(false);
const battleQuestionRef = ref<InstanceType<typeof BattleQuestion> | null>(null);

// Get battle state from engine (computed for reactivity)
const battleState = computed(() => {
  if (battleEngine.value?.state) {
    return battleEngine.value.state;
  }
  // Return default idle state when engine is not initialized
  return {
    phase: 'idle' as const,
    playerHP: 100,
    enemyHP: 50,
    enemyAttack: 10,
    currentQuestion: null,
    timeRemaining: 0,
    battleResult: null,
    questionCount: 0,
    correctCount: 0,
    combo: 0,
    maxCombo: 0,
    totalDamage: 0,
    isRetreated: false
  };
});

// Initialize battle engine
function initBattleEngine() {
  const engine = useBattleEngine(
    battleConfig.value,
    'arithmetic',
    '四则运算',
    () => {
      const generated = generateQuestions({
        ...config.value,
        questionCount: 1
      });
      return generated.length > 0 ? generated : [];
    }
  );
  
  battleEngine.value = engine;
}

// Battle handlers
function handleStartBattle() {
  initBattleEngine();
  battleEngine.value?.initializeBattle();
  battleEngine.value?.startPrepareTimer();
  ElMessage.info('准备进入战斗！');
}

// Settings handlers
function handleSettingsConfirm(settings: { shakeEnabled: boolean }) {
  console.log('[ArithmeticPage] Settings confirmed:', settings);
  console.log('[ArithmeticPage] Current global shakeEnabled:', gameSettingsRef.value?.shakeEnabled);
  ElMessage.success('设置已保存');
}

// modify by jx: wrapper so we always log when BattleQuestion emits submit (proves event reached parent)
function onBattleQuestionSubmit(answer: number | null) {
  console.log('[ArithmeticPage][SHAKE_DEBUG] onBattleQuestionSubmit received', { answer, ts: Date.now() });
  handleBattleAnswer(answer);
}

function handleBattleAnswer(answer: number | null) {
  console.log('[ArithmeticPage][SHAKE_DEBUG] handleBattleAnswer called', { answer, ts: Date.now() });
  if (!battleEngine.value || isSubmittingAnswer.value) {
    console.log('[ArithmeticPage][SHAKE_DEBUG] early return', { hasEngine: !!battleEngine.value, isSubmitting: isSubmittingAnswer.value });
    return;
  }

  // modify by jx: save expected answer BEFORE submitAnswer (submitAnswer advances currentQuestion to next)
  const expectedAnswer = battleEngine.value.state.currentQuestion?.answer ?? null;
  const isCorrect = answer !== null && answer === expectedAnswer;
  console.log('[ArithmeticPage][SHAKE_DEBUG] before submitAnswer', { answer, expectedAnswer, isCorrect, ts: Date.now() });

  isSubmittingAnswer.value = true;
  const result = battleEngine.value.submitAnswer(answer);

  console.log('[ArithmeticPage][SHAKE_DEBUG] after submitAnswer', { result, isCorrect, enemyHP: battleEngine.value.state.enemyHP, ts: Date.now() });

  if (result && battleEngine.value.state.enemyHP <= 0) {
    // Victory
    console.log('[ArithmeticPage][SHAKE_DEBUG] victory branch, trigger hit');
    isEnemyHit.value = false;
    nextTick(() => {
      isEnemyHit.value = true;
    });
    setTimeout(() => {
      isSubmittingAnswer.value = false;
      showBattleResult.value = true;
      battleRecord.value = battleEngine.value?.getBattleRecord() || null;
      battleResult.value = 'victory';
    }, 500);
  } else if (battleEngine.value.state.playerHP <= 0) {
    // Defeat
    isSubmittingAnswer.value = false;
    showBattleResult.value = true;
    battleRecord.value = battleEngine.value?.getBattleRecord() || null;
    battleResult.value = 'defeat';
  } else {
    // Continue - modify by jx: use isCorrect (saved before submit) to trigger hit shake; reset then set true in nextTick
    if (isCorrect) {
      console.log('[ArithmeticPage][SHAKE_DEBUG] correct answer, trigger energy orb shake');
      isEnemyHit.value = false;
      nextTick(() => {
        isEnemyHit.value = true;
        console.log('[ArithmeticPage][SHAKE_DEBUG] isEnemyHit set to true in nextTick');
      });
    } else {
      console.log('[ArithmeticPage][SHAKE_DEBUG] wrong answer, no shake');
    }
    setTimeout(() => {
      isEnemyHit.value = false;
      isSubmittingAnswer.value = false;
      nextTick(() => {
        battleQuestionRef.value?.focus();
      });
    }, 400);
  }
}

function handleRetreat() {
  if (!battleEngine.value) return;
  
  ElMessage.warning('撤退成功！');
  battleRecord.value = battleEngine.value.retreat();
  battleResult.value = 'retreat';
  showBattleResult.value = true;
}

function handleRematch() {
  if (!battleEngine.value) return;
  battleEngine.value.resetBattle();
  battleEngine.value.startPrepareTimer();
  showBattleResult.value = false;
}

function handleReturnFromBattle() {
  if (!battleEngine.value) return;
  battleEngine.value.resetBattle();
  showBattleResult.value = false;
  // modify by jx: keep battle mode to allow rematch after retreat
  // answerMode.value = 'practice';
}

// Handle battle settings update
function handleBattleSettingsUpdate(settings: BattleSettings) {
  battleSettings.value = settings;
}

// Handle entering battle mode
function handleEnterBattle() {
  logDebug('Entering battle mode with config:', {
    config: config.value,
    battleSettings: battleSettings.value
  });
}

// Use answering composable
const {
  isSubmitted,
  getAllAnswers,
  isAllAnswered,
  initializeAnswers,
  setAnswer,
  submitAnswers,
  resetAnswers,
  clearAnswers,
  getElapsedTime
} = useAnswering(() => questions.value);

// Watch answerMode changes
watch(answerMode, (newMode) => {
  logDebug('answerMode changed to:', newMode);
  if (newMode === 'answering' && questions.value.length > 0) {
    clearAnswers();
    initializeAnswers();
  } else if (newMode === 'battle') {
    // Initialize battle state when entering battle mode
    logDebug('Entering battle mode, clearing questions and answers');
    clearQuestions();
    clearAnswers();
  } else {
    clearAnswers();
  }
});

// Watch questions change to initialize answers
watch(questions, (newQuestions) => {
  if (newQuestions.length > 0 && answerMode.value === 'answering') {
    initializeAnswers();
  }
});

// Student answers map for QuestionDisplay component
const studentAnswersMap = computed(() => {
  const map = new Map();
  getAllAnswers.value.forEach((answer) => {
    map.set(answer.questionId, {
      answer: answer.answer,
      status: answer.status
    });
  });
  return map;
});

// Score result
const score = ref<ScoreResult | null>(null);

// Wrong questions and statistics
const wrongQuestions = ref<WrongQuestion[]>([]);
const wrongQuestionStats = ref<WrongQuestionStats | null>(null);

// Tutoring plan
const tutoringPlan = ref<TutoringPlan | null>(null);

// Handle generate questions
const handleGenerate = () => {
  // Validate operations
  if (config.value.operations.length === 0) {
    ElMessage.warning('请至少选择一种运算类型');
    return;
  }

  // Validate range
  if (config.value.minValue >= config.value.maxValue) {
    ElMessage.warning('最小值必须小于最大值');
    return;
  }

  // Clear previous questions
  clearQuestions();
  clearAnswers();
  score.value = null;
  wrongQuestions.value = [];
  wrongQuestionStats.value = null;
  tutoringPlan.value = null;

  // Generate new questions
  try {
    const generated = generateQuestions(config.value);
    
    if (generated.length === 0) {
      ElMessage.error('生成题目失败，请调整配置后重试');
      return;
    }

    // Initialize answers if in answering mode
    if (answerMode.value === 'answering') {
      initializeAnswers();
    }

    ElMessage.success(`成功生成 ${generated.length} 道题目`);
  } catch (error) {
    console.error('Generate questions error:', error);
    ElMessage.error('生成题目时发生错误');
  }
};

// Handle answer change
const handleAnswerChange = (questionId: string, answer: number | null) => {
  setAnswer(questionId, answer);
};

// Handle submit answers
const handleSubmitAnswers = () => {
  if (!isAllAnswered.value) {
    ElMessage.warning('请完成所有题目后再提交');
    return;
  }

  // Submit answers
  const submittedAnswers = submitAnswers();
  
  // Calculate score
  const elapsedTime = getElapsedTime.value;
  score.value = calculateScore(submittedAnswers, elapsedTime);

  // Extract wrong questions
  wrongQuestions.value = extractWrongQuestions(questions.value, submittedAnswers);
  
  // Calculate wrong question statistics
  if (wrongQuestions.value.length > 0) {
    wrongQuestionStats.value = calculateWrongQuestionStats(wrongQuestions.value);
    
    // Generate tutoring plan
    tutoringPlan.value = generateTutoringPlan(
      wrongQuestionStats.value,
      questions.value.length
    );
  } else {
    wrongQuestionStats.value = null;
    tutoringPlan.value = null;
  }

  ElMessage.success('答案已提交！');
};

// Handle reset answers
const handleResetAnswers = () => {
  clearAnswers();
  resetAnswers();
  score.value = null;
  wrongQuestions.value = [];
  wrongQuestionStats.value = null;
  tutoringPlan.value = null;
  ElMessage.info('已重置，可以重新答题');
};

// Handle view wrong questions
const handleViewWrongQuestions = () => {
  ElMessage.info(`共有 ${wrongQuestions.value.length} 道错题`);
};

// Handle apply recommended config
const handleApplyRecommendedConfig = (recommendedConfig: Partial<QuestionConfig>) => {
  if (recommendedConfig.operations) {
    config.value.operations = recommendedConfig.operations;
  }
  if (recommendedConfig.operandCount) {
    config.value.operandCount = recommendedConfig.operandCount;
  }
  if (recommendedConfig.questionCount) {
    config.value.questionCount = recommendedConfig.questionCount;
  }
  ElMessage.success('已应用推荐配置，请重新生成题目');
};

// Handle export TXT
const handleExportTxt = (includeAnswers: boolean) => {
  if (questions.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    exportToTxt(questions.value, includeAnswers);
  } catch (error) {
    console.error('Export TXT error:', error);
    ElMessage.error('导出TXT失败');
  }
};

// Handle export PDF
const handleExportPdf = (includeAnswers: boolean) => {
  if (questions.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    exportToPdf(questions.value, includeAnswers);
  } catch (error) {
    console.error('Export PDF error:', error);
    ElMessage.error('导出PDF失败');
  }
};

// Handle export Excel
const handleExportExcel = (includeAnswers: boolean) => {
  if (questions.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    exportToExcel(questions.value, includeAnswers);
  } catch (error) {
    console.error('Export Excel error:', error);
    ElMessage.error('导出Excel失败');
  }
};

// Handle print
const handlePrint = (includeAnswers: boolean) => {
  if (questions.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    printQuestions(questions.value, includeAnswers);
  } catch (error) {
    console.error('Print error:', error);
    ElMessage.error('打印失败');
  }
};
</script>

<style scoped>
.arithmetic-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  transition: all 0.3s ease;
}

.arithmetic-page.battle-mode {
  max-width: 800px;
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 16px;
}

.header-left {
  text-align: left;
}

.header-right {
  flex-shrink: 0;
}

.settings-button {
  width: 44px;
  height: 44px;
}

.settings-button .el-icon {
  font-size: 20px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 12px 0;
}

.subtitle {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

.control-panel-section {
  margin-bottom: 24px;
}

.action-buttons-section {
  margin-bottom: 24px;
}

.answer-actions-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.score-section {
  margin-bottom: 24px;
}

.analysis-section {
  margin-bottom: 24px;
}

.tutoring-plan-section {
  margin-bottom: 24px;
}

.question-display-section {
  margin-bottom: 24px;
}

/* Battle mode styles */
.battle-start-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  margin-bottom: 24px;
}

.battle-start-section .el-button {
  height: 64px;
  padding: 0 48px;
  font-size: 24px;
  font-weight: 700;
  border-radius: 16px;
}

.battle-hint {
  color: #909399;
  font-size: 16px;
}

.battle-container {
  padding: 24px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 16px;
  margin-bottom: 24px;
}

.battle-info {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
  font-size: 16px;
  color: #909399;
}

.battle-info span:first-child {
  color: #67c23a;
}

.battle-info span:last-child {
  color: #409eff;
}

/* Responsive design */
@media (max-width: 768px) {
  .arithmetic-page {
    padding: 12px;
  }

  .arithmetic-page.battle-mode {
    padding: 12px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .debug-bar {
    font-family: monospace;
    white-space: pre;
  }

  .battle-info {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
}
</style>
