<template>
  <el-dialog
    v-model="visible"
    width="600px"
    class="battle-wrong-question-dialog"
    modal-class="battle-wrong-question-dialog"
    :show-close="false"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <!-- modify by jx: custom header with large close button at top-right -->
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">查看错题</span>
        <button
          type="button"
          class="close-btn"
          aria-label="关闭"
          @click="handleClose"
        >
          <span class="close-icon">×</span>
        </button>
      </div>
    </template>
    <div class="wrong-question-content">
      <!-- Wrong Question List -->
      <div class="section wrong-list-section">
        <h4 class="section-title">错题列表</h4>
        <div class="wrong-list" v-if="wrongQuestions.length">
          <div
            v-for="(wq, idx) in wrongQuestions"
            :key="wq.questionId"
            class="wrong-item"
          >
            <div class="wrong-index">{{ idx + 1 }}</div>
            <div class="wrong-detail">
              <div class="wrong-expression">{{ wq.question.expression }} = ?</div>
              <div class="wrong-answers">
                <span class="label">你的答案：</span>
                <span :class="['value', wq.isTimeout ? 'timeout' : 'wrong']">
                  {{ wq.isTimeout ? '未作答' : wq.studentAnswer }}
                </span>
                <span class="label correct">正确答案：</span>
                <span class="value correct">{{ wq.correctAnswer }}</span>
                <span v-if="wq.isTimeout" class="badge-timeout">超时</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wrong Question Type Analysis -->
      <div v-if="stats && stats.total > 0" class="section stats-section">
        <h4 class="section-title">错题类型分析</h4>
        <div class="stats-summary">共 {{ stats.total }} 题错误</div>
        <div class="stats-grid">
          <div class="stat-card" :class="{ 'has-error': stats.byOperationType.add > 0 }">
            <span class="stat-label">加法</span>
            <span class="stat-value">{{ stats.byOperationType.add }}题</span>
          </div>
          <div class="stat-card" :class="{ 'has-error': stats.byOperationType.subtract > 0 }">
            <span class="stat-label">减法</span>
            <span class="stat-value">{{ stats.byOperationType.subtract }}题</span>
          </div>
          <div class="stat-card" :class="{ 'has-error': stats.byOperationType.multiply > 0 }">
            <span class="stat-label">乘法</span>
            <span class="stat-value">{{ stats.byOperationType.multiply }}题</span>
          </div>
          <div class="stat-card" :class="{ 'has-error': stats.byOperationType.divide > 0 }">
            <span class="stat-label">除法</span>
            <span class="stat-value">{{ stats.byOperationType.divide }}题</span>
          </div>
        </div>
        <div class="stats-grid operand-stats">
          <div class="stat-card" :class="{ 'has-error': stats.byOperandCount.binary > 0 }">
            <span class="stat-label">二元运算</span>
            <span class="stat-value">{{ stats.byOperandCount.binary }}题</span>
          </div>
          <div class="stat-card" :class="{ 'has-error': stats.byOperandCount.ternary > 0 }">
            <span class="stat-label">三元运算</span>
            <span class="stat-value">{{ stats.byOperandCount.ternary }}题</span>
          </div>
          <div class="stat-card" :class="{ 'has-error': stats.byOperandCount.quaternary > 0 }">
            <span class="stat-label">四元运算</span>
            <span class="stat-value">{{ stats.byOperandCount.quaternary }}题</span>
          </div>
        </div>
      </div>

      <!-- Tutoring Plan / Learning Suggestions -->
      <div v-if="plan && plan.suggestions.length > 0" class="section suggestions-section">
        <h4 class="section-title">个性化学习建议</h4>
        <ul class="suggestions-list">
          <li v-for="(suggestion, index) in plan.suggestions" :key="index" class="suggestion-item">
            <span class="suggestion-icon">💡</span>
            <span class="suggestion-text">{{ suggestion }}</span>
          </li>
        </ul>
        <div v-if="plan.recommendedConfig" class="recommended-config-hint">
          <span class="hint-label">推荐练习：</span>
          <span class="hint-value">{{ formatRecommendedConfig(plan.recommendedConfig) }}</span>
        </div>
      </div>
    </div>
    <!-- modify by jx: footer with return button; Esc and click-outside also close -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" size="large" class="return-btn" @click="handleClose">
          返回
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// modify by jx: implement battle wrong question dialog for settlement review - wrong list, type analysis, tutoring suggestions

import { computed } from 'vue';
import type { BattleWrongQuestion, TutoringPlan, QuestionConfig } from '@/types';
import { calculateWrongQuestionStatsFromBattle, getOperationTypeName, getOperandCountName } from '@/composables/useWrongQuestionAnalysis';
import { generateTutoringPlan } from '@/composables/useTutoringPlan';

interface Props {
  modelValue: boolean;
  wrongQuestions: BattleWrongQuestion[];
  totalQuestions: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
});

function handleClose() {
  visible.value = false;
}

const stats = computed(() => {
  if (!props.wrongQuestions.length) return null;
  return calculateWrongQuestionStatsFromBattle(props.wrongQuestions);
});

const plan = computed<TutoringPlan | null>(() => {
  const s = stats.value;
  if (!s || props.totalQuestions <= 0) return null;
  return generateTutoringPlan(s, props.totalQuestions);
});

function formatRecommendedConfig(cfg: Partial<QuestionConfig>): string {
  const parts: string[] = [];
  if (cfg.operations?.length) {
    parts.push(cfg.operations.map(getOperationTypeName).join('、'));
  }
  if (cfg.operandCount !== undefined) {
    parts.push(cfg.operandCount === 'mixed' ? '混合模式' : getOperandCountName(cfg.operandCount));
  }
  parts.push(`${cfg.questionCount || 20}题`);
  return parts.join('，') || '';
}
</script>

<style scoped>
/* modify by jx: custom header with large close button */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.close-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(245, 108, 108, 0.3);
  border-color: rgba(245, 108, 108, 0.5);
}

.close-icon {
  font-size: 32px;
  font-weight: 300;
  line-height: 1;
  color: #e4e7ed;
}

.close-btn:hover .close-icon {
  color: #f56c6c;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.return-btn {
  min-width: 140px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
}

.wrong-question-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
}

/* modify by jx: dark theme to match battle/settlement UI */
.section {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px 0;
}

/* Wrong list */
.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 220px;
  overflow-y: auto;
}

.wrong-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wrong-index {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 108, 108, 0.25);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  color: #f56c6c;
}

.wrong-detail {
  flex: 1;
  min-width: 0;
}

.wrong-expression {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.wrong-answers {
  font-size: 14px;
  color: #e4e7ed;
}

.wrong-answers .label {
  margin-right: 4px;
}

.wrong-answers .value.wrong {
  color: #f56c6c;
  font-weight: 600;
  margin-right: 12px;
}

.wrong-answers .value.timeout {
  color: #e6a23c;
  font-weight: 600;
  margin-right: 12px;
}

.wrong-answers .label.correct,
.wrong-answers .value.correct {
  color: #67c23a;
  font-weight: 600;
}

.badge-timeout {
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 11px;
  background: rgba(230, 162, 60, 0.25);
  color: #e6a23c;
  border-radius: 4px;
}

/* Stats */
.stats-summary {
  font-size: 14px;
  color: #f56c6c;
  font-weight: 600;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stats-grid.operand-stats {
  margin-top: 10px;
  grid-template-columns: repeat(3, 1fr);
}

.stat-card {
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-card.has-error {
  background: rgba(245, 108, 108, 0.12);
  border-color: rgba(245, 108, 108, 0.3);
}

.stat-card.has-error .stat-value {
  color: #f56c6c;
}

.stat-card .stat-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-card .stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

/* Suggestions */
.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(64, 158, 255, 0.12);
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.suggestion-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.suggestion-text {
  font-size: 14px;
  color: #e4e7ed;
  line-height: 1.6;
}

.recommended-config-hint {
  margin-top: 12px;
  padding: 12px 14px;
  background: rgba(103, 194, 58, 0.1);
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid rgba(103, 194, 58, 0.25);
}

.hint-label {
  color: #909399;
  margin-right: 8px;
}

.hint-value {
  color: #67c23a;
  font-weight: 600;
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid.operand-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<style>
/* modify by jx: dark theme to match battle/settlement UI; remove white border; ensure all layout bg dark */
.battle-wrong-question-dialog .el-dialog {
  --el-dialog-bg-color: #1a1a2e;
  background: #1a1a2e !important;
  border: none !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4) !important;
}

.battle-wrong-question-dialog .el-dialog__wrapper {
  background: transparent;
}

.battle-wrong-question-dialog .el-dialog__header {
  color: #fff;
  background: #1a1a2e !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 24px 16px;
  position: relative;
}

.battle-wrong-question-dialog .el-dialog__body {
  padding: 20px 24px 24px;
  background: #1a1a2e !important;
}

.battle-wrong-question-dialog .el-dialog__footer {
  padding: 16px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: #1a1a2e !important;
}

.battle-wrong-question-dialog .el-overlay-dialog,
.battle-wrong-question-dialog .el-overlay {
  background: rgba(0, 0, 0, 0.6);
}
</style>
