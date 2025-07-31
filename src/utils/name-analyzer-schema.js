/**
 * 姓名分析器模式定义
 * Name Analyzer Schema Definitions
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

/**
 * 获取参数模式
 * @returns {object} 参数模式
 */
function getParameterSchema() {
  return {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        description: '完整姓名，如：张雅琪',
        minLength: 2,
        maxLength: 6
      },
      analysisDepth: {
        type: 'string',
        enum: ['basic', 'detailed', 'comprehensive'],
        default: 'detailed',
        description: '分析深度：basic-基础分析，detailed-详细分析，comprehensive-综合分析'
      }
    },
    required: ['fullName']
  };
}

/**
 * 获取使用示例
 * @returns {array} 示例数组
 */
function getExamples() {
  return [
    {
      title: '基础分析',
      params: {
        fullName: '张雅琪',
        analysisDepth: 'basic'
      },
      description: '对张雅琪这个名字进行基础的寓意分析'
    },
    {
      title: '详细分析',
      params: {
        fullName: '李智慧',
        analysisDepth: 'detailed'
      },
      description: '对李智慧这个名字进行详细的寓意分析，包括字符分解和文化背景'
    },
    {
      title: '综合分析',
      params: {
        fullName: '王浩然',
        analysisDepth: 'comprehensive'
      },
      description: '对王浩然这个名字进行全面综合分析，包括五行、诗词典故等'
    }
  ];
}

module.exports = {
  getParameterSchema,
  getExamples
};
