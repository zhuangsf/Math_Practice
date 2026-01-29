<template>
  <div class="geometry-page">
    <!-- Header -->
    <div class="header">
      <h2 class="title">几何计算题目生成</h2>
      <p class="subtitle">支持周长、面积、体积计算</p>
    </div>

    <!-- Control Panel -->
    <div class="control-panel-section">
      <GeometryControlPanel
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
      <GeometryWrongQuestionAnalysis
        :stats="wrongQuestionStats"
        :wrong-questions="wrongQuestions"
        @view-wrong-questions="handleViewWrongQuestions"
      />
    </div>

    <!-- Tutoring Plan -->
    <div v-if="tutoringPlan && isSubmitted" class="tutoring-plan-section">
      <GeometryTutoringPlan
        :plan="tutoringPlan"
        @apply-recommended-config="handleApplyRecommendedConfig"
      />
    </div>

    <!-- Question Display -->
    <div class="question-display-section">
      <GeometryDisplay
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
// modify by jx: implement geometry page with control panel, action buttons, question display, answering and scoring

import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import GeometryControlPanel from '@/components/GeometryControlPanel.vue';
import GeometryDisplay from '@/components/GeometryDisplay.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import ScoreDisplay from '@/components/ScoreDisplay.vue';
import GeometryWrongQuestionAnalysis from '@/components/GeometryWrongQuestionAnalysis.vue';
import GeometryTutoringPlan from '@/components/GeometryTutoringPlan.vue';
import { useGeometryGenerator } from '@/composables/useGeometryGenerator';
import { useExport } from '@/composables/useExport';
import { validateGeometryAnswer } from '@/utils/geometryUtils';
import { calculateScore } from '@/composables/useScoring';
import { extractGeometryWrongQuestions, calculateGeometryWrongQuestionStats } from '@/composables/useWrongQuestionAnalysis';
import { generateGeometryTutoringPlan } from '@/composables/useTutoringPlan';
import type { GeometryConfig, AnswerStatus, ScoreResult, GeometryWrongQuestion, GeometryWrongQuestionStats, GeometryTutoringPlan as GeometryTutoringPlanType } from '@/types';

// Default configuration
const defaultConfig: GeometryConfig = {
  shapes: ['rectangle', 'square', 'triangle', 'circle', 'cuboid', 'cube'],
  calculationTypes: ['perimeter', 'area', 'volume'],
  parameterRange: [1, 20],
  questionCount: 20,
  piValue: 3.14
};

// Reactive state
const config = ref<GeometryConfig>({ ...defaultConfig });
const showAnswers = ref(false);
const answerMode = ref<'practice' | 'answering'>('practice');

// Use geometry generator composable
const { isGenerating, questions, generate, clear } = useGeometryGenerator();

// Use export composable
const { isExporting, exportGeometryToTxt, exportGeometryToPdf, exportGeometryToExcel, printGeometry } = useExport();

// Answering state
const isSubmitted = ref(false);
const startTime = ref<Date | null>(null);
const studentAnswers = ref<Map<string, { answer: number | null; status: AnswerStatus }>>(new Map());

// Score result
const score = ref<ScoreResult | null>(null);

// Wrong questions and statistics
const wrongQuestions = ref<GeometryWrongQuestion[]>([]);
const wrongQuestionStats = ref<GeometryWrongQuestionStats | null>(null);

// Tutoring plan
const tutoringPlan = ref<GeometryTutoringPlanType | null>(null);

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

// Student answers map for GeometryDisplay component
const studentAnswersMap = computed(() => {
  return studentAnswers.value;
});

// Check if all questions are answered
const isAllAnswered = computed(() => {
  return Array.from(studentAnswers.value.values()).every(
    answer => answer.answer !== null && answer.answer !== undefined
  );
});

// Handle generate questions
const handleGenerate = () => {
  // Validate shapes
  if (config.value.shapes.length === 0) {
    ElMessage.warning('请至少选择一种图形类型');
    return;
  }

  // Validate calculation types
  if (config.value.calculationTypes.length === 0) {
    ElMessage.warning('请至少选择一种计算类型');
    return;
  }

  // Validate range
  if (config.value.parameterRange[0] >= config.value.parameterRange[1]) {
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
const handleAnswerChange = (questionId: string, answer: number | null) => {
  const question = questions.value.find(q => q.id === questionId);
  if (!question) return;

  const currentAnswer = studentAnswers.value.get(questionId);
  if (currentAnswer) {
    currentAnswer.answer = answer;
    if (answer !== null && answer !== undefined) {
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

    if (validateGeometryAnswer(studentAnswer.answer, question.answer)) {
      studentAnswer.status = 'correct';
    } else {
      studentAnswer.status = 'wrong';
    }
  });

  isSubmitted.value = true;
  
  // Calculate elapsed time
  const elapsedTime = startTime.value 
    ? Math.floor((new Date().getTime() - startTime.value.getTime()) / 1000)
    : 0;

  // Convert answers to StudentAnswer format for scoring
  const studentAnswersArray = Array.from(studentAnswers.value.entries()).map(([questionId, answer]) => ({
    questionId,
    answer: answer.answer || null,
    status: answer.status as AnswerStatus
  }));

  // Calculate score using useScoring
  score.value = calculateScore(studentAnswersArray, elapsedTime);

  // Extract wrong questions
  wrongQuestions.value = extractGeometryWrongQuestions(questions.value, studentAnswers.value);
  
  // Calculate wrong question statistics
  if (wrongQuestions.value.length > 0) {
    wrongQuestionStats.value = calculateGeometryWrongQuestionStats(wrongQuestions.value);
    
    // Generate tutoring plan
    tutoringPlan.value = generateGeometryTutoringPlan(
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
const handleApplyRecommendedConfig = (recommendedConfig: Partial<GeometryConfig>) => {
  if (recommendedConfig.shapes) {
    config.value.shapes = recommendedConfig.shapes;
  }
  if (recommendedConfig.calculationTypes) {
    config.value.calculationTypes = recommendedConfig.calculationTypes;
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
    exportGeometryToTxt(questions.value, includeAnswers);
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
    exportGeometryToPdf(questions.value, includeAnswers);
  } catch (error) {
    console.error('Export PDF error:', error);
    ElMessage.error('导出PDF失败');
  }
};

// Handle export Excel
// modify by jx: add Excel export handler for geometry questions
const handleExportExcel = (includeAnswers: boolean) => {
  if (questions.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    exportGeometryToExcel(questions.value, includeAnswers);
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
    printGeometry(questions.value, includeAnswers);
  } catch (error) {
    console.error('Print error:', error);
    ElMessage.error('打印失败');
  }
};
</script>

<style scoped>
.geometry-page {
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
