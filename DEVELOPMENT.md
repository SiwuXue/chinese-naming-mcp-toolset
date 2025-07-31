# 开发指南

## 项目概述

中文起名MCP工具集是一个专业的姓名生成、分析和文化解读系统，基于传统中华文化和现代技术构建。

## 技术架构

### 核心架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MCP Client    │    │   Tool Engine   │    │   Data Layer    │
│                 │    │                 │    │                 │
│ - 参数验证      │◄──►│ - 工具调度      │◄──►│ - 字符数据库    │
│ - 结果格式化    │    │ - 逻辑处理      │    │ - 文化知识库    │
│ - 错误处理      │    │ - 缓存管理      │    │ - 统计数据      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 工具分层

1. **基础工具层** (`src/tools/`)
   - 姓名生成器
   - 含义分析器
   - 重名检查器

2. **高级工具层** (`src/tools/advanced/`)
   - 八字分析器
   - 音韵分析器
   - 文化分析器
   - 诗词生成器
   - 运势分析器
   - 风水分析器
   - 历史分析器

3. **数据层** (`src/data/`)
   - 字符数据库
   - 文化知识库
   - 统计数据

4. **工具层** (`src/utils/`)
   - 基础工具类
   - 通用函数
   - 辅助工具

## 开发环境设置

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-org/chinese-naming-mcp-toolset.git
cd chinese-naming-mcp-toolset

# 2. 安装依赖
npm install

# 3. 运行测试
npm test

# 4. 启动开发服务器
npm run dev
```

### 开发工具配置

#### VSCode 配置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.preferences.quoteStyle": "single",
  "typescript.preferences.quoteStyle": "single"
}
```

#### ESLint 配置

项目使用 ESLint 进行代码规范检查，配置文件为 `.eslintrc.js`。

#### Prettier 配置

代码格式化使用 Prettier，配置文件为 `.prettierrc`。

## 开发规范

### 代码规范

1. **命名规范**
   - 类名：PascalCase（如 `ChineseNameGenerator`）
   - 方法名：camelCase（如 `generateNames`）
   - 常量：UPPER_SNAKE_CASE（如 `MAX_NAME_COUNT`）
   - 文件名：kebab-case（如 `name-generator.tool.js`）

2. **注释规范**
   ```javascript
   /**
    * 生成中文姓名
    * @param {Object} params - 生成参数
    * @param {string} params.surname - 姓氏
    * @param {string} params.gender - 性别
    * @param {string} params.style - 风格
    * @returns {Promise<Object>} 生成结果
    */
   async generateNames(params) {
     // 实现逻辑
   }
   ```

3. **错误处理**
   ```javascript
   try {
     const result = await this.processData(params);
     return this.createResponse(true, '处理成功', result);
   } catch (error) {
     return this.createResponse(false, '处理失败', null, {
       code: 'PROCESSING_ERROR',
       details: error.message
     });
   }
   ```

### 工具开发规范

#### 1. 继承基础类

所有工具必须继承 `BaseTool` 类：

```javascript
const BaseTool = require('../utils/base-tool');

class MyTool extends BaseTool {
  constructor() {
    super();
    this.name = 'my-tool';
    this.description = '我的工具描述';
  }
}
```

#### 2. 实现必要方法

```javascript
class MyTool extends BaseTool {
  // 主要执行逻辑
  async execute(params) {
    // 参数验证
    const validation = this.validateParams(params);
    if (!validation.valid) {
      return this.createResponse(false, validation.message);
    }

    // 业务逻辑
    const result = await this.processLogic(params);
    
    return this.createResponse(true, '执行成功', result);
  }

  // 参数模式定义
  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        // 定义参数
      },
      required: []
    };
  }

  // 使用示例
  getUsageExamples() {
    return [
      {
        description: '基本使用',
        input: { /* 示例参数 */ }
      }
    ];
  }
}
```

#### 3. 参数验证

```javascript
validateParams(params) {
  const schema = this.getParameterSchema();
  
  // 使用 JSON Schema 验证
  const valid = this.validateSchema(params, schema);
  
  if (!valid) {
    return {
      valid: false,
      message: '参数验证失败'
    };
  }

  // 业务逻辑验证
  if (params.name && !this.isValidChineseName(params.name)) {
    return {
      valid: false,
      message: '姓名格式不正确'
    };
  }

  return { valid: true };
}
```

### 测试规范

#### 1. 测试文件结构

```javascript
const MyTool = require('../src/tools/my-tool.js');

describe('MyTool', () => {
  let tool;

  beforeEach(() => {
    tool = new MyTool();
  });

  describe('execute', () => {
    test('should handle valid parameters', async () => {
      // 测试逻辑
    });

    test('should reject invalid parameters', async () => {
      // 测试逻辑
    });
  });

  describe('getParameterSchema', () => {
    test('should return valid schema', () => {
      // 测试逻辑
    });
  });
});
```

#### 2. 测试覆盖率要求

- 行覆盖率：≥ 80%
- 函数覆盖率：≥ 80%
- 分支覆盖率：≥ 70%
- 语句覆盖率：≥ 80%

#### 3. 测试命令

```bash
# 运行所有测试
npm test

# 运行特定测试
npm run test:generator
npm run test:analyzer

# 生成覆盖率报告
npm run coverage

# 监视模式
npm run test:watch
```

## 数据管理

### 字符数据库

字符数据存储在 `src/data/character-data.js` 中：

```javascript
const characterData = {
  '明': {
    strokes: 8,
    wuxing: '火',
    pinyin: 'míng',
    meaning: '光明、明亮、聪明',
    category: ['virtue', 'wisdom']
  }
};
```

### 数据更新流程

1. **添加新字符**
   ```javascript
   // 在 character-data.js 中添加
   '新字': {
     strokes: 笔画数,
     wuxing: '五行属性',
     pinyin: '拼音',
     meaning: '含义',
     category: ['分类']
   }
   ```

2. **更新现有数据**
   - 修改对应字符的属性
   - 运行测试确保兼容性
   - 更新相关文档

3. **数据验证**
   ```bash
   npm run validate:data
   ```

## 性能优化

### 缓存策略

1. **内存缓存**
   ```javascript
   class MyTool extends BaseTool {
     constructor() {
       super();
       this.cache = new Map();
     }

     async execute(params) {
       const cacheKey = this.generateCacheKey(params);
       
       if (this.cache.has(cacheKey)) {
         return this.cache.get(cacheKey);
       }

       const result = await this.processLogic(params);
       this.cache.set(cacheKey, result);
       
       return result;
     }
   }
   ```

2. **数据预加载**
   ```javascript
   async initializeData() {
     // 预加载常用数据
     this.commonSurnames = await this.loadCommonSurnames();
     this.frequentChars = await this.loadFrequentChars();
   }
   ```

### 算法优化

1. **批量处理**
   ```javascript
   async generateMultipleNames(requests) {
     // 批量处理多个请求
     const results = await Promise.all(
       requests.map(req => this.generateSingleName(req))
     );
     return results;
   }
   ```

2. **懒加载**
   ```javascript
   get expensiveData() {
     if (!this._expensiveData) {
       this._expensiveData = this.loadExpensiveData();
     }
     return this._expensiveData;
   }
   ```

## 调试指南

### 日志系统

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 在工具中使用
logger.info('开始生成姓名', { params });
logger.error('生成失败', { error: error.message });
```

### 调试技巧

1. **使用调试器**
   ```javascript
   // 在代码中设置断点
   debugger;
   
   // 或使用 console.log
   console.log('调试信息:', variable);
   ```

2. **单元测试调试**
   ```bash
   # 调试特定测试
   npm run test:debug -- --testNamePattern="specific test"
   ```

3. **性能分析**
   ```javascript
   console.time('operation');
   await performOperation();
   console.timeEnd('operation');
   ```

## 部署指南

### 构建流程

```bash
# 1. 安装依赖
npm ci

# 2. 运行测试
npm test

# 3. 代码检查
npm run lint

# 4. 构建项目
npm run build

# 5. 打包
npm pack
```

### 环境配置

1. **开发环境**
   ```bash
   NODE_ENV=development
   LOG_LEVEL=debug
   ```

2. **生产环境**
   ```bash
   NODE_ENV=production
   LOG_LEVEL=info
   ```

### 监控和维护

1. **健康检查**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       version: process.env.npm_package_version
     });
   });
   ```

2. **错误监控**
   ```javascript
   process.on('uncaughtException', (error) => {
     logger.error('未捕获的异常', { error });
     process.exit(1);
   });
   ```

## 贡献指南

### 提交规范

使用 Conventional Commits 规范：

```
type(scope): description

[optional body]

[optional footer]
```

类型说明：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat(generator): 添加五行偏好功能

为姓名生成器添加五行偏好设置，用户可以指定期望的五行属性。

Closes #123
```

### Pull Request 流程

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 编写测试
5. 确保测试通过
6. 提交 PR
7. 代码审查
8. 合并代码

### 代码审查清单

- [ ] 代码符合项目规范
- [ ] 有充分的测试覆盖
- [ ] 文档已更新
- [ ] 性能影响可接受
- [ ] 安全性考虑
- [ ] 向后兼容性

## 常见问题

### Q: 如何添加新的姓名风格？

A: 在相应的工具类中添加新的风格处理逻辑，并更新参数模式。

### Q: 如何优化生成速度？

A: 使用缓存、批量处理和数据预加载等技术。

### Q: 如何处理生僻字？

A: 在字符数据库中添加生僻字信息，或使用外部字典API。

### Q: 如何扩展文化分析功能？

A: 丰富文化知识库，添加更多的历史典故和文化内涵数据。

## 参考资源

- [Node.js 官方文档](https://nodejs.org/docs/)
- [Jest 测试框架](https://jestjs.io/)
- [ESLint 规则](https://eslint.org/docs/rules/)
- [Prettier 配置](https://prettier.io/docs/en/configuration.html)
- [中华传统文化资料](https://example.com/culture)