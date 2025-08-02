# 中文起名MCP工具集

 🎯 **专业的中文起名工具集** - 基于传统文化与现代技术的智能姓名分析与生成系统

## 🌟 特性

### 核心工具
- **中文姓名生成器** - 基于传统文化和现代需求的智能起名
- **姓名含义分析器** - 深度解析姓名的文化内涵和象征意义
- **姓名重名检查器** - 评估姓名的独特性和重复风险

### 高级分析工具
- **八字分析器** - 传统命理学分析，五行配置优化
- **音韵分析器** - 姓名的音韵美感和发音流畅度分析
- **文化分析器** - 深度挖掘姓名的文化层次和历史渊源
- **诗词生成器** - 基于姓名创作各种形式的诗词
- **运势分析器** - 传统姓名学运势预测和建议
- **风水分析器** - 姓名的风水属性和影响分析
- **历史典故分析器** - 挖掘姓名中的历史典故和名人轶事

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/SiwuXue/chinese-naming-mcp-toolset.git
cd chinese-naming-mcp-toolset

# 安装依赖
npm install

# 运行项目
npm start
```

### MCP客户端配置

本工具集支持标准的MCP (Model Context Protocol) 协议，可以在支持MCP的客户端中使用。

#### Claude Desktop 配置

在 Claude Desktop 的配置文件中添加以下配置：

**Windows 配置路径：** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS 配置路径：** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "chinese-naming": {
      "command": "npx",
      "args": ["chinese-naming-mcp"]
    }
  }
}
```


#### 验证连接

配置完成后，重启客户端，你应该能看到以下10个中文起名工具：

- 🎯 **chinese-name-generator** - 中文姓名生成器
- 📖 **name-meaning-analyzer** - 姓名含义分析器
- 🔍 **name-collision-checker** - 姓名重名检查器
- ☯️ **name-bazi-analyzer** - 姓名八字分析器
- 🎵 **name-phonetic-analyzer** - 姓名音律分析器
- 🏛️ **name-cultural-analyzer** - 姓名文化分析器
- 📝 **name-poetry-generator** - 姓名诗词生成器
- 🔮 **name-fortune-analyzer** - 姓名运势分析器
- 🏔️ **name-fengshui-analyzer** - 姓名风水分析器
- 📚 **name-history-analyzer** - 姓名历史分析器

## 🔧 故障排除

如果遇到 "MCP error -32000: Connection closed" 错误，请参考 [故障排除指南](./MCP-TROUBLESHOOTING.md)。

### 快速诊断

运行测试脚本验证 MCP 服务器状态：

```bash
node test-mcp-connection.js
```

### 常见解决方案

1. **检查配置文件**：确保 `claude_desktop_config.json` 格式正确
2. **重启 Claude Desktop**：修改配置后必须完全重启
3. **验证环境**：确保 Node.js >= 14.0.0 和 npm 正常工作
4. **检查权限**：确保有足够的文件系统权限

### 基本使用

```bash
# 生成姓名
node index.js generate --surname 李 --gender male --style traditional

# 分析姓名
node index.js analyze --name 李明华 --depth detailed

# 检查重名
node index.js check-collision --name 王伟 --region beijing

# 八字分析
node index.js bazi-analyze --name 张三 --birth-year 1990 --birth-month 5 --birth-day 15 --birth-hour 14
```

### MCP客户端使用示例

在支持MCP的客户端中，你可以直接调用工具：

```
请帮我生成3个适合女孩的现代风格姓名，姓氏是"李"
```

```
请分析"王雅琪"这个名字的文化内涵和含义
```

```
请检查"张伟"这个名字的重名情况
```

```
请根据1990年5月15日上午10点的生辰八字，分析"李明华"这个名字的五行配置
```

## 📚 工具详解

### 1. 中文姓名生成器 (ChineseNameGenerator)

智能生成符合中文传统和现代审美的姓名。

**功能特点：**
- 支持传统、现代、诗意、五行等多种风格
- 可指定期望字符和避讳字符
- 自动计算拼音、笔画、含义和评分
- 提供详细的生成理由和文化背景

**使用示例：**
```javascript
const generator = new ChineseNameGenerator();
const result = await generator.execute({
  surname: '李',
  gender: 'male',
  style: 'traditional',
  desiredChars: ['明', '华'],
  avoidChars: ['病', '死'],
  count: 5
});
```

### 2. 姓名含义分析器 (NameMeaningAnalyzer)

深度分析姓名的文化内涵、字符含义和象征意义。

**分析维度：**
- 基础分析：字符含义、拼音、笔画
- 详细分析：文化内涵、象征意义、历史背景
- 综合分析：现代解读、教育价值、启发意义

### 3. 姓名重名检查器 (NameCollisionChecker)

评估姓名的独特性和在不同地区的重复情况。

**检查内容：**
- 重名频率估算
- 地区分布分析
- 独特性评分
- 风险等级评估
- 相似姓名推荐

### 4. 八字分析器 (NameBaziAnalyzer)

基于传统命理学的八字分析和姓名五行配置。

**分析要素：**
- 八字计算（年月日时）
- 五行属性分析
- 用神喜忌判断
- 姓名五行配置
- 运势预测和建议

### 5. 音韵分析器 (NamePhoneticAnalyzer)

分析姓名的音韵美感、声调搭配和发音流畅度。

**分析项目：**
- 声调组合分析
- 音韵和谐度
- 发音流畅度
- 音韵风格识别
- 地方口音适应性

### 6. 文化分析器 (NameCulturalAnalyzer)

深度挖掘姓名的文化层次、历史渊源和哲学内涵。

**文化维度：**
- 古典文化层次
- 哲学思想体现
- 历史文化背景
- 现代文化价值
- 跨文化理解

### 7. 诗词生成器 (NamePoetryGenerator)

基于姓名创作各种形式的诗词作品。

**诗词类型：**
- 藏头诗：姓名字符作为每句开头
- 嵌名诗：姓名自然嵌入诗句
- 回文诗：可正反读的诗句
- 拆字诗：基于字符结构的创作
- 主题诗：围绕姓名寓意的主题创作

### 8. 运势分析器 (NameFortuneAnalyzer)

基于传统姓名学的运势分析和人生预测。

**分析内容：**
- 五格数理计算
- 三才配置分析
- 各方面运势预测
- 人生阶段运势
- 改运建议

### 9. 风水分析器 (NameFengshuiAnalyzer)

分析姓名的风水属性和对个人运势的影响。

**风水要素：**
- 八卦属性分析
- 方位属性配置
- 风水格局评估
- 调理建议
- 应用指导

### 10. 历史典故分析器 (NameHistoryAnalyzer)

挖掘姓名中的历史典故、文化内涵和名人轶事。

**分析范围：**
- 历史名人关联
- 经典典故引用
- 文学作品渊源
- 文化符号意义
- 哲学思想体现

## 🛠️ 开发指南



### 添加新工具

1. 继承 `BaseTool` 类
2. 实现必要的方法：
   - `execute(params)` - 主要执行逻辑
   - `getParameterSchema()` - 参数模式定义
   - `getUsageExamples()` - 使用示例

```javascript
const BaseTool = require('../utils/base-tool');

class MyNewTool extends BaseTool {
  constructor() {
    super();
    this.name = 'my-new-tool';
    this.description = '我的新工具';
  }

  async execute(params) {
    // 实现工具逻辑
    return this.createResponse(true, '执行成功', result);
  }

  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        // 定义参数
      },
      required: []
    };
  }

  getUsageExamples() {
    return [
      {
        description: '示例描述',
        input: { /* 示例输入 */ }
      }
    ];
  }
}

module.exports = MyNewTool;
```

### 测试

```bash
# 运行所有测试
npm test

# 运行特定工具测试
npm run test:generator
npm run test:analyzer

# 代码覆盖率
npm run coverage
```

### 代码规范

```bash
# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📖 API 文档

### 通用响应格式

所有工具都返回统一的响应格式：

```javascript
{
  success: boolean,     // 执行是否成功
  message: string,      // 响应消息
  data: object,         // 结果数据
  timestamp: string,    // 时间戳
  toolName: string      // 工具名称
}
```

### 错误处理

当工具执行失败时，返回错误信息：

```javascript
{
  success: false,
  message: "错误描述",
  error: {
    code: "ERROR_CODE",
    details: "详细错误信息"
  },
  timestamp: "2024-01-01T00:00:00.000Z",
  toolName: "tool-name"
}
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢所有贡献者的努力
- 感谢中华传统文化的深厚底蕴
- 感谢开源社区的支持

## 📞 联系我们

- 项目主页: [GitHub](https://github.com/SiwuXue/chinese-naming-mcp-toolset)
- 问题反馈: [Issues](https://github.com/SiwuXue/chinese-naming-mcp-toolset/issues)
- 邮箱: 3488909960@qq.com

---

**注意**: 本工具集仅供参考和娱乐使用，不应作为人生重大决策的唯一依据。传统文化分析结果具有主观性，请理性对待。
