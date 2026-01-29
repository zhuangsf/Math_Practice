# 小学数学知识点开发计划

## 开发目标

为每个新的知识点单独创建一个页签，实现完整的题目生成、答题、评分、错题分析和个性化辅导计划功能。

## 知识点优先级

### 高优先级（优先开发）
1. ✅ **分数运算** - 分数加减乘除、分数化简、分数与整数混合运算（已完成，含导出功能）
2. ✅ **小数运算** - 小数加减乘除、小数与整数混合运算（已完成，含导出功能）

### 中优先级（第二阶段开发）
3. ✅ **百分数** - 百分数与小数/分数互化、百分数应用题（已完成，含导出功能）
4. ✅ **单位换算** - 长度、重量、面积、体积、时间单位换算（已完成，含导出功能）
5. ✅ **几何计算** - 周长、面积、体积计算（已完成，含导出功能）
6. ✅ **倍数与因数** - 找倍数、找因数、最大公因数、最小公倍数（已完成，含导出功能）

### 低优先级（第三阶段开发）
7. ✅ **质数与合数** - 判断质数/合数、质因数分解（已完成，含导出功能）
8. ✅ **比较大小** - 整数、小数、分数比较（已完成，含导出功能）
9. ✅ **找规律** - 数字规律、图形规律（已完成，含导出功能）

## 导出功能状态

### 导出功能覆盖范围 ✅ 已完成

所有知识点均已实现完整的导出功能，包括：

| 知识点 | 导出TXT | 导出PDF | 打印 |
|--------|---------|---------|------|
| 四则运算 | ✅ | ✅ | ✅ |
| 一元一次方程 | ✅ | ✅ | ✅ |
| 分数运算 | ✅ | ✅ | ✅ |
| 小数运算 | ✅ | ✅ | ✅ |
| 百分数 | ✅ | ✅ | ✅ |
| 单位换算 | ✅ | ✅ | ✅ |
| 几何计算 | ✅ | ✅ | ✅ |
| 倍数与因数 | ✅ | ✅ | ✅ |
| 质数与合数 | ✅ | ✅ | ✅ |
| 比较大小 | ✅ | ✅ | ✅ |
| 找规律 | ✅ | ✅ | ✅ |

### 导出功能实现详情

`useExport.ts` 导出的函数列表：

```typescript
// 四则运算导出函数（原始函数，保持向后兼容）
exportToTxt(questions: Question[], includeAnswers: boolean, title?: string)
exportToPdf(questions: Question[], includeAnswers: boolean, title?: string)
printQuestions(questions: Question[], includeAnswers: boolean, title?: string)

// 一元一次方程导出函数
exportEquationsToTxt(questions: EquationQuestion[], includeAnswers: boolean, title?: string)
exportEquationsToPdf(questions: EquationQuestion[], includeAnswers: boolean, title?: string)
printEquations(questions: EquationQuestion[], includeAnswers: boolean, title?: string)

// 分数运算导出函数
exportFractionsToTxt(questions: FractionQuestion[], includeAnswers: boolean, title?: string)
exportFractionsToPdf(questions: FractionQuestion[], includeAnswers: boolean, title?: string)
printFractions(questions: FractionQuestion[], includeAnswers: boolean, title?: string)

// 小数运算导出函数
exportDecimalsToTxt(questions: DecimalQuestion[], includeAnswers: boolean, title?: string)
exportDecimalsToPdf(questions: DecimalQuestion[], includeAnswers: boolean, title?: string)
printDecimals(questions: DecimalQuestion[], includeAnswers: boolean, title?: string)

// 几何计算导出函数
exportGeometryToTxt(questions: GeometryQuestion[], includeAnswers: boolean, title?: string)
exportGeometryToPdf(questions: GeometryQuestion[], includeAnswers: boolean, title?: string)
printGeometry(questions: GeometryQuestion[], includeAnswers: boolean, title?: string)

// 百分数导出函数
exportPercentageToTxt(questions: PercentageQuestion[], includeAnswers: boolean, title?: string)
exportPercentageToPdf(questions: PercentageQuestion[], includeAnswers: boolean, title?: string)
printPercentage(questions: PercentageQuestion[], includeAnswers: boolean, title?: string)

// 单位换算导出函数
exportUnitConversionToTxt(questions: UnitConversionQuestion[], includeAnswers: boolean, title?: string)
exportUnitConversionToPdf(questions: UnitConversionQuestion[], includeAnswers: boolean, title?: string)
printUnitConversion(questions: UnitConversionQuestion[], includeAnswers: boolean, title?: string)

// 倍数与因数导出函数
exportFactorMultipleToTxt(questions: FactorMultipleQuestion[], includeAnswers: boolean, title?: string)
exportFactorMultipleToPdf(questions: FactorMultipleQuestion[], includeAnswers: boolean, title?: string)
printFactorMultiple(questions: FactorMultipleQuestion[], includeAnswers: boolean, title?: string)

// 比较大小导出函数
exportComparisonToTxt(questions: ComparisonQuestion[], includeAnswers: boolean, title?: string)
exportComparisonToPdf(questions: ComparisonQuestion[], includeAnswers: boolean, title?: string)
printComparison(questions: ComparisonQuestion[], includeAnswers: boolean, title?: string)

// 找规律导出函数
exportPatternToTxt(questions: PatternQuestion[], includeAnswers: boolean, title?: string)
exportPatternToPdf(questions: PatternQuestion[], includeAnswers: boolean, title?: string)
printPattern(questions: PatternQuestion[], includeAnswers: boolean, title?: string)

// 质数与合数导出函数
exportPrimeCompositeToTxt(questions: PrimeCompositeQuestion[], includeAnswers: boolean, title?: string)
exportPrimeCompositeToPdf(questions: PrimeCompositeQuestion[], includeAnswers: boolean, title?: string)
printPrimeComposite(questions: PrimeCompositeQuestion[], includeAnswers: boolean, title?: string)
```

### 导出功能特性

1. **TXT导出** - 生成格式化的文本文件，支持4列布局显示
2. **PDF导出** - 使用jsPDF生成专业的PDF文档
3. **打印功能** - 打开新窗口并自动触发打印对话框
4. **答案控制** - 支持是否包含答案的导出选项
5. **中文标题** - 自动生成带中文标题的文件名
6. **时间戳** - 文件名包含生成时间戳，避免覆盖

## 代码架构规划

### 目录结构

```
src/
├── views/                          # 页面视图
│   ├── Home.vue                    # 主页面（页签容器）
│   ├── ArithmeticPage.vue         # 四则运算页面（✅ 已完成，含导出功能）
│   ├── EquationPage.vue           # 一元一次方程页面（✅ 已完成，含导出功能）
│   ├── FractionPage.vue           # 分数运算页面（✅ 已完成，含导出功能）
│   ├── DecimalPage.vue            # 小数运算页面（✅ 已完成，含导出功能）
│   ├── PercentagePage.vue         # 百分数页面（✅ 已完成，含导出功能）
│   ├── UnitConversionPage.vue     # 单位换算页面（✅ 已完成，含导出功能）
│   ├── GeometryPage.vue           # 几何计算页面（✅ 已完成，含导出功能）
│   ├── FactorMultiplePage.vue     # 倍数因数页面（✅ 已完成，含导出功能）
│   ├── PrimeCompositePage.vue     # 质数合数页面（✅ 已完成，含导出功能）
│   ├── ComparisonPage.vue         # 比较大小页面（✅ 已完成，含导出功能）
│   └── PatternPage.vue            # 找规律页面（✅ 已完成，含导出功能）
│
├── components/                      # 组件
│   ├── ControlPanel.vue            # 四则运算控制面板（已存在）
│   ├── FractionControlPanel.vue    # 分数运算控制面板（✅ 已完成）
│   ├── DecimalControlPanel.vue     # 小数运算控制面板（✅ 已完成）
│   ├── PercentageControlPanel.vue  # 百分数控制面板（✅ 已完成）
│   ├── UnitConversionControlPanel.vue  # 单位换算控制面板（✅ 已完成）
│   ├── GeometryControlPanel.vue    # 几何计算控制面板（✅ 已完成）
│   ├── FactorMultipleControlPanel.vue  # 倍数因数控制面板（✅ 已完成）
│   ├── PrimeCompositeControlPanel.vue  # 质数合数控制面板（✅ 已完成）
│   ├── ComparisonControlPanel.vue  # 比较大小控制面板（✅ 已完成）
│   ├── PatternControlPanel.vue     # 找规律控制面板（✅ 已完成）
│   ├── QuestionDisplay.vue         # 四则运算题目显示（已存在）
│   ├── FractionDisplay.vue         # 分数题目显示（✅ 已完成）
│   ├── DecimalDisplay.vue          # 小数题目显示（✅ 已完成）
│   ├── PercentageDisplay.vue       # 百分数题目显示（✅ 已完成）
│   ├── UnitConversionDisplay.vue   # 单位换算题目显示（✅ 已完成）
│   ├── GeometryDisplay.vue         # 几何计算题目显示（✅ 已完成）
│   ├── FactorMultipleDisplay.vue   # 倍数因数题目显示（✅ 已完成）
│   ├── PrimeCompositeDisplay.vue   # 质数合数题目显示（✅ 已完成）
│   ├── ComparisonDisplay.vue       # 比较大小题目显示（✅ 已完成）
│   ├── PatternDisplay.vue          # 找规律题目显示（✅ 已完成）
│   ├── FractionWrongQuestionAnalysis.vue  # 分数错题分析组件（✅ 已完成）
│   ├── DecimalWrongQuestionAnalysis.vue    # 小数错题分析组件（✅ 已完成）
│   ├── FractionTutoringPlan.vue    # 分数辅导计划组件（✅ 已完成）
│   ├── DecimalTutoringPlan.vue     # 小数辅导计划组件（✅ 已完成）
│   ├── PercentageWrongQuestionAnalysis.vue # 百分数错题分析组件（✅ 已完成）
│   ├── PercentageTutoringPlan.vue         # 百分数辅导计划组件（✅ 已完成）
│   ├── UnitConversionWrongQuestionAnalysis.vue  # 单位换算错题分析组件（✅ 已完成）
│   ├── UnitConversionTutoringPlan.vue           # 单位换算辅导计划组件（✅ 已完成）
│   ├── GeometryWrongQuestionAnalysis.vue        # 几何计算错题分析组件（✅ 已完成）
│   ├── GeometryTutoringPlan.vue                # 几何计算辅导计划组件（✅ 已完成）
│   ├── FactorMultipleWrongQuestionAnalysis.vue # 倍数因数错题分析组件（✅ 已完成）
│   ├── FactorMultipleTutoringPlan.vue          # 倍数因数辅导计划组件（✅ 已完成）
│   ├── PrimeCompositeWrongQuestionAnalysis.vue # 质数合数错题分析组件（✅ 已完成）
│   ├── PrimeCompositeTutoringPlan.vue          # 质数合数辅导计划组件（✅ 已完成）
│   ├── ComparisonWrongQuestionAnalysis.vue     # 比较大小错题分析组件（✅ 已完成）
│   ├── ComparisonTutoringPlan.vue              # 比较大小辅导计划组件（✅ 已完成）
│   ├── PatternWrongQuestionAnalysis.vue        # 找规律错题分析组件（✅ 已完成）
│   └── PatternTutoringPlan.vue                 # 找规律辅导计划组件（✅ 已完成）
│
├── composables/                     # 组合式函数
│   ├── useQuestionGenerator.ts      # 四则运算生成器（已存在）
│   ├── useFractionGenerator.ts      # 分数运算生成器（✅ 已完成）
│   ├── useDecimalGenerator.ts       # 小数运算生成器（✅ 已完成）
│   ├── usePercentageGenerator.ts    # 百分数生成器（✅ 已完成）
│   ├── useUnitConversionGenerator.ts # 单位换算生成器（✅ 已完成）
│   ├── useGeometryGenerator.ts      # 几何计算生成器（✅ 已完成）
│   ├── useFactorMultipleGenerator.ts # 倍数因数生成器（✅ 已完成）
│   ├── usePrimeCompositeGenerator.ts # 质数合数生成器（✅ 已完成）
│   ├── useComparisonGenerator.ts    # 比较大小生成器（✅ 已完成）
│   ├── usePatternGenerator.ts       # 找规律生成器（✅ 已完成）
│   ├── useAnswering.ts              # 答题功能（已存在，可复用）
│   ├── useScoring.ts                # 评分功能（已存在，可复用）
│   ├── useWrongQuestionAnalysis.ts  # 错题分析（✅ 已扩展所有知识点）
│   ├── useTutoringPlan.ts           # 辅导计划生成（✅ 已扩展所有知识点）
│   └── useExport.ts                 # 导出功能（✅ 已支持所有题型）
│
├── utils/                           # 工具函数
│   ├── mathUtils.ts                 # 数学运算工具（已存在）
│   ├── fractionUtils.ts             # 分数运算工具（✅ 已完成）
│   ├── decimalUtils.ts              # 小数运算工具（✅ 已完成）
│   ├── percentageUtils.ts           # 百分数工具（✅ 已完成）
│   ├── unitConversionUtils.ts       # 单位换算工具（✅ 已完成）
│   ├── geometryUtils.ts             # 几何计算工具（✅ 已完成）
│   ├── factorMultipleUtils.ts       # 倍数因数工具（✅ 已完成）
│   ├── primeCompositeUtils.ts       # 质数合数工具（✅ 已完成）
│   ├── comparisonUtils.ts           # 比较大小工具（✅ 已完成）
│   └── patternUtils.ts              # 找规律工具（✅ 已完成）
│
└── types/                           # 类型定义
    └── index.ts                     # 全局类型定义（✅ 已扩展所有知识点）
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
- [x] **导出功能** ✅ 已完成
  - [x] 实现 `exportFractionsToTxt` 函数
  - [x] 实现 `exportFractionsToPdf` 函数
  - [x] 实现 `printFractions` 函数

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
- [x] **导出功能** ✅ 已完成
  - [x] 实现 `exportDecimalsToTxt` 函数
  - [x] 实现 `exportDecimalsToPdf` 函数
  - [x] 实现 `printDecimals` 函数

### 第二阶段：中优先级知识点

#### 3. 百分数开发 ✅ 已完成
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
- [x] **导出功能** ✅ 已完成
  - [x] 实现 `exportPercentageToTxt` 函数
  - [x] 实现 `exportPercentageToPdf` 函数
  - [x] 实现 `printPercentage` 函数

#### 4. 单位换算开发 ✅ 已完成
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
- [x] **导出功能** ✅ 已完成
  - [x] 实现 `exportUnitConversionToTxt` 函数
  - [x] 实现 `exportUnitConversionToPdf` 函数
  - [x] 实现 `printUnitConversion` 函数

#### 5. 几何计算开发 ✅ 已完成
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
- [x] **导出功能** ✅ 已完成
  - [x] 实现 `exportGeometryToTxt` 函数
  - [x] 实现 `exportGeometryToPdf` 函数
  - [x] 实现 `printGeometry` 函数

#### 6. 倍数与因数开发 ✅ 已完成
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
- [x] **导出功能** ✅ 已完成
  - [x] 实现 `exportFactorMultipleToTxt` 函数
  - [x] 实现 `exportFactorMultipleToPdf` 函数
  - [x] 实现 `printFactorMultiple` 函数

### 第三阶段：低优先级知识点

#### 7. 质数与合数开发 ✅ 已完成
- [x] 创建 `primeCompositeUtils.ts` 工具函数
  - [x] `isPrime(num)` - 判断是否为质数
  - [x] `isComposite(num)` - 判断是否为合数
  - [x] `getPrimeFactors(num)` - 获取质因数分解
  - [x] `getPrimesInRange(min, max)` - 获取范围内的所有质数
- [x] 创建 `usePrimeCompositeGenerator.ts` 生成器
  - [x] 生成质数/合数判断题目
  - [x] 生成质因数分解题目
  - [x] 支持难度级别设置
- [x] 创建 `PrimeCompositeControlPanel.vue` 控制面板组件
  - [x] 题目类型选择（判断质数/合数、质因数分解）
  - [x] 数字范围设置
  - [x] 题目数量设置
- [x] 创建 `PrimeCompositeDisplay.vue` 题目显示组件
  - [x] 显示待判断的数字
  - [x] 提供质数/合数选择按钮
  - [x] 质因数分解输入框
- [x] 创建 `PrimeCompositePage.vue` 页面组件
  - [x] 集成控制面板和题目显示
  - [x] 集成答题和评分功能
  - [x] 在 `Home.vue` 中添加质数合数页签
- [x] 扩展 `types/index.ts` 添加质数合数相关类型
- [x] **个性化辅导计划功能** ✅ 已完成
  - [x] 在 `types/index.ts` 中定义 `PrimeCompositeWrongQuestion`、`PrimeCompositeWrongQuestionStats`、`PrimeCompositeTutoringPlan` 类型
  - [x] 在 `useWrongQuestionAnalysis.ts` 中实现 `extractPrimeCompositeWrongQuestions` 和 `calculatePrimeCompositeWrongQuestionStats` 函数
  - [x] 在 `useTutoringPlan.ts` 中实现 `generatePrimeCompositeTutoringPlan` 函数
  - [x] 创建 `PrimeCompositeWrongQuestionAnalysis.vue` 错题分析组件
  - [x] 创建 `PrimeCompositeTutoringPlan.vue` 辅导计划组件
  - [x] 在 `PrimeCompositePage.vue` 中集成错题分析和辅导计划功能
- [x] **导出功能** ✅ 已完成
  - [x] 实现 `exportPrimeCompositeToTxt` 函数
  - [x] 实现 `exportPrimeCompositeToPdf` 函数
  - [x] 实现 `printPrimeComposite` 函数
- [x] 编写单元测试 `primeCompositeUtils.test.ts`
- [x] 编写单元测试 `usePrimeCompositeGenerator.test.ts`

#### 8. 比较大小开发 ✅ 已完成
- [x] 创建 `comparisonUtils.ts` 工具函数
  - [x] `compareIntegers(a, b)` - 比较整数大小
  - [x] `compareDecimals(a, b)` - 比较小数大小
  - [x] `compareFractions(a, b)` - 比较分数大小
  - [x] `compareMixed(a, b)` - 比较混合数大小
- [x] 创建 `useComparisonGenerator.ts` 生成器
  - [x] 生成整数比较题目
  - [x] 生成小数比较题目
  - [x] 生成分数比较题目
  - [x] 支持难度级别设置
- [x] 创建 `ComparisonControlPanel.vue` 控制面板组件
  - [x] 数字类型选择（整数、小数、分数）
  - [x] 数字范围设置
  - [x] 题目数量设置
- [x] 创建 `ComparisonDisplay.vue` 题目显示组件
  - [x] 显示两个需要比较的数字
  - [x] 提供比较符号选择（<、>、=）
- [x] 创建 `ComparisonPage.vue` 页面组件
  - [x] 集成控制面板和题目显示
  - [x] 集成答题和评分功能
  - [x] 在 `Home.vue` 中添加比较大小页签
- [x] 扩展 `types/index.ts` 添加比较大小相关类型
- [x] **个性化辅导计划功能** ✅ 已完成
  - [x] 在 `types/index.ts` 中定义 `ComparisonWrongQuestion`、`ComparisonWrongQuestionStats`、`ComparisonTutoringPlan` 类型
  - [x] 在 `useWrongQuestionAnalysis.ts` 中实现 `extractComparisonWrongQuestions` 和 `calculateComparisonWrongQuestionStats` 函数
  - [x] 在 `useTutoringPlan.ts` 中实现 `generateComparisonTutoringPlan` 函数
  - [x] 创建 `ComparisonWrongQuestionAnalysis.vue` 错题分析组件
  - [x] 创建 `ComparisonTutoringPlan.vue` 辅导计划组件
  - [x] 在 `ComparisonPage.vue` 中集成错题分析和辅导计划功能
- [x] **导出功能** ✅ 已完成
  - [x] 实现 `exportComparisonToTxt` 函数
  - [x] 实现 `exportComparisonToPdf` 函数
  - [x] 实现 `printComparison` 函数
- [x] 编写单元测试 `comparisonUtils.test.ts`
- [x] 编写单元测试 `useComparisonGenerator.test.ts`

#### 9. 找规律开发 ✅ 已完成
- [x] 创建 `patternUtils.ts` 工具函数
  - [x] `generateArithmeticSequence(start, diff, count)` - 生成等差数列
  - [x] `generateGeometricSequence(start, ratio, count)` - 生成等比数列
  - [x] `generateFibonacciSequence(count)` - 生成斐波那契数列
  - [x] `generateSquareSequence(count)` - 生成平方数列
- [x] 创建 `usePatternGenerator.ts` 生成器
  - [x] 生成数字规律填空题目
  - [x] 生成图形规律题目（可选）
  - [x] 支持难度级别设置
- [x] 创建 `PatternControlPanel.vue` 控制面板组件
  - [x] 规律类型选择（等差、等比、斐波那契、平方等）
  - [x] 数字范围设置
  - [x] 题目数量设置
- [x] 创建 `PatternDisplay.vue` 题目显示组件
  - [x] 显示数列的一部分
  - [x] 显示空缺位置
  - [x] 提供答案输入框
- [x] 创建 `PatternPage.vue` 页面组件
  - [x] 集成控制面板和题目显示
  - [x] 集成答题和评分功能
  - [x] 在 `Home.vue` 中添加找规律页签
- [x] 扩展 `types/index.ts` 添加找规律相关类型
- [x] **个性化辅导计划功能** ✅ 已完成
  - [x] 在 `types/index.ts` 中定义 `PatternWrongQuestion`、`PatternWrongQuestionStats`、`PatternTutoringPlan` 类型
  - [x] 在 `useWrongQuestionAnalysis.ts` 中实现 `extractPatternWrongQuestions` 和 `calculatePatternWrongQuestionStats` 函数
  - [x] 在 `useTutoringPlan.ts` 中实现 `generatePatternTutoringPlan` 函数
  - [x] 创建 `PatternWrongQuestionAnalysis.vue` 错题分析组件
  - [x] 创建 `PatternTutoringPlan.vue` 辅导计划组件
  - [x] 在 `PatternPage.vue` 中集成错题分析和辅导计划功能
- [x] **导出功能** ✅ 已完成
  - [x] 实现 `exportPatternToTxt` 函数
  - [x] 实现 `exportPatternToPdf` 函数
  - [x] 实现 `printPattern` 函数
- [x] 编写单元测试 `patternUtils.test.ts`
- [x] 编写单元测试 `usePatternGenerator.test.ts`

## 通用功能复用

以下功能可以在所有知识点中复用：
- `useAnswering.ts` - 答题功能
- `useScoring.ts` - 评分功能
- `useTutoringPlan.ts` - 辅导计划生成
- `useWrongQuestionAnalysis.ts` - 错题分析
- `useExport.ts` - 导出功能（✅ 已支持所有11种题型）

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

## 导出功能开发指南

### 实现步骤

为新知识点添加导出功能需要以下步骤：

1. **在 `useExport.ts` 中添加工具函数**
   - `unify{知识点}Question` - 将题目转换为统一格式
   - `export{知识点}ToTxt` - 导出TXT文件
   - `export{知识点}ToPdf` - 导出PDF文件
   - `print{知识点}` - 打印功能

2. **在页面组件中集成导出功能**
   ```typescript
   import { useExport } from '@/composables/useExport';

   // 导入导出函数
   const { isExporting, export{知识点}ToTxt, export{知识点}ToPdf, print{知识点} } = useExport();

   // 处理导出TXT
   const handleExportTxt = (includeAnswers: boolean) => {
     if (questions.value.length === 0) {
       ElMessage.warning('请先生成题目');
       return;
     }
     try {
       export{知识点}ToTxt(questions.value, includeAnswers);
     } catch (error) {
       ElMessage.error('导出TXT失败');
     }
   };
   ```

3. **在 `return` 中导出函数**
   ```typescript
   return {
     isExporting,
     export{知识点}ToTxt,
     export{知识点}ToPdf,
     print{知识点},
     // ... 其他导出函数
   };
   ```

### 统一题目格式

所有导出函数使用统一的 `UnifiedQuestion` 格式：

```typescript
interface UnifiedQuestion {
  id: string;              // 题目ID
  expression: string;      // 题目表达式
  answer: string | number; // 答案
  questionNumber: number;  // 题号
}
```

### 文件命名规则

导出文件名格式：`{知识点}_{YYYYMMDD}_{HHMMSS}.{extension}`

例如：`分数运算_20260129_143000.txt`

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
4. **导出功能测试** - 验证TXT、PDF导出和打印功能

## 开发规范

1. 代码注释使用英文，格式：`// modify by jx + 具体修改内容英文描述`
2. 每个知识点独立开发，互不干扰
3. 遵循现有代码风格和架构模式
4. 确保单元测试覆盖率 > 80%
5. 所有功能开发完成后执行单元测试，确保结果正确

## 时间规划

- **第一阶段**（高优先级）：已完成
- **第二阶段**（中优先级）：已完成
- **第三阶段**（低优先级）：已完成

**导出功能开发**：已全部完成（2026-01-29）

## 更新日志

### 2026-01-29
- ✅ 扩展 `useExport.ts` 支持所有11种题型
- ✅ 修复分数运算导出功能
- ✅ 修复小数运算导出功能
- ✅ 修复几何计算导出功能
- ✅ 修复百分数导出功能
- ✅ 修复单位换算导出功能
- ✅ 修复倍数与因数导出功能
- ✅ 修复比较大小导出功能
- ✅ 修复找规律导出功能
- ✅ 修复质数与合数导出功能
- ✅ 更新一元一次方程导出函数名称
- ✅ 更新所有页面的导出功能集成

### 2026-01-28
- ✅ 新增因数与倍数功能，支持找因数、找倍数、最大公因数、最小公倍数
- ✅ 新增几何图形功能，支持长方形、正方形、三角形、平行四边形、梯形、圆形的周长和面积计算
- ✅ 新增百分数功能，支持百分数与小数互化、百分数与分数互化、求百分数、求比值的百分数
- ✅ 新增单位换算功能，支持长度单位（米、厘米、毫米、千米、分米）和质量单位（千克、克、吨、斤、公斤）的换算
- ✅ 为所有新增功能模块添加答题模式、评分系统、错题分析和个性化辅导计划
- ✅ 优化辅导计划生成逻辑，增强智能推荐能力
- ✅ 扩展类型定义，支持所有新增功能模块
