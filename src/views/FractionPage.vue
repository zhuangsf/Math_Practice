<template>
  <div class="fraction-page">
    <!-- Header -->
    <div class="header">
      <h2 class="title">分数运算题目生成</h2>
      <p class="subtitle">支持分数加减乘除、分数化简等练习</p>
    </div>

    <!-- Control Panel -->
    <div class="control-panel-section">
      <FractionControlPanel
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

    <!-- Question Display -->
    <div class="question-display-section">
      <FractionDisplay
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
// modify by jx: implement fraction page with control panel, action buttons, question display, answering and scoring

import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import FractionControlPanel from '@/components/FractionControlPanel.vue';
import FractionDisplay from '@/components/FractionDisplay.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import { useFractionGenerator } from '@/composables/useFractionGenerator';
import { parseFraction, fractionsEqual } from '@/utils/fractionUtils';
import type { FractionConfig, AnswerStatus } from '@/types';

// Default configuration
const defaultConfig: FractionConfig = {
  denominatorRange: [2, 10],
  numeratorRange: [1, 9],
  operations: ['add', 'subtract', 'multiply', 'divide'],
  questionCount: 20,
  includeMixedNumbers: false,
  questionTypes: ['same-denominator', 'different-denominator']
};

// Reactive state
const config = ref<FractionConfig>({ ...defaultConfig });
const showAnswers = ref(false);
const answerMode = ref<'practice' | 'answering'>('practice');

// Use fraction generator composable
const { isGenerating, questions, generate, clear } = useFractionGenerator();

// Export state
const isExporting = ref(false);

// Answering state
const isSubmitted = ref(false);
const studentAnswers = ref<Map<string, { answer: string | null; status: AnswerStatus }>>(new Map());

// Initialize answers when questions are generated
watch(questions, (newQuestions) => {
  if (newQuestions.length > 0 && answerMode.value === 'answering') {
    studentAnswers.value.clear();
    newQuestions.forEach(q => {
      studentAnswers.value.set(q.id, { answer: null, status: 'unanswered' });
    });
    isSubmitted.value = false;
  }
});

// Student answers map for FractionDisplay component
const studentAnswersMap = computed(() => {
  return studentAnswers.value;
});

// Check if all questions are answered
const isAllAnswered = computed(() => {
  return Array.from(studentAnswers.value.values()).every(
    answer => answer.answer !== null && answer.answer.trim() !== ''
  );
});

// Handle generate questions
const handleGenerate = () => {
  // Validate operations
  if (config.value.operations.length === 0) {
    ElMessage.warning('请至少选择一种运算类型');
    return;
  }

  // Validate question types
  if (config.value.questionTypes.length === 0) {
    ElMessage.warning('请至少选择一种题目类型');
    return;
  }

  // Validate ranges
  if (config.value.denominatorRange[0] >= config.value.denominatorRange[1]) {
    ElMessage.warning('分母最小值必须小于最大值');
    return;
  }

  if (config.value.numeratorRange[0] >= config.value.numeratorRange[1]) {
    ElMessage.warning('分子最小值必须小于最大值');
    return;
  }

  // Clear previous state
  clear();
  studentAnswers.value.clear();
  isSubmitted.value = false;

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
    if (answer && answer.trim()) {
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
    if (!studentAnswer || !studentAnswer.answer) return;

    try {
      const parsedAnswer = parseFraction(studentAnswer.answer);
      if (fractionsEqual(parsedAnswer, question.answer)) {
        studentAnswer.status = 'correct';
      } else {
        studentAnswer.status = 'wrong';
      }
    } catch (error) {
      studentAnswer.status = 'wrong';
    }
  });

  isSubmitted.value = true;
  
  // Calculate score
  const correctCount = Array.from(studentAnswers.value.values()).filter(
    a => a.status === 'correct'
  ).length;
  const total = questions.value.length;
  const percentage = (correctCount / total) * 100;

  ElMessage.success(`提交成功！得分：${correctCount}/${total} (${percentage.toFixed(1)}%)`);
};

// Handle reset answers
const handleResetAnswers = () => {
  studentAnswers.value.forEach(answer => {
    answer.answer = null;
    answer.status = 'unanswered';
  });
  isSubmitted.value = false;
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
.fraction-page {
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

.question-display-section {
  margin-top: 24px;
}
</style>
