# 个性化辅导计划功能设计规划

## 1. 功能概述

个性化辅导计划是基于学生答题结果，自动分析错题统计，生成个性化学习建议和推荐练习配置的功能模块。该功能包含：

- **学习建议**：根据错题分析，提供针对性的学习建议
- **推荐练习配置**：根据薄弱环节，推荐适合的练习配置
- **一键应用**：支持一键应用推荐配置，快速开始针对性练习

## 2. 功能流程

```
答题提交 → 错题分析 → 统计计算 → 辅导计划生成 → 显示建议和推荐配置 → 应用配置
```

## 3. 实现步骤清单

### 3.1 类型定义（types/index.ts）

**必须完成的步骤：**

- [ ] 定义错题记录类型：`{知识点}WrongQuestion`
  - 包含：questionId, question, studentAnswer, correctAnswer, operationType, 其他知识点特有字段
- [ ] 定义错题统计类型：`{知识点}WrongQuestionStats`
  - 包含：byOperationType（按运算类型统计），其他知识点特有的统计维度，total
- [ ] 定义辅导计划类型：`{知识点}TutoringPlan`
  - 包含：weakAreas（薄弱环节），suggestions（学习建议），recommendedConfig（推荐配置）

**示例：**
```typescript
// 分数运算示例
export interface FractionWrongQuestion {
  questionId: string;
  question: FractionQuestion;
  studentAnswer: string;
  correctAnswer: Fraction;
  operationType: OperationType;
  questionType: 'same-denominator' | 'different-denominator' | 'mixed' | 'simplify';
  timestamp: Date;
  timeSpent?: number;
}

export interface FractionWrongQuestionStats {
  byOperationType: {
    add: number;
    subtract: number;
    multiply: number;
    divide: number;
  };
  byQuestionType: {
    'same-denominator': number;
    'different-denominator': number;
    'mixed': number;
    'simplify': number;
  };
  total: number;
}

export interface FractionTutoringPlan {
  weakAreas: {
    operationTypes: OperationType[];
    questionTypes: ('same-denominator' | 'different-denominator' | 'mixed' | 'simplify')[];
  };
  suggestions: string[];
  recommendedConfig?: Partial<FractionConfig>;
}
```

### 3.2 错题分析函数（composables/useWrongQuestionAnalysis.ts）

**必须完成的步骤：**

- [ ] 创建提取错题函数：`extract{知识点}WrongQuestions`
  - 参数：questions数组，answers Map
  - 返回：错题数组
- [ ] 创建统计计算函数：`calculate{知识点}WrongQuestionStats`
  - 参数：错题数组
  - 返回：错题统计对象

**示例：**
```typescript
export function extractFractionWrongQuestions(
  questions: FractionQuestion[],
  answers: Map<string, { answer: string | null; status: string }>
): FractionWrongQuestion[] {
  // 实现逻辑
}

export function calculateFractionWrongQuestionStats(
  wrongQuestions: FractionWrongQuestion[]
): FractionWrongQuestionStats {
  // 实现逻辑
}
```

### 3.3 辅导计划生成函数（composables/useTutoringPlan.ts）

**必须完成的步骤：**

- [ ] 创建辅导计划生成函数：`generate{知识点}TutoringPlan`
  - 参数：错题统计对象，总题目数
  - 返回：辅导计划对象
- [ ] 实现薄弱环节分析逻辑
  - 计算错误率
  - 识别薄弱运算类型（错误率 > 30%）
  - 识别薄弱知识点特有维度（如分数运算的题目类型）
- [ ] 生成学习建议
  - 根据薄弱环节生成针对性建议
  - 根据整体表现生成通用建议
- [ ] 生成推荐配置
  - 根据薄弱环节推荐练习配置
  - 包含运算类型、知识点特有配置项、题目数量

**示例：**
```typescript
export function generateFractionTutoringPlan(
  stats: FractionWrongQuestionStats,
  totalQuestions: number
): FractionTutoringPlan {
  const weakAreas = {
    operationTypes: [] as OperationType[],
    questionTypes: [] as ('same-denominator' | 'different-denominator' | 'mixed' | 'simplify')[]
  };
  const suggestions: string[] = [];
  
  // 计算错误率
  const errorRate = stats.total / totalQuestions;
  const weakThreshold = 0.3;
  const severeThreshold = 0.5;
  
  // 分析薄弱环节
  // 生成建议
  // 生成推荐配置
  
  return { weakAreas, suggestions, recommendedConfig };
}
```

### 3.4 错题分析组件（components/{知识点}WrongQuestionAnalysis.vue）

**必须完成的步骤：**

- [ ] 创建错题分析组件
- [ ] 显示错题总数
- [ ] 按运算类型统计显示
- [ ] 按知识点特有维度统计显示（如果有）
- [ ] 提供查看错题按钮

**组件结构：**
```vue
<template>
  <div v-if="stats && stats.total > 0">
    <!-- 错题总数 -->
    <!-- 按运算类型统计 -->
    <!-- 按知识点特有维度统计 -->
    <!-- 查看错题按钮 -->
  </div>
</template>
```

### 3.5 辅导计划组件（components/{知识点}TutoringPlan.vue）

**必须完成的步骤：**

- [ ] 创建辅导计划组件
- [ ] 显示学习建议列表
- [ ] 显示推荐练习配置
- [ ] 提供应用推荐配置按钮

**组件结构：**
```vue
<template>
  <div v-if="plan">
    <!-- 学习建议 -->
    <div class="suggestions-section">
      <h4>学习建议</h4>
      <ul>
        <li v-for="suggestion in plan.suggestions">
          {{ suggestion }}
        </li>
      </ul>
    </div>
    
    <!-- 推荐配置 -->
    <div v-if="plan.recommendedConfig" class="recommendation-section">
      <h4>推荐练习配置</h4>
      <!-- 显示配置项 -->
      <el-button @click="applyConfig">应用推荐配置</el-button>
    </div>
  </div>
</template>
```

### 3.6 页面集成（views/{知识点}Page.vue）

**必须完成的步骤：**

- [ ] 导入必要的组件和函数
  - 导入 ScoreDisplay 组件
  - 导入错题分析组件
  - 导入辅导计划组件
  - 导入 calculateScore 函数
  - 导入错题分析函数
  - 导入辅导计划生成函数
- [ ] 定义响应式状态
  - score: ScoreResult | null
  - wrongQuestions: {知识点}WrongQuestion[]
  - wrongQuestionStats: {知识点}WrongQuestionStats | null
  - tutoringPlan: {知识点}TutoringPlan | null
  - startTime: Date | null（用于时间统计）
- [ ] 在模板中添加组件
  - ScoreDisplay 组件（在提交后显示）
  - 错题分析组件（在提交后显示）
  - 辅导计划组件（在提交后显示）
- [ ] 实现答题提交逻辑
  - 验证答案
  - 计算时间
  - 计算分数
  - 提取错题
  - 计算统计
  - 生成辅导计划
- [ ] 实现应用推荐配置逻辑
  - handleApplyRecommendedConfig 函数
  - 更新配置并提示重新生成题目
- [ ] 实现重置逻辑
  - 清空所有状态
  - 重置时间

**关键代码片段：**
```typescript
// 提交答案
const handleSubmitAnswers = () => {
  // 验证答案...
  
  // 计算时间
  const elapsedTime = startTime.value 
    ? Math.floor((new Date().getTime() - startTime.value.getTime()) / 1000)
    : 0;
  
  // 计算分数
  score.value = calculateScore(studentAnswersArray, elapsedTime);
  
  // 提取错题
  wrongQuestions.value = extract{知识点}WrongQuestions(questions.value, studentAnswers.value);
  
  // 计算统计
  if (wrongQuestions.value.length > 0) {
    wrongQuestionStats.value = calculate{知识点}WrongQuestionStats(wrongQuestions.value);
    
    // 生成辅导计划
    tutoringPlan.value = generate{知识点}TutoringPlan(
      wrongQuestionStats.value,
      questions.value.length
    );
  }
};

// 应用推荐配置
const handleApplyRecommendedConfig = (recommendedConfig: Partial<{知识点}Config>) => {
  // 更新配置...
  ElMessage.success('已应用推荐配置，请重新生成题目');
};
```

## 4. 检查清单

在完成新知识点的个性化辅导计划功能后，请检查以下项目：

### 4.1 类型定义检查
- [ ] 已定义错题记录类型
- [ ] 已定义错题统计类型
- [ ] 已定义辅导计划类型
- [ ] 所有类型都正确导出

### 4.2 函数实现检查
- [ ] 已实现提取错题函数
- [ ] 已实现统计计算函数
- [ ] 已实现辅导计划生成函数
- [ ] 所有函数都有适当的注释

### 4.3 组件检查
- [ ] 已创建错题分析组件
- [ ] 已创建辅导计划组件
- [ ] 组件样式正确
- [ ] 组件响应式设计

### 4.4 页面集成检查
- [ ] 已导入所有必要的组件和函数
- [ ] 已定义所有必要的响应式状态
- [ ] 已在模板中添加所有组件
- [ ] 已实现答题提交逻辑
- [ ] 已实现应用推荐配置逻辑
- [ ] 已实现重置逻辑
- [ ] 状态清理完整（生成题目、切换模式、重置时）

### 4.5 功能测试检查
- [ ] 答题后能正确显示分数
- [ ] 答题后能正确显示错题分析
- [ ] 答题后能正确显示辅导计划
- [ ] 学习建议内容合理
- [ ] 推荐配置正确
- [ ] 应用推荐配置功能正常
- [ ] 重置功能正常

## 5. 知识点特有维度说明

不同知识点可能有不同的统计维度，需要在错题统计和辅导计划中体现：

### 5.1 四则运算
- 统计维度：运算类型（加减乘除）、运算元数量（二元/三元/四元）
- 推荐配置：运算类型、运算元数量、题目数量

### 5.2 分数运算
- 统计维度：运算类型（加减乘除）、题目类型（同分母/异分母/带分数/分数化简）
- 推荐配置：运算类型、题目类型、题目数量

### 5.3 小数运算
- 统计维度：运算类型（加减乘除）
- 推荐配置：运算类型、题目数量

### 5.4 其他知识点
- 需要根据知识点特点定义统计维度
- 例如：百分数可能按转换类型、应用题类型统计
- 例如：几何计算可能按图形类型、计算类型统计

## 6. 通用建议模板

在生成学习建议时，可以使用以下模板：

### 6.1 薄弱环节建议
- 严重薄弱（错误率 ≥ 50%）：`您在{运算类型/知识点维度}方面错误较多，建议重点加强练习`
- 一般薄弱（错误率 ≥ 30%）：`您在{运算类型/知识点维度}方面需要加强，建议多练习相关题目`

### 6.2 整体表现建议
- 全对：`恭喜！您全部答对了，可以尝试增加难度或题目数量`
- 表现良好（错误率 < 30%）：`您的表现不错，继续保持！可以适当增加题目难度`
- 表现较差（错误率 ≥ 50%）：`建议从基础题目开始练习，逐步提高难度`

## 7. 注意事项

1. **时间统计**：确保在答题模式开始时记录 startTime，在提交时计算 elapsedTime
2. **状态清理**：在生成新题目、切换模式、重置时，要清空所有相关状态
3. **类型安全**：确保所有类型定义正确，避免类型错误
4. **错误处理**：在提取错题和计算统计时，要处理边界情况
5. **用户体验**：建议使用 ElMessage 提示用户操作结果

## 8. 参考实现

可以参考以下已实现的示例：
- 四则运算：`src/views/ArithmeticPage.vue`
- 分数运算：`src/views/FractionPage.vue`
- 小数运算：`src/views/DecimalPage.vue`

## 9. 后续优化方向

1. **历史记录**：保存学生的答题历史和辅导计划历史
2. **进度跟踪**：跟踪学生在薄弱环节的进步情况
3. **智能推荐**：根据历史数据智能推荐练习内容
4. **可视化分析**：使用图表展示错题分布和学习进度
