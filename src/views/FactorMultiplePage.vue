<template>
  <div class="factor-multiple-page">
    <!-- Header -->
    <div class="header">
      <h2 class="title">倍数与因数题目生成</h2>
      <p class="subtitle">支持找倍数、找因数、最大公因数、最小公倍数</p>
    </div>

    <!-- Control Panel -->
    <div class="control-panel-section">
      <FactorMultipleControlPanel
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
        :questions="questions as any"
        :show-answers="showAnswers"
        @generate="handleGenerate"
        @export-txt="handleExportTxt"
        @export-pdf="handleExportPdf"
        @export-excel="handleExportExcel"
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
      <FactorMultipleWrongQuestionAnalysis
        :stats="wrongQuestionStats"
        :wrong-questions="wrongQuestions"
        @view-wrong-questions="handleViewWrongQuestions"
      />
    </div>

    <!-- Tutoring Plan -->
    <div v-if="tutoringPlan && isSubmitted" class="tutoring-plan-section">
      <FactorMultipleTutoringPlan
        :plan="tutoringPlan"
        @apply-recommended-config="handleApplyRecommendedConfig"
      />
    </div>

    <!-- Question Display -->
    <div class="question-display-section">
      <FactorMultipleDisplay
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
// modify by jx: implement factor multiple page with control panel, action buttons, question display, answering and scoring

import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import FactorMultipleControlPanel from '@/components/FactorMultipleControlPanel.vue';
import FactorMultipleDisplay from '@/components/FactorMultipleDisplay.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import ScoreDisplay from '@/components/ScoreDisplay.vue';
import FactorMultipleWrongQuestionAnalysis from '@/components/FactorMultipleWrongQuestionAnalysis.vue';
import FactorMultipleTutoringPlan from '@/components/FactorMultipleTutoringPlan.vue';
import { useFactorMultipleGenerator } from '@/composables/useFactorMultipleGenerator';
import { useExport } from '@/composables/useExport';
import { validateFactorMultipleAnswer, parseFactorMultipleAnswer } from '@/utils/factorMultipleUtils';
import { calculateScore } from '@/composables/useScoring';
import { extractFactorMultipleWrongQuestions, calculateFactorMultipleWrongQuestionStats } from '@/composables/useWrongQuestionAnalysis';
import { generateFactorMultipleTutoringPlan } from '@/composables/useTutoringPlan';
import type { FactorMultipleConfig, AnswerStatus, ScoreResult, FactorMultipleWrongQuestion, FactorMultipleWrongQuestionStats, FactorMultipleTutoringPlan as FactorMultipleTutoringPlanType } from '@/types';

// Default configuration
const defaultConfig: FactorMultipleConfig = {
  questionTypes: ['find-multiples', 'find-factors', 'gcd', 'lcm'],
  valueRange: [1, 50],
  questionCount: 20,
  multipleCount: 5
};

// Reactive state
const config = ref<FactorMultipleConfig>({ ...defaultConfig });
const showAnswers = ref(false);
const answerMode = ref<'practice' | 'answering'>('practice');

// Use factor multiple generator composable
const { isGenerating, questions, generate, clear } = useFactorMultipleGenerator();

// Use export composable
const { isExporting, exportFactorMultipleToTxt, exportFactorMultipleToPdf, exportFactorMultipleToExcel, printFactorMultiple } = useExport();

// Answering state
const isSubmitted = ref(false);
const startTime = ref<Date | null>(null);
const studentAnswers = ref<Map<string, { answer: string | number | number[] | null; status: AnswerStatus }>>(new Map());

// Score result
const score = ref<ScoreResult | null>(null);

// Wrong questions and statistics
const wrongQuestions = ref<FactorMultipleWrongQuestion[]>([]);
const wrongQuestionStats = ref<FactorMultipleWrongQuestionStats | null>(null);

// Tutoring plan
const tutoringPlan = ref<FactorMultipleTutoringPlanType | null>(null);

// Initialize answers when questions are generated
watch(questions, (newQuestions) => {
  if (newQuestions.length > 0 && answerMode.value === 'answering') {
    studentAnswers.value.clear();
    newQuestions.forEach(q => {
      studentAnswers.value.set(q.id, { answer: null, status: 'unanswered' });
    });
    isSubmitted.value = false;
    startTime.value = new Date();
    score.value = null;
    wrongQuestions.value = [];
    wrongQuestionStats.value = null;
    tutoringPlan.value = null;
  }
});

// Watch answerMode changes
watch(answerMode, (newMode) => {
  if (newMode === 'answering' && questions.value.length > 0) {
    studentAnswers.value.clear();
    questions.value.forEach(q => {
      studentAnswers.value.set(q.id, { answer: null, status: 'unanswered' });
    });
    isSubmitted.value = false;
    startTime.value = new Date();
    score.value = null;
  } else if (newMode === 'practice') {
    studentAnswers.value.clear();
    isSubmitted.value = false;
    startTime.value = null;
    score.value = null;
    wrongQuestions.value = [];
    wrongQuestionStats.value = null;
    tutoringPlan.value = null;
  }
});

// Student answers map for FactorMultipleDisplay component
const studentAnswersMap = computed(() => {
  return studentAnswers.value;
});

// Check if all questions are answered
const isAllAnswered = computed(() => {
  return Array.from(studentAnswers.value.values()).every(
    answer => answer.answer !== null && answer.answer !== undefined && answer.answer !== ''
  );
});

// Handle generate questions
const handleGenerate = () => {
  // Validate question types
  if (config.value.questionTypes.length === 0) {
    ElMessage.warning('请至少选择一种题目类型');
    return;
  }

  // Validate range
  if (config.value.valueRange[0] >= config.value.valueRange[1]) {
    ElMessage.warning('最小值必须小于最大值');
    return;
  }

  // Clear previous state
  clear();
  studentAnswers.value.clear();
  isSubmitted.value = false;
  startTime.value = null;
  score.value = null;
  wrongQuestions.value = [];
  wrongQuestionStats.value = null;
  tutoringPlan.value = null;

  // Generate questions
  generate(config.value);
};

// Handle answer change
const handleAnswerChange = (questionId: string, answer: string | number | number[] | null) => {
  const question = questions.value.find(q => q.id === questionId);
  if (!question) return;

  const currentAnswer = studentAnswers.value.get(questionId);
  if (currentAnswer) {
    currentAnswer.answer = answer;
    if (answer !== null && answer !== undefined && answer !== '') {
      currentAnswer.status = 'answered';
    } else {
      currentAnswer.status = 'unanswered';
    }
  }
};

// Handle submit answers
const handleSubmitAnswers = () => {
  if (!isAllAnswered.value) {
    ElMessage.warning('请完成所有题目后再提交');
    return;
  }

  // Validate and check answers
  questions.value.forEach(question => {
    const studentAnswer = studentAnswers.value.get(question.id);
    if (!studentAnswer || studentAnswer.answer === null || studentAnswer.answer === undefined) return;

    try {
      let parsedAnswer: number | number[];
      if (typeof studentAnswer.answer === 'string') {
        parsedAnswer = parseFactorMultipleAnswer(studentAnswer.answer);
      } else {
        parsedAnswer = studentAnswer.answer;
      }
      
      if (validateFactorMultipleAnswer(parsedAnswer, question.answer)) {
        studentAnswer.status = 'correct';
      } else {
        studentAnswer.status = 'wrong';
      }
    } catch (error) {
      studentAnswer.status = 'wrong';
    }
  });

  isSubmitted.value = true;
  
  // Calculate elapsed time
  const elapsedTime = startTime.value 
    ? Math.floor((new Date().getTime() - startTime.value.getTime()) / 1000)
    : 0;

  // Convert answers to StudentAnswer format for scoring
  const studentAnswersArray = Array.from(studentAnswers.value.entries()).map(([questionId, answer]) => {
    let numAnswer: number | null = null;
    if (typeof answer.answer === 'number') {
      numAnswer = answer.answer;
    } else if (typeof answer.answer === 'string') {
      try {
        const parsed = parseFactorMultipleAnswer(answer.answer);
        numAnswer = Array.isArray(parsed) ? parsed[0] : parsed;
      } catch {
        numAnswer = null;
      }
    } else if (Array.isArray(answer.answer)) {
      numAnswer = answer.answer[0] || null;
    }
    return {
      questionId,
      answer: numAnswer,
      status: answer.status as AnswerStatus
    };
  });

  // Calculate score using useScoring
  score.value = calculateScore(studentAnswersArray, elapsedTime);

  // Extract wrong questions
  wrongQuestions.value = extractFactorMultipleWrongQuestions(questions.value, studentAnswers.value);
  
  // Calculate wrong question statistics
  if (wrongQuestions.value.length > 0) {
    wrongQuestionStats.value = calculateFactorMultipleWrongQuestionStats(wrongQuestions.value);
    
    // Generate tutoring plan
    tutoringPlan.value = generateFactorMultipleTutoringPlan(
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
  studentAnswers.value.forEach(answer => {
    answer.answer = null;
    answer.status = 'unanswered';
  });
  isSubmitted.value = false;
  startTime.value = new Date();
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
const handleApplyRecommendedConfig = (recommendedConfig: Partial<FactorMultipleConfig>) => {
  if (recommendedConfig.questionTypes) {
    config.value.questionTypes = recommendedConfig.questionTypes;
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
    exportFactorMultipleToTxt(questions.value, includeAnswers);
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
    exportFactorMultipleToPdf(questions.value, includeAnswers);
  } catch (error) {
    console.error('Export PDF error:', error);
    ElMessage.error('导出PDF失败');
  }
};

// Handle export Excel
// modify by jx: add Excel export handler for factor multiple questions
const handleExportExcel = (includeAnswers: boolean) => {
  if (questions.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    exportFactorMultipleToExcel(questions.value, includeAnswers);
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
    printFactorMultiple(questions.value, includeAnswers);
  } catch (error) {
    console.error('Print error:', error);
    ElMessage.error('打印失败');
  }
};
</script>

<style scoped>
.factor-multiple-page {
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
  font-size: 14px;
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
  gap: 12px;
  justify-content: center;
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
  margin-top: 24px;
}
</style>
