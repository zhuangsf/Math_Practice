<template>
  <div class="home">
    <!-- Header -->
    <div class="header">
      <h1 class="title">小学数学题目生成工具</h1>
      <p class="subtitle">快速生成练习题目，支持四则运算和一元一次方程</p>
    </div>

    <!-- Tabs -->
    <div class="tabs-section">
      <el-tabs v-model="activeTab" type="card" class="main-tabs">
        <el-tab-pane label="四则运算" name="arithmetic">
          <ArithmeticPage />
        </el-tab-pane>
        <el-tab-pane label="一元一次方程" name="equation">
          <EquationPage />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement home page with tabs for arithmetic and equation pages

import { ref } from 'vue';
import ArithmeticPage from '@/views/ArithmeticPage.vue';
import EquationPage from '@/views/EquationPage.vue';

// Active tab state
const activeTab = ref('arithmetic');
</script>

<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 12px 0;
}

.subtitle {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

.tabs-section {
  margin-bottom: 24px;
}

.main-tabs {
  background: transparent;
}

/* Responsive design */
@media (max-width: 768px) {
  .home {
    padding: 12px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
