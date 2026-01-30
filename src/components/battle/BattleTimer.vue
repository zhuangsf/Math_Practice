<template>
  <div class="battle-timer">
    <div 
      class="timer-display"
      :class="{ 
        'warning': timeRemaining <= 3 && timeRemaining > 0,
        'critical': timeRemaining <= 1,
        'finished': timeRemaining <= 0
      }"
    >
      <span class="timer-value">{{ formattedTime }}</span>
      <span class="timer-unit">秒</span>
    </div>
    
    <!-- Progress bar -->
    <div class="progress-container">
      <div 
        class="progress-bar"
        :style="{ width: progressPercent + '%' }"
        :class="{ 
          'warning': timeRemaining <= 3 && timeRemaining > 0,
          'critical': timeRemaining <= 1
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement battle countdown timer component with visual feedback

import { computed } from 'vue';

interface Props {
  timeRemaining: number;
  maxTime: number;
}

const props = withDefaults(defineProps<Props>(), {
  timeRemaining: 0,
  maxTime: 10
});

// Computed
const progressPercent = computed(() => {
  return Math.max(0, Math.min(100, (props.timeRemaining / props.maxTime) * 100));
});

const formattedTime = computed(() => {
  const time = Math.max(0, props.timeRemaining);
  if (time < 1) {
    return time.toFixed(1);
  }
  return time.toFixed(1);
});
</script>

<style scoped>
.battle-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px;
}

.timer-display {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.timer-value {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  min-width: 60px;
  text-align: right;
}

.timer-unit {
  font-size: 14px;
  color: #909399;
}

.timer-display.warning {
  animation: pulse 0.5s ease infinite;
}

.timer-display.warning .timer-value {
  color: #e6a23c;
}

.timer-display.critical {
  animation: shake 0.2s ease infinite;
}

.timer-display.critical .timer-value {
  color: #f56c6c;
}

.timer-display.finished .timer-value {
  color: #909399;
}

/* Progress bar */
.progress-container {
  width: 100%;
  max-width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #67c23a 0%, #85ce61 100%);
  border-radius: 4px;
  transition: width 0.1s linear, background 0.3s ease;
}

.progress-bar.warning {
  background: linear-gradient(90deg, #e6a23c 0%, #f5c582 100%);
}

.progress-bar.critical {
  background: linear-gradient(90deg, #f56c6c 0%, #f89898 100%);
  animation: progress-flash 0.2s ease infinite;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

@keyframes progress-flash {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .timer-value {
    font-size: 24px;
    min-width: 50px;
  }

  .timer-unit {
    font-size: 12px;
  }

  .progress-container {
    max-width: 200px;
  }
}
</style>
