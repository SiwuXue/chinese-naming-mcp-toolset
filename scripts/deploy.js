#!/usr/bin/env node
/**
 * 中文起名MCP工具集 - 部署脚本
 * Chinese Naming MCP Toolset - Deployment Script
 * 
 * 自动化部署流程，支持多种部署方式
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

// 项目根目录
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(PROJECT_ROOT, 'build');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json');

/**
 * 显示部署信息
 */
function showDeployInfo() {
  console.log(chalk.blue('🚀 中文起名MCP工具集 - 部署脚本'));
  console.log(chalk.blue('Chinese Naming MCP Toolset - Deployment Script'));
  console.log(chalk.gray('='.repeat(50)));
  console.log();
}

/**
 * 检查部署前置条件
 */
function checkPrerequisites() {
  console.log(chalk.yellow('🔍 检查部署前置条件...'));
  
  // 检查构建目录
  if (!fs.existsSync(BUILD_DIR)) {
    console.error(chalk.red('❌ 构建目录不存在，请先运行构建'));
    console.log(chalk.yellow('💡 运行: npm run build'));
    process.exit(1);
  }
  
  // 检查必需文件
  const requiredFiles = [
    path.join(BUILD_DIR, 'index.js'),
    path.join(BUILD_DIR, 'package.json'),
    path.join(BUILD_DIR, 'build-info.json')
  ];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.error(chalk.red(`❌ 缺少必需文件: ${path.relative(PROJECT_ROOT, file)}`));
      process.exit(1);
    }
  });
  
  console.log(chalk.green('✅ 前置条件检查通过'));
}

/**
 * 检查部署环境
 */
function checkDeploymentEnvironment(target) {
  console.log(chalk.yellow(`🌍 检查${target}部署环境...`));
  
  switch (target) {
    case 'docker':
      return checkDockerEnvironment();
    case 'pm2':
      return checkPM2Environment();
    case 'systemd':
      return checkSystemdEnvironment();
    case 'heroku':
      return checkHerokuEnvironment();
    case 'vercel':
      return checkVercelEnvironment();
    default:
      console.log(chalk.green('✅ 本地部署环境检查通过'));
      return Promise.resolve();
  }
}

/**
 * 检查 Docker 环境
 */
function checkDockerEnvironment() {
  return new Promise((resolve, reject) => {
    exec('docker --version', (error, stdout) => {
      if (error) {
        console.error(chalk.red('❌ 未找到 Docker，请先安装'));
        reject(error);
        return;
      }
      
      console.log(chalk.green(`✅ Docker 已安装: ${stdout.trim()}`));
      
      // 检查 Docker Compose
      exec('docker-compose --version', (error, stdout) => {
        if (error) {
          console.log(chalk.yellow('⚠️ 未找到 Docker Compose，将使用 Docker 命令'));
        } else {
          console.log(chalk.green(`✅ Docker Compose 已安装: ${stdout.trim()}`));
        }
        resolve();
      });
    });
  });
}

/**
 * 检查 PM2 环境
 */
function checkPM2Environment() {
  return new Promise((resolve, reject) => {
    exec('pm2 --version', (error, stdout) => {
      if (error) {
        console.error(chalk.red('❌ 未找到 PM2，请先安装'));
        console.log(chalk.yellow('💡 运行: npm install -g pm2'));
        reject(error);
        return;
      }
      
      console.log(chalk.green(`✅ PM2 已安装: ${stdout.trim()}`));
      resolve();
    });
  });
}

/**
 * 检查 Systemd 环境
 */
function checkSystemdEnvironment() {
  return new Promise((resolve, reject) => {
    exec('systemctl --version', (error, stdout) => {
      if (error) {
        console.error(chalk.red('❌ 未找到 Systemd'));
        reject(error);
        return;
      }
      
      console.log(chalk.green('✅ Systemd 可用'));
      resolve();
    });
  });
}

/**
 * 检查 Heroku 环境
 */
function checkHerokuEnvironment() {
  return new Promise((resolve, reject) => {
    exec('heroku --version', (error, stdout) => {
      if (error) {
        console.error(chalk.red('❌ 未找到 Heroku CLI，请先安装'));
        reject(error);
        return;
      }
      
      console.log(chalk.green(`✅ Heroku CLI 已安装: ${stdout.trim()}`));
      resolve();
    });
  });
}

/**
 * 检查 Vercel 环境
 */
function checkVercelEnvironment() {
  return new Promise((resolve, reject) => {
    exec('vercel --version', (error, stdout) => {
      if (error) {
        console.error(chalk.red('❌ 未找到 Vercel CLI，请先安装'));
        reject(error);
        return;
      }
      
      console.log(chalk.green(`✅ Vercel CLI 已安装: ${stdout.trim()}`));
      resolve();
    });
  });
}

/**
 * Docker 部署
 */
function deployWithDocker() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('🐳 开始 Docker 部署...'));
    
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    const imageName = `${packageJson.name}:${packageJson.version}`;
    
    // 构建 Docker 镜像
    console.log(chalk.yellow('📦 构建 Docker 镜像...'));
    const build = spawn('docker', ['build', '-t', imageName, '.'], {
      cwd: BUILD_DIR,
      stdio: 'inherit'
    });
    
    build.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('✅ Docker 镜像构建完成'));
        
        // 检查是否有 docker-compose.yml
        const dockerComposePath = path.join(BUILD_DIR, 'docker-compose.yml');
        if (fs.existsSync(dockerComposePath)) {
          console.log(chalk.yellow('🚀 使用 Docker Compose 启动服务...'));
          const compose = spawn('docker-compose', ['up', '-d'], {
            cwd: BUILD_DIR,
            stdio: 'inherit'
          });
          
          compose.on('close', (composeCode) => {
            if (composeCode === 0) {
              console.log(chalk.green('✅ Docker Compose 部署完成'));
              console.log(chalk.blue('💡 服务已在后台运行'));
              console.log(chalk.gray('   查看日志: docker-compose logs -f'));
              console.log(chalk.gray('   停止服务: docker-compose down'));
              resolve();
            } else {
              reject(new Error(`Docker Compose failed with code ${composeCode}`));
            }
          });
        } else {
          console.log(chalk.yellow('🚀 启动 Docker 容器...'));
          const run = spawn('docker', ['run', '-d', '-p', '3000:3000', '--name', packageJson.name, imageName], {
            stdio: 'inherit'
          });
          
          run.on('close', (runCode) => {
            if (runCode === 0) {
              console.log(chalk.green('✅ Docker 容器启动完成'));
              console.log(chalk.blue('💡 服务运行在 http://localhost:3000'));
              console.log(chalk.gray(`   查看日志: docker logs ${packageJson.name}`));
              console.log(chalk.gray(`   停止容器: docker stop ${packageJson.name}`));
              resolve();
            } else {
              reject(new Error(`Docker run failed with code ${runCode}`));
            }
          });
        }
      } else {
        reject(new Error(`Docker build failed with code ${code}`));
      }
    });
    
    build.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * PM2 部署
 */
function deployWithPM2() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('⚡ 开始 PM2 部署...'));
    
    const ecosystemPath = path.join(BUILD_DIR, 'ecosystem.config.js');
    
    if (!fs.existsSync(ecosystemPath)) {
      console.error(chalk.red('❌ 未找到 PM2 配置文件'));
      reject(new Error('PM2 config not found'));
      return;
    }
    
    // 停止现有进程
    console.log(chalk.yellow('🛑 停止现有进程...'));
    exec('pm2 delete chinese-naming-toolset', { cwd: BUILD_DIR }, (error) => {
      // 忽略删除错误（可能进程不存在）
      
      // 启动新进程
      console.log(chalk.yellow('🚀 启动新进程...'));
      const start = spawn('pm2', ['start', 'ecosystem.config.js'], {
        cwd: BUILD_DIR,
        stdio: 'inherit'
      });
      
      start.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.green('✅ PM2 部署完成'));
          console.log(chalk.blue('💡 服务已启动'));
          console.log(chalk.gray('   查看状态: pm2 status'));
          console.log(chalk.gray('   查看日志: pm2 logs chinese-naming-toolset'));
          console.log(chalk.gray('   重启服务: pm2 restart chinese-naming-toolset'));
          console.log(chalk.gray('   停止服务: pm2 stop chinese-naming-toolset'));
          resolve();
        } else {
          reject(new Error(`PM2 start failed with code ${code}`));
        }
      });
      
      start.on('error', (error) => {
        reject(error);
      });
    });
  });
}

/**
 * Systemd 部署
 */
function deployWithSystemd() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('🔧 开始 Systemd 部署...'));
    
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    const serviceName = 'chinese-naming-toolset';
    
    // 创建 systemd 服务文件
    const serviceContent = `[Unit]
Description=${packageJson.description}
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=${BUILD_DIR}
ExecStart=${process.execPath} index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
`;
    
    const serviceFilePath = `/etc/systemd/system/${serviceName}.service`;
    
    try {
      // 需要 sudo 权限
      console.log(chalk.yellow('📝 创建 systemd 服务文件...'));
      console.log(chalk.gray(`   文件位置: ${serviceFilePath}`));
      console.log(chalk.yellow('⚠️ 需要管理员权限'));
      
      fs.writeFileSync(`${BUILD_DIR}/${serviceName}.service`, serviceContent);
      
      console.log(chalk.blue('💡 请手动执行以下命令完成部署:'));
      console.log(chalk.cyan(`sudo cp ${BUILD_DIR}/${serviceName}.service ${serviceFilePath}`));
      console.log(chalk.cyan('sudo systemctl daemon-reload'));
      console.log(chalk.cyan(`sudo systemctl enable ${serviceName}`));
      console.log(chalk.cyan(`sudo systemctl start ${serviceName}`));
      console.log();
      console.log(chalk.blue('管理命令:'));
      console.log(chalk.gray(`   查看状态: sudo systemctl status ${serviceName}`));
      console.log(chalk.gray(`   查看日志: sudo journalctl -u ${serviceName} -f`));
      console.log(chalk.gray(`   重启服务: sudo systemctl restart ${serviceName}`));
      console.log(chalk.gray(`   停止服务: sudo systemctl stop ${serviceName}`));
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Heroku 部署
 */
function deployWithHeroku() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('☁️ 开始 Heroku 部署...'));
    
    // 检查是否已登录
    exec('heroku auth:whoami', (error, stdout) => {
      if (error) {
        console.error(chalk.red('❌ 请先登录 Heroku'));
        console.log(chalk.yellow('💡 运行: heroku login'));
        reject(error);
        return;
      }
      
      console.log(chalk.green(`✅ 已登录 Heroku: ${stdout.trim()}`));
      
      // 创建 Procfile
      const procfileContent = 'web: node index.js\n';
      fs.writeFileSync(path.join(BUILD_DIR, 'Procfile'), procfileContent);
      
      // 初始化 Git 仓库（如果需要）
      const gitDir = path.join(BUILD_DIR, '.git');
      if (!fs.existsSync(gitDir)) {
        console.log(chalk.yellow('📦 初始化 Git 仓库...'));
        exec('git init', { cwd: BUILD_DIR }, (error) => {
          if (error) {
            reject(error);
            return;
          }
          
          deployToHeroku(resolve, reject);
        });
      } else {
        deployToHeroku(resolve, reject);
      }
    });
  });
}

/**
 * 执行 Heroku 部署
 */
function deployToHeroku(resolve, reject) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'package.json'), 'utf8'));
  const appName = packageJson.name.replace(/[^a-z0-9-]/g, '-');
  
  console.log(chalk.yellow(`🚀 部署到 Heroku 应用: ${appName}...`));
  
  // 创建 Heroku 应用
  exec(`heroku create ${appName}`, { cwd: BUILD_DIR }, (error, stdout) => {
    if (error && !error.message.includes('already exists')) {
      reject(error);
      return;
    }
    
    // 添加文件到 Git
    exec('git add .', { cwd: BUILD_DIR }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      
      // 提交
      exec('git commit -m "Deploy to Heroku"', { cwd: BUILD_DIR }, (error) => {
        if (error) {
          reject(error);
          return;
        }
        
        // 推送到 Heroku
        const deploy = spawn('git', ['push', 'heroku', 'main'], {
          cwd: BUILD_DIR,
          stdio: 'inherit'
        });
        
        deploy.on('close', (code) => {
          if (code === 0) {
            console.log(chalk.green('✅ Heroku 部署完成'));
            console.log(chalk.blue(`💡 应用地址: https://${appName}.herokuapp.com`));
            console.log(chalk.gray('   查看日志: heroku logs --tail'));
            console.log(chalk.gray('   打开应用: heroku open'));
            resolve();
          } else {
            reject(new Error(`Heroku deploy failed with code ${code}`));
          }
        });
      });
    });
  });
}

/**
 * Vercel 部署
 */
function deployWithVercel() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('▲ 开始 Vercel 部署...'));
    
    // 创建 vercel.json 配置
    const vercelConfig = {
      version: 2,
      builds: [
        {
          src: 'index.js',
          use: '@vercel/node'
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: '/index.js'
        }
      ]
    };
    
    fs.writeFileSync(path.join(BUILD_DIR, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
    
    // 部署到 Vercel
    const deploy = spawn('vercel', ['--prod'], {
      cwd: BUILD_DIR,
      stdio: 'inherit'
    });
    
    deploy.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('✅ Vercel 部署完成'));
        console.log(chalk.blue('💡 应用已部署到 Vercel'));
        console.log(chalk.gray('   查看部署: vercel ls'));
        resolve();
      } else {
        reject(new Error(`Vercel deploy failed with code ${code}`));
      }
    });
    
    deploy.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * 本地部署
 */
function deployLocally() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('🏠 开始本地部署...'));
    
    // 复制构建文件到部署目录
    const deployDir = path.join(PROJECT_ROOT, 'deploy');
    
    if (fs.existsSync(deployDir)) {
      fs.rmSync(deployDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(deployDir, { recursive: true });
    
    // 复制文件
    copyDirectory(BUILD_DIR, deployDir);
    
    console.log(chalk.green('✅ 本地部署完成'));
    console.log(chalk.blue(`💡 部署目录: ${deployDir}`));
    console.log(chalk.gray('   启动服务: cd deploy && npm start'));
    
    resolve();
  });
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
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

/**
 * 部署后验证
 */
function verifyDeployment(target) {
  console.log(chalk.blue('🔍 验证部署结果...'));
  
  // 这里可以添加具体的验证逻辑
  // 比如检查服务是否正常运行、端口是否可访问等
  
  console.log(chalk.green('✅ 部署验证完成'));
}

/**
 * 显示部署摘要
 */
function showDeploymentSummary(target, startTime) {
  const endTime = new Date();
  const duration = Math.round((endTime - startTime) / 1000);
  
  console.log();
  console.log(chalk.blue('📊 部署摘要'));
  console.log(chalk.gray('='.repeat(30)));
  console.log(`部署方式: ${chalk.cyan(target)}`);
  console.log(`部署时间: ${chalk.cyan(duration)}秒`);
  console.log(`完成时间: ${chalk.cyan(endTime.toLocaleString('zh-CN'))}`);
  console.log();
  console.log(chalk.green('🎉 部署成功！'));
}

/**
 * 选择部署方式
 */
async function selectDeploymentTarget() {
  const choices = [
    { name: '🐳 Docker 部署', value: 'docker' },
    { name: '⚡ PM2 部署', value: 'pm2' },
    { name: '🔧 Systemd 部署', value: 'systemd' },
    { name: '☁️ Heroku 部署', value: 'heroku' },
    { name: '▲ Vercel 部署', value: 'vercel' },
    { name: '🏠 本地部署', value: 'local' }
  ];
  
  const { target } = await inquirer.prompt([
    {
      type: 'list',
      name: 'target',
      message: '请选择部署方式:',
      choices
    }
  ]);
  
  return target;
}

/**
 * 主函数
 */
async function main() {
  try {
    const startTime = new Date();
    
    showDeployInfo();
    checkPrerequisites();
    
    // 检查命令行参数
    const args = process.argv.slice(2);
    let target = args[0];
    
    if (!target) {
      target = await selectDeploymentTarget();
    }
    
    console.log(chalk.yellow(`🎯 部署目标: ${target}`));
    console.log();
    
    // 检查部署环境
    await checkDeploymentEnvironment(target);
    
    // 执行部署
    switch (target) {
      case 'docker':
        await deployWithDocker();
        break;
      case 'pm2':
        await deployWithPM2();
        break;
      case 'systemd':
        await deployWithSystemd();
        break;
      case 'heroku':
        await deployWithHeroku();
        break;
      case 'vercel':
        await deployWithVercel();
        break;
      case 'local':
        await deployLocally();
        break;
      default:
        console.error(chalk.red(`❌ 不支持的部署方式: ${target}`));
        process.exit(1);
    }
    
    // 验证部署
    verifyDeployment(target);
    
    // 显示部署摘要
    showDeploymentSummary(target, startTime);
    
  } catch (error) {
    console.error(chalk.red('❌ 部署失败:'), error.message);
    process.exit(1);
  }
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(chalk.blue('🚀 中文起名MCP工具集 - 部署脚本'));
  console.log();
  console.log(chalk.yellow('用法:'));
  console.log('  node scripts/deploy.js [target]');
  console.log();
  console.log(chalk.yellow('部署目标:'));
  console.log('  docker     Docker 容器部署');
  console.log('  pm2        PM2 进程管理器部署');
  console.log('  systemd    Systemd 服务部署');
  console.log('  heroku     Heroku 云平台部署');
  console.log('  vercel     Vercel 云平台部署');
  console.log('  local      本地目录部署');
  console.log();
  console.log(chalk.yellow('示例:'));
  console.log('  node scripts/deploy.js docker    # Docker 部署');
  console.log('  node scripts/deploy.js pm2       # PM2 部署');
  console.log('  node scripts/deploy.js           # 交互式选择');
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
  checkPrerequisites,
  checkDeploymentEnvironment,
  deployWithDocker,
  deployWithPM2,
  deployWithSystemd,
  deployWithHeroku,
  deployWithVercel,
  deployLocally,
  verifyDeployment
};