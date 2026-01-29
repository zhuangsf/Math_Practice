<template>
  <div class="action-buttons">
    <el-button
      v-if="true"
      type="primary"
      size="large"
      :loading="isGenerating"
      @click="handleGenerate"
      class="generate-button"
    >
      <el-icon><MagicStick /></el-icon>
      生成题目
    </el-button>

    <el-button
      v-if="false"
      type="success"
      size="large"
      :disabled="!hasQuestions || isExporting"
      :loading="isExporting"
      @click="handleExportTxt"
    >
      <el-icon><Document /></el-icon>
      导出TXT
    </el-button>

    <el-button
      v-if="false"
      type="warning"
      size="large"
      :disabled="!hasQuestions || isExporting"
      :loading="isExporting"
      @click="handleExportPdf"
    >
      <el-icon><DocumentCopy /></el-icon>
      导出PDF
    </el-button>

    <el-button
      type="success"
      size="large"
      :disabled="!hasQuestions || isExporting"
      :loading="isExporting"
      @click="handleExportExcel"
    >
      <el-icon><Grid /></el-icon>
      导出Excel
    </el-button>

    <el-button
      type="info"
      size="large"
      :disabled="!hasQuestions || isExporting"
      @click="handlePrint"
    >
      <el-icon><Printer /></el-icon>
      打印
    </el-button>

    <!-- Export Options Dialog -->
    <el-dialog
      v-model="showExportDialog"
      title="导出选项"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="export-options">
        <el-checkbox v-model="exportIncludeAnswers" size="large">
          包含答案
        </el-checkbox>
      </div>
      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmExport">确认导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement action buttons component for generate, export and print

import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { MagicStick, Document, DocumentCopy, Printer, Grid } from '@element-plus/icons-vue';
import type { Question } from '@/types';

// Define props and emits
const props = defineProps<{
  isGenerating: boolean;
  isExporting: boolean;
  questions: Question[];
  showAnswers: boolean;
}>();

const emit = defineEmits<{
  (e: 'generate'): void;
  (e: 'exportTxt', includeAnswers: boolean): void;
  (e: 'exportPdf', includeAnswers: boolean): void;
  (e: 'exportExcel', includeAnswers: boolean): void;
  (e: 'print', includeAnswers: boolean): void;
}>();

// Export dialog state
const showExportDialog = ref(false);
const exportIncludeAnswers = ref(false);
let pendingExportType: 'txt' | 'pdf' | 'excel' | 'print' | null = null;

// Check if there are questions to export
const hasQuestions = computed(() => props.questions.length > 0);

// Handle generate button click
const handleGenerate = () => {
  emit('generate');
};

// Handle export TXT button click
const handleExportTxt = () => {
  pendingExportType = 'txt';
  exportIncludeAnswers.value = props.showAnswers;
  showExportDialog.value = true;
};

// Handle export PDF button click
const handleExportPdf = () => {
  pendingExportType = 'pdf';
  exportIncludeAnswers.value = props.showAnswers;
  showExportDialog.value = true;
};

// Handle export Excel button click
// modify by jx: add Excel export button click handler
const handleExportExcel = () => {
  pendingExportType = 'excel';
  exportIncludeAnswers.value = props.showAnswers;
  showExportDialog.value = true;
};

// Handle print button click
const handlePrint = () => {
  pendingExportType = 'print';
  exportIncludeAnswers.value = props.showAnswers;
  showExportDialog.value = true;
};

// Confirm export
// modify by jx: add Excel export handling in confirm export function
const confirmExport = () => {
  showExportDialog.value = false;

  try {
    switch (pendingExportType) {
      case 'txt':
        emit('exportTxt', exportIncludeAnswers.value);
        ElMessage.success('TXT文件导出成功');
        break;
      case 'pdf':
        emit('exportPdf', exportIncludeAnswers.value);
        ElMessage.success('PDF文件导出成功');
        break;
      case 'excel':
        emit('exportExcel', exportIncludeAnswers.value);
        ElMessage.success('Excel文件导出成功');
        break;
      case 'print':
        emit('print', exportIncludeAnswers.value);
        ElMessage.success('打印窗口已打开');
        break;
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试');
    console.error(error);
  }

  pendingExportType = null;
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.generate-button {
  min-width: 160px;
}

.export-options {
  padding: 20px 0;
}
</style>
