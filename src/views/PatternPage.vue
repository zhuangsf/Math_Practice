<template>
  <div class="pattern-page">
    <!-- Header -->
    <div class="header">
      <h2 class="title">找规律题目生成</h2>
      <p class="subtitle">支持等差数列、等比数列、斐波那契数列、平方数列、立方数列</p>
    </div>

    <!-- Control Panel -->
    <div class="control-panel-section">
      <PatternControlPanel
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
      <PatternWrongQuestionAnalysis
        :stats="wrongQuestionStats"
        :wrong-questions="wrongQuestions"
        @view-wrong-questions="handleViewWrongQuestions"
      />
    </div>

    <!-- Tutoring Plan -->
    <div v-if="tutoringPlan && isSubmitted" class="tutoring-plan-section">
      <PatternTutoringPlan
        :plan="tutoringPlan"
        @apply-recommended-config="handleApplyRecommendedConfig"
      />
    </div>

    <!-- Question Display -->
    <div class="question-display-section">
      <PatternDisplay
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
// modify by jx: implement pattern page with control panel, action buttons, question display, answering and scoring

import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import PatternControlPanel from '@/components/PatternControlPanel.vue';
import PatternDisplay from '@/components/PatternDisplay.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import ScoreDisplay from '@/components/ScoreDisplay.vue';
import PatternWrongQuestionAnalysis from '@/components/PatternWrongQuestionAnalysis.vue';
import PatternTutoringPlan from '@/components/PatternTutoringPlan.vue';
import { usePatternGenerator } from '@/composables/usePatternGenerator';
import { validatePatternAnswer } from '@/utils/patternUtils';
import { calculateScore } from '@/composables/useScoring';
import { extractPatternWrongQuestions, calculatePatternWrongQuestionStats } from '@/composables/useWrongQuestionAnalysis';
import { generatePatternTutoringPlan } from '@/composables/useTutoringPlan';
import type { PatternConfig, AnswerStatus, ScoreResult, PatternWrongQuestion, PatternWrongQuestionStats, PatternTutoringPlan as PatternTutoringPlanType } from '@/types';

// Default configuration
const defaultConfig: PatternConfig = {
  patternTypes: ['arithmetic', 'geometric', 'fibonacci', 'square', 'cube'],
  questionCount: 20,
  termsCount: 4
};

// Reactive state
const config = ref<PatternConfig>({ ...defaultConfig });
const showAnswers = ref(false);
const answerMode = ref<'practice' | 'answering'>('practice');

// Use pattern generator composable
const { isGenerating, questions, generate, clear } = usePatternGenerator();

// Export state
const isExporting = ref(false);

// Answering state
const isSubmitted = ref(false);
const startTime = ref<Date | null>(null);
const studentAnswers = ref<Map<string, { answer: string | null; status: AnswerStatus }>>(new Map());

// Score result
const score = ref<ScoreResult | null>(null);

// Wrong questions and statistics
const wrongQuestions = ref<PatternWrongQuestion[]>([]);
const wrongQuestionStats = ref<PatternWrongQuestionStats | null>(null);

// Tutoring plan
const tutoringPlan = ref<PatternTutoringPlanType | null>(null);

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

// Student answers map for PatternDisplay component
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
  // Validate pattern types
  if (config.value.patternTypes.length === 0) {
    ElMessage.warning('请至少选择一种规律类型');
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
const handleAnswerChange = (questionId: string, answer: string | null) => {
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

    const isCorrect = validatePatternAnswer(studentAnswer.answer, question.answer);
    
    if (isCorrect) {
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
  const studentAnswersArray = Array.from(studentAnswers.value.entries()).map(([questionId, answer]) => {
    let numAnswer: number | null = null;
    if (answer.answer) {
      numAnswer = parseInt(answer.answer, 10);
      if (isNaN(numAnswer)) {
        numAnswer = null;
      }
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
  wrongQuestions.value = extractPatternWrongQuestions(questions.value, studentAnswers.value);
  
  // Calculate wrong question statistics
  if (wrongQuestions.value.length > 0) {
    wrongQuestionStats.value = calculatePatternWrongQuestionStats(wrongQuestions.value);
    
    // Generate tutoring plan
    tutoringPlan.value = generatePatternTutoringPlan(
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
const handleApplyRecommendedConfig = (recommendedConfig: Partial<PatternConfig>) => {
  if (recommendedConfig.patternTypes) {
    config.value.patternTypes = recommendedConfig.patternTypes;
  }
  if (recommendedConfig.questionCount) {
    config.value.questionCount = recommendedConfig.questionCount;
  }
  ElMessage.success('已应用推荐配置，请重新生成题目');
};

// Handle export (simplified - will need proper implementation)
const handleExportTxt = () => {
  ElMessage.info('导出功能开发中...');
};

const handleExportPdf = () => {
  ElMessage.info('导出功能开发中...');
};

const handlePrint = () => {
  ElMessage.info('打印功能开发中...');
};
</script>

<style scoped>
.pattern-page {
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
