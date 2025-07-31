#!/usr/bin/env node

/**
 * 中文起名MCP工具集 - 主入口文件
 * Chinese Naming MCP Toolset - Main Entry Point
 *
 * 提供统一的工具访问接口和便捷的使用方法
 * @version 1.0.0
 * @author Chinese Naming MCP Team
 */

const fs = require('fs');
const path = require('path');

// 读取package.json获取版本信息
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

// 基础工具导入
const ChineseNameGenerator = require('./src/tools/chinese-name-generator.tool.js');
const NameMeaningAnalyzer = require('./src/tools/name-meaning-analyzer.tool.js');
const NameCollisionChecker = require('./src/tools/name-collision-checker.tool.js');

// 高级工具导入
const NameBaziAnalyzer = require('./src/tools/advanced/name-bazi-analyzer.tool.js');
const NamePhoneticAnalyzer = require('./src/tools/advanced/name-phonetic-analyzer.tool.js');
const NameCulturalAnalyzer = require('./src/tools/advanced/name-cultural-analyzer.tool.js');
const NamePoetryGenerator = require('./src/tools/advanced/name-poetry-generator.tool.js');
const NameFortuneAnalyzer = require('./src/tools/advanced/name-fortune-analyzer.tool.js');
const NameFengshuiAnalyzer = require('./src/tools/advanced/name-fengshui-analyzer.tool.js');
const NameHistoryAnalyzer = require('./src/tools/advanced/name-history-analyzer.tool.js');

// 数据层导入
const CharacterData = require('./src/data/character-data');

// 工具注册表
const TOOLS = {
  // 基础工具
  'chinese-name-generator': ChineseNameGenerator,
  'name-meaning-analyzer': NameMeaningAnalyzer,
  'name-collision-checker': NameCollisionChecker,

  // 高级工具
  'name-bazi-analyzer': NameBaziAnalyzer,
  'name-phonetic-analyzer': NamePhoneticAnalyzer,
  'name-cultural-analyzer': NameCulturalAnalyzer,
  'name-poetry-generator': NamePoetryGenerator,
  'name-fortune-analyzer': NameFortuneAnalyzer,
  'name-fengshui-analyzer': NameFengshuiAnalyzer,
  'name-history-analyzer': NameHistoryAnalyzer
};

/**
 * 中文起名工具集主类
 * 提供统一的工具访问和管理接口
 */
class ChineseNamingToolset {
  constructor() {
    this.tools = new Map();
    this.characterData = new CharacterData();
    this.initialized = false;
  }

  /**
   * 初始化工具集
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      // 初始化字符数据
      await this.characterData.initialize();

      // 初始化所有工具
      for (const [name, ToolClass] of Object.entries(TOOLS)) {
        const tool = new ToolClass();
        await tool.initialize();
        this.tools.set(name, tool);
      }

      this.initialized = true;
      console.log('中文起名工具集初始化完成');
    } catch (error) {
      console.error('工具集初始化失败:', error);
      throw error;
    }
  }

  /**
   * 获取工具实例
   * @param {string} toolName - 工具名称
   * @returns {Object} 工具实例
   */
  getTool(toolName) {
    if (!this.initialized) {
      throw new Error('工具集尚未初始化，请先调用 initialize() 方法');
    }

    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`未找到工具: ${toolName}`);
    }

    return tool;
  }

  /**
   * 获取所有可用工具列表
   * @returns {Array<string>} 工具名称列表
   */
  getAvailableTools() {
    return Array.from(this.tools.keys());
  }

  /**
   * 执行工具
   * @param {string} toolName - 工具名称
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 执行结果
   */
  async execute(toolName, params) {
    const tool = this.getTool(toolName);
    return await tool.execute(params);
  }

  /**
   * 获取工具的参数模式
   * @param {string} toolName - 工具名称
   * @returns {Object} 参数模式
   */
  getToolSchema(toolName) {
    const tool = this.getTool(toolName);
    return tool.getParameterSchema();
  }

  /**
   * 获取工具的使用示例
   * @param {string} toolName - 工具名称
   * @returns {Array} 使用示例
   */
  getToolExamples(toolName) {
    const tool = this.getTool(toolName);
    return tool.getUsageExamples();
  }

  /**
   * 获取工具集统计信息
   * @returns {Object} 统计信息
   */
  getStatistics() {
    return {
      totalTools: this.tools.size,
      basicTools: 3,
      advancedTools: 7,
      initialized: this.initialized,
      characterDataLoaded: this.characterData.isInitialized(),
      version: packageJson.version
    };
  }
}

/**
 * 便捷函数：创建并初始化工具集实例
 * @returns {Promise<ChineseNamingToolset>} 初始化后的工具集实例
 */
async function createToolset() {
  const toolset = new ChineseNamingToolset();
  await toolset.initialize();
  return toolset;
}

/**
 * MCP工具执行器
 * @param {string} toolName - 工具名称
 * @param {object} params - 工具参数
 * @returns {Promise<object>} 执行结果
 */
async function executeTool(toolName, params = {}) {
  try {
    const toolset = await createToolset();
    return await toolset.execute(toolName, params);
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
      timestamp: new Date().toISOString(),
      toolName,
      error: {
        code: 'EXECUTION_ERROR',
        details: error.message
      }
    };
  }
}

/**
 * 获取所有可用工具列表
 * @returns {object} 工具列表和描述
 */
async function getAvailableTools() {
  try {
    const toolset = await createToolset();
    const toolNames = toolset.getAvailableTools();
    const toolList = {};

    for (const name of toolNames) {
      const tool = toolset.getTool(name);
      toolList[name] = {
        name,
        description: tool.description || '暂无描述',
        category: tool.category || '未分类',
        parameters: tool.getParameterSchema(),
        examples: tool.getUsageExamples()
      };
    }

    return {
      version: packageJson.version,
      description: packageJson.description,
      totalTools: toolNames.length,
      tools: toolList
    };
  } catch (error) {
    return {
      version: packageJson.version,
      description: packageJson.description,
      totalTools: 0,
      tools: {},
      error: error.message
    };
  }
}

/**
 * 主函数 - 命令行接口
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
🎯 中文起名MCP工具集 v${packageJson.version}`);
    console.log('='.repeat(50));
    console.log('\n📋 可用命令:');
    console.log('  --list, -l     显示所有可用工具');
    console.log('  --tool <name>  执行指定工具');
    console.log('  --help, -h     显示帮助信息');
    console.log('\n📖 使用示例:');
    console.log('  node index.js --list');
    console.log('  node index.js --tool chinese-name-generator');
    console.log('');
    return;
  }

  if (args[0] === '--list' || args[0] === '-l') {
    const availableTools = await getAvailableTools();
    console.log(`\n🛠️  可用工具 (${availableTools.totalTools}个):`);
    console.log('='.repeat(50));

    for (const [name, tool] of Object.entries(availableTools.tools)) {
      console.log(`\n📌 ${name}`);
      console.log(`   类别: ${tool.category}`);
      console.log(`   描述: ${tool.description}`);
    }
    console.log('');
    return;
  }

  if (args[0] === '--tool' && args[1]) {
    const toolName = args[1];
    console.log(`\n🚀 执行工具: ${toolName}`);
    console.log('='.repeat(30));

    // 这里可以添加交互式参数输入
    // 目前先显示工具信息
    const availableTools = await getAvailableTools();
    const tool = availableTools.tools[toolName];

    if (!tool) {
      console.error(`❌ 工具 '${toolName}' 不存在`);
      return;
    }

    console.log(`\n📋 工具信息:`);
    console.log(`   名称: ${tool.name}`);
    console.log(`   类别: ${tool.category}`);
    console.log(`   描述: ${tool.description}`);
    console.log(`\n📝 参数说明:`);
    console.log(JSON.stringify(tool.parameters, null, 2));
    console.log('');
    return;
  }

  console.error('❌ 无效的命令参数，使用 --help 查看帮助');
}

/**
 * MCP协议处理器
 * 处理标准输入输出的MCP消息
 */
class MCPHandler {
  constructor() {
    this.toolset = null;
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      this.toolset = await createToolset();
      this.initialized = true;
    }
  }

  /**
   * 处理MCP请求
   * @param {object} request - MCP请求对象
   * @returns {object} MCP响应对象
   */
  async handleRequest(request) {
    try {
      await this.initialize();

      switch (request.method) {
        case 'initialize':
          return this.handleInitialize(request);

        case 'tools/list':
          return await this.handleToolsList(request);

        case 'tools/call':
          return await this.handleToolsCall(request);

        default:
          return {
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32601,
              message: `Method not found: ${request.method}`
            }
          };
      }
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32603,
          message: 'Internal error',
          data: error.message
        }
      };
    }
  }

  /**
   * 处理初始化请求
   */
  handleInitialize(request) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'chinese-naming-mcp-toolset',
          version: packageJson.version
        }
      }
    };
  }

  /**
   * 处理工具列表请求
   */
  async handleToolsList(request) {
    const toolNames = this.toolset.getAvailableTools();
    const tools = [];

    for (const name of toolNames) {
      const tool = this.toolset.getTool(name);
      tools.push({
        name,
        description: tool.description || '暂无描述',
        inputSchema: tool.getParameterSchema()
      });
    }

    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        tools
      }
    };
  }

  /**
   * 处理工具调用请求
   */
  async handleToolsCall(request) {
    const { name, arguments: args } = request.params;

    try {
      const result = await this.toolset.execute(name, args || {});

      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        }
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32603,
          message: 'Tool execution failed',
          data: error.message
        }
      };
    }
  }
}

/**
 * 启动MCP服务器
 * 监听stdin/stdout进行MCP协议通信
 */
async function startMCPServer() {
  const handler = new MCPHandler();

  // 监听标准输入
  process.stdin.setEncoding('utf8');

  let buffer = '';

  process.stdin.on('data', async (chunk) => {
    buffer += chunk;

    // 处理完整的JSON-RPC消息
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // 保留不完整的行

    for (const line of lines) {
      if (line.trim()) {
        try {
          const request = JSON.parse(line);
          const response = await handler.handleRequest(request);

          // 输出响应到stdout
          process.stdout.write(JSON.stringify(response) + '\n');
        } catch (error) {
          // 输出错误响应
          const errorResponse = {
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32700,
              message: 'Parse error',
              data: error.message
            }
          };
          process.stdout.write(JSON.stringify(errorResponse) + '\n');
        }
      }
    }
  });

  process.stdin.on('end', () => {
    process.exit(0);
  });

  // 处理进程信号
  process.on('SIGINT', () => {
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    process.exit(0);
  });
}

// 检查是否通过MCP协议启动
const isMCPMode = process.argv.includes('--mcp') ||
                  process.env.MCP_MODE === 'true' ||
                  (!process.stdout.isTTY && process.argv.length === 2);

// 如果直接运行此文件
if (require.main === module) {
  if (isMCPMode) {
    // MCP模式：启动stdio服务器
    startMCPServer().catch(console.error);
  } else {
    // 命令行模式：执行主函数
    main().catch(console.error);
  }
}

// 导出主要类和函数
module.exports = {
  // 主要类
  ChineseNamingToolset,

  // 工具类
  ChineseNameGenerator,
  NameMeaningAnalyzer,
  NameCollisionChecker,
  NameBaziAnalyzer,
  NamePhoneticAnalyzer,
  NameCulturalAnalyzer,
  NamePoetryGenerator,
  NameFortuneAnalyzer,
  NameFengshuiAnalyzer,
  NameHistoryAnalyzer,

  // 数据类
  CharacterData,

  // 便捷函数
  createToolset,
  executeTool,
  getAvailableTools,

  // 工具注册表
  TOOLS,

  // 版本信息
  version: packageJson.version
};

// 默认导出工具集类
module.exports.default = ChineseNamingToolset;
