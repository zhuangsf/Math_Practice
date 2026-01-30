<template>
  <el-dialog
    v-model="visible"
    title="⚙️ 游戏设置"
    width="400px"
    center
    :close-on-click-modal="true"
    class="settings-dialog"
  >
    <div class="settings-content">
      <!-- Battle Settings Section -->
      <div class="settings-section">
        <h3 class="section-title">战斗设置</h3>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">进入战斗震动效果</span>
            <span class="setting-description">进入战斗画面时能量团的震动动画</span>
          </div>
          <el-switch
            v-model="shakeEnabled"
            active-text="开启"
            inactive-text="关闭"
          />
        </div>
      </div>
    </div>
    
    <template #footer>
      <el-button type="primary" @click="handleConfirm">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// modify by jx: implement settings dialog for game configuration
// Terminology: 能量团 (shake description). See README 战斗模式术语.

import { ref, watch } from 'vue';

interface Props {
  modelValue: boolean;
  shakeEnabled: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:shakeEnabled', value: boolean): void;
  (e: 'confirm', settings: { shakeEnabled: boolean }): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  shakeEnabled: false  // modify by jx: default off to disable energy orb shake after starting battle
});

const emit = defineEmits<Emits>();

const visible = ref(props.modelValue);
const shakeEnabled = ref(props.shakeEnabled);

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal;
});

watch(() => props.shakeEnabled, (newVal) => {
  shakeEnabled.value = newVal;
});

// Watch for visible change
watch(visible, (newVal) => {
  emit('update:modelValue', newVal);
});

// Handle confirm
function handleConfirm() {
  emit('update:shakeEnabled', shakeEnabled.value);
  emit('confirm', { shakeEnabled: shakeEnabled.value });
  visible.value = false;
}
</script>

<style scoped>
.settings-dialog {
  border-radius: 12px;
}

.settings-dialog :deep(.el-dialog__header) {
  margin-right: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.settings-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.settings-content {
  padding: 8px 0;
}

.settings-section {
  margin-bottom: 24px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  margin: 0 0 16px 0;
  padding-left: 8px;
  border-left: 3px solid #409eff;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-label {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.setting-description {
  font-size: 12px;
  color: #909399;
}

.setting-item :deep(.el-switch) {
  flex-shrink: 0;
}

.setting-item :deep(.el-switch__label) {
  font-size: 12px;
}

.setting-item :deep(.el-switch__label--left) {
  margin-right: 8px;
}

.setting-item :deep(.el-switch__label--right) {
  margin-left: 8px;
}
</style>
