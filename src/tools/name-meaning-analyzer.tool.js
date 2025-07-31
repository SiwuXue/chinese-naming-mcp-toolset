/**
 * 姓名寓意分析器 - 核心工具
 * Name Meaning Analyzer - Core Tool
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 *
 * cSpell:words wuxing Wuxing
 */

const BaseTool = require('../utils/base-tool.js');
const nameUtils = require('../utils/name-analyzer-utils');
const advancedUtils = require('../utils/name-analyzer-advanced');
const coreUtils = require('../utils/name-analyzer-core');
const schemaUtils = require('../utils/name-analyzer-schema');
const initUtils = require('../utils/name-analyzer-init');

/**
 * 姓名寓意分析器类
 * 提供深度分析姓名的文化内涵、字义解释和象征意义的功能
 * @class
 * @extends BaseTool
 */
class NameMeaningAnalyzer extends BaseTool {
  /**
   * 构造函数
   */
  constructor() {
    super();
    this.name = 'name-meaning-analyzer';
    this.description = '深度分析姓名的文化内涵、字义解释和象征意义';
    this.category = 'core';

    // 初始化字义数据库
    this.initializeCharacterDatabase();
  }

  /**
   * 初始化字符数据库
   * 加载常用汉字的含义、姓氏文化背景和组合寓意模板
   */
  initializeCharacterDatabase() {
    this.characterMeanings = initUtils.initializeCharacterMeanings();
    this.surnameOrigins = initUtils.initializeSurnameOrigins();
    initUtils.initializeCombinationTemplates();
  }

  /**
   * 解析完整姓名
   * @param {string} fullName - 完整姓名
   * @returns {object} 姓氏和名字
   */
  parseFullName(fullName) {
    return coreUtils.parseFullName(fullName);
  }

  /**
   * 基础分析
   * @param {string} surname - 姓氏
   * @param {string} givenName - 名字
   * @returns {object} 基础分析结果
   */
  async basicAnalysis(surname, givenName) {
    const surnameInfo = this.analyzeSurname(surname);
    const givenNameInfo = this.analyzeGivenName(givenName);
    const overallMeaning = this.generateOverallMeaning(surname, givenName, 'basic');

    return {
      surnameAnalysis: surnameInfo,
      givenNameAnalysis: givenNameInfo,
      overallMeaning,
      culturalSignificance: this.getCulturalSignificance(surname, givenName, 'basic')
    };
  }

  /**
   * 详细分析
   * @param {string} surname - 姓氏
   * @param {string} givenName - 名字
   * @returns {object} 详细分析结果
   */
  async detailedAnalysis(surname, givenName) {
    const basicResult = await this.basicAnalysis(surname, givenName);

    return {
      ...basicResult,
      characterBreakdown: this.getCharacterBreakdown(givenName),
      phoneticAnalysis: this.getPhoneticAnalysis(surname + givenName),
      numerologyAnalysis: this.getNumerologyAnalysis(surname + givenName),
      historicalReferences: this.getHistoricalReferences(givenName),
      modernInterpretation: this.getModernInterpretation(givenName)
    };
  }

  /**
   * 综合分析
   * @param {string} surname - 姓氏
   * @param {string} givenName - 名字
   * @returns {object} 综合分析结果
   */
  async comprehensiveAnalysis(surname, givenName) {
    const detailedResult = await this.detailedAnalysis(surname, givenName);

    return {
      ...detailedResult,
      wuxingAnalysis: this.getWuxingAnalysis(givenName),
      poetryReferences: this.getPoetryReferences(givenName),
      personalityTraits: this.getPersonalityTraits(givenName),
      careerSuggestions: this.getCareerSuggestions(givenName),
      compatibilityAnalysis: this.getCompatibilityAnalysis(surname, givenName),
      recommendations: this.getRecommendations(surname, givenName)
    };
  }

  /**
   * 分析姓氏
   * @param {string} surname - 姓氏
   * @returns {object} 姓氏分析结果
   */
  analyzeSurname(surname) {
    return coreUtils.analyzeSurname(surname, this.surnameOrigins);
  }

  /**
   * 分析名字
   * @param {string} givenName - 名字
   * @returns {object} 名字分析结果
   */
  analyzeGivenName(givenName) {
    return coreUtils.analyzeGivenName(
      givenName,
      char => this.analyzeCharacter(char),
      analyses => this.getCombinedMeaning(analyses),
      analyses => this.getDominantThemes(analyses)
    );
  }

  /**
   * 分析单个字符
   * @param {string} char - 字符
   * @returns {object} 字符分析结果
   */
  analyzeCharacter(char) {
    return coreUtils.analyzeCharacter(char, this.characterMeanings);
  }

  /**
   * 获取组合寓意
   * @param {array} characterAnalyses - 字符分析数组
   * @returns {string} 组合寓意
   */
  getCombinedMeaning(characterAnalyses) {
    return coreUtils.getCombinedMeaning(characterAnalyses);
  }

  /**
   * 生成组合描述
   * @param {array} themes - 主题数组
   * @returns {string} 组合描述
   */
  generateCombinationDescription(themes) {
    return coreUtils.generateCombinationDescription(themes);
  }

  /**
   * 获取主导主题
   * @param {array} characterAnalyses - 字符分析数组
   * @returns {array} 主导主题数组
   */
  getDominantThemes(characterAnalyses) {
    return coreUtils.getDominantThemes(characterAnalyses);
  }

  /**
   * 生成整体寓意
   * @param {string} surname - 姓氏
   * @param {string} givenName - 名字
   * @param {string} depth - 分析深度
   * @returns {string} 整体寓意
   */
  generateOverallMeaning(surname, givenName, depth) {
    return coreUtils.generateOverallMeaning(surname, givenName, depth);
  }

  /**
   * 获取文化意义
   * @param {string} surname - 姓氏
   * @param {string} givenName - 名字
   * @param {string} depth - 分析深度
   * @returns {object} 文化意义
   */
  getCulturalSignificance(surname, givenName, depth) {
    return coreUtils.getCulturalSignificance(surname, givenName, depth);
  }

  /**
   * 获取字符详细分解
   * @param {string} givenName - 名字
   * @returns {array} 字符分解数组
   */
  getCharacterBreakdown(givenName) {
    return coreUtils.getCharacterBreakdown(
      givenName,
      char => this.analyzeCharacter(char),
      char => this.getStrokeCount(char),
      char => this.getRadicals(char),
      char => this.getPronunciation(char)
    );
  }

  /**
   * 获取语音分析
   * @param {string} fullName - 完整姓名
   * @returns {object} 语音分析
   */
  getPhoneticAnalysis(fullName) {
    return nameUtils.getPhoneticAnalysis(fullName);
  }

  /**
   * 获取数理分析
   * @param {string} fullName - 完整姓名
   * @returns {object} 数理分析
   */
  getNumerologyAnalysis(fullName) {
    return nameUtils.getNumerologyAnalysis(fullName);
  }

  /**
   * 获取历史典故
   * @param {string} givenName - 名字
   * @returns {array} 历史典故数组
   */
  getHistoricalReferences(givenName) {
    return advancedUtils.getHistoricalReferences(givenName);
  }

  /**
   * 获取现代诠释
   * @param {string} givenName - 名字
   * @returns {object} 现代诠释
   */
  getModernInterpretation(givenName) {
    return advancedUtils.getModernInterpretation(givenName);
  }

  /**
   * 获取笔画数
   * @param {string} char - 字符
   * @returns {number} 笔画数
   */
  getStrokeCount(char) {
    return nameUtils.getStrokeCount(char);
  }

  /**
   * 获取部首
   * @param {string} char - 字符
   * @returns {array} 部首数组
   */
  getRadicals(char) {
    return nameUtils.getRadicals(char);
  }

  /**
   * 获取发音
   * @param {string} char - 字符
   * @returns {string} 拼音
   */
  getPronunciation(char) {
    return nameUtils.getPronunciation(char);
  }

  /**
   * 获取声调
   * @param {string} pinyinStr - 拼音字符串
   * @returns {number} 声调
   */
  getTone(pinyinStr) {
    return nameUtils.getTone(pinyinStr);
  }

  /**
   * 获取五行分析
   * @param {string} givenName - 名字
   * @returns {object} 五行分析结果
   */
  getWuxingAnalysis(givenName) {
    return advancedUtils.getWuxingAnalysis(givenName);
  }

  /**
   * 获取诗词典故
   * @param {string} givenName - 名字
   * @returns {array} 诗词典故数组
   */
  getPoetryReferences(givenName) {
    return advancedUtils.getPoetryReferences(givenName);
  }

  /**
   * 获取性格特点
   * @param {string} givenName - 名字
   * @returns {array} 性格特点数组
   */
  getPersonalityTraits(givenName) {
    return advancedUtils.getPersonalityTraits(givenName);
  }

  /**
   * 获取职业建议
   * @param {string} givenName - 名字
   * @returns {array} 职业建议数组
   */
  getCareerSuggestions(givenName) {
    return advancedUtils.getCareerSuggestions(givenName);
  }

  /**
   * 获取兼容性分析
   * @param {string} surname - 姓氏
   * @param {string} givenName - 名字
   * @returns {object} 兼容性分析结果
   */
  getCompatibilityAnalysis(surname, givenName) {
    return advancedUtils.getCompatibilityAnalysis(surname, givenName);
  }

  /**
   * 获取建议
   * @param {string} surname - 姓氏
   * @param {string} givenName - 名字
   * @returns {array} 建议数组
   */
  getRecommendations(surname, givenName) {
    return advancedUtils.getRecommendations(surname, givenName);
  }

  /**
   * 获取参数模式
   * @returns {object} 参数模式
   */
  getParameterSchema() {
    return schemaUtils.getParameterSchema();
  }

  /**
   * 获取使用示例
   * @returns {array} 示例数组
   */
  getUsageExamples() {
    return this.getExamples();
  }

  /**
   * 获取使用示例
   * @returns {array} 示例数组
   */
  getExamples() {
    return schemaUtils.getExamples();
  }

  /**
   * 执行姓名寓意分析
   * @param {object} params - 分析参数
   * @returns {object} 分析结果
   */
  async execute(params) {
    try {
      const { name, analysisDepth = 'basic' } = params;
      
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('姓名不能为空');
      }

      const trimmedName = name.trim();
      const nameStructure = this.parseFullName(trimmedName);
      
      if (!nameStructure.surname) {
        throw new Error('无法正确解析姓名结构');
      }

      let analysisResult;

      switch (analysisDepth) {
        case 'basic':
          analysisResult = await this.basicAnalysis(nameStructure.surname, nameStructure.givenName);
          break;
        case 'detailed':
          analysisResult = await this.detailedAnalysis(nameStructure.surname, nameStructure.givenName);
          break;
        case 'comprehensive':
          analysisResult = await this.comprehensiveAnalysis(nameStructure.surname, nameStructure.givenName);
          break;
        default:
          analysisResult = await this.basicAnalysis(nameStructure.surname, nameStructure.givenName);
      }

      return this.createSuccessResponse({
        name: trimmedName,
        analysisDepth,
        ...analysisResult,
        summary: this.generateSummary(analysisResult)
      }, '姓名寓意分析完成');

    } catch (error) {
      return this.createErrorResponse(`姓名寓意分析失败: ${error.message}`);
    }
  }

  /**
   * 生成分析摘要
   * @param {object} analysisResult - 分析结果
   * @returns {string} 摘要文本
   */
  generateSummary(analysisResult) {
    const { surnameAnalysis, givenNameAnalysis, overallMeaning } = analysisResult;
    
    let summary = `姓名「${surnameAnalysis.surname}${givenNameAnalysis.givenName}」`;
    
    if (overallMeaning) {
      summary += `寓意：${overallMeaning.substring(0, 50)}${overallMeaning.length > 50 ? '...' : ''}`;
    }
    
    if (givenNameAnalysis.dominantThemes && givenNameAnalysis.dominantThemes.length > 0) {
      summary += `，主要体现${givenNameAnalysis.dominantThemes.slice(0, 2).join('、')}等主题`;
    }
    
    return summary;
  }
}

module.exports = NameMeaningAnalyzer;
