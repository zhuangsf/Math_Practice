# 小学数学四则运算出题工具 - 代码架构文档

## 1. 技术栈选型

### 1.1 前端框架
- **Vue 3** - 使用Composition API，便于状态管理和逻辑复用
- **Vite** - 构建工具，快速开发和热更新

### 1.2 UI组件库
- **Element Plus** - 提供美观的UI组件（复选框、单选框、按钮等）
- **TailwindCSS** - 原子化CSS框架，快速构建响应式布局

### 1.3 工具库
- **jsPDF** - PDF导出功能
- **html2canvas** - 打印预览支持（可选）

### 1.4 开发语言
- **TypeScript** - 类型安全，提高代码质量

---

## 2. 项目目录结构

```
Math_Practice/
├── public/                      # 静态资源目录
│   └── favicon.ico             # 网站图标
│
├── src/                         # 源代码目录
│   ├── assets/                  # 资源文件
│   │   ├── styles/              # 全局样式
│   │   │   ├── main.css         # 主样式文件
│   │   │   └── variables.css    # CSS变量定义
│   │   └── images/              # 图片资源
│   │
│   ├── components/              # 组件目录
│   │   ├── ControlPanel.vue     # 控制面板组件
│   │   ├── QuestionDisplay.vue  # 题目显示组件
│   │   ├── ActionButtons.vue   # 操作按钮组件
│   │   ├── ExportModal.vue     # 导出弹窗组件
│   │   ├── SettingsDialog.vue  # 设置弹窗组件
│   │   └── battle/             # 战斗模式相关组件（征服者/能量团，见 README）
│   │       ├── BattleHUD.vue   # 战斗 HUD（血量等）
│   │       ├── BattleEnemy.vue # 能量团展示
│   │       └── BattleResult.vue# 战斗结果
│   │
│   ├── composables/             # 组合式函数（Composition API）
│   │   ├── useQuestionGenerator.ts  # 题目生成逻辑
│   │   ├── useExport.ts             # 导出功能逻辑
│   │   ├── useBattleEngine.ts      # 战斗引擎（伤害、回合等）
│   │   ├── useBattleNavigation.ts  # 战斗页面导航
│   │   ├── useAnswering.ts         # 答题逻辑
│   │   ├── useScoring.ts           # 评分逻辑
│   │   └── ...                    # 其他题型生成与工具
│   │
│   ├── utils/                   # 工具函数
│   │   ├── mathUtils.ts         # 数学运算工具函数
│   │   ├── validationUtils.ts   # 验证工具函数
│   │   ├── exportUtils.ts       # 导出工具函数
│   │   └── numberUtils.ts       # 数字生成工具函数
│   │
│   ├── types/                   # TypeScript类型定义
│   │   └── index.ts             # 全局类型定义（含战斗相关类型）
│   │
│   ├── views/                   # 页面视图
│   │   ├── Home.vue             # 主页面
│   │   ├── ArithmeticPage.vue   # 四则运算页面
│   │   ├── BattlePage.vue       # 战斗页面（征服四则运算等）
│   │   └── ...                  # 其他题型页面
│   │
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 应用入口
│
├── index.html                   # HTML模板
├── package.json                 # 依赖配置
├── tsconfig.json                # TypeScript配置
├── vite.config.ts               # Vite配置
├── tailwind.config.js           # TailwindCSS配置
├── README.md                    # 项目说明文档
└── CODE_ARCHITECTURE.md         # 代码架构文档（本文件）
```

---

## 3. 核心模块设计

### 3.1 题目生成模块（useQuestionGenerator.ts）

**职责：**
- 根据配置生成题目
- 计算题目答案
- 应用约束规则

**核心函数：**
```typescript
// 生成题目数组
generateQuestions(config: QuestionConfig): Question[]

// 生成单个二元运算
generateBinaryQuestion(operation: OperationType, min: number, max: number): Question

// 生成单个三元运算
generateTernaryQuestion(operations: OperationType[], min: number, max: number): Question

// 生成单个四元运算
generateQuaternaryQuestion(operations: OperationType[], min: number, max: number): Question

// 计算表达式结果
calculateExpression(numbers: number[], operators: OperationType[]): number
```

### 3.2 数学运算工具模块（mathUtils.ts）

**职责：**
- 生成指定范围内的随机数
- 执行基本运算
- 验证运算约束

**核心函数：**
```typescript
// 生成随机数（包含边界）
randomInt(min: number, max: number): number

// 生成整除对的数字（用于除法）
generateDivisibleNumbers(min: number, max: number): [number, number]

// 验证加法结果是否超限
validateAddition(a: number, b: number, max: number): boolean

// 验证减法结果是否非负
validateSubtraction(a: number, b: number): boolean

// 验证乘法结果是否超限
validateMultiplication(a: number, b: number, max: number): boolean

// 验证除法是否整除
validateDivision(a: number, b: number): boolean
```

### 3.3 导出功能模块（useExport.ts）

**职责：**
- 导出TXT文件
- 导出PDF文件
- 打印功能

**核心函数：**
```typescript
// 导出为TXT文件
exportToTxt(questions: Question[], includeAnswers: boolean): void

// 导出为PDF文件
exportToPdf(questions: Question[], includeAnswers: boolean): void

// 打印题目
printQuestions(questions: Question[], includeAnswers: boolean): void

// 格式化题目文本
formatQuestionForExport(question: Question, includeAnswers: boolean): string
```

### 3.4 配置管理模块

**职责：**
- 管理用户配置
- 保存和加载历史记录
- 本地存储

**核心函数：**
```typescript
// 保存配置到本地存储
saveConfig(config: QuestionConfig): void

// 从本地存储加载配置
loadConfig(): QuestionConfig | null

// 保存题目历史记录
saveHistory(questions: Question[], config: QuestionConfig): void

// 获取历史记录
getHistory(): HistoryItem[]
```

---

## 4. 组件设计

### 4.1 App.vue（根组件）
- **职责：** 应用根组件，设置全局布局
- **包含：**
  - 标题栏
  - 主内容区域
  - 页脚

### 4.2 Home.vue（主页面）
- **职责：** 主页面容器，组合各个子组件
- **包含：**
  - ControlPanel（控制面板）
  - ActionButtons（操作按钮）
  - QuestionDisplay（题目显示）

### 4.3 ControlPanel.vue（控制面板）
- **职责：** 接收用户输入的配置参数
- **功能：**
  - 运算元数量选择（单选）
  - 数值范围设置
  - 运算类型选择（多选）
  - 题目数量选择
  - 显示答案选项
- **状态：**
  - operandCount: 2 | 3 | 4
  - minValue: number
  - maxValue: number
  - selectedOperations: OperationType[]
  - questionCount: number
  - showAnswers: boolean

### 4.4 QuestionDisplay.vue（题目显示）
- **职责：** 以4列布局显示生成的题目
- **功能：**
  - 4列网格布局
  - 动态渲染题目
  - 答案显示/隐藏切换
- **props：**
  - questions: Question[]
  - showAnswers: boolean

### 4.5 ActionButtons.vue（操作按钮）
- **职责：** 提供操作按钮
- **功能：**
  - 生成题目按钮
  - 导出TXT按钮
  - 导出PDF按钮
  - 打印按钮
- **事件：**
  - @generate: 生成题目
  - @exportTxt: 导出TXT
  - @exportPdf: 导出PDF
  - @print: 打印

### 4.6 ExportModal.vue（导出弹窗）
- **职责：** 导出时的选项设置
- **功能：**
  - 是否包含答案选项
  - 确认导出
- **props：**
  - visible: boolean
- **事件：**
  - @confirm: 确认导出
  - @cancel: 取消导出

---

## 5. 数据模型

### 5.1 题目类型（Question）
```typescript
interface Question {
  id: string;              // 题目唯一标识
  expression: string;      // 运算表达式（如："25 + 37"）
  answer: number;           // 答案
  numbers: number[];        // 参与运算的数字
  operators: OperationType[]; // 运算符
}
```

### 5.2 运算类型（OperationType）
```typescript
type OperationType = 'add' | 'subtract' | 'multiply' | 'divide';
```

### 5.3 题目配置（QuestionConfig）
```typescript
interface QuestionConfig {
  operandCount: 2 | 3 | 4;           // 运算元数量
  minValue: number;                   // 最小值
  maxValue: number;                   // 最大值
  operations: OperationType[];        // 运算类型
  questionCount: number;              // 题目数量
}
```

### 5.4 历史记录（HistoryItem）
```typescript
interface HistoryItem {
  id: string;              // 记录唯一标识
  timestamp: Date;        // 生成时间
  config: QuestionConfig; // 生成时的配置
  questions: Question[];  // 生成的题目
}
```

---

## 6. 状态管理

### 6.1 使用Vue 3 Composition API
- 在Home.vue中使用`ref`和`reactive`管理响应式数据
- 使用`computed`派生计算属性
- 使用`watch`监听配置变化

### 6.2 主要状态
```typescript
// 用户配置
const config = ref<QuestionConfig>({
  operandCount: 2,
  minValue: 0,
  maxValue: 20,  // modify by jx: default changed from 1000 to 20
  operations: ['add', 'subtract', 'multiply', 'divide'],
  questionCount: 20
});

// 生成的题目
const questions = ref<Question[]>([]);

// 是否显示答案
const showAnswers = ref(false);

// 是否正在生成
const isGenerating = ref(false);

// 历史记录
const history = ref<HistoryItem[]>([]);
```

---

## 7. 约束规则实现

### 7.1 加法约束
- 两个数字相加的结果不能超过maxValue
- 生成数字时：`a + b <= maxValue`

### 7.2 减法约束
- 被减数必须大于或等于减数，保证结果非负
- 生成数字时：`a >= b`

### 7.3 乘法约束
- 两个数字相乘的结果不能超过maxValue
- 生成数字时：`a * b <= maxValue`

### 7.4 除法约束
- 除数不能为0
- 必须能整除，余数为0
- 被除数 >= 除数
- 生成方法：先生成除数和商，然后相乘得到被除数

### 7.5 多元运算约束
- 按照运算优先级（先乘除后加减）逐步计算
- 每一步的中间结果都要满足对应的约束规则
- 对于三元和四元运算，需要多次验证约束

---

## 8. 开发流程

### 阶段一：基础功能开发
1. 搭建Vue 3 + Vite + TypeScript项目
2. 创建项目目录结构
3. 实现基础组件（ControlPanel、QuestionDisplay、ActionButtons）
4. 实现题目生成核心逻辑（二元运算）
5. 实现基本UI布局和样式

### 阶段二：功能完善
1. 实现三元和四元运算题目生成
2. 实现约束规则验证
3. 实现答案显示/隐藏功能
4. 实现导出TXT功能
5. 优化4列布局样式

### 阶段三：增强功能
1. 实现导出PDF功能
2. 实现打印功能
3. 实现历史记录功能
4. 响应式优化
5. 性能优化
6. 添加错误处理和提示

---

## 9. 关键技术点

### 9.1 4列布局实现
使用CSS Grid：
```css
.question-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .question-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .question-grid {
    grid-template-columns: 1fr;
  }
}
```

### 9.2 运算优先级处理
使用栈或递归下降解析器处理表达式计算：
```typescript
function calculateExpression(numbers: number[], operators: OperationType[]): number {
  // 先处理乘除
  const newNumbers = [...numbers];
  const newOperators = [...operators];
  
  for (let i = newOperators.length - 1; i >= 0; i--) {
    if (newOperators[i] === 'multiply' || newOperators[i] === 'divide') {
      const result = calculate(newNumbers[i], newNumbers[i + 1], newOperators[i]);
      newNumbers.splice(i, 2, result);
      newOperators.splice(i, 1);
    }
  }
  
  // 再处理加减
  let result = newNumbers[0];
  for (let i = 0; i < newOperators.length; i++) {
    result = calculate(result, newNumbers[i + 1], newOperators[i]);
  }
  
  return result;
}
```

### 9.3 约束验证的尝试重试机制
对于随机生成的题目，可能需要多次尝试才能满足所有约束：
```typescript
function generateWithRetry<T>(
  generator: () => T,
  validator: (result: T) => boolean,
  maxRetries: number = 10
): T | null {
  for (let i = 0; i < maxRetries; i++) {
    const result = generator();
    if (validator(result)) {
      return result;
    }
  }
  return null;
}
```

---

## 10. 测试策略

### 10.1 单元测试
- 测试数学运算工具函数
- 测试约束验证函数
- 测试题目生成逻辑

### 10.2 集成测试
- 测试完整的题目生成流程
- 测试导出功能
- 测试用户交互流程

### 10.3 手动测试
- 测试各种配置组合
- 测试边界情况（如最大值、最小值）
- 测试响应式布局

---

## 11. 部署方案

### 11.1 构建产物
```bash
npm run build
```
生成`dist`目录，包含：
- `index.html`
- `assets/` - 静态资源文件

### 11.2 部署方式
- 可以部署到任何静态文件服务器（如Nginx、Apache）
- 可以部署到GitHub Pages
- 可以部署到Vercel、Netlify等平台

---

## 12. 战斗模式术语（Terminology）

战斗模式中使用的产品术语与代码对应关系，详见 **README.md 战斗模式与术语** 小节。简要对照：

| 术语 | 代码对应 |
|------|----------|
| 征服者 | `playerHP`、`player-section`、BattleHUD 标签、战斗信息 log |
| 能量团 | `enemyHP`、`enemyAttack`、BattleEnemy、战斗信息 log |
| 征服四则运算 | BattlePage 页面标题、`document.title` |

搜索关键词：`征服者`、`能量团`、`征服四则运算` 可定位到对应文案与逻辑所在文件。

---

**文档版本**: v1.0
**创建日期**: 2026-01-26
**最后更新**: 2026-01-26
