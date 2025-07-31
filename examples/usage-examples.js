/**
 * 中文起名MCP工具集 - 使用示例
 * Chinese Naming MCP Toolset - Usage Examples
 * 
 * 展示各种工具的基本使用方法和高级功能
 * @version 1.0.0
 */

const { 
  createToolset, 
  generateName, 
  analyzeName, 
  checkCollision, 
  analyzeBazi,
  comprehensiveAnalysis 
} = require('../index');

/**
 * 基础示例：生成姓名
 */
async function basicNameGeneration() {
  console.log('\n=== 基础姓名生成示例 ===');
  
  try {
    // 生成传统风格的男性姓名
    const result = await generateName('李', 'male', 'traditional', {
      count: 3,
      includeReason: true
    });
    
    if (result.success) {
      console.log('生成的姓名:');
      result.data.names.forEach((name, index) => {
        console.log(`${index + 1}. ${name.fullName} (评分: ${name.score})`);
        console.log(`   含义: ${name.meaning}`);
        console.log(`   理由: ${name.reason}\n`);
      });
    } else {
      console.error('生成失败:', result.message);
    }
  } catch (error) {
    console.error('示例执行错误:', error.message);
  }
}

/**
 * 高级示例：姓名含义分析
 */
async function advancedNameAnalysis() {
  console.log('\n=== 高级姓名分析示例 ===');
  
  try {
    const result = await analyzeName('王雅琴', 'comprehensive', {
      includeWuxing: true,
      includePronunciation: true,
      includeTraditional: true
    });
    
    if (result.success) {
      const data = result.data;
      console.log(`姓名: ${data.name}`);
      console.log(`整体含义: ${data.overall.meaning}`);
      console.log(`综合评分: ${data.overall.score}`);
      
      if (data.culturalConnotation) {
        console.log(`\n文化内涵:`);
        console.log(`  传统文化: ${data.culturalConnotation.traditional}`);
        console.log(`  现代文化: ${data.culturalConnotation.modern}`);
      }
      
      if (data.modernInterpretation) {
        console.log(`\n现代解读:`);
        console.log(`  职业发展: ${data.modernInterpretation.career}`);
        console.log(`  性格特征: ${data.modernInterpretation.personality}`);
      }
    } else {
      console.error('分析失败:', result.message);
    }
  } catch (error) {
    console.error('示例执行错误:', error.message);
  }
}

/**
 * 重名检查示例
 */
async function nameCollisionExample() {
  console.log('\n=== 重名检查示例 ===');
  
  try {
    const result = await checkCollision('张伟', 'national', {
      ageGroup: '20-30',
      includeSimilar: true,
      includeGenderAnalysis: true,
      includeTrend: true,
      includeRecommendations: true
    });
    
    if (result.success) {
      const data = result.data;
      console.log(`姓名: ${data.name}`);
      console.log(`重名风险: ${data.collisionRisk}`);
      console.log(`预估重名人数: ${data.estimatedCount}`);
      console.log(`独特性评分: ${data.uniquenessScore}`);
      
      if (data.similarNames && data.similarNames.length > 0) {
        console.log('\n相似姓名:');
        data.similarNames.slice(0, 3).forEach(similar => {
          console.log(`  ${similar.name} (相似度: ${similar.similarity}%)`);
        });
      }
      
      if (data.recommendations) {
        console.log('\n建议:');
        console.log(`  总体建议: ${data.recommendations.advice}`);
        if (data.recommendations.alternatives.length > 0) {
          console.log(`  替代方案: ${data.recommendations.alternatives.join(', ')}`);
        }
      }
    } else {
      console.error('检查失败:', result.message);
    }
  } catch (error) {
    console.error('示例执行错误:', error.message);
  }
}

/**
 * 八字分析示例
 */
async function baziAnalysisExample() {
  console.log('\n=== 八字分析示例 ===');
  
  try {
    const result = await analyzeBazi('李明华', 1990, 5, 15, 14, {
      depth: 'detailed',
      gender: 'male'
    });
    
    if (result.success) {
      const data = result.data;
      console.log(`姓名: ${data.name}`);
      console.log(`日主: ${data.bazi.dayMaster}`);
      console.log(`配合度评分: ${data.compatibility.score}`);
      console.log(`配合分析: ${data.compatibility.analysis}`);
      
      if (data.dayMasterAnalysis) {
        console.log('\n日主分析:');
        console.log(`  性格特征: ${data.dayMasterAnalysis.characteristics.join(', ')}`);
        console.log(`  优势: ${data.dayMasterAnalysis.strengths.join(', ')}`);
      }
      
      if (data.seasonalInfluence) {
        console.log('\n季节影响:');
        console.log(`  出生季节: ${data.seasonalInfluence.season}`);
        console.log(`  季节影响: ${data.seasonalInfluence.influence}`);
      }
    } else {
      console.error('分析失败:', result.message);
    }
  } catch (error) {
    console.error('示例执行错误:', error.message);
  }
}

/**
 * 综合分析示例
 */
async function comprehensiveAnalysisExample() {
  console.log('\n=== 综合分析示例 ===');
  
  try {
    const result = await comprehensiveAnalysis('陈诗涵', {
      birthYear: 1995,
      birthMonth: 8,
      birthDay: 20,
      birthHour: 10
    });
    
    if (result.success) {
      const data = result.data;
      console.log(`姓名: ${data.name}`);
      console.log(`分析时间: ${data.timestamp}`);
      
      // 显示各项分析结果
      Object.keys(data.analyses).forEach(analysisType => {
        const analysis = data.analyses[analysisType];
        if (!analysis.error) {
          console.log(`\n${analysisType} 分析完成 ✓`);
          
          // 根据分析类型显示关键信息
          switch (analysisType) {
            case 'name-meaning-analyzer':
              if (analysis.overall) {
                console.log(`  整体含义: ${analysis.overall.meaning}`);
                console.log(`  综合评分: ${analysis.overall.score}`);
              }
              break;
            case 'name-collision-checker':
              console.log(`  重名风险: ${analysis.collisionRisk}`);
              console.log(`  独特性评分: ${analysis.uniquenessScore}`);
              break;
            case 'name-bazi-analyzer':
              if (analysis.compatibility) {
                console.log(`  八字配合度: ${analysis.compatibility.score}`);
              }
              break;
            case 'name-phonetic-analyzer':
              if (analysis.analysis) {
                console.log(`  音韵美感: ${analysis.analysis.beauty}`);
                console.log(`  流畅度: ${analysis.analysis.fluency}`);
              }
              break;
            case 'name-cultural-analyzer':
              if (analysis.culturalLayers) {
                console.log(`  文化深度: ${analysis.culturalLayers.deep}`);
              }
              break;
          }
        } else {
          console.log(`\n${analysisType} 分析失败: ${analysis.error}`);
        }
      });
    } else {
      console.error('综合分析失败:', result.message);
    }
  } catch (error) {
    console.error('示例执行错误:', error.message);
  }
}

/**
 * 工具集管理示例
 */
async function toolsetManagementExample() {
  console.log('\n=== 工具集管理示例 ===');
  
  try {
    // 创建工具集实例
    const toolset = await createToolset();
    
    // 获取统计信息
    const stats = toolset.getStatistics();
    console.log('工具集统计:');
    console.log(`  总工具数: ${stats.totalTools}`);
    console.log(`  基础工具: ${stats.basicTools}`);
    console.log(`  高级工具: ${stats.advancedTools}`);
    console.log(`  初始化状态: ${stats.initialized}`);
    console.log(`  版本: ${stats.version}`);
    
    // 获取可用工具列表
    const availableTools = toolset.getAvailableTools();
    console.log('\n可用工具:');
    availableTools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool}`);
    });
    
    // 获取特定工具的参数模式
    const schema = toolset.getToolSchema('chinese-name-generator');
    console.log('\n中文姓名生成器参数模式:');
    console.log(JSON.stringify(schema, null, 2));
    
  } catch (error) {
    console.error('示例执行错误:', error.message);
  }
}

/**
 * 批量处理示例
 */
async function batchProcessingExample() {
  console.log('\n=== 批量处理示例 ===');
  
  try {
    const toolset = await createToolset();
    
    // 定义批量任务
    const tasks = [
      {
        toolName: 'chinese-name-generator',
        params: {
          surname: '刘',
          gender: 'female',
          style: 'poetic',
          count: 2
        }
      },
      {
        toolName: 'name-meaning-analyzer',
        params: {
          name: '刘诗雨',
          depth: 'basic'
        }
      },
      {
        toolName: 'name-collision-checker',
        params: {
          name: '刘诗雨',
          region: 'national'
        }
      }
    ];
    
    // 执行批量任务
    const results = await toolset.executeBatch(tasks);
    
    console.log('批量处理结果:');
    results.forEach((result, index) => {
      console.log(`\n任务 ${index + 1}: ${result.toolName}`);
      if (result.success) {
        console.log('  状态: 成功 ✓');
        // 根据工具类型显示简要结果
        if (result.toolName === 'chinese-name-generator' && result.result.data.names) {
          console.log(`  生成姓名: ${result.result.data.names.map(n => n.fullName).join(', ')}`);
        } else if (result.toolName === 'name-meaning-analyzer' && result.result.data.overall) {
          console.log(`  整体评分: ${result.result.data.overall.score}`);
        } else if (result.toolName === 'name-collision-checker' && result.result.data) {
          console.log(`  重名风险: ${result.result.data.collisionRisk}`);
        }
      } else {
        console.log('  状态: 失败 ✗');
        console.log(`  错误: ${result.error}`);
      }
    });
    
  } catch (error) {
    console.error('示例执行错误:', error.message);
  }
}

/**
 * 主函数：运行所有示例
 */
async function runAllExamples() {
  console.log('🎯 中文起名MCP工具集 - 使用示例演示');
  console.log('='.repeat(60));
  
  try {
    // 运行各种示例
    await basicNameGeneration();
    await advancedNameAnalysis();
    await nameCollisionExample();
    await baziAnalysisExample();
    await comprehensiveAnalysisExample();
    await toolsetManagementExample();
    await batchProcessingExample();
    
    console.log('\n🎉 所有示例演示完成！');
    
  } catch (error) {
    console.error('\n❌ 示例演示过程中出现错误:', error.message);
  }
}

/**
 * 交互式示例选择
 */
async function interactiveExamples() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const examples = {
    '1': { name: '基础姓名生成', func: basicNameGeneration },
    '2': { name: '高级姓名分析', func: advancedNameAnalysis },
    '3': { name: '重名检查', func: nameCollisionExample },
    '4': { name: '八字分析', func: baziAnalysisExample },
    '5': { name: '综合分析', func: comprehensiveAnalysisExample },
    '6': { name: '工具集管理', func: toolsetManagementExample },
    '7': { name: '批量处理', func: batchProcessingExample },
    '0': { name: '运行所有示例', func: runAllExamples }
  };
  
  console.log('\n🎯 中文起名MCP工具集 - 交互式示例');
  console.log('='.repeat(50));
  console.log('请选择要运行的示例:');
  
  Object.entries(examples).forEach(([key, example]) => {
    console.log(`  ${key}. ${example.name}`);
  });
  
  rl.question('\n请输入选项 (0-7): ', async (answer) => {
    const example = examples[answer.trim()];
    if (example) {
      console.log(`\n正在运行: ${example.name}`);
      await example.func();
    } else {
      console.log('\n无效选项，请重新选择。');
    }
    rl.close();
  });
}

// 如果直接运行此文件
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--interactive') || args.includes('-i')) {
    interactiveExamples();
  } else {
    runAllExamples();
  }
}

// 导出示例函数
module.exports = {
  basicNameGeneration,
  advancedNameAnalysis,
  nameCollisionExample,
  baziAnalysisExample,
  comprehensiveAnalysisExample,
  toolsetManagementExample,
  batchProcessingExample,
  runAllExamples,
  interactiveExamples
};