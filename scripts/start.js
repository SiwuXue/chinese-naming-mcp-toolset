#!/usr/bin/env node
/**
 * 中文起名MCP工具集 - 启动脚本
 * Chinese Naming MCP Toolset - Startup Script
 * 
 * 提供便捷的启动和管理功能
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

// 项目根目录
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json');
const ENV_EXAMPLE_PATH = path.join(PROJECT_ROOT, '.env.example');
const ENV_PATH = path.join(PROJECT_ROOT, '.env');
const CONFIG_DIR = path.join(PROJECT_ROOT, 'config');
const LOGS_DIR = path.join(PROJECT_ROOT, 'logs');

/**
 * 显示欢迎信息
 */
function showWelcome() {
  console.log(chalk.blue('🎯 中文起名MCP工具集'));
  console.log(chalk.blue('Chinese Naming MCP Toolset'));
  console.log(chalk.gray('='.repeat(50)));
  console.log();
}

/**
 * 检查项目依赖
 */
function checkDependencies() {
  console.log(chalk.yellow('📦 检查项目依赖...'));
  
  // 检查 package.json
  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    console.error(chalk.red('❌ 未找到 package.json 文件'));
    process.exit(1);
  }
  
  // 检查 node_modules
  const nodeModulesPath = path.join(PROJECT_ROOT, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(chalk.yellow('⚠️ 未找到 node_modules，正在安装依赖...'));
    return installDependencies();
  }
  
  console.log(chalk.green('✅ 依赖检查完成'));
  return Promise.resolve();
}

/**
 * 安装项目依赖
 */
function installDependencies() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('📥 正在安装项目依赖...'));
    
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const install = spawn(npm, ['install'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit'
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('✅ 依赖安装完成'));
        resolve();
      } else {
        console.error(chalk.red('❌ 依赖安装失败'));
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
    
    install.on('error', (error) => {
      console.error(chalk.red('❌ 依赖安装出错:'), error.message);
      reject(error);
    });
  });
}

/**
 * 初始化环境配置
 */
function initializeEnvironment() {
  console.log(chalk.yellow('⚙️ 初始化环境配置...'));
  
  // 创建必要的目录
  const directories = [CONFIG_DIR, LOGS_DIR];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.green(`✅ 创建目录: ${path.relative(PROJECT_ROOT, dir)}`));
    }
  });
  
  // 检查 .env 文件
  if (!fs.existsSync(ENV_PATH)) {
    if (fs.existsSync(ENV_EXAMPLE_PATH)) {
      fs.copyFileSync(ENV_EXAMPLE_PATH, ENV_PATH);
      console.log(chalk.green('✅ 创建 .env 配置文件'));
      console.log(chalk.yellow('💡 请根据需要修改 .env 文件中的配置'));
    } else {
      console.log(chalk.yellow('⚠️ 未找到 .env.example 文件'));
    }
  }
  
  console.log(chalk.green('✅ 环境初始化完成'));
}

/**
 * 运行测试
 */
function runTests() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('🧪 运行测试套件...'));
    
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const test = spawn(npm, ['test'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit'
    });
    
    test.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('✅ 所有测试通过'));
        resolve();
      } else {
        console.log(chalk.yellow('⚠️ 部分测试失败，但可以继续启动'));
        resolve(); // 测试失败不阻止启动
      }
    });
    
    test.on('error', (error) => {
      console.error(chalk.red('❌ 测试运行出错:'), error.message);
      resolve(); // 测试错误不阻止启动
    });
  });
}

/**
 * 启动开发服务器
 */
function startDevelopmentServer() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('🚀 启动开发服务器...'));
    
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const dev = spawn(npm, ['run', 'dev'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: true
    });
    
    dev.on('close', (code) => {
      console.log(chalk.yellow('🛑 开发服务器已停止'));
      resolve();
    });
    
    dev.on('error', (error) => {
      console.error(chalk.red('❌ 开发服务器启动失败:'), error.message);
      reject(error);
    });
    
    // 监听 Ctrl+C
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 正在停止开发服务器...'));
      dev.kill('SIGINT');
    });
  });
}

/**
 * 启动生产服务器
 */
function startProductionServer() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('🚀 启动生产服务器...'));
    
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const start = spawn(npm, ['start'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: true
    });
    
    start.on('close', (code) => {
      console.log(chalk.yellow('🛑 生产服务器已停止'));
      resolve();
    });
    
    start.on('error', (error) => {
      console.error(chalk.red('❌ 生产服务器启动失败:'), error.message);
      reject(error);
    });
    
    // 监听 Ctrl+C
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 正在停止生产服务器...'));
      start.kill('SIGINT');
    });
  });
}

/**
 * 运行CLI工具
 */
function runCLI() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('💻 启动CLI工具...'));
    
    const node = process.execPath;
    const cliPath = path.join(PROJECT_ROOT, 'bin', 'chinese-naming-cli.js');
    
    if (!fs.existsSync(cliPath)) {
      console.error(chalk.red('❌ 未找到CLI工具文件'));
      reject(new Error('CLI tool not found'));
      return;
    }
    
    const cli = spawn(node, [cliPath, 'interactive'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: true
    });
    
    cli.on('close', (code) => {
      console.log(chalk.yellow('🛑 CLI工具已退出'));
      resolve();
    });
    
    cli.on('error', (error) => {
      console.error(chalk.red('❌ CLI工具启动失败:'), error.message);
      reject(error);
    });
  });
}

/**
 * 运行示例
 */
function runExamples() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('📚 运行使用示例...'));
    
    const node = process.execPath;
    const examplesPath = path.join(PROJECT_ROOT, 'examples', 'usage-examples.js');
    
    if (!fs.existsSync(examplesPath)) {
      console.error(chalk.red('❌ 未找到使用示例文件'));
      reject(new Error('Examples file not found'));
      return;
    }
    
    const examples = spawn(node, [examplesPath], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: true
    });
    
    examples.on('close', (code) => {
      console.log(chalk.yellow('🛑 示例运行完成'));
      resolve();
    });
    
    examples.on('error', (error) => {
      console.error(chalk.red('❌ 示例运行失败:'), error.message);
      reject(error);
    });
  });
}

/**
 * 显示项目信息
 */
function showProjectInfo() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    
    console.log(chalk.blue('📋 项目信息'));
    console.log(chalk.gray('='.repeat(30)));
    console.log(`名称: ${chalk.cyan(packageJson.name)}`);
    console.log(`版本: ${chalk.cyan(packageJson.version)}`);
    console.log(`描述: ${chalk.gray(packageJson.description)}`);
    console.log(`作者: ${chalk.gray(packageJson.author)}`);
    console.log(`许可证: ${chalk.gray(packageJson.license)}`);
    
    if (packageJson.repository) {
      console.log(`仓库: ${chalk.gray(packageJson.repository.url || packageJson.repository)}`);
    }
    
    if (packageJson.homepage) {
      console.log(`主页: ${chalk.gray(packageJson.homepage)}`);
    }
    
    console.log();
    
    // 显示可用脚本
    if (packageJson.scripts) {
      console.log(chalk.blue('📜 可用脚本'));
      console.log(chalk.gray('='.repeat(30)));
      Object.entries(packageJson.scripts).forEach(([name, script]) => {
        console.log(`${chalk.cyan(name)}: ${chalk.gray(script)}`);
      });
      console.log();
    }
    
  } catch (error) {
    console.error(chalk.red('❌ 读取项目信息失败:'), error.message);
  }
}

/**
 * 检查系统要求
 */
function checkSystemRequirements() {
  console.log(chalk.yellow('🔍 检查系统要求...'));
  
  // 检查 Node.js 版本
  const nodeVersion = process.version;
  const requiredNodeVersion = '14.0.0';
  
  console.log(`Node.js 版本: ${chalk.cyan(nodeVersion)}`);
  
  if (nodeVersion < `v${requiredNodeVersion}`) {
    console.error(chalk.red(`❌ 需要 Node.js ${requiredNodeVersion} 或更高版本`));
    process.exit(1);
  }
  
  // 检查 npm 版本
  exec('npm --version', (error, stdout) => {
    if (error) {
      console.error(chalk.red('❌ 未找到 npm'));
    } else {
      console.log(`npm 版本: ${chalk.cyan(stdout.trim())}`);
    }
  });
  
  console.log(chalk.green('✅ 系统要求检查完成'));
}

/**
 * 主菜单
 */
async function showMainMenu() {
  const choices = [
    { name: '🚀 启动开发服务器', value: 'dev' },
    { name: '🏭 启动生产服务器', value: 'prod' },
    { name: '💻 运行CLI工具', value: 'cli' },
    { name: '📚 运行使用示例', value: 'examples' },
    { name: '🧪 运行测试', value: 'test' },
    { name: '📋 显示项目信息', value: 'info' },
    { name: '⚙️ 重新初始化环境', value: 'init' },
    { name: '❌ 退出', value: 'exit' }
  ];
  
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '请选择操作:',
      choices
    }
  ]);
  
  return action;
}

/**
 * 主函数
 */
async function main() {
  try {
    showWelcome();
    checkSystemRequirements();
    
    // 检查命令行参数
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
      const command = args[0];
      
      switch (command) {
        case 'dev':
        case 'development':
          await checkDependencies();
          initializeEnvironment();
          await startDevelopmentServer();
          break;
          
        case 'prod':
        case 'production':
          await checkDependencies();
          initializeEnvironment();
          await startProductionServer();
          break;
          
        case 'cli':
          await checkDependencies();
          initializeEnvironment();
          await runCLI();
          break;
          
        case 'examples':
          await checkDependencies();
          initializeEnvironment();
          await runExamples();
          break;
          
        case 'test':
          await checkDependencies();
          await runTests();
          break;
          
        case 'info':
          showProjectInfo();
          break;
          
        case 'init':
          await checkDependencies();
          initializeEnvironment();
          console.log(chalk.green('✅ 初始化完成'));
          break;
          
        case 'help':
        case '--help':
        case '-h':
          showHelp();
          break;
          
        default:
          console.error(chalk.red(`❌ 未知命令: ${command}`));
          showHelp();
          process.exit(1);
      }
    } else {
      // 交互式模式
      await checkDependencies();
      initializeEnvironment();
      
      while (true) {
        const action = await showMainMenu();
        
        if (action === 'exit') {
          console.log(chalk.green('👋 再见！'));
          break;
        }
        
        console.log();
        
        try {
          switch (action) {
            case 'dev':
              await startDevelopmentServer();
              break;
            case 'prod':
              await startProductionServer();
              break;
            case 'cli':
              await runCLI();
              break;
            case 'examples':
              await runExamples();
              break;
            case 'test':
              await runTests();
              break;
            case 'info':
              showProjectInfo();
              break;
            case 'init':
              initializeEnvironment();
              console.log(chalk.green('✅ 重新初始化完成'));
              break;
          }
        } catch (error) {
          console.error(chalk.red('❌ 操作失败:'), error.message);
        }
        
        console.log();
        
        // 询问是否继续
        const { continueAction } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continueAction',
            message: '是否继续其他操作?',
            default: true
          }
        ]);
        
        if (!continueAction) {
          console.log(chalk.green('👋 再见！'));
          break;
        }
      }
    }
    
  } catch (error) {
    console.error(chalk.red('❌ 启动失败:'), error.message);
    process.exit(1);
  }
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(chalk.blue('🎯 中文起名MCP工具集 - 启动脚本'));
  console.log();
  console.log(chalk.yellow('用法:'));
  console.log('  node scripts/start.js [command]');
  console.log();
  console.log(chalk.yellow('命令:'));
  console.log('  dev, development    启动开发服务器');
  console.log('  prod, production    启动生产服务器');
  console.log('  cli                 运行CLI工具');
  console.log('  examples            运行使用示例');
  console.log('  test                运行测试');
  console.log('  info                显示项目信息');
  console.log('  init                初始化环境');
  console.log('  help, --help, -h    显示帮助信息');
  console.log();
  console.log(chalk.yellow('示例:'));
  console.log('  node scripts/start.js dev      # 启动开发服务器');
  console.log('  node scripts/start.js cli      # 运行CLI工具');
  console.log('  node scripts/start.js          # 交互式模式');
  console.log();
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ 未处理的错误:'), error);
    process.exit(1);
  });
}

module.exports = {
  checkDependencies,
  installDependencies,
  initializeEnvironment,
  runTests,
  startDevelopmentServer,
  startProductionServer,
  runCLI,
  runExamples,
  showProjectInfo,
  checkSystemRequirements
};