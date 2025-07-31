# 贡献指南

感谢您对中文起名MCP工具集项目的关注！我们欢迎所有形式的贡献，包括但不限于代码、文档、测试、反馈和建议。

## 🤝 如何贡献

### 🐛 报告问题

如果您发现了bug或有功能建议，请通过以下方式报告：

1. 在 [GitHub Issues](https://github.com/chinese-naming/mcp-toolset/issues) 中搜索是否已有相关问题
2. 如果没有，请创建新的issue，并提供以下信息：
   - 问题的详细描述
   - 重现步骤
   - 期望的行为
   - 实际的行为
   - 环境信息（Node.js版本、操作系统等）
   - 相关的错误日志或截图

### 💡 功能建议

我们欢迎新功能的建议！请在issue中详细描述：

- 功能的用途和价值
- 预期的使用场景
- 可能的实现方案
- 是否愿意参与开发

### 🔧 代码贡献

#### 开发环境设置

1. **Fork 项目**
   ```bash
   # 克隆您的fork
   git clone https://github.com/YOUR_USERNAME/chinese-naming-mcp-toolset.git
   cd chinese-naming-mcp-toolset
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **设置开发环境**
   ```bash
   # 复制环境配置
   cp .env.example .env
   
   # 运行初始化脚本
   npm run start:init
   ```

4. **运行测试**
   ```bash
   npm test
   ```

#### 开发流程

1. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

2. **进行开发**
   - 遵循项目的代码规范
   - 编写测试用例
   - 更新相关文档

3. **提交代码**
   ```bash
   # 运行代码检查
   npm run lint
   
   # 运行测试
   npm test
   
   # 提交代码
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **创建 Pull Request**
   - 在GitHub上创建PR
   - 填写PR模板
   - 等待代码审查

## 📝 代码规范

### 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型 (type)：**
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `ci`: CI/CD相关

**示例：**
```
feat(name-generator): add poetry-based name generation

Implement a new feature that generates names based on classical Chinese poetry.
This includes integration with poetry database and semantic analysis.

Closes #123
```

### 代码风格

我们使用 ESLint 和 Prettier 来保持代码风格的一致性：

```bash
# 检查代码风格
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

**主要规则：**
- 使用2个空格缩进
- 使用单引号
- 语句末尾加分号
- 每行最大100个字符
- 使用驼峰命名法

### 文档规范

- 所有公共API必须有JSDoc注释
- README和API文档需要保持更新
- 代码注释使用中文
- 提交信息和PR描述使用中文

**JSDoc示例：**
```javascript
/**
 * 生成中文姓名
 * @param {Object} options - 生成选项
 * @param {string} options.surname - 姓氏
 * @param {string} options.gender - 性别 ('male' | 'female')
 * @param {number} [options.count=5] - 生成数量
 * @returns {Promise<Object>} 生成结果
 * @throws {Error} 当参数无效时抛出错误
 */
async function generateNames(options) {
  // 实现代码
}
```

## 🧪 测试指南

### 测试类型

1. **单元测试** - 测试单个函数或类
2. **集成测试** - 测试组件间的交互
3. **端到端测试** - 测试完整的用户场景

### 测试规范

- 每个新功能都必须有对应的测试
- 测试覆盖率不能低于90%
- 测试文件命名：`*.test.js` 或 `*.spec.js`
- 测试描述使用中文

**测试示例：**
```javascript
describe('ChineseNameGenerator', () => {
  describe('generateNames', () => {
    it('应该生成指定数量的姓名', async () => {
      const generator = new ChineseNameGenerator();
      const result = await generator.generateNames({
        surname: '李',
        gender: 'male',
        count: 3
      });
      
      expect(result.success).toBe(true);
      expect(result.data.names).toHaveLength(3);
    });
    
    it('当姓氏为空时应该抛出错误', async () => {
      const generator = new ChineseNameGenerator();
      
      await expect(generator.generateNames({
        surname: '',
        gender: 'male'
      })).rejects.toThrow('姓氏不能为空');
    });
  });
});
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- name-generator.test.js

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## 📋 Pull Request 指南

### PR 模板

创建PR时，请填写以下信息：

```markdown
## 变更类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他

## 变更描述
简要描述本次变更的内容和目的。

## 相关Issue
关闭 #issue_number

## 测试
- [ ] 已添加单元测试
- [ ] 已添加集成测试
- [ ] 所有测试通过
- [ ] 代码覆盖率满足要求

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 已更新相关文档
- [ ] 已添加必要的注释
- [ ] 已运行lint检查
- [ ] 已运行所有测试

## 截图（如适用）
如果有UI变更，请提供截图。

## 其他说明
其他需要说明的内容。
```

### 代码审查

所有PR都需要经过代码审查：

1. **自动检查**
   - CI/CD流水线必须通过
   - 代码覆盖率检查
   - 安全扫描

2. **人工审查**
   - 至少需要一个维护者的批准
   - 代码质量和规范检查
   - 功能正确性验证

3. **审查标准**
   - 代码逻辑清晰
   - 性能影响可接受
   - 安全性考虑充分
   - 文档完整准确

## 🏗️ 项目架构

### 目录结构

```
chinese-naming-mcp-toolset/
├── tools/              # 工具实现
│   ├── basic/         # 基础工具
│   ├── advanced/      # 高级工具
│   └── data/          # 数据工具
├── lib/               # 核心库
├── test/              # 测试文件
├── examples/          # 使用示例
├── docs/              # 文档
├── scripts/           # 构建脚本
├── config/            # 配置文件
└── data/              # 数据文件
```

### 添加新工具

1. **创建工具类**
   ```javascript
   // tools/basic/YourNewTool.js
   const BaseTool = require('../../lib/BaseTool');
   
   class YourNewTool extends BaseTool {
     constructor() {
       super('YourNewTool', '工具描述');
     }
     
     async execute(params) {
       // 实现工具逻辑
     }
     
     getSchema() {
       // 返回参数schema
     }
   }
   
   module.exports = YourNewTool;
   ```

2. **注册工具**
   ```javascript
   // index.js
   const YourNewTool = require('./tools/basic/YourNewTool');
   
   // 在tools对象中添加
   tools.YourNewTool = new YourNewTool();
   ```

3. **添加测试**
   ```javascript
   // test/tools/YourNewTool.test.js
   const YourNewTool = require('../../tools/basic/YourNewTool');
   
   describe('YourNewTool', () => {
     // 测试用例
   });
   ```

4. **更新文档**
   - 在API.md中添加工具文档
   - 更新README.md
   - 添加使用示例

## 🎯 开发最佳实践

### 性能考虑

- 使用缓存减少重复计算
- 避免阻塞操作
- 合理使用异步编程
- 注意内存使用

### 安全考虑

- 验证所有输入参数
- 避免代码注入
- 不在日志中记录敏感信息
- 使用安全的依赖包

### 错误处理

- 使用统一的错误格式
- 提供有意义的错误信息
- 记录详细的错误日志
- 优雅地处理异常情况

### 国际化

- 所有用户可见的文本都要支持国际化
- 使用标准的i18n库
- 提供中英文双语支持

## 🏷️ 发布流程

### 版本管理

我们使用 [Semantic Versioning](https://semver.org/)：

- `MAJOR.MINOR.PATCH`
- MAJOR: 不兼容的API变更
- MINOR: 向后兼容的功能新增
- PATCH: 向后兼容的问题修正

### 发布步骤

1. **准备发布**
   ```bash
   # 更新版本号
   npm version patch|minor|major
   
   # 更新CHANGELOG
   npm run changelog
   ```

2. **创建发布PR**
   - 包含版本更新和CHANGELOG
   - 经过完整的测试和审查

3. **发布到NPM**
   ```bash
   npm publish
   ```

4. **创建GitHub Release**
   - 标记重要变更
   - 包含详细的发布说明

## 📞 获取帮助

如果您在贡献过程中遇到任何问题，可以通过以下方式获取帮助：

- 💬 [GitHub Discussions](https://github.com/chinese-naming/mcp-toolset/discussions)
- 📧 邮箱：dev@chinese-naming.com
- 🐛 [GitHub Issues](https://github.com/chinese-naming/mcp-toolset/issues)

## 🙏 致谢

感谢所有为项目做出贡献的开发者！您的每一个贡献都让这个项目变得更好。

### 贡献者列表

<!-- 这里会自动生成贡献者列表 -->

---

再次感谢您的贡献！让我们一起打造更好的中文起名工具集！ 🎉