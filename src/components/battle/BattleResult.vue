<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="560px"
    class="battle-result-dialog"
  >
    <!-- Victory -->
    <div v-if="result === 'victory'" class="result-content victory">
      <div class="result-icon">🎉</div>
      <h2 class="result-title">战斗胜利！</h2>
      <p class="result-subtitle">能量团已被驯服</p>
      
      <div class="result-stats">
        <div class="stat-card">
          <div class="stat-value">{{ record.stats.totalQuestions }}</div>
          <div class="stat-label">答题数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ record.stats.correctAnswers }}</div>
          <div class="stat-label">正确数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ record.stats.accuracy }}%</div>
          <div class="stat-label">正确率</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ record.stats.maxCombo }}</div>
          <div class="stat-label">最大连击</div>
        </div>
      </div>

      <div class="result-details">
        <div class="detail-item">
          <span class="detail-label">用时</span>
          <span class="detail-value">{{ record.duration.toFixed(1) }}秒</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">剩余HP</span>
          <span class="detail-value success">{{ (record.stats.remainingPlayerHP ?? 0).toFixed(1) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">总伤害</span>
          <span class="detail-value">{{ record.stats.totalDamage.toFixed(1) }}</span>
        </div>
      </div>
    </div>

    <!-- Defeat -->
    <div v-else-if="result === 'defeat'" class="result-content defeat">
      <div class="result-icon">💔</div>
      <h2 class="result-title">战斗失败</h2>
      <p class="result-subtitle">能量团太强大了...</p>
      
      <div class="result-stats">
        <div class="stat-card">
          <div class="stat-value">{{ record.stats.totalQuestions }}</div>
          <div class="stat-label">答题数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ record.stats.correctAnswers }}</div>
          <div class="stat-label">正确数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ record.stats.accuracy }}%</div>
          <div class="stat-label">正确率</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ record.stats.maxCombo }}</div>
          <div class="stat-label">最大连击</div>
        </div>
      </div>

      <div class="encouragement">
        别灰心！再试一次，你一定能驯服能量团！
      </div>
    </div>

    <!-- Retreat -->
    <div v-else class="result-content retreat">
      <div class="result-icon">🏃</div>
      <h2 class="result-title">撤退成功</h2>
      <p class="result-subtitle">保存实力，下次再战！</p>
    </div>

    <!-- Actions -->
    <template #footer>
      <div class="result-actions">
        <el-button
          v-if="hasWrongQuestions"
          type="warning"
          size="large"
          @click="showWrongQuestionDialog = true"
        >
          📋 查看错题
        </el-button>
        <el-button size="large" @click="handleRematch">
          🔄 再战一场
        </el-button>
        <el-button type="primary" size="large" @click="handleReturn">
          返回练习
        </el-button>
      </div>
    </template>

    <!-- Wrong Question Dialog; modify by jx: add for settlement wrong-question review -->
    <BattleWrongQuestionDialog
      v-model="showWrongQuestionDialog"
      :wrong-questions="record.wrongQuestions ?? []"
      :total-questions="record.stats.totalQuestions"
    />
  </el-dialog>
</template>

<script setup lang="ts">
// modify by jx: implement battle result display dialog component
// Terminology: 能量团 (victory/defeat copy). See README 战斗模式术语.

import { ref, computed } from 'vue';
import BattleWrongQuestionDialog from './BattleWrongQuestionDialog.vue';
import type { BattleRecord, BattleResult } from '@/types';

interface Props {
  modelValue: boolean;
  record: BattleRecord;
  result: BattleResult;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'rematch'): void;
  (e: 'return'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showWrongQuestionDialog = ref(false);

const hasWrongQuestions = computed(
  () => (props.record.wrongQuestions?.length ?? 0) > 0
);

// Visible state
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Handlers
function handleRematch() {
  visible.value = false;
  emit('rematch');
}

function handleReturn() {
  visible.value = false;
  emit('return');
}
</script>

<style>
/* Dialog styles */
.battle-result-dialog {
  --el-dialog-bg-color: #1a1a2e;
  --el-dialog-title-font-size: 20px;
}

.battle-result-dialog .el-dialog__header {
  display: none;
}

.battle-result-dialog .el-dialog__body {
  padding: 32px 40px;
}

.battle-result-dialog .el-dialog__footer {
  padding: 20px 40px 28px;
}
</style>

<style scoped>
.result-content {
  text-align: center;
}

.result-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.result-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #fff;
}

.result-subtitle {
  font-size: 16px;
  color: #909399;
  margin: 0 0 24px 0;
}

.result-content.victory .result-title {
  color: #67c23a;
}

.result-content.defeat .result-title {
  color: #f56c6c;
}

.result-content.retreat .result-title {
  color: #e6a23c;
}

/* Stats grid */
.result-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 16px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card .stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.stat-card .stat-label {
  font-size: 12px;
  color: #909399;
}

/* Details */
.result-details {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #909399;
}

.detail-value {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.detail-value.success {
  color: #67c23a;
}

/* Encouragement */
.encouragement {
  padding: 16px;
  background: rgba(230, 162, 60, 0.1);
  border-radius: 12px;
  color: #e6a23c;
  font-size: 16px;
  margin-top: 24px;
}

/* Actions; modify by jx: add padding and gap so buttons not stuck to edges */
.result-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 20px;
  padding: 0 8px;
}

.result-actions .el-button {
  min-width: 130px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 560px) {
  .result-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .result-details {
    flex-direction: column;
    gap: 16px;
  }

  .result-actions {
    flex-direction: column;
  }

  .result-actions .el-button {
    width: 100%;
  }
}
</style>
