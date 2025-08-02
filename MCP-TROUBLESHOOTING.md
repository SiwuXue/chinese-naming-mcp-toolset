# MCP 连接故障排除指南

## 🔍 问题诊断

如果您遇到 "MCP error -32000: Connection closed" 错误，请按照以下步骤进行排查：

## ✅ 1. 验证 MCP 服务器状态

首先运行我们提供的测试脚本：

```bash
node test-mcp-connection.js
```

如果看到 "🎉 所有测试通过! MCP服务器工作正常"，说明服务器本身没有问题。

## ⚙️ 2. 检查 Claude Desktop 配置

### 配置文件位置

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### 正确的配置内容

将以下内容复制到您的 `claude_desktop_config.json` 文件中：

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

### 配置验证

1. **检查 JSON 格式**：确保配置文件是有效的 JSON 格式
2. **检查路径**：确保 `npx` 命令在系统 PATH 中可用
3. **检查权限**：确保 Claude Desktop 有权限访问配置文件

## 🔄 3. 重启 Claude Desktop

**重要**：修改配置后必须完全重启 Claude Desktop：

1. 完全关闭 Claude Desktop
2. 等待几秒钟
3. 重新启动 Claude Desktop

## 🛠️ 4. 环境检查

### 检查 Node.js 和 npm

```bash
# 检查 Node.js 版本（需要 >= 14.0.0）
node --version

# 检查 npm 版本
npm --version

# 检查 npx 是否可用
npx --version
```

### 检查包安装

```bash
# 检查包是否已安装
npm list -g chinese-naming-mcp

# 或者直接测试
npx chinese-naming-mcp --help
```

## 🐛 5. 常见问题解决

### 问题 1: "command not found: npx"

**解决方案**：
```bash
# 重新安装 npm
npm install -g npm@latest

# 或者使用完整路径
{
  "mcpServers": {
    "chinese-naming": {
      "command": "node",
      "args": ["-e", "require('child_process').spawn('npx', ['chinese-naming-mcp'], {stdio: 'inherit'})"]
    }
  }
}
```

### 问题 2: 权限错误

**Windows 解决方案**：
```bash
# 以管理员身份运行 PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**macOS/Linux 解决方案**：
```bash
# 检查文件权限
ls -la ~/.config/Claude/claude_desktop_config.json

# 修复权限
chmod 644 ~/.config/Claude/claude_desktop_config.json
```

### 问题 3: 网络问题

如果 `npx` 下载失败，可以预先安装：

```bash
# 全局安装
npm install -g chinese-naming-mcp

# 然后修改配置为
{
  "mcpServers": {
    "chinese-naming": {
      "command": "chinese-naming-mcp"
    }
  }
}
```

## 📋 6. 高级诊断

### 启用详细日志

创建一个包装脚本来捕获详细日志：

**debug-mcp.js**:
```javascript
#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');

const logFile = 'mcp-debug.log';
const child = spawn('npx', ['chinese-naming-mcp'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

child.stdout.on('data', (data) => {
  fs.appendFileSync(logFile, `STDOUT: ${data}`);
  process.stdout.write(data);
});

child.stderr.on('data', (data) => {
  fs.appendFileSync(logFile, `STDERR: ${data}`);
  process.stderr.write(data);
});

child.stdin.on('data', (data) => {
  fs.appendFileSync(logFile, `STDIN: ${data}`);
  child.stdin.write(data);
});

process.stdin.pipe(child.stdin);
```

然后在配置中使用：
```json
{
  "mcpServers": {
    "chinese-naming": {
      "command": "node",
      "args": ["debug-mcp.js"]
    }
  }
}
```

## 📞 7. 获取帮助

如果以上步骤都无法解决问题，请提供以下信息：

1. 操作系统版本
2. Node.js 版本 (`node --version`)
3. npm 版本 (`npm --version`)
4. Claude Desktop 版本
5. 完整的错误消息
6. `test-mcp-connection.js` 的输出结果
7. `mcp-debug.log` 文件内容（如果使用了调试脚本）

## ✨ 验证成功

配置成功后，您应该能够在 Claude Desktop 中看到以下工具：

- 🎯 **chinese-name-generator** - 中文姓名生成器
- 📖 **name-meaning-analyzer** - 姓名含义分析
- 🔍 **name-collision-checker** - 姓名重复检查
- ⚖️ **name-bazi-analyzer** - 八字分析
- 🎵 **name-phonetic-analyzer** - 音律分析
- 🏛️ **name-cultural-analyzer** - 文化分析
- 📝 **name-poetry-generator** - 诗词生成
- 🔮 **name-fortune-analyzer** - 运势分析
- 🏠 **name-fengshui-analyzer** - 风水分析
- 📚 **name-history-analyzer** - 历史典故分析

现在您可以开始使用这些强大的中文起名工具了！