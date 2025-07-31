#!/usr/bin/env node
/**
 * 中文起名MCP工具集 - 构建脚本
 * Chinese Naming MCP Toolset - Build Script
 * 
 * 用于项目打包、优化和部署准备
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const chalk = require('chalk');
const archiver = require('archiver');

// 项目根目录
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json');
const BUILD_DIR = path.join(PROJECT_ROOT, 'build');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const TEMP_DIR = path.join(PROJECT_ROOT, '.temp');

/**
 * 显示构建信息
 */
function showBuildInfo() {
  console.log(chalk.blue('🔨 中文起名MCP工具集 - 构建脚本'));
  console.log(chalk.blue('Chinese Naming MCP Toolset - Build Script'));
  console.log(chalk.gray('='.repeat(50)));
  console.log();
}

/**
 * 清理构建目录
 */
function cleanBuildDirectories() {
  console.log(chalk.yellow('🧹 清理构建目录...'));
  
  const dirsToClean = [BUILD_DIR, DIST_DIR, TEMP_DIR];
  
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(chalk.green(`✅ 清理: ${path.relative(PROJECT_ROOT, dir)}`));
    }
  });
  
  // 重新创建目录
  dirsToClean.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
  
  console.log(chalk.green('✅ 构建目录清理完成'));
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
        console.error(chalk.red('❌ 测试失败'));
        reject(new Error(`Tests failed with code ${code}`));
      }
    });
    
    test.on('error', (error) => {
      console.error(chalk.red('❌ 测试运行出错:'), error.message);
      reject(error);
    });
  });
}

/**
 * 代码质量检查
 */
function runLinting() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('🔍 运行代码质量检查...'));
    
    // 检查是否有 ESLint 配置
    const eslintConfigFiles = [
      '.eslintrc.js',
      '.eslintrc.json',
      '.eslintrc.yml',
      '.eslintrc.yaml'
    ];
    
    const hasEslintConfig = eslintConfigFiles.some(file => 
      fs.existsSync(path.join(PROJECT_ROOT, file))
    );
    
    if (!hasEslintConfig) {
      console.log(chalk.yellow('⚠️ 未找到ESLint配置，跳过代码检查'));
      resolve();
      return;
    }
    
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const lint = spawn(npm, ['run', 'lint'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit'
    });
    
    lint.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('✅ 代码质量检查通过'));
        resolve();
      } else {
        console.log(chalk.yellow('⚠️ 代码质量检查有警告，但继续构建'));
        resolve(); // 不阻止构建
      }
    });
    
    lint.on('error', (error) => {
      console.log(chalk.yellow('⚠️ 代码质量检查失败，但继续构建'));
      resolve(); // 不阻止构建
    });
  });
}

/**
 * 复制源文件
 */
function copySourceFiles() {
  console.log(chalk.blue('📁 复制源文件...'));
  
  const filesToCopy = [
    'index.js',
    'package.json',
    'README.md',
    'LICENSE',
    'API.md'
  ];
  
  const directoriesToCopy = [
    'src',
    'lib',
    'tools',
    'config',
    'bin',
    'examples'
  ];
  
  // 复制文件
  filesToCopy.forEach(file => {
    const srcPath = path.join(PROJECT_ROOT, file);
    const destPath = path.join(BUILD_DIR, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(chalk.green(`✅ 复制文件: ${file}`));
    }
  });
  
  // 复制目录
  directoriesToCopy.forEach(dir => {
    const srcPath = path.join(PROJECT_ROOT, dir);
    const destPath = path.join(BUILD_DIR, dir);
    
    if (fs.existsSync(srcPath)) {
      copyDirectory(srcPath, destPath);
      console.log(chalk.green(`✅ 复制目录: ${dir}`));
    }
  });
  
  console.log(chalk.green('✅ 源文件复制完成'));
}

/**
 * 递归复制目录
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      // 跳过某些目录
      if (['node_modules', '.git', 'test', 'tests', '.temp', 'build', 'dist'].includes(item)) {
        return;
      }
      copyDirectory(srcPath, destPath);
    } else {
      // 跳过某些文件
      if (item.startsWith('.') && !item.startsWith('.env')) {
        return;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

/**
 * 优化 package.json
 */
function optimizePackageJson() {
  console.log(chalk.blue('📦 优化 package.json...'));
  
  const packageJsonPath = path.join(BUILD_DIR, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // 移除开发依赖
  delete packageJson.devDependencies;
  
  // 移除构建脚本
  if (packageJson.scripts) {
    const scriptsToKeep = ['start', 'postinstall'];
    const newScripts = {};
    
    scriptsToKeep.forEach(script => {
      if (packageJson.scripts[script]) {
        newScripts[script] = packageJson.scripts[script];
      }
    });
    
    packageJson.scripts = newScripts;
  }
  
  // 添加构建信息
  packageJson.buildInfo = {
    buildTime: new Date().toISOString(),
    buildVersion: packageJson.version,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(chalk.green('✅ package.json 优化完成'));
}

/**
 * 生成构建信息文件
 */
function generateBuildInfo() {
  console.log(chalk.blue('📋 生成构建信息...'));
  
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  
  const buildInfo = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    buildTime: new Date().toISOString(),
    buildDate: new Date().toLocaleDateString('zh-CN'),
    nodeVersion: process.version,
    npmVersion: null, // 将通过异步获取
    platform: process.platform,
    arch: process.arch,
    environment: process.env.NODE_ENV || 'production',
    gitCommit: null, // 将通过异步获取
    gitBranch: null, // 将通过异步获取
    buildSize: null, // 将在打包后计算
    files: {
      total: 0,
      js: 0,
      json: 0,
      md: 0,
      other: 0
    }
  };
  
  // 统计文件信息
  const countFiles = (dir, info = { total: 0, js: 0, json: 0, md: 0, other: 0 }) => {
    if (!fs.existsSync(dir)) return info;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.git', '.temp'].includes(item)) {
          countFiles(itemPath, info);
        }
      } else {
        info.total++;
        const ext = path.extname(item).toLowerCase();
        
        switch (ext) {
          case '.js':
            info.js++;
            break;
          case '.json':
            info.json++;
            break;
          case '.md':
            info.md++;
            break;
          default:
            info.other++;
        }
      }
    });
    
    return info;
  };
  
  buildInfo.files = countFiles(BUILD_DIR);
  
  // 获取 Git 信息
  return new Promise((resolve) => {
    exec('git rev-parse HEAD', { cwd: PROJECT_ROOT }, (error, stdout) => {
      if (!error) {
        buildInfo.gitCommit = stdout.trim();
      }
      
      exec('git rev-parse --abbrev-ref HEAD', { cwd: PROJECT_ROOT }, (error, stdout) => {
        if (!error) {
          buildInfo.gitBranch = stdout.trim();
        }
        
        exec('npm --version', (error, stdout) => {
          if (!error) {
            buildInfo.npmVersion = stdout.trim();
          }
          
          // 写入构建信息文件
          const buildInfoPath = path.join(BUILD_DIR, 'build-info.json');
          fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
          
          console.log(chalk.green('✅ 构建信息生成完成'));
          console.log(chalk.gray(`   版本: ${buildInfo.version}`));
          console.log(chalk.gray(`   构建时间: ${buildInfo.buildDate}`));
          console.log(chalk.gray(`   文件总数: ${buildInfo.files.total}`));
          
          if (buildInfo.gitCommit) {
            console.log(chalk.gray(`   Git提交: ${buildInfo.gitCommit.substring(0, 8)}`));
          }
          
          if (buildInfo.gitBranch) {
            console.log(chalk.gray(`   Git分支: ${buildInfo.gitBranch}`));
          }
          
          resolve(buildInfo);
        });
      });
    });
  });
}

/**
 * 创建分发包
 */
function createDistributionPackage(buildInfo) {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('📦 创建分发包...'));
    
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    const archiveName = `${packageJson.name}-v${packageJson.version}.tar.gz`;
    const archivePath = path.join(DIST_DIR, archiveName);
    
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('tar', {
      gzip: true,
      gzipOptions: {
        level: 9
      }
    });
    
    output.on('close', () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(chalk.green(`✅ 分发包创建完成: ${archiveName}`));
      console.log(chalk.gray(`   大小: ${sizeInMB} MB`));
      
      // 更新构建信息中的包大小
      buildInfo.buildSize = `${sizeInMB} MB`;
      const buildInfoPath = path.join(BUILD_DIR, 'build-info.json');
      fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
      
      resolve(archivePath);
    });
    
    output.on('error', (error) => {
      console.error(chalk.red('❌ 分发包创建失败:'), error.message);
      reject(error);
    });
    
    archive.on('error', (error) => {
      console.error(chalk.red('❌ 压缩失败:'), error.message);
      reject(error);
    });
    
    archive.pipe(output);
    
    // 添加构建目录中的所有文件
    archive.directory(BUILD_DIR, false);
    
    archive.finalize();
  });
}

/**
 * 生成部署脚本
 */
function generateDeploymentScripts() {
  console.log(chalk.blue('🚀 生成部署脚本...'));
  
  // Docker 部署脚本
  const dockerfileContent = `# 中文起名MCP工具集 Docker镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json
COPY package.json ./

# 安装依赖
RUN npm install --production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["npm", "start"]
`;
  
  fs.writeFileSync(path.join(BUILD_DIR, 'Dockerfile'), dockerfileContent);
  
  // Docker Compose 配置
  const dockerComposeContent = `version: '3.8'

services:
  chinese-naming-toolset:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
      - ./config:/app/config
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
`;
  
  fs.writeFileSync(path.join(BUILD_DIR, 'docker-compose.yml'), dockerComposeContent);
  
  // PM2 配置
  const pm2Config = {
    apps: [{
      name: 'chinese-naming-toolset',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }]
  };
  
  fs.writeFileSync(path.join(BUILD_DIR, 'ecosystem.config.js'), 
    `module.exports = ${JSON.stringify(pm2Config, null, 2)};`);
  
  // 部署脚本
  const deployScript = `#!/bin/bash
# 中文起名MCP工具集部署脚本

set -e

echo "🚀 开始部署中文起名MCP工具集..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未找到 npm，请先安装"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install --production

# 创建必要目录
mkdir -p logs
mkdir -p config

# 复制配置文件
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ 创建 .env 配置文件"
        echo "💡 请根据需要修改 .env 文件中的配置"
    fi
fi

# 设置权限
chmod +x bin/chinese-naming-cli.js

echo "✅ 部署完成！"
echo "💡 使用以下命令启动服务："
echo "   npm start                    # 直接启动"
echo "   pm2 start ecosystem.config.js # 使用 PM2 启动"
echo "   docker-compose up -d         # 使用 Docker 启动"
`;
  
  fs.writeFileSync(path.join(BUILD_DIR, 'deploy.sh'), deployScript);
  
  // Windows 部署脚本
  const deployBat = `@echo off
REM 中文起名MCP工具集部署脚本 (Windows)

echo 🚀 开始部署中文起名MCP工具集...

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Node.js，请先安装
    exit /b 1
)

REM 检查 npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 npm，请先安装
    exit /b 1
)

REM 安装依赖
echo 📦 安装依赖...
npm install --production

REM 创建必要目录
if not exist "logs" mkdir logs
if not exist "config" mkdir config

REM 复制配置文件
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ✅ 创建 .env 配置文件
        echo 💡 请根据需要修改 .env 文件中的配置
    )
)

echo ✅ 部署完成！
echo 💡 使用以下命令启动服务：
echo    npm start                    # 直接启动
echo    pm2 start ecosystem.config.js # 使用 PM2 启动

pause
`;
  
  fs.writeFileSync(path.join(BUILD_DIR, 'deploy.bat'), deployBat);
  
  console.log(chalk.green('✅ 部署脚本生成完成'));
  console.log(chalk.gray('   - Dockerfile'));
  console.log(chalk.gray('   - docker-compose.yml'));
  console.log(chalk.gray('   - ecosystem.config.js (PM2)'));
  console.log(chalk.gray('   - deploy.sh (Linux/macOS)'));
  console.log(chalk.gray('   - deploy.bat (Windows)'));
}

/**
 * 验证构建结果
 */
function validateBuild() {
  console.log(chalk.blue('🔍 验证构建结果...'));
  
  const requiredFiles = [
    'index.js',
    'package.json',
    'build-info.json'
  ];
  
  const requiredDirs = [
    'tools',
    'config'
  ];
  
  let isValid = true;
  
  // 检查必需文件
  requiredFiles.forEach(file => {
    const filePath = path.join(BUILD_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`❌ 缺少必需文件: ${file}`));
      isValid = false;
    } else {
      console.log(chalk.green(`✅ 文件存在: ${file}`));
    }
  });
  
  // 检查必需目录
  requiredDirs.forEach(dir => {
    const dirPath = path.join(BUILD_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      console.error(chalk.red(`❌ 缺少必需目录: ${dir}`));
      isValid = false;
    } else {
      console.log(chalk.green(`✅ 目录存在: ${dir}`));
    }
  });
  
  // 检查 package.json 格式
  try {
    const packageJsonPath = path.join(BUILD_DIR, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.name || !packageJson.version) {
      console.error(chalk.red('❌ package.json 缺少必需字段'));
      isValid = false;
    } else {
      console.log(chalk.green('✅ package.json 格式正确'));
    }
  } catch (error) {
    console.error(chalk.red('❌ package.json 格式错误:'), error.message);
    isValid = false;
  }
  
  if (isValid) {
    console.log(chalk.green('✅ 构建验证通过'));
  } else {
    throw new Error('构建验证失败');
  }
  
  return isValid;
}

/**
 * 显示构建摘要
 */
function showBuildSummary(buildInfo, archivePath) {
  console.log();
  console.log(chalk.blue('📊 构建摘要'));
  console.log(chalk.gray('='.repeat(40)));
  console.log(`项目名称: ${chalk.cyan(buildInfo.name)}`);
  console.log(`版本: ${chalk.cyan(buildInfo.version)}`);
  console.log(`构建时间: ${chalk.cyan(buildInfo.buildDate)}`);
  console.log(`Node.js版本: ${chalk.cyan(buildInfo.nodeVersion)}`);
  console.log(`平台: ${chalk.cyan(buildInfo.platform)} (${buildInfo.arch})`);
  
  if (buildInfo.gitBranch) {
    console.log(`Git分支: ${chalk.cyan(buildInfo.gitBranch)}`);
  }
  
  if (buildInfo.gitCommit) {
    console.log(`Git提交: ${chalk.cyan(buildInfo.gitCommit.substring(0, 8))}`);
  }
  
  console.log(`文件统计:`);
  console.log(`  总计: ${chalk.cyan(buildInfo.files.total)}`);
  console.log(`  JavaScript: ${chalk.cyan(buildInfo.files.js)}`);
  console.log(`  JSON: ${chalk.cyan(buildInfo.files.json)}`);
  console.log(`  Markdown: ${chalk.cyan(buildInfo.files.md)}`);
  console.log(`  其他: ${chalk.cyan(buildInfo.files.other)}`);
  
  if (buildInfo.buildSize) {
    console.log(`包大小: ${chalk.cyan(buildInfo.buildSize)}`);
  }
  
  console.log();
  console.log(chalk.blue('📁 输出目录:'));
  console.log(`构建目录: ${chalk.cyan(path.relative(PROJECT_ROOT, BUILD_DIR))}`);
  console.log(`分发目录: ${chalk.cyan(path.relative(PROJECT_ROOT, DIST_DIR))}`);
  
  if (archivePath) {
    console.log(`分发包: ${chalk.cyan(path.relative(PROJECT_ROOT, archivePath))}`);
  }
  
  console.log();
  console.log(chalk.green('🎉 构建完成！'));
}

/**
 * 主函数
 */
async function main() {
  try {
    showBuildInfo();
    
    // 检查命令行参数
    const args = process.argv.slice(2);
    const skipTests = args.includes('--skip-tests');
    const skipLint = args.includes('--skip-lint');
    const skipPackage = args.includes('--skip-package');
    
    console.log(chalk.yellow('🔧 构建配置:'));
    console.log(`跳过测试: ${skipTests ? chalk.red('是') : chalk.green('否')}`);
    console.log(`跳过代码检查: ${skipLint ? chalk.red('是') : chalk.green('否')}`);
    console.log(`跳过打包: ${skipPackage ? chalk.red('是') : chalk.green('否')}`);
    console.log();
    
    // 1. 清理构建目录
    cleanBuildDirectories();
    
    // 2. 运行测试（可选）
    if (!skipTests) {
      await runTests();
    }
    
    // 3. 代码质量检查（可选）
    if (!skipLint) {
      await runLinting();
    }
    
    // 4. 复制源文件
    copySourceFiles();
    
    // 5. 优化 package.json
    optimizePackageJson();
    
    // 6. 生成构建信息
    const buildInfo = await generateBuildInfo();
    
    // 7. 生成部署脚本
    generateDeploymentScripts();
    
    // 8. 验证构建结果
    validateBuild();
    
    // 9. 创建分发包（可选）
    let archivePath = null;
    if (!skipPackage) {
      archivePath = await createDistributionPackage(buildInfo);
    }
    
    // 10. 显示构建摘要
    showBuildSummary(buildInfo, archivePath);
    
  } catch (error) {
    console.error(chalk.red('❌ 构建失败:'), error.message);
    process.exit(1);
  }
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(chalk.blue('🔨 中文起名MCP工具集 - 构建脚本'));
  console.log();
  console.log(chalk.yellow('用法:'));
  console.log('  node scripts/build.js [options]');
  console.log();
  console.log(chalk.yellow('选项:'));
  console.log('  --skip-tests     跳过测试');
  console.log('  --skip-lint      跳过代码质量检查');
  console.log('  --skip-package   跳过分发包创建');
  console.log('  --help, -h       显示帮助信息');
  console.log();
  console.log(chalk.yellow('示例:'));
  console.log('  node scripts/build.js                    # 完整构建');
  console.log('  node scripts/build.js --skip-tests       # 跳过测试的构建');
  console.log('  node scripts/build.js --skip-package     # 不创建分发包');
  console.log();
}

// 检查帮助参数
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
  process.exit(0);
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ 未处理的错误:'), error);
    process.exit(1);
  });
}

module.exports = {
  cleanBuildDirectories,
  runTests,
  runLinting,
  copySourceFiles,
  optimizePackageJson,
  generateBuildInfo,
  createDistributionPackage,
  generateDeploymentScripts,
  validateBuild,
  showBuildSummary
};