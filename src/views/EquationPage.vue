<template>
  <div class="equation-page">
    <!-- Header -->
    <div class="header">
      <h2 class="title">一元一次方程题目生成</h2>
      <p class="subtitle">支持简单、中等、复杂三种难度级别</p>
    </div>

    <!-- Control Panel -->
    <div class="control-panel-section">
      <EquationControlPanel
        v-model="config"
        v-model:show-answers="showAnswers"
      />
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons-section">
      <ActionButtons
        :is-generating="isGenerating"
        :is-exporting="isExporting"
        :questions="equationsAsQuestions"
        :show-answers="showAnswers"
        @generate="handleGenerate"
        @export-txt="handleExportTxt"
        @export-pdf="handleExportPdf"
        @export-excel="handleExportExcel"
        @print="handlePrint"
      />
    </div>

    <!-- Equation Display -->
    <div class="equation-display-section">
      <EquationDisplay
        :equations="equations"
        :show-answers="showAnswers"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement equation page with control panel, action buttons and equation display

import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import EquationControlPanel from '@/components/EquationControlPanel.vue';
import EquationDisplay from '@/components/EquationDisplay.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import { useEquationGenerator } from '@/composables/useEquationGenerator';
import { useExport } from '@/composables/useExport';
import type { EquationConfig, Question } from '@/types';

// Default configuration
const defaultConfig: EquationConfig = {
  difficulty: 'easy',
  questionCount: 20
};

// Reactive state
const config = ref<EquationConfig>({ ...defaultConfig });
const showAnswers = ref(false);

// Use equation generator composable
const { isGenerating, equations, generateEquations, clearEquations } = useEquationGenerator();

// Use export composable
// modify by jx: add exportEquationsToExcel to the export composable destructuring
const { isExporting, exportEquationsToTxt, exportEquationsToPdf, exportEquationsToExcel, printEquations } = useExport();

// Convert equations to questions format for export
// modify by jx: convert to Question[] format for ActionButtons component
const equationsAsQuestions = computed<Question[]>(() => {
  return equations.value.map(eq => ({
    id: eq.id,
    expression: eq.equation,
    answer: eq.answer,
    numbers: [],
    operators: []
  }));
});

// Handle generate equations
const handleGenerate = () => {
  // Clear previous equations
  clearEquations();

  // Generate new equations
  try {
    const generated = generateEquations(config.value);
    
    if (generated.length === 0) {
      ElMessage.error('生成题目失败，请调整配置后重试');
      return;
    }

    ElMessage.success(`成功生成 ${generated.length} 道题目`);
  } catch (error) {
    console.error('Generate equations error:', error);
    ElMessage.error('生成题目时发生错误');
  }
};

// Handle export TXT
const handleExportTxt = (includeAnswers: boolean) => {
  if (equations.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    exportEquationsToTxt(equations.value, includeAnswers);
  } catch (error) {
    console.error('Export TXT error:', error);
    ElMessage.error('导出TXT失败');
  }
};

// Handle export PDF
const handleExportPdf = (includeAnswers: boolean) => {
  if (equations.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    exportEquationsToPdf(equations.value, includeAnswers);
  } catch (error) {
    console.error('Export PDF error:', error);
    ElMessage.error('导出PDF失败');
  }
};

// Handle export Excel
// modify by jx: add Excel export handler for equation questions
const handleExportExcel = (includeAnswers: boolean) => {
  if (equations.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    exportEquationsToExcel(equations.value, includeAnswers);
  } catch (error) {
    console.error('Export Excel error:', error);
    ElMessage.error('导出Excel失败');
  }
};

// Handle print
const handlePrint = (includeAnswers: boolean) => {
  if (equations.value.length === 0) {
    ElMessage.warning('请先生成题目');
    return;
  }

  try {
    printEquations(equations.value, includeAnswers);
  } catch (error) {
    console.error('Print error:', error);
    ElMessage.error('打印失败');
  }
};
</script>

<style scoped>
.equation-page {
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

.equation-display-section {
  margin-bottom: 24px;
}

/* Responsive design */
@media (max-width: 768px) {
  .equation-page {
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
