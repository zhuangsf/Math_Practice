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

    <!-- Question Display -->
    <div class="question-display-section">
      <QuestionDisplay
        :questions="questions"
        :show-answers="showAnswers"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement arithmetic page with control panel, action buttons and question display

import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import ControlPanel from '@/components/ControlPanel.vue';
import QuestionDisplay from '@/components/QuestionDisplay.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import { useQuestionGenerator } from '@/composables/useQuestionGenerator';
import { useExport } from '@/composables/useExport';
import type { QuestionConfig } from '@/types';

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

// Use question generator composable
const { isGenerating, questions, generateQuestions, clearQuestions } = useQuestionGenerator();

// Use export composable
const { isExporting, exportToTxt, exportToPdf, printQuestions } = useExport();

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

  // Generate new questions
  try {
    const generated = generateQuestions(config.value);
    
    if (generated.length === 0) {
      ElMessage.error('生成题目失败，请调整配置后重试');
      return;
    }

    ElMessage.success(`成功生成 ${generated.length} 道题目`);
  } catch (error) {
    console.error('Generate questions error:', error);
    ElMessage.error('生成题目时发生错误');
  }
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
