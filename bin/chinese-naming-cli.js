#!/usr/bin/env node
/**
 * 中文起名MCP工具集 - 命令行界面
 * Chinese Naming MCP Toolset - Command Line Interface
 * 
 * 提供便捷的命令行访问接口
 * @version 1.0.0
 */

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { createToolset } = require('../index');
const packageInfo = require('../package.json');

// 设置程序信息
program
  .name('chinese-naming')
  .description('中文起名MCP工具集 - 专业的中文姓名生成与分析工具')
  .version(packageInfo.version);

/**
 * 格式化输出结果
 */
function formatOutput(result, toolName) {
  if (!result.success) {
    console.log(chalk.red('❌ 执行失败:'), result.message);
    return;
  }

  console.log(chalk.green('✅ 执行成功'));
  console.log(chalk.blue('📊 结果数据:'));
  
  // 根据工具类型格式化输出
  switch (toolName) {
    case 'chinese-name-generator':
      formatNameGeneratorOutput(result.data);
      break;
    case 'name-meaning-analyzer':
      formatMeaningAnalyzerOutput(result.data);
      break;
    case 'name-collision-checker':
      formatCollisionCheckerOutput(result.data);
      break;
    case 'name-bazi-analyzer':
      formatBaziAnalyzerOutput(result.data);
      break;
    default:
      console.log(JSON.stringify(result.data, null, 2));
  }
}

/**
 * 格式化姓名生成器输出
 */
function formatNameGeneratorOutput(data) {
  if (data.names && data.names.length > 0) {
    console.log(chalk.yellow('\n🎯 生成的姓名:'));
    data.names.forEach((name, index) => {
      console.log(`\n${index + 1}. ${chalk.bold(name.fullName)}`);
      console.log(`   评分: ${chalk.cyan(name.score)}/100`);
      console.log(`   含义: ${name.meaning}`);
      if (name.reason) {
        console.log(`   理由: ${chalk.gray(name.reason)}`);
      }
    });
  }
  
  if (data.statistics) {
    console.log(chalk.yellow('\n📈 统计信息:'));
    console.log(`   平均评分: ${data.statistics.averageScore}`);
    console.log(`   最高评分: ${data.statistics.maxScore}`);
    console.log(`   生成耗时: ${data.statistics.generationTime}ms`);
  }
}

/**
 * 格式化含义分析器输出
 */
function formatMeaningAnalyzerOutput(data) {
  console.log(chalk.yellow(`\n🔍 姓名分析: ${chalk.bold(data.name)}`));
  
  if (data.overall) {
    console.log(`\n整体含义: ${data.overall.meaning}`);
    console.log(`综合评分: ${chalk.cyan(data.overall.score)}/100`);
  }
  
  if (data.characters && data.characters.length > 0) {
    console.log(chalk.yellow('\n📝 字符分析:'));
    data.characters.forEach((char, index) => {
      console.log(`\n${index + 1}. ${chalk.bold(char.character)}`);
      console.log(`   含义: ${char.meaning}`);
      console.log(`   拼音: ${char.pinyin}`);
      console.log(`   笔画: ${char.strokes}`);
      if (char.wuxing) {
        console.log(`   五行: ${char.wuxing}`);
      }
    });
  }
  
  if (data.culturalConnotation) {
    console.log(chalk.yellow('\n🏛️ 文化内涵:'));
    console.log(`   传统文化: ${data.culturalConnotation.traditional}`);
    console.log(`   现代文化: ${data.culturalConnotation.modern}`);
  }
}

/**
 * 格式化重名检查器输出
 */
function formatCollisionCheckerOutput(data) {
  console.log(chalk.yellow(`\n🔍 重名检查: ${chalk.bold(data.name)}`));
  
  console.log(`\n重名风险: ${getCollisionRiskColor(data.collisionRisk)}`);
  console.log(`预估重名人数: ${chalk.cyan(data.estimatedCount)}`);
  console.log(`独特性评分: ${chalk.cyan(data.uniquenessScore)}/100`);
  
  if (data.similarNames && data.similarNames.length > 0) {
    console.log(chalk.yellow('\n👥 相似姓名:'));
    data.similarNames.slice(0, 5).forEach((similar, index) => {
      console.log(`   ${index + 1}. ${similar.name} (相似度: ${similar.similarity}%)`);
    });
  }
  
  if (data.recommendations) {
    console.log(chalk.yellow('\n💡 建议:'));
    console.log(`   ${data.recommendations.advice}`);
    if (data.recommendations.alternatives.length > 0) {
      console.log(`   替代方案: ${data.recommendations.alternatives.join(', ')}`);
    }
  }
}

/**
 * 格式化八字分析器输出
 */
function formatBaziAnalyzerOutput(data) {
  console.log(chalk.yellow(`\n🔮 八字分析: ${chalk.bold(data.name)}`));
  
  if (data.bazi) {
    console.log(`\n日主: ${chalk.cyan(data.bazi.dayMaster)}`);
    console.log(`八字: ${data.bazi.year} ${data.bazi.month} ${data.bazi.day} ${data.bazi.hour}`);
  }
  
  if (data.compatibility) {
    console.log(`\n配合度评分: ${chalk.cyan(data.compatibility.score)}/100`);
    console.log(`配合分析: ${data.compatibility.analysis}`);
  }
  
  if (data.wuxingBalance) {
    console.log(chalk.yellow('\n⚖️ 五行平衡:'));
    Object.entries(data.wuxingBalance.elements).forEach(([element, strength]) => {
      console.log(`   ${element}: ${getWuxingStrengthColor(strength)}`);
    });
    console.log(`   平衡度: ${data.wuxingBalance.balance}`);
  }
}

/**
 * 获取重名风险颜色
 */
function getCollisionRiskColor(risk) {
  switch (risk) {
    case 'very_low': return chalk.green('极低');
    case 'low': return chalk.green('低');
    case 'medium': return chalk.yellow('中等');
    case 'high': return chalk.red('高');
    case 'very_high': return chalk.red('极高');
    default: return risk;
  }
}

/**
 * 获取五行强度颜色
 */
function getWuxingStrengthColor(strength) {
  switch (strength) {
    case 'very_weak': return chalk.red('极弱');
    case 'weak': return chalk.yellow('弱');
    case 'normal': return chalk.green('正常');
    case 'strong': return chalk.cyan('强');
    case 'very_strong': return chalk.blue('极强');
    default: return strength;
  }
}

/**
 * 姓名生成命令
 */
program
  .command('generate')
  .alias('gen')
  .description('生成中文姓名')
  .option('-s, --surname <surname>', '姓氏')
  .option('-g, --gender <gender>', '性别 (male/female)', 'male')
  .option('-t, --style <style>', '风格 (traditional/modern/poetic)', 'traditional')
  .option('-c, --count <count>', '生成数量', '3')
  .option('-r, --reason', '包含生成理由')
  .action(async (options) => {
    try {
      const toolset = await createToolset();
      
      // 如果没有提供姓氏，提示用户输入
      if (!options.surname) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'surname',
            message: '请输入姓氏:',
            validate: (input) => input.trim() !== '' || '姓氏不能为空'
          }
        ]);
        options.surname = answers.surname;
      }
      
      const params = {
        surname: options.surname,
        gender: options.gender,
        style: options.style,
        count: parseInt(options.count),
        includeReason: options.reason
      };
      
      console.log(chalk.blue('🎯 正在生成姓名...'));
      const result = await toolset.execute('chinese-name-generator', params);
      formatOutput(result, 'chinese-name-generator');
      
    } catch (error) {
      console.error(chalk.red('❌ 执行错误:'), error.message);
    }
  });

/**
 * 姓名分析命令
 */
program
  .command('analyze')
  .alias('ana')
  .description('分析姓名含义')
  .option('-n, --name <name>', '姓名')
  .option('-d, --depth <depth>', '分析深度 (basic/detailed/comprehensive)', 'basic')
  .option('-w, --wuxing', '包含五行分析')
  .option('-p, --pronunciation', '包含发音分析')
  .action(async (options) => {
    try {
      const toolset = await createToolset();
      
      // 如果没有提供姓名，提示用户输入
      if (!options.name) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: '请输入要分析的姓名:',
            validate: (input) => input.trim() !== '' || '姓名不能为空'
          }
        ]);
        options.name = answers.name;
      }
      
      const params = {
        name: options.name,
        depth: options.depth,
        includeWuxing: options.wuxing,
        includePronunciation: options.pronunciation
      };
      
      console.log(chalk.blue('🔍 正在分析姓名...'));
      
      // 执行工具
      const result = await toolset.execute('name-meaning-analyzer', params);
      formatOutput(result, 'name-meaning-analyzer');
      
    } catch (error) {
      console.error(chalk.red('❌ 执行错误:'), error.message);
    }
  });

/**
 * 重名检查命令
 */
program
  .command('check')
  .description('检查姓名重名情况')
  .option('-n, --name <name>', '姓名')
  .option('-r, --region <region>', '地区 (national/provincial/city)', 'national')
  .option('-a, --age <age>', '年龄组 (如: 20-30)')
  .option('-s, --similar', '包含相似姓名')
  .action(async (options) => {
    try {
      const toolset = await createToolset();
      
      // 如果没有提供姓名，提示用户输入
      if (!options.name) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: '请输入要检查的姓名:',
            validate: (input) => input.trim() !== '' || '姓名不能为空'
          }
        ]);
        options.name = answers.name;
      }
      
      const params = {
        name: options.name,
        region: options.region,
        includeSimilar: options.similar
      };
      
      if (options.age) {
        params.ageGroup = options.age;
      }
      
      console.log(chalk.blue('🔍 正在检查重名情况...'));
      const result = await toolset.execute('name-collision-checker', params);
      formatOutput(result, 'name-collision-checker');
      
    } catch (error) {
      console.error(chalk.red('❌ 执行错误:'), error.message);
    }
  });

/**
 * 八字分析命令
 */
program
  .command('bazi')
  .description('八字姓名分析')
  .option('-n, --name <name>', '姓名')
  .option('-y, --year <year>', '出生年份')
  .option('-m, --month <month>', '出生月份')
  .option('-d, --day <day>', '出生日期')
  .option('-h, --hour <hour>', '出生时辰')
  .option('-g, --gender <gender>', '性别 (male/female)')
  .action(async (options) => {
    try {
      const toolset = await createToolset();
      
      // 收集缺失的参数
      const questions = [];
      
      if (!options.name) {
        questions.push({
          type: 'input',
          name: 'name',
          message: '请输入姓名:',
          validate: (input) => input.trim() !== '' || '姓名不能为空'
        });
      }
      
      if (!options.year) {
        questions.push({
          type: 'input',
          name: 'year',
          message: '请输入出生年份:',
          validate: (input) => {
            const year = parseInt(input);
            return (year >= 1900 && year <= 2100) || '请输入有效的年份 (1900-2100)';
          }
        });
      }
      
      if (!options.month) {
        questions.push({
          type: 'input',
          name: 'month',
          message: '请输入出生月份 (1-12):',
          validate: (input) => {
            const month = parseInt(input);
            return (month >= 1 && month <= 12) || '请输入有效的月份 (1-12)';
          }
        });
      }
      
      if (!options.day) {
        questions.push({
          type: 'input',
          name: 'day',
          message: '请输入出生日期 (1-31):',
          validate: (input) => {
            const day = parseInt(input);
            return (day >= 1 && day <= 31) || '请输入有效的日期 (1-31)';
          }
        });
      }
      
      if (!options.hour) {
        questions.push({
          type: 'input',
          name: 'hour',
          message: '请输入出生时辰 (0-23):',
          validate: (input) => {
            const hour = parseInt(input);
            return (hour >= 0 && hour <= 23) || '请输入有效的时辰 (0-23)';
          }
        });
      }
      
      if (questions.length > 0) {
        const answers = await inquirer.prompt(questions);
        Object.assign(options, answers);
      }
      
      const params = {
        name: options.name,
        birthYear: parseInt(options.year),
        birthMonth: parseInt(options.month),
        birthDay: parseInt(options.day),
        birthHour: parseInt(options.hour),
        depth: 'detailed'
      };
      
      if (options.gender) {
        params.gender = options.gender;
      }
      
      console.log(chalk.blue('🔮 正在进行八字分析...'));
      const result = await toolset.execute('name-bazi-analyzer', params);
      formatOutput(result, 'name-bazi-analyzer');
      
    } catch (error) {
      console.error(chalk.red('❌ 执行错误:'), error.message);
    }
  });

/**
 * 工具列表命令
 */
program
  .command('tools')
  .description('显示所有可用工具')
  .action(async () => {
    try {
      const toolset = await createToolset();
      const tools = toolset.getAvailableTools();
      const stats = toolset.getStatistics();
      
      console.log(chalk.blue('🛠️ 中文起名MCP工具集'));
      console.log(chalk.gray(`版本: ${stats.version}`));
      console.log(chalk.gray(`总工具数: ${stats.totalTools}`));
      console.log();
      
      console.log(chalk.yellow('📋 可用工具:'));
      tools.forEach((tool, index) => {
        const schema = toolset.getToolSchema(tool);
        console.log(`\n${index + 1}. ${chalk.bold(tool)}`);
        if (schema && schema.description) {
          console.log(`   ${chalk.gray(schema.description)}`);
        }
      });
      
    } catch (error) {
      console.error(chalk.red('❌ 执行错误:'), error.message);
    }
  });

/**
 * 交互式模式命令
 */
program
  .command('interactive')
  .alias('i')
  .description('进入交互式模式')
  .action(async () => {
    try {
      const toolset = await createToolset();
      const tools = toolset.getAvailableTools();
      
      console.log(chalk.blue('🎯 中文起名MCP工具集 - 交互式模式'));
      console.log(chalk.gray('输入 "exit" 退出'));
      console.log();
      
      while (true) {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: '请选择操作:',
            choices: [
              { name: '🎯 生成姓名', value: 'generate' },
              { name: '🔍 分析姓名', value: 'analyze' },
              { name: '👥 检查重名', value: 'check' },
              { name: '🔮 八字分析', value: 'bazi' },
              { name: '🛠️ 查看工具', value: 'tools' },
              { name: '❌ 退出', value: 'exit' }
            ]
          }
        ]);
        
        if (action === 'exit') {
          console.log(chalk.green('👋 再见！'));
          break;
        }
        
        // 根据选择执行相应的操作
        switch (action) {
          case 'generate':
            await executeInteractiveGenerate(toolset);
            break;
          case 'analyze':
            await executeInteractiveAnalyze(toolset);
            break;
          case 'check':
            await executeInteractiveCheck(toolset);
            break;
          case 'bazi':
            await executeInteractiveBazi(toolset);
            break;
          case 'tools':
            await executeInteractiveTools(toolset);
            break;
        }
        
        console.log();
      }
      
    } catch (error) {
      console.error(chalk.red('❌ 执行错误:'), error.message);
    }
  });

/**
 * 交互式生成姓名
 */
async function executeInteractiveGenerate(toolset) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'surname',
      message: '请输入姓氏:',
      validate: (input) => input.trim() !== '' || '姓氏不能为空'
    },
    {
      type: 'list',
      name: 'gender',
      message: '请选择性别:',
      choices: [
        { name: '男性', value: 'male' },
        { name: '女性', value: 'female' }
      ]
    },
    {
      type: 'list',
      name: 'style',
      message: '请选择风格:',
      choices: [
        { name: '传统', value: 'traditional' },
        { name: '现代', value: 'modern' },
        { name: '诗意', value: 'poetic' }
      ]
    },
    {
      type: 'input',
      name: 'count',
      message: '生成数量 (1-10):',
      default: '3',
      validate: (input) => {
        const count = parseInt(input);
        return (count >= 1 && count <= 10) || '请输入 1-10 之间的数字';
      }
    }
  ]);
  
  const params = {
    surname: answers.surname,
    gender: answers.gender,
    style: answers.style,
    count: parseInt(answers.count),
    includeReason: true
  };
  
  console.log(chalk.blue('🎯 正在生成姓名...'));
  const result = await toolset.execute('chinese-name-generator', params);
  formatOutput(result, 'chinese-name-generator');
}

/**
 * 交互式分析姓名
 */
async function executeInteractiveAnalyze(toolset) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入要分析的姓名:',
      validate: (input) => input.trim() !== '' || '姓名不能为空'
    },
    {
      type: 'list',
      name: 'depth',
      message: '请选择分析深度:',
      choices: [
        { name: '基础分析', value: 'basic' },
        { name: '详细分析', value: 'detailed' },
        { name: '全面分析', value: 'comprehensive' }
      ]
    }
  ]);
  
  const params = {
    name: answers.name,
    depth: answers.depth,
    includeWuxing: true,
    includePronunciation: true
  };
  
  console.log(chalk.blue('🔍 正在分析姓名...'));
  const result = await toolset.execute('name-meaning-analyzer', params);
  formatOutput(result, 'name-meaning-analyzer');
}

/**
 * 交互式检查重名
 */
async function executeInteractiveCheck(toolset) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入要检查的姓名:',
      validate: (input) => input.trim() !== '' || '姓名不能为空'
    },
    {
      type: 'list',
      name: 'region',
      message: '请选择检查范围:',
      choices: [
        { name: '全国', value: 'national' },
        { name: '省级', value: 'provincial' },
        { name: '市级', value: 'city' }
      ]
    }
  ]);
  
  const params = {
    name: answers.name,
    region: answers.region,
    includeSimilar: true,
    includeRecommendations: true
  };
  
  console.log(chalk.blue('🔍 正在检查重名情况...'));
  const result = await toolset.execute('name-collision-checker', params);
  formatOutput(result, 'name-collision-checker');
}

/**
 * 交互式八字分析
 */
async function executeInteractiveBazi(toolset) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入姓名:',
      validate: (input) => input.trim() !== '' || '姓名不能为空'
    },
    {
      type: 'input',
      name: 'year',
      message: '请输入出生年份:',
      validate: (input) => {
        const year = parseInt(input);
        return (year >= 1900 && year <= 2100) || '请输入有效的年份 (1900-2100)';
      }
    },
    {
      type: 'input',
      name: 'month',
      message: '请输入出生月份 (1-12):',
      validate: (input) => {
        const month = parseInt(input);
        return (month >= 1 && month <= 12) || '请输入有效的月份 (1-12)';
      }
    },
    {
      type: 'input',
      name: 'day',
      message: '请输入出生日期 (1-31):',
      validate: (input) => {
        const day = parseInt(input);
        return (day >= 1 && day <= 31) || '请输入有效的日期 (1-31)';
      }
    },
    {
      type: 'input',
      name: 'hour',
      message: '请输入出生时辰 (0-23):',
      validate: (input) => {
        const hour = parseInt(input);
        return (hour >= 0 && hour <= 23) || '请输入有效的时辰 (0-23)';
      }
    }
  ]);
  
  const params = {
    name: answers.name,
    birthYear: parseInt(answers.year),
    birthMonth: parseInt(answers.month),
    birthDay: parseInt(answers.day),
    birthHour: parseInt(answers.hour),
    depth: 'detailed'
  };
  
  console.log(chalk.blue('🔮 正在进行八字分析...'));
  const result = await toolset.execute('name-bazi-analyzer', params);
  formatOutput(result, 'name-bazi-analyzer');
}

/**
 * 交互式查看工具
 */
async function executeInteractiveTools(toolset) {
  const tools = toolset.getAvailableTools();
  const stats = toolset.getStatistics();
  
  console.log(chalk.blue('🛠️ 中文起名MCP工具集'));
  console.log(chalk.gray(`版本: ${stats.version}`));
  console.log(chalk.gray(`总工具数: ${stats.totalTools}`));
  console.log();
  
  console.log(chalk.yellow('📋 可用工具:'));
  tools.forEach((tool, index) => {
    const schema = toolset.getToolSchema(tool);
    console.log(`\n${index + 1}. ${chalk.bold(tool)}`);
    if (schema && schema.description) {
      console.log(`   ${chalk.gray(schema.description)}`);
    }
  });
}

// 解析命令行参数
program.parse();

// 如果没有提供命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
  console.log();
  console.log(chalk.blue('💡 提示:'));
  console.log('  使用 "chinese-naming interactive" 进入交互式模式');
  console.log('  使用 "chinese-naming tools" 查看所有可用工具');
  console.log('  使用 "chinese-naming --help" 查看详细帮助');
}