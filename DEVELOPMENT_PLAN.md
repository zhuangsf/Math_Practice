# 小学数学知识点开发计划

## 开发目标

为每个新的知识点单独创建一个页签，实现完整的题目生成、答题、评分、错题分析和个性化辅导计划功能。

## 知识点优先级

### 高优先级（优先开发）
1. ✅ **分数运算** - 分数加减乘除、分数化简、分数与整数混合运算（已完成）
2. ✅ **小数运算** - 小数加减乘除、小数与整数混合运算（已完成）

### 中优先级（第二阶段开发）
3. **百分数** - 百分数与小数/分数互化、百分数应用题
4. **单位换算** - 长度、重量、面积、体积、时间单位换算
5. **几何计算** - 周长、面积、体积计算
6. **倍数与因数** - 找倍数、找因数、最大公因数、最小公倍数

### 低优先级（第三阶段开发）
7. **质数与合数** - 判断质数/合数、质因数分解
8. **比较大小** - 整数、小数、分数比较
9. **估算练习** - 加减法估算、乘除法估算
10. **找规律** - 数字规律、图形规律

## 代码架构规划

### 目录结构

```
src/
├── views/                          # 页面视图
│   ├── Home.vue                    # 主页面（页签容器）
│   ├── ArithmeticPage.vue         # 四则运算页面（已存在）
│   ├── EquationPage.vue           # 一元一次方程页面（已存在）
│   ├── FractionPage.vue           # 分数运算页面（✅ 已完成，含辅导计划）
│   ├── DecimalPage.vue            # 小数运算页面（✅ 已完成，含辅导计划）
│   ├── PercentagePage.vue         # 百分数页面（✅ 已完成，含辅导计划）
│   ├── UnitConversionPage.vue    # 单位换算页面（✅ 已完成，含辅导计划）
│   ├── GeometryPage.vue           # 几何计算页面（✅ 已完成，含辅导计划）
│   ├── FactorMultiplePage.vue     # 倍数因数页面（✅ 已完成，含辅导计划）
│   ├── PrimeCompositePage.vue     # 质数合数页面（新增）
│   ├── ComparisonPage.vue         # 比较大小页面（新增）
│   ├── EstimationPage.vue         # 估算练习页面（新增）
│   └── PatternPage.vue            # 找规律页面（新增）
│
├── components/                      # 组件
│   ├── ControlPanel.vue            # 四则运算控制面板（已存在）
│   ├── FractionControlPanel.vue   # 分数运算控制面板（✅ 已完成）
│   ├── DecimalControlPanel.vue    # 小数运算控制面板（✅ 已完成）
│   ├── PercentageControlPanel.vue # 百分数控制面板（✅ 已完成）
│   ├── UnitConversionControlPanel.vue  # 单位换算控制面板（✅ 已完成）
│   ├── GeometryControlPanel.vue   # 几何计算控制面板（✅ 已完成）
│   ├── FactorMultipleControlPanel.vue  # 倍数因数控制面板（✅ 已完成）
│   ├── PrimeCompositeControlPanel.vue  # 质数合数控制面板（新增）
│   ├── ComparisonControlPanel.vue # 比较大小控制面板（新增）
│   ├── EstimationControlPanel.vue # 估算练习控制面板（新增）
│   ├── PatternControlPanel.vue    # 找规律控制面板（新增）
│   ├── QuestionDisplay.vue         # 四则运算题目显示（已存在）
│   ├── FractionDisplay.vue         # 分数题目显示（✅ 已完成）
│   ├── DecimalDisplay.vue          # 小数题目显示（✅ 已完成）
│   ├── PercentageDisplay.vue       # 百分数题目显示（✅ 已完成）
│   ├── UnitConversionDisplay.vue   # 单位换算题目显示（✅ 已完成）
│   ├── GeometryDisplay.vue         # 几何计算题目显示（✅ 已完成）
│   ├── FactorMultipleDisplay.vue   # 倍数因数题目显示（✅ 已完成）
│   ├── FractionWrongQuestionAnalysis.vue  # 分数错题分析组件（✅ 已完成）
│   ├── DecimalWrongQuestionAnalysis.vue    # 小数错题分析组件（✅ 已完成）
│   ├── FractionTutoringPlan.vue    # 分数辅导计划组件（✅ 已完成）
│   ├── DecimalTutoringPlan.vue      # 小数辅导计划组件（✅ 已完成）
│   ├── PercentageWrongQuestionAnalysis.vue # 百分数错题分析组件（✅ 已完成）
│   ├── PercentageTutoringPlan.vue         # 百分数辅导计划组件（✅ 已完成）
│   ├── UnitConversionWrongQuestionAnalysis.vue  # 单位换算错题分析组件（✅ 已完成）
│   ├── UnitConversionTutoringPlan.vue           # 单位换算辅导计划组件（✅ 已完成）
│   ├── GeometryWrongQuestionAnalysis.vue        # 几何计算错题分析组件（✅ 已完成）
│   ├── GeometryTutoringPlan.vue                # 几何计算辅导计划组件（✅ 已完成）
│   ├── FactorMultipleWrongQuestionAnalysis.vue # 倍数因数错题分析组件（✅ 已完成）
│   └── FactorMultipleTutoringPlan.vue          # 倍数因数辅导计划组件（✅ 已完成）
│
├── composables/                     # 组合式函数
│   ├── useQuestionGenerator.ts     # 四则运算生成器（已存在）
│   ├── useFractionGenerator.ts     # 分数运算生成器（✅ 已完成）
│   ├── useDecimalGenerator.ts      # 小数运算生成器（✅ 已完成）
│   ├── usePercentageGenerator.ts   # 百分数生成器（✅ 已完成）
│   ├── useUnitConversionGenerator.ts  # 单位换算生成器（✅ 已完成）
│   ├── useGeometryGenerator.ts     # 几何计算生成器（✅ 已完成）
│   ├── useFactorMultipleGenerator.ts   # 倍数因数生成器（✅ 已完成）
│   ├── usePrimeCompositeGenerator.ts   # 质数合数生成器（新增）
│   ├── useComparisonGenerator.ts   # 比较大小生成器（新增）
│   ├── useEstimationGenerator.ts   # 估算练习生成器（新增）
│   ├── usePatternGenerator.ts      # 找规律生成器（新增）
│   ├── useAnswering.ts             # 答题功能（已存在，可复用）
│   ├── useScoring.ts               # 评分功能（已存在，可复用）
│   ├── useWrongQuestionAnalysis.ts # 错题分析（已存在，需扩展各知识点函数）
│   ├── useTutoringPlan.ts          # 辅导计划生成（已存在，需扩展各知识点函数）
│   └── useExport.ts                # 导出功能（已存在，可复用）
│
├── utils/                           # 工具函数
│   ├── mathUtils.ts                # 数学运算工具（已存在）
│   ├── fractionUtils.ts            # 分数运算工具（✅ 已完成）
│   ├── decimalUtils.ts             # 小数运算工具（✅ 已完成）
│   ├── percentageUtils.ts          # 百分数工具（✅ 已完成）
│   ├── unitConversionUtils.ts      # 单位换算工具（✅ 已完成）
│   ├── geometryUtils.ts            # 几何计算工具（✅ 已完成）
│   ├── factorMultipleUtils.ts      # 倍数因数工具（✅ 已完成）
│   ├── primeCompositeUtils.ts     # 质数合数工具（新增）
│   ├── comparisonUtils.ts          # 比较大小工具（新增）
│   ├── estimationUtils.ts          # 估算工具（新增）
│   └── patternUtils.ts             # 找规律工具（新增）
│
└── types/                           # 类型定义
    └── index.ts                     # 全局类型定义（扩展）
```

## 开发步骤

### 第一阶段：高优先级知识点（分数运算、小数运算）

#### 1. 分数运算开发 ✅ 已完成
- [x] 创建 `FractionPage.vue` 页面组件
- [x] 创建 `FractionControlPanel.vue` 控制面板组件
- [x] 创建 `FractionDisplay.vue` 题目显示组件
- [x] 创建 `useFractionGenerator.ts` 生成器
- [x] 创建 `fractionUtils.ts` 工具函数
- [x] 扩展 `types/index.ts` 添加分数相关类型
- [x] 编写单元测试 `fractionUtils.test.ts`
- [x] 编写单元测试 `useFractionGenerator.test.ts`
- [x] 在 `Home.vue` 中添加分数运算页签
- [x] 集成答题、评分、错题分析功能

#### 2. 小数运算开发 ✅ 已完成
- [x] 创建 `DecimalPage.vue` 页面组件
- [x] 创建 `DecimalControlPanel.vue` 控制面板组件
- [x] 创建 `DecimalDisplay.vue` 题目显示组件
- [x] 创建 `useDecimalGenerator.ts` 生成器
- [x] 创建 `decimalUtils.ts` 工具函数
- [x] 扩展 `types/index.ts` 添加小数相关类型
- [x] 编写单元测试 `decimalUtils.test.ts`
- [x] 编写单元测试 `useDecimalGenerator.test.ts`
- [x] 在 `Home.vue` 中添加小数运算页签
- [x] 集成答题、评分、错题分析功能

### 第二阶段：中优先级知识点

#### 3. 百分数开发
- [x] 创建 `PercentagePage.vue` 页面组件
- [x] 创建 `PercentageControlPanel.vue` 控制面板组件
- [x] 创建 `PercentageDisplay.vue` 题目显示组件
- [x] 创建 `usePercentageGenerator.ts` 生成器
- [x] 创建 `percentageUtils.ts` 工具函数
- [x] 扩展 `types/index.ts` 添加百分数相关类型
- [x] 在 `Home.vue` 中添加百分数页签
- [x] 集成答题、评分功能
- [x] **个性化辅导计划功能** ✅ 已完成
  - [x] 在 `types/index.ts` 中定义 `PercentageWrongQuestion`、`PercentageWrongQuestionStats`、`PercentageTutoringPlan` 类型
  - [x] 在 `useWrongQuestionAnalysis.ts` 中实现 `extractPercentageWrongQuestions` 和 `calculatePercentageWrongQuestionStats` 函数
  - [x] 在 `useTutoringPlan.ts` 中实现 `generatePercentageTutoringPlan` 函数
  - [x] 创建 `PercentageWrongQuestionAnalysis.vue` 错题分析组件
  - [x] 创建 `PercentageTutoringPlan.vue` 辅导计划组件
  - [x] 在 `PercentagePage.vue` 中集成错题分析和辅导计划功能

#### 4. 单位换算开发
- [x] 创建 `UnitConversionPage.vue` 页面组件
- [x] 创建 `UnitConversionControlPanel.vue` 控制面板组件
- [x] 创建 `UnitConversionDisplay.vue` 题目显示组件
- [x] 创建 `useUnitConversionGenerator.ts` 生成器
- [x] 创建 `unitConversionUtils.ts` 工具函数
- [x] 扩展 `types/index.ts` 添加单位换算相关类型
- [x] 在 `Home.vue` 中添加单位换算页签
- [x] 集成答题、评分功能
- [x] **个性化辅导计划功能** ✅ 已完成
  - [x] 在 `types/index.ts` 中定义 `UnitConversionWrongQuestion`、`UnitConversionWrongQuestionStats`、`UnitConversionTutoringPlan` 类型
  - [x] 在 `useWrongQuestionAnalysis.ts` 中实现 `extractUnitConversionWrongQuestions` 和 `calculateUnitConversionWrongQuestionStats` 函数
  - [x] 在 `useTutoringPlan.ts` 中实现 `generateUnitConversionTutoringPlan` 函数
  - [x] 创建 `UnitConversionWrongQuestionAnalysis.vue` 错题分析组件
  - [x] 创建 `UnitConversionTutoringPlan.vue` 辅导计划组件
  - [x] 在 `UnitConversionPage.vue` 中集成错题分析和辅导计划功能

#### 5. 几何计算开发
- [x] 创建 `GeometryPage.vue` 页面组件
- [x] 创建 `GeometryControlPanel.vue` 控制面板组件
- [x] 创建 `GeometryDisplay.vue` 题目显示组件
- [x] 创建 `useGeometryGenerator.ts` 生成器
- [x] 创建 `geometryUtils.ts` 工具函数
- [x] 扩展 `types/index.ts` 添加几何计算相关类型
- [x] 在 `Home.vue` 中添加几何计算页签
- [x] 集成答题、评分功能
- [x] **个性化辅导计划功能** ✅ 已完成
  - [x] 在 `types/index.ts` 中定义 `GeometryWrongQuestion`、`GeometryWrongQuestionStats`、`GeometryTutoringPlan` 类型
  - [x] 在 `useWrongQuestionAnalysis.ts` 中实现 `extractGeometryWrongQuestions` 和 `calculateGeometryWrongQuestionStats` 函数
  - [x] 在 `useTutoringPlan.ts` 中实现 `generateGeometryTutoringPlan` 函数
  - [x] 创建 `GeometryWrongQuestionAnalysis.vue` 错题分析组件
  - [x] 创建 `GeometryTutoringPlan.vue` 辅导计划组件
  - [x] 在 `GeometryPage.vue` 中集成错题分析和辅导计划功能

#### 6. 倍数与因数开发
- [x] 创建 `FactorMultiplePage.vue` 页面组件
- [x] 创建 `FactorMultipleControlPanel.vue` 控制面板组件
- [x] 创建 `FactorMultipleDisplay.vue` 题目显示组件
- [x] 创建 `useFactorMultipleGenerator.ts` 生成器
- [x] 创建 `factorMultipleUtils.ts` 工具函数
- [x] 扩展 `types/index.ts` 添加倍数与因数相关类型
- [x] 在 `Home.vue` 中添加倍数与因数页签
- [x] 集成答题、评分功能
- [x] **个性化辅导计划功能** ✅ 已完成
  - [x] 在 `types/index.ts` 中定义 `FactorMultipleWrongQuestion`、`FactorMultipleWrongQuestionStats`、`FactorMultipleTutoringPlan` 类型
  - [x] 在 `useWrongQuestionAnalysis.ts` 中实现 `extractFactorMultipleWrongQuestions` 和 `calculateFactorMultipleWrongQuestionStats` 函数
  - [x] 在 `useTutoringPlan.ts` 中实现 `generateFactorMultipleTutoringPlan` 函数
  - [x] 创建 `FactorMultipleWrongQuestionAnalysis.vue` 错题分析组件
  - [x] 创建 `FactorMultipleTutoringPlan.vue` 辅导计划组件
  - [x] 在 `FactorMultiplePage.vue` 中集成错题分析和辅导计划功能

### 第三阶段：低优先级知识点

#### 7-10. 其他知识点开发
- [ ] 按照相同模式开发剩余知识点

## 通用功能复用

以下功能可以在所有知识点中复用：
- `useAnswering.ts` - 答题功能
- `useScoring.ts` - 评分功能
- `useTutoringPlan.ts` - 辅导计划生成
- `useWrongQuestionAnalysis.ts` - 错题分析
- `useExport.ts` - 导出功能（需要适配不同题目类型）

## 个性化辅导计划功能开发

每个知识点都需要实现个性化辅导计划功能，包括：

1. **类型定义**（`types/index.ts`）
   - 错题记录类型：`{知识点}WrongQuestion`
   - 错题统计类型：`{知识点}WrongQuestionStats`
   - 辅导计划类型：`{知识点}TutoringPlan`

2. **错题分析函数**（`composables/useWrongQuestionAnalysis.ts`）
   - `extract{知识点}WrongQuestions` - 提取错题
   - `calculate{知识点}WrongQuestionStats` - 计算错题统计

3. **辅导计划生成函数**（`composables/useTutoringPlan.ts`）
   - `generate{知识点}TutoringPlan` - 生成辅导计划

4. **组件开发**
   - `{知识点}WrongQuestionAnalysis.vue` - 错题分析组件
   - `{知识点}TutoringPlan.vue` - 辅导计划组件

5. **页面集成**（`views/{知识点}Page.vue`）
   - 导入错题分析和辅导计划相关函数和组件
   - 添加错题分析和辅导计划的状态管理
   - 在提交答案后生成错题分析和辅导计划
   - 实现应用推荐配置功能

**详细实现步骤请参考 `TUTORING_PLAN_DESIGN.md` 文档。**

**已完成的示例参考：**
- 分数运算：`FractionPage.vue`、`FractionWrongQuestionAnalysis.vue`、`FractionTutoringPlan.vue`
- 小数运算：`DecimalPage.vue`、`DecimalWrongQuestionAnalysis.vue`、`DecimalTutoringPlan.vue`

## 类型定义扩展

需要在 `types/index.ts` 中添加的类型：

```typescript
// 分数相关类型
export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface FractionQuestion {
  id: string;
  expression: string;
  answer: Fraction;
  // ... 其他字段
}

// 小数相关类型
export interface DecimalQuestion {
  id: string;
  expression: string;
  answer: number;
  decimalPlaces: number;
  // ... 其他字段
}

// 百分数相关类型
export interface PercentageQuestion {
  id: string;
  expression: string;
  answer: number | string; // 可能是数字或百分数字符串
  questionType: 'conversion' | 'percentage' | 'part' | 'total';
  // ... 其他字段
}

// ... 其他知识点类型
```

## 测试策略

每个知识点都需要：
1. **工具函数单元测试** - 测试核心数学计算逻辑
2. **生成器单元测试** - 测试题目生成逻辑
3. **集成测试** - 测试完整流程（生成、答题、评分）

## 开发规范

1. 代码注释使用英文，格式：`// modify by jx + 具体修改内容英文描述`
2. 每个知识点独立开发，互不干扰
3. 遵循现有代码风格和架构模式
4. 确保单元测试覆盖率 > 80%
5. 所有功能开发完成后执行单元测试，确保结果正确

## 时间规划

- **第一阶段**（高优先级）：预计 2-3 天
- **第二阶段**（中优先级）：预计 3-4 天
- **第三阶段**（低优先级）：预计 2-3 天

**总计**：预计 7-10 天完成所有知识点开发
