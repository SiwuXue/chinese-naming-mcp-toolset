/**
 * 文本统计工具
 * Text Statistics Tool
 * 
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

const BaseTool = require('../../utils/base-tool.js');

class TextStatistics extends BaseTool {
  constructor() {
    super(
      'text-statistics',
      '分析文本统计信息，包括字符数、单词数、句子数等',
      'text-analysis'
    );
  }

  /**
   * 执行文本统计分析
   * @param {object} params - 输入参数
   * @returns {Promise<object>} 分析结果
   */
  async execute(params) {
    try {
      this._updateStats();
      this.log('info', '开始分析文本统计信息', params);
      
      const { text, includeDetails = false } = params;
      
      // 参数验证
      if (!text) {
        throw new Error('文本内容不能为空');
      }
      
      if (text.length > 100000) {
        throw new Error('文本内容长度不能超过100000字符');
      }
      
      // 基本统计
      const characterCount = text.length;
      const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
      const lineCount = text.split('\n').length;
      const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      
      const result = {
        characterCount,
        wordCount,
        lineCount,
        sentenceCount
      };
      
      // 详细统计
      if (includeDetails) {
        const averageWordLength = characterCount / wordCount || 0;
        const averageSentenceLength = wordCount / sentenceCount || 0;
        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0).length;
        
        result.details = {
          averageWordLength: parseFloat(averageWordLength.toFixed(2)),
          averageSentenceLength: parseFloat(averageSentenceLength.toFixed(2)),
          paragraphCount: paragraphs,
          spaceCount: (text.match(/\s/g) || []).length,
          punctuationCount: (text.match(/[.!?;:,]/g) || []).length
        };
      }
      
      this.log('info', '文本统计分析完成');
      return this.createSuccessResponse(result);
      
    } catch (error) {
      this.log('error', '分析文本统计信息时发生错误', { error: error.message });
      return this.createErrorResponse(error.message);
    }
  }
  
  /**
   * 获取参数模式
   * @returns {object} 参数模式
   */
  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: '需要分析的文本内容',
          minLength: 1,
          maxLength: 100000
        },
        includeDetails: {
          type: 'boolean',
          default: false,
          description: '是否包含详细统计信息'
        }
      },
      required: ['text']
    };
  }
  
  /**
   * 获取使用示例
   * @returns {array} 示例数组
   */
  getExamples() {
    return [
      {
        title: '基础文本统计',
        params: {
          text: 'Hello world! This is a test.'
        },
        description: '对简单文本进行基础统计分析'
      },
      {
        title: '详细文本统计',
        params: {
          text: 'Hello world! This is a test. It includes multiple sentences and words.',
          includeDetails: true
        },
        description: '对文本进行详细统计分析'
      }
    ];
  }
}

module.exports = TextStatistics;