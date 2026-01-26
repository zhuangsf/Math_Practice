# 小学数学四则运算出题工具

一个为小学生设计的自动四则运算题目生成工具，支持快速生成练习题目。

## 功能特性

- ✅ **多种运算模式**：支持二元、三元、四元运算
- ✅ **四种运算类型**：加法、减法、乘法、除法（可多选）
- ✅ **灵活的数值范围**：可自定义最小值和最大值（默认0-1000）
- ✅ **题目数量选择**：支持20、50、100题三种选项
- ✅ **答案显示控制**：可选择是否显示答案
- ✅ **多格式导出**：支持导出TXT和PDF文件
- ✅ **打印功能**：直接打印题目
- ✅ **4列布局**：题目以4列网格显示，适合打印
- ✅ **题目质量保证**：所有除法题目保证整除，不会生成以0作为被除数的无效题目

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 UI组件库
- **TailwindCSS** - 原子化CSS框架
- **jsPDF** - PDF生成库

## 项目结构

```
Math_Practice/
├── public/                      # 静态资源
├── src/
│   ├── assets/                  # 资源文件
│   │   └── styles/              # 全局样式
│   ├── components/              # Vue组件
│   │   ├── ControlPanel.vue     # 控制面板
│   │   ├── QuestionDisplay.vue  # 题目显示
│   │   └── ActionButtons.vue    # 操作按钮
│   ├── composables/             # 组合式函数
│   │   ├── useQuestionGenerator.ts  # 题目生成逻辑
│   │   └── useExport.ts              # 导出功能
│   ├── utils/                   # 工具函数
│   │   ├── mathUtils.ts         # 数学运算
│   │   ├── validationUtils.ts   # 验证工具
│   │   └── numberUtils.ts       # 数字生成
│   ├── types/                   # TypeScript类型定义
│   ├── views/                   # 页面视图
│   │   └── Home.vue             # 主页面
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 应用入口
├── index.html                   # HTML模板
├── package.json                 # 依赖配置
├── vite.config.ts               # Vite配置
└── tsconfig.json                # TypeScript配置
```

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### 3. 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

### 4. 预览生产构建

```bash
npm run preview
```

## 使用说明

1. **选择运算元数量**：选择二元、三元或四元运算
2. **设置数值范围**：调整最小值和最大值
3. **选择运算类型**：勾选需要的运算类型（至少选择一种）
4. **选择题目数量**：选择20、50或100题
5. **（可选）勾选"显示答案"**：如果需要在生成时显示答案
6. **点击"生成题目"按钮**：生成题目
7. **查看题目**：题目将以4列布局显示
8. **导出或打印**：选择导出TXT、导出PDF或直接打印

## 核心功能说明

### 运算约束

- **加法**：结果不超过最大值
- **减法**：被减数 ≥ 减数，结果非负
- **乘法**：结果不超过最大值，操作数不为0（避免无意义的0×运算）
- **除法**：
  - 保证整除（余数为0）
  - 被除数 ≥ 除数
  - 除数 ≠ 0
  - **被除数 ≠ 0**（避免生成如"0 ÷ 7 ÷ 6"这类结果恒为0的无意义题目）

### 运算优先级

遵循标准数学运算优先级：先乘除后加减，从左到右计算。

## 开发说明

### 代码规范

- 所有代码注释使用英文
- 格式：`// modify by jx + 具体修改内容英文描述`

### 类型定义

主要类型定义在 `src/types/index.ts` 中：

- `Question`: 题目对象
- `QuestionConfig`: 题目生成配置
- `OperationType`: 运算类型（'add' | 'subtract' | 'multiply' | 'divide'）

### 组合式函数

- `useQuestionGenerator`: 题目生成逻辑
- `useExport`: 导出功能（TXT、PDF、打印）

## 浏览器支持

- Chrome (推荐)
- Edge
- Firefox
- Safari

## 许可证

MIT License

## 作者

Created with ❤️ for elementary school math practice.

---

**版本**: 1.0.0
**更新日期**: 2026-01-26

## 更新日志

### 2026-01-26
- ✅ 修复除法题目生成逻辑，确保不会生成以0作为被除数的无效题目（如"0 ÷ 7 ÷ 6"）
- ✅ 增强题目验证机制，确保所有生成的题目都有实际练习价值
