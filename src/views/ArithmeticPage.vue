<template>
  <div class="arithmetic-page">
    <!-- Header -->
    <div class="header">
      <h2 class="title">四则运算题目生成</h2>
      <p class="subtitle">支持加减乘除多种运算模式</p>
    </div>

    <!-- Control Panel -->
    <div class="control-panel-section">
      <ControlPanel
        v-model="config"
        v-model:show-answers="showAnswers"
        v-model:answer-mode="answerMode"
      />
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons-section">
      <ActionButtons
        :is-generating="isGenerating"
        :is-exporting="isExporting"
        :questions="questions"
        :show-answers="showAnswers"
        @generate="handleGenerate"
        @export-txt="handleExportTxt"
        @export-pdf="handleExportPdf"
        @print="handlePrint"
      />
    </div>

    <!-- Answer Mode Actions -->
    <div v-if="answerMode === 'answering' && questions.length > 0" class="answer-actions-section">
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

    <!-- Score Display -->
    <div v-if="score && isSubmitted" class="score-section">
      <ScoreDisplay :score="score" />
    </div>

    <!-- Wrong Question Analysis -->
    <div v-if="wrongQuestionStats && isSubmitted" class="analysis-section">
      <WrongQuestionAnalysis
        :stats="wrongQuestionStats"
        :wrong-questions="wrongQuestions"
        @view-wrong-questions="handleViewWrongQuestions"
      />
    </div>

    <!-- Tutoring Plan -->
    <div v-if="tutoringPlan && isSubmitted" class="tutoring-plan-section">
      <TutoringPlanComponent
        :plan="tutoringPlan"
        @apply-recommended-config="handleApplyRecommendedConfig"
      />
    </div>

    <!-- Question Display -->
    <div class="question-display-section">
      <QuestionDisplay
        :questions="questions"
        :show-answers="showAnswers"
        :answer-mode="answerMode"
        :student-answers="studentAnswersMap"
        :is-submitted="isSubmitted"
        @answer-change="handleAnswerChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement arithmetic page with control panel, action buttons, question display, answering, scoring and analysis

import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import ControlPanel from '@/components/ControlPanel.vue';
import QuestionDisplay from '@/components/QuestionDisplay.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import ScoreDisplay from '@/components/ScoreDisplay.vue';
import WrongQuestionAnalysis from '@/components/WrongQuestionAnalysis.vue';
import TutoringPlanComponent from '@/components/TutoringPlan.vue';
import { useQuestionGenerator } from '@/composables/useQuestionGenerator';
import { useExport } from '@/composables/useExport';
import { useAnswering } from '@/composables/useAnswering';
import { calculateScore } from '@/composables/useScoring';
import { extractWrongQuestions, calculateWrongQuestionStats } from '@/composables/useWrongQuestionAnalysis';
import { generateTutoringPlan } from '@/composables/useTutoringPlan';
import type { QuestionConfig, ScoreResult, WrongQuestionStats, WrongQuestion, TutoringPlan } from '@/types';

// Default configuration
const defaultConfig: QuestionConfig = {
  operandCount: 2,
  minValue: 0,
  maxValue: 1000,
  operations: ['add', 'subtract', 'multiply', 'divide'],
  questionCount: 20
};

// Reactive state
const config = ref<QuestionConfig>({ ...defaultConfig });
const showAnswers = ref(false);
const answerMode = ref<'practice' | 'answering'>('practice');

// Use question generator composable
const { isGenerating, questions, generateQuestions, clearQuestions } = useQuestionGenerator();

// Use export composable
const { isExporting, exportToTxt, exportToPdf, printQuestions } = useExport();

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
  if (newMode === 'answering' && questions.value.length > 0) {
    // modify by jx: clear all answers before initializing when entering answering mode
    clearAnswers();
    initializeAnswers();
  } else if (newMode === 'practice') {
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
  // modify by jx: clear all answers before resetting
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
  // TODO: Implement wrong questions view dialog or page
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
}

.header {
  text-align: center;
  margin-bottom: 32px;
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

/* Responsive design */
@media (max-width: 768px) {
  .arithmetic-page {
    padding: 12px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
