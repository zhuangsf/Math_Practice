<template>
  <el-dialog
    v-model="visible"
    width="640px"
    class="battle-review-dialog"
    modal-class="battle-review-dialog"
    :show-close="false"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <!-- modify by jx: custom header with large close button at top-right -->
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">战况复盘</span>
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
    <div class="review-content">
      <!-- Time Analysis Section; modify by jx: add for battle review time analysis -->
      <div class="section time-analysis-section">
        <h4 class="section-title">答题速度分析</h4>
        <div class="time-stats-grid">
          <div class="time-stat-card">
            <div class="time-stat-value">{{ formatTime(timeStats.totalDuration) }}</div>
            <div class="time-stat-label">总用时</div>
          </div>
          <div class="time-stat-card">
            <div class="time-stat-value">{{ timeStats.averageTime.toFixed(1) }}秒</div>
            <div class="time-stat-label">平均用时</div>
          </div>
          <div class="time-stat-card">
            <div class="time-stat-value">{{ timeStats.fastestTime.toFixed(1) }}秒</div>
            <div class="time-stat-label">最快用时</div>
          </div>
          <div class="time-stat-card">
            <div class="time-stat-value">{{ timeStats.slowestTime.toFixed(1) }}秒</div>
            <div class="time-stat-label">最慢用时</div>
          </div>
        </div>
        <!-- Time Distribution; modify by jx: add time distribution visualization -->
        <div class="time-distribution">
          <div class="distribution-bar">
            <div
              class="distribution-segment fast"
              :style="{ width: getDistributionPercent('fast') + '%' }"
              :title="'快速 (≤3秒): ' + timeStats.fastCount + '题'"
            ></div>
            <div
              class="distribution-segment normal"
              :style="{ width: getDistributionPercent('normal') + '%' }"
              :title="'正常 (3-6秒): ' + timeStats.normalCount + '题'"
            ></div>
            <div
              class="distribution-segment slow"
              :style="{ width: getDistributionPercent('slow') + '%' }"
              :title="'较慢 (6-10秒): ' + timeStats.slowCount + '题'"
            ></div>
            <div
              class="distribution-segment timeout"
              :style="{ width: getDistributionPercent('timeout') + '%' }"
              :title="'超时 (>10秒): ' + timeStats.timeoutCount + '题'"
            ></div>
          </div>
          <div class="distribution-legend">
            <span class="legend-item"><span class="legend-dot fast"></span>快速 ≤3秒</span>
            <span class="legend-item"><span class="legend-dot normal"></span>正常 3-6秒</span>
            <span class="legend-item"><span class="legend-dot slow"></span>较慢 6-10秒</span>
            <span class="legend-item"><span class="legend-dot timeout"></span>超时 >10秒</span>
          </div>
        </div>
      </div>

      <!-- Answer Summary; modify by jx: add for battle review answer summary -->
      <div class="section summary-section">
        <h4 class="section-title">答题概况</h4>
        <div class="summary-grid">
          <div class="summary-card correct">
            <div class="summary-value">{{ record.stats.correctAnswers }}</div>
            <div class="summary-label">正确</div>
          </div>
          <div class="summary-card wrong">
            <div class="summary-value">{{ wrongQuestions.length - getTimeoutCount() }}</div>
            <div class="summary-label">错误</div>
          </div>
          <div class="summary-card timeout">
            <div class="summary-value">{{ getTimeoutCount() }}</div>
            <div class="summary-label">超时</div>
          </div>
          <div class="summary-card accuracy">
            <div class="summary-value">{{ record.stats.accuracy }}%</div>
            <div class="summary-label">正确率</div>
          </div>
        </div>
      </div>

      <!-- Wrong Question List -->
      <div v-if="wrongQuestions.length" class="section wrong-list-section">
        <h4 class="section-title">错题详情</h4>
        <div class="wrong-list">
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
                <span v-else class="badge-time-spent">用时 {{ wq.timeSpent?.toFixed(1) || '-' }}秒</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wrong Question Type Analysis -->
      <div v-if="wrongQuestions.length && stats" class="section stats-section">
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

      <!-- No Wrong Questions Message -->
      <div v-if="!wrongQuestions.length" class="section success-section">
        <div class="success-message">
          <span class="success-icon">🎉</span>
          <span class="success-text">太棒了！本次战斗所有题目全部正确！</span>
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
// modify by jx: implement battle review dialog for settlement review - time analysis, answer summary, wrong list, type analysis, tutoring suggestions

import { computed } from 'vue';
import type { BattleRecord, BattleWrongQuestion, TutoringPlan, QuestionConfig } from '@/types';
import { calculateWrongQuestionStatsFromBattle, getOperationTypeName, getOperandCountName } from '@/composables/useWrongQuestionAnalysis';
import { generateTutoringPlan } from '@/composables/useTutoringPlan';

interface Props {
  modelValue: boolean;
  record: BattleRecord;
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

// Get wrong questions from record
const wrongQuestions = computed<BattleWrongQuestion[]>(
  () => props.record.wrongQuestions ?? []
);

// Calculate timeout count
function getTimeoutCount(): number {
  return wrongQuestions.value.filter(wq => wq.isTimeout).length;
}

// Get question times from record; modify by jx: use all question times for accurate time analysis
const questionTimes = computed<number[]>(
  () => props.record.questionTimes ?? []
);

// Time statistics; modify by jx: add for battle review time analysis
interface TimeStats {
  totalDuration: number;
  averageTime: number;
  fastestTime: number;
  slowestTime: number;
  fastCount: number;
  normalCount: number;
  slowCount: number;
  timeoutCount: number;
}

const timeStats = computed<TimeStats>(() => {
  const totalQuestions = props.record.stats.totalQuestions;
  const duration = props.record.duration;
  const allTimes = questionTimes.value;

  // Calculate average time from actual question times
  const averageTime = allTimes.length > 0
    ? allTimes.reduce((sum, t) => sum + t, 0) / allTimes.length
    : duration / totalQuestions;

  // Calculate fastest and slowest times from actual data
  let fastestTime: number;
  let slowestTime: number;

  if (allTimes.length > 0) {
    fastestTime = Math.min(...allTimes);
    slowestTime = Math.max(...allTimes);
  } else {
    // Fallback: estimate from average
    fastestTime = averageTime * 0.5;
    slowestTime = averageTime * 1.5;
  }

  // Count by time category (using all question times)
  const fastCount = allTimes.filter(t => t <= 3).length;
  const normalCount = allTimes.filter(t => t > 3 && t <= 6).length;
  const slowCount = allTimes.filter(t => t > 6 && t <= 10).length;
  const timeoutCount = getTimeoutCount();

  return {
    totalDuration: duration,
    averageTime,
    fastestTime,
    slowestTime,
    fastCount,
    normalCount,
    slowCount,
    timeoutCount
  };
});

// Get distribution percentage
function getDistributionPercent(category: 'fast' | 'normal' | 'slow' | 'timeout'): number {
  const totalQuestions = props.record.stats.totalQuestions || 1;

  switch (category) {
    case 'fast':
      return (timeStats.value.fastCount / totalQuestions) * 100;
    case 'normal':
      return (timeStats.value.normalCount / totalQuestions) * 100;
    case 'slow':
      return (timeStats.value.slowCount / totalQuestions) * 100;
    case 'timeout':
      return (timeStats.value.timeoutCount / totalQuestions) * 100;
    default:
      return 0;
  }
}

// Format time from seconds to mm:ss
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins > 0) {
    return `${mins}分${secs}秒`;
  }
  return `${secs}秒`;
}

const stats = computed(() => {
  if (!wrongQuestions.value.length) return null;
  return calculateWrongQuestionStatsFromBattle(wrongQuestions.value);
});

const plan = computed<TutoringPlan | null>(() => {
  const s = stats.value;
  if (!s || props.record.stats.totalQuestions <= 0) return null;
  return generateTutoringPlan(s, props.record.stats.totalQuestions);
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

.review-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  margin: 0 0 16px 0;
}

/* Time Analysis Section; modify by jx: add styles for time analysis */
.time-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.time-stat-card {
  padding: 14px 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.time-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.time-stat-label {
  font-size: 12px;
  color: #909399;
}

/* Time Distribution; modify by jx: add time distribution styles */
.time-distribution {
  margin-top: 8px;
}

.distribution-bar {
  display: flex;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.distribution-segment {
  height: 100%;
  transition: width 0.3s ease;
}

.distribution-segment.fast {
  background: linear-gradient(90deg, #67c23a, #85ce61);
}

.distribution-segment.normal {
  background: linear-gradient(90deg, #409eff, #66b1ff);
}

.distribution-segment.slow {
  background: linear-gradient(90deg, #e6a23c, #f5c07a);
}

.distribution-segment.timeout {
  background: linear-gradient(90deg, #f56c6c, #f89898);
}

.distribution-legend {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #909399;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.fast {
  background: #67c23a;
}

.legend-dot.normal {
  background: #409eff;
}

.legend-dot.slow {
  background: #e6a23c;
}

.legend-dot.timeout {
  background: #f56c6c;
}

/* Summary Section; modify by jx: add styles for answer summary */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.summary-card {
  padding: 14px 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.summary-card.correct {
  border-color: rgba(103, 194, 58, 0.3);
  background: rgba(103, 194, 58, 0.1);
}

.summary-card.wrong {
  border-color: rgba(245, 108, 108, 0.3);
  background: rgba(245, 108, 108, 0.1);
}

.summary-card.timeout {
  border-color: rgba(230, 162, 60, 0.3);
  background: rgba(230, 162, 60, 0.1);
}

.summary-card.accuracy {
  border-color: rgba(64, 158, 255, 0.3);
  background: rgba(64, 158, 255, 0.1);
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.summary-card.correct .summary-value {
  color: #67c23a;
}

.summary-card.wrong .summary-value {
  color: #f56c6c;
}

.summary-card.timeout .summary-value {
  color: #e6a23c;
}

.summary-card.accuracy .summary-value {
  color: #409eff;
}

.summary-label {
  font-size: 12px;
  color: #909399;
}

/* Wrong list */
.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 200px;
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

.badge-time-spent {
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 11px;
  background: rgba(64, 158, 255, 0.25);
  color: #409eff;
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

/* Success Section; modify by jx: add styles for no wrong questions */
.success-section {
  background: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.25);
}

.success-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px;
}

.success-icon {
  font-size: 28px;
}

.success-text {
  font-size: 16px;
  font-weight: 600;
  color: #67c23a;
}

@media (max-width: 640px) {
  .time-stats-grid,
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid.operand-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .distribution-legend {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>

<style>
/* modify by jx: dark theme to match battle/settlement UI; remove white border; ensure all layout bg dark */
.battle-review-dialog .el-dialog {
  --el-dialog-bg-color: #1a1a2e;
  background: #1a1a2e !important;
  border: none !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4) !important;
}

.battle-review-dialog .el-dialog__wrapper {
  background: transparent;
}

.battle-review-dialog .el-dialog__header {
  color: #fff;
  background: #1a1a2e !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 24px 16px;
  position: relative;
}

.battle-review-dialog .el-dialog__body {
  padding: 20px 24px 24px;
  background: #1a1a2e !important;
}

.battle-review-dialog .el-dialog__footer {
  padding: 16px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: #1a1a2e !important;
}

.battle-review-dialog .el-overlay-dialog,
.battle-review-dialog .el-overlay {
  background: rgba(0, 0, 0, 0.6);
}
</style>
