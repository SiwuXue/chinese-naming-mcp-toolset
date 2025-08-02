#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

console.log('🎋 Chinese Naming MCP Toolset');
console.log('=============================');
console.log('');
console.log('这是一个 MCP (Model Context Protocol) 服务包，不是传统的命令行工具。');
console.log('');
console.log('📋 使用方法：');
console.log('1. 安装包：npm install chinese-naming-mcp');
console.log('2. 在 Claude Desktop 配置文件中添加：');
console.log('');
console.log('   {');
console.log('     "mcpServers": {');
console.log('       "chinese-naming": {');
console.log('         "command": "node",');
console.log('         "args": ["./node_modules/chinese-naming-mcp/index.js"]');
console.log('       }');
console.log('     }');
console.log('   }');
console.log('');
console.log('3. 重启 Claude Desktop 即可使用');
console.log('');
console.log('🛠️  包含工具：');
console.log('• 中文姓名生成器');
console.log('• 姓名含义分析器');
console.log('• 姓名重名检查器');
console.log('• 八字分析器');
console.log('• 语音分析器');
console.log('• 文化内涵分析器');
console.log('• 诗词起名器');
console.log('• 运势分析器');
console.log('• 风水分析器');
console.log('• 历史文化分析器');
console.log('');
console.log('📖 详细文档：https://github.com/SiwuXue/chinese-naming-mcp-toolset');
console.log('');

// 检查是否有参数
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('💡 帮助信息：');
  console.log('  --help, -h     显示帮助信息');
  console.log('  --version, -v  显示版本信息');
  console.log('  --config       显示配置示例');
  console.log('  --test         运行 MCP 服务测试');
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  const packageJson = require('../package.json');
  console.log(`版本：${packageJson.version}`);
  process.exit(0);
}

if (args.includes('--config')) {
  console.log('📝 Claude Desktop 配置示例：');
  console.log('');
  console.log('Windows: %APPDATA%\\Claude\\claude_desktop_config.json');
  console.log('macOS: ~/Library/Application Support/Claude/claude_desktop_config.json');
  console.log('');
  console.log('配置内容：');
  console.log(JSON.stringify({
    mcpServers: {
      "chinese-naming": {
        command: "node",
        args: ["./node_modules/chinese-naming-mcp/index.js"]
      }
    }
  }, null, 2));
  process.exit(0);
}

if (args.includes('--test')) {
  console.log('🧪 启动 MCP 服务测试...');
  try {
    require('../index.js');
  } catch (error) {
    console.error('❌ 测试失败：', error.message);
    process.exit(1);
  }
  process.exit(0);
}

console.log('💡 使用 --help 查看更多选项');