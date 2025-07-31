# 中文起名MCP开发文档

<!-- cSpell:words jieba nodejieba conv zhāng wuxing zhang míng feng shui zhōu weibo wechat douyin kaishu xingshu caoshu -->

## 📋 项目概述

### 项目名称
**Chinese Name Generator MCP** - 中文起名生成器MCP工具集

### 项目目标
为中文人名起名提供专业、智能、文化内涵丰富的MCP工具生态系统，结合传统文化智慧与现代技术便利。

### 核心价值
- **文化传承**：融合传统文化元素（五行、八字、诗词典故）
- **智能便捷**：现代算法优化，简洁易用的接口设计
- **个性定制**：支持多种起名风格和个人偏好
- **质量保证**：多维度评分确保名字质量

## 🏗️ 系统架构

### 整体架构设计
```
中文起名MCP生态系统
├── 核心工具层 (Core Tools)
│   ├── chinese-name-generator     # 核心起名生成器
│   ├── name-meaning-analyzer      # 姓名寓意分析
│   ├── name-phonetic-checker      # 音韵美学检测
│   └── name-culture-scorer        # 文化内涵评分
├── 高级扩展层 (Advanced Extensions)
│   ├── 专业分析类
│   ├── 实用检测类
│   ├── 创意生成类
│   └── 文化深度类
├── 数据支撑层 (Data Layer)
│   ├── 汉字数据库
│   ├── 文化知识库
│   ├── 音韵规则库
│   └── 统计数据库
└── 配置管理层 (Config Layer)
    ├── 用户偏好管理
    ├── 历史记录管理
    └── 系统配置管理
```

### 技术栈选择
- **运行环境**：Node.js 18+
- **核心依赖**：
  - `pinyin` - 中文拼音转换
  - `nodejieba` - 中文分词
  - `chinese-conv` - 简繁体转换
- **数据格式**：JSON
- **接口规范**：MCP ToolInterface

## 🛠️ 核心工具详细设计

### 1. chinese-name-generator (核心起名生成器)

#### Purpose
基于传统文化和现代审美，为用户生成高质量的中文人名。

#### Usage
```javascript
// 基础用法
const result = await mcpTool.execute('chinese-name-generator', {
  surname: '张',
  gender: 'female',
  style: 'traditional'
});

// 高级定制
const result = await mcpTool.execute('chinese-name-generator', {
  surname: '李',
  gender: 'male',
  style: 'modern',
  elements: ['智慧', '勇敢'],
  avoidChars: ['病', '死'],
  count: 15
});
```

#### Parameters
```javascript
{
  surname: {
    type: 'string',
    required: true,
    description: '姓氏，如：张、李、王'
  },
  gender: {
    type: 'string',
    enum: ['male', 'female', 'neutral'],
    default: 'neutral',
    description: '性别偏向'
  },
  style: {
    type: 'string',
    enum: ['traditional', 'modern', 'poetic', 'simple'],
    default: 'modern',
    description: '起名风格'
  },
  elements: {
    type: 'array',
    items: { type: 'string' },
    description: '希望体现的元素，如：智慧、美丽、勇敢'
  },
  avoidChars: {
    type: 'array',
    items: { type: 'string' },
    description: '避免使用的字符'
  },
  count: {
    type: 'integer',
    default: 10,
    min: 1,
    max: 50,
    description: '生成名字数量'
  }
}
```

#### Outcome
```javascript
{
  names: [
    {
      fullName: '张雅琪',
      givenName: '雅琪',
      meaning: '雅致高贵，琪花瑶草，寓意品格高雅，才华出众',
      pronunciation: 'zhāng yǎ qí',
      tones: [1, 3, 2],
      strokes: [11, 12, 13],
      elements: ['木', '木'],
      culturalScore: 85,
      phoneticScore: 90,
      overallScore: 87,
      tags: ['优雅', '文艺', '传统']
    }
  ],
  summary: '基于传统文化生成的优雅女性名字，注重音韵美感和文化内涵',
  statistics: {
    totalGenerated: 10,
    averageScore: 82,
    styleDistribution: {
      traditional: 6,
      modern: 4
    }
  }
}
```

### 2. name-meaning-analyzer (姓名寓意分析)

#### Purpose
深度分析姓名的文化内涵、字义解释和象征意义。

#### Parameters
```javascript
{
  fullName: {
    type: 'string',
    required: true,
    description: '完整姓名，如：张雅琪'
  },
  analysisDepth: {
    type: 'string',
    enum: ['basic', 'detailed', 'comprehensive'],
    default: 'detailed',
    description: '分析深度'
  }
}
```

### 3. name-phonetic-checker (音韵美学检测)

#### Purpose
检测姓名的音韵搭配、声调协调性和读音流畅度。

#### Parameters
```javascript
{
  fullName: {
    type: 'string',
    required: true,
    description: '完整姓名'
  },
  checkLevel: {
    type: 'string',
    enum: ['basic', 'advanced'],
    default: 'advanced',
    description: '检测级别'
  }
}
```

### 4. name-culture-scorer (文化内涵评分)

#### Purpose
基于传统文化标准对姓名进行综合评分。

#### Parameters
```javascript
{
  fullName: {
    type: 'string',
    required: true,
    description: '完整姓名'
  },
  culturalAspects: {
    type: 'array',
    items: {
      type: 'string',
      enum: ['wuxing', 'bazi', 'poetry', 'classical', 'modern']
    },
    default: ['wuxing', 'poetry', 'classical'],
    description: '评分维度'
  }
}
```

## 🚀 高级扩展工具

### 专业分析类

#### name-bazi-analyzer (八字五行匹配分析)
```javascript
// 根据生辰八字分析姓名五行匹配度
{
  fullName: 'string',
  birthDateTime: 'string', // ISO格式
  analysisType: 'comprehensive' | 'simplified'
}
```

#### name-stroke-calculator (笔画数理计算器)
```javascript
// 计算姓名笔画数理和吉凶分析
{
  fullName: 'string',
  calculationMethod: 'traditional' | 'simplified',
  includeAnalysis: boolean
}
```

#### name-zodiac-matcher (生肖属相匹配器)
```javascript
// 分析姓名与生肖属相的匹配度
{
  fullName: 'string',
  birthYear: number,
  zodiacSystem: 'chinese' | 'western'
}
```

#### name-poetry-generator (诗词典故起名器)
```javascript
// 基于古诗词典故生成富有文化内涵的名字
{
  surname: 'string',
  poetryStyle: 'tang' | 'song' | 'classical' | 'modern',
  themes: ['nature', 'virtue', 'wisdom', 'beauty'],
  count: number
}
```

### 实用检测类

#### name-collision-checker (重名率统计检测)
```javascript
// 检测姓名的重名概率和流行度
{
  fullName: 'string',
  region: 'national' | 'regional',
  ageGroup: 'all' | '0-18' | '19-35' | '36-60' | '60+'
}
```

#### name-domain-checker (域名可用性检测)
```javascript
// 检测基于姓名的域名可用性
{
  fullName: 'string',
  domainTypes: ['.com', '.cn', '.net'],
  includeVariants: boolean
}
```

#### name-trademark-scanner (商标冲突扫描器)
```javascript
// 扫描姓名相关的商标注册情况
{
  fullName: 'string',
  categories: ['personal', 'business', 'brand'],
  regions: ['china', 'international']
}
```

#### name-social-validator (社交平台用户名检测)
```javascript
// 检测社交平台用户名可用性
{
  baseName: 'string',
  platforms: ['weibo', 'wechat', 'qq', 'douyin'],
  includeVariants: boolean
}
```

### 创意生成类

#### nickname-generator (小名昵称生成器)
```javascript
// 基于正式姓名生成可爱的小名昵称
{
  fullName: 'string',
  style: 'cute' | 'traditional' | 'modern',
  length: 'short' | 'medium',
  count: number
}
```

#### english-name-matcher (中英文名匹配器)
```javascript
// 为中文名匹配合适的英文名
{
  chineseName: 'string',
  gender: 'male' | 'female' | 'neutral',
  style: 'similar-sound' | 'similar-meaning' | 'popular',
  count: number
}
```

#### family-name-coordinator (家族命名协调器)
```javascript
// 为家族成员生成协调统一的名字
{
  surname: 'string',
  existingNames: ['string'],
  relationship: 'siblings' | 'cousins' | 'generation',
  theme: 'unified' | 'complementary',
  count: number
}
```

#### name-variant-creator (名字变体创造器)
```javascript
// 创建姓名的各种变体形式
{
  baseName: 'string',
  variantTypes: ['homophone', 'synonym', 'style-change'],
  preserveElements: ['meaning', 'sound', 'structure'],
  count: number
}
```

### 文化深度类

#### name-calligraphy-analyzer (书法美学分析器)
```javascript
// 分析姓名的书法美学特征
{
  fullName: 'string',
  calligraphyStyles: ['kaishu', 'xingshu', 'caoshu'],
  analysisAspects: ['structure', 'balance', 'flow']
}
```

#### name-feng-shui-checker (风水学名字检测)
```javascript
// 基于风水学原理检测姓名
{
  fullName: 'string',
  birthInfo: {
    year: number,
    month: number,
    day: number,
    hour: number
  },
  fengShuiSchool: 'traditional' | 'modern'
}
```

#### name-historical-tracer (历史名人同名追溯)
```javascript
// 追溯历史上的同名名人
{
  fullName: 'string',
  timeRange: 'ancient' | 'modern' | 'contemporary' | 'all',
  fields: ['literature', 'politics', 'science', 'arts']
}
```

#### name-regional-adapter (地域文化适配器)
```javascript
// 根据地域文化特色调整姓名
{
  baseName: 'string',
  targetRegion: 'beijing' | 'shanghai' | 'guangdong' | 'sichuan',
  adaptationType: 'pronunciation' | 'cultural' | 'both'
}
```

## 📊 数据库设计

### 汉字数据库结构
```javascript
{
  char: '雅',
  pinyin: 'yǎ',
  tone: 3,
  strokes: 12,
  radicals: ['隹'],
  elements: ['木'],
  meanings: [
    {
      primary: '高雅、文雅',
      secondary: '正直、标准',
      context: 'character'
    }
  ],
  genderTendency: {
    male: 0.2,
    female: 0.8,
    neutral: 0.0
  },
  frequency: {
    overall: 'high',
    inNames: 'very-high',
    byGeneration: {
      '1950-1970': 'medium',
      '1970-1990': 'high',
      '1990-2010': 'very-high',
      '2010-2030': 'high'
    }
  },
  cultural: {
    poetry: true,
    classical: true,
    modern: true,
    religious: false
  },
  combinations: {
    common: ['雅致', '雅琪', '雅婷'],
    recommended: ['雅诗', '雅韵', '雅慧']
  },
  avoidCombinations: ['雅痞', '雅贼'],
  phonetic: {
    rhymeGroup: 'a',
    initialSound: 'y',
    finalSound: 'a',
    harmoniousWith: ['qi', 'ting', 'hui'],
    conflictsWith: ['ya', 'ga']
  }
}
```

### 文化知识库结构
```javascript
{
  category: 'poetry',
  source: '诗经·卫风·淇奥',
  content: '瞻彼淇奥，绿竹猗猗。有匪君子，如切如磋，如琢如磨',
  extractedElements: [
    {
      char: '琢',
      meaning: '雕琢、精心制作',
      symbolism: '精益求精的品格',
      applicableGender: ['male', 'female'],
      culturalWeight: 'high'
    }
  ],
  themes: ['品格', '修养', '君子'],
  era: 'pre-qin',
  popularity: 'classic'
}
```

## 🔧 开发实施计划

### Phase 1: 基础架构 (1-2周)
- [ ] 项目初始化和环境配置
- [ ] 核心数据库设计和构建
- [ ] MCP接口规范实现
- [ ] 基础工具框架搭建

### Phase 2: 核心工具开发 (2-3周)
- [ ] chinese-name-generator 实现
- [ ] name-meaning-analyzer 实现
- [ ] name-phonetic-checker 实现
- [ ] name-culture-scorer 实现
- [ ] 核心工具集成测试

### Phase 3: 高级扩展工具 (3-4周)
- [ ] 专业分析类工具开发
- [ ] 实用检测类工具开发
- [ ] 创意生成类工具开发
- [ ] 文化深度类工具开发

### Phase 4: 优化和完善 (1-2周)
- [ ] 性能优化
- [ ] 用户体验改进
- [ ] 文档完善
- [ ] 测试覆盖

## 📝 开发规范

### 代码规范
- 使用 ES6+ 语法
- 严格的 TypeScript 类型定义
- 统一的错误处理机制
- 完整的 JSDoc 注释

### 文件命名规范
```
工具文件: {tool-name}.tool.js
手册文件: {tool-name}.manual.md
测试文件: {tool-name}.test.js
数据文件: {data-type}.data.json
```

### 接口设计原则
- 参数最小化，合理默认值
- 输出标准化，结构清晰
- 错误信息友好，便于调试
- 向后兼容，版本管理

## 🧪 测试策略

### 单元测试
- 每个工具的核心逻辑测试
- 参数验证测试
- 边界条件测试
- 错误处理测试

### 集成测试
- 工具间协作测试
- 数据库访问测试
- MCP接口兼容性测试

### 性能测试
- 响应时间测试
- 内存使用测试
- 并发处理测试
- 大数据量测试

## 📈 质量保证

### 代码质量
- ESLint 代码规范检查
- Prettier 代码格式化
- SonarQube 代码质量分析
- 代码覆盖率 > 80%

### 文档质量
- API 文档完整性
- 使用示例丰富性
- 错误处理说明
- 最佳实践指南

## 🚀 部署和发布

### 版本管理
- 语义化版本控制 (SemVer)
- 变更日志维护
- 向后兼容性保证

### 发布流程
1. 代码审查
2. 自动化测试
3. 性能验证
4. 文档更新
5. 版本发布
6. 用户通知

## 📞 支持和维护

### 用户支持
- 详细的使用文档
- 常见问题解答
- 示例代码库
- 社区支持论坛

### 持续维护
- 定期安全更新
- 性能优化
- 功能增强
- Bug 修复

---

**开发团队**: 鲁班 (PromptX工具开发大师)
**文档版本**: v1.0
**最后更新**: 2024年
**联系方式**: 通过PromptX MCP系统
