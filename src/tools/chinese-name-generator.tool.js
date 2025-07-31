/**
 * 中文起名生成器 - 核心工具
 * Chinese Name Generator - Core Tool
 *
 * 基于传统文化和现代审美，为用户生成高质量的中文人名。
 * 支持多种风格、性别偏向和个性化参数设置。
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

const BaseTool = require('../utils/base-tool.js');
const { pinyin } = require('pinyin-pro');
const {
  COMMON_SURNAMES,
  TRADITIONAL_CHARS,
  MODERN_CHARS,
  POETIC_CHARS,
  WU_XING_CHARS
} = require('../data/naming-data.js');
const {
  getTone,
  getStrokeCount,
  generateMeaning,
  getElements,
  generateTags,
  generateSummary
} = require('../utils/naming-helpers.js');
const {
  validateAndExtractParams,
  getParameterSchema,
  getExamples
} = require('../utils/naming-validator.js');

// 常量定义，避免魔术数字
const CONSTANTS = {
  DOUBLE_NAME_PROBABILITY: 0.3,
  BASE_CULTURAL_SCORE: 70,
  BASE_PHONETIC_SCORE: 75,
  TRADITIONAL_BONUS: 15,
  POETIC_BONUS: 10,
  MODERN_BONUS: 5,
  MAX_SCORE: 100,
  MIN_SCORE: 60,
  CULTURAL_RANDOM_RANGE: 20,
  PHONETIC_RANDOM_RANGE: 15,
  TONE_BONUS_MULTIPLIER: 5,
  CULTURAL_RANDOM_OFFSET: 10,
  PHONETIC_RANDOM_OFFSET: 7
};

/**
 * 中文起名生成器类
 */
class ChineseNameGenerator extends BaseTool {
  /**
   * 构造函数
   */
  constructor() {
    super();
    this.name = 'chinese-name-generator';
    this.description = '基于传统文化和现代审美，为用户生成高质量的中文人名';
    this.category = 'core';
    this.initializeData();
  }

  /**
   * 初始化数据
   */
  initializeData() {
    this.commonSurnames = COMMON_SURNAMES;
    this.traditionalChars = TRADITIONAL_CHARS;
    this.modernChars = MODERN_CHARS;
    this.poeticChars = POETIC_CHARS;
    this.wuXingChars = WU_XING_CHARS;
  }

  /**
   * 执行起名生成
   * @param {object} params - 输入参数
   * @returns {Promise<object>} 生成结果
   */
  async execute(params) {
    try {
      this._updateStats();
      this.log('info', '开始生成中文姓名', params);

      const validatedParams = validateAndExtractParams(params, this.createErrorResponse.bind(this));
      if (validatedParams.error) {
        return validatedParams.error;
      }

      const nameResults = this._generateNames(validatedParams);
      const statistics = this._calculateStatistics(nameResults, validatedParams.style);

      const result = {
        names: nameResults,
        summary: generateSummary(nameResults, validatedParams.gender, validatedParams.style),
        statistics
      };

      this.log('info', `成功生成 ${nameResults.length} 个姓名`);
      return this.createSuccessResponse(result);
    } catch (error) {
      this.log('error', '生成姓名时发生错误', { error: error.message });
      return this.createErrorResponse(error.message);
    }
  }

  /**
   * 生成指定数量的名字
   * @param {object} params - 生成参数对象
   * @returns {array} 生成的名字数组
   * @private
   */
  _generateNames(params) {
    const { count } = params;
    const names = [];
    const usedNames = new Set();

    for (let i = 0; i < count && names.length < count; i++) {
      const generatedName = this._generateSingleName(params);

      if (generatedName && !usedNames.has(generatedName.fullName)) {
        usedNames.add(generatedName.fullName);
        names.push(generatedName);
      }
    }

    return names;
  }

  /**
   * 生成单个姓名
   * @param {object} params - 生成参数对象
   * @returns {object} 生成的姓名信息
   * @private
   */
  _generateSingleName(params) {
    const { surname, gender, style, avoidChars, nameLength } = params;

    let charPool = this._selectCharPool(style, gender);
    charPool = charPool.filter(char => !avoidChars.includes(char));

    if (charPool.length < 2) {
      throw new Error('可用字符不足，请调整参数');
    }

    const finalNameLength = nameLength || (Math.random() > CONSTANTS.DOUBLE_NAME_PROBABILITY ? 2 : 1);
    let givenName = '';

    for (let i = 0; i < finalNameLength; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      const selectedChar = charPool[randomIndex];

      if (!givenName.includes(selectedChar)) {
        givenName += selectedChar;
      } else if (charPool.length > finalNameLength) {
        i--;
        continue;
      }
    }

    const fullName = surname + givenName;
    return this._generateNameDetails(fullName, givenName, style, gender);
  }

  /**
   * 选择字符池
   * @param {string} style - 风格
   * @param {string} gender - 性别
   * @returns {array} 字符池
   * @private
   */
  _selectCharPool(style, gender) {
    const charMaps = {
      traditional: () => this._getTraditionalChars(gender),
      modern: () => this._getModernChars(gender),
      poetic: () => this._getPoeticChars(),
      simple: () => this._getSimpleChars()
    };

    const charPool = charMaps[style] ? charMaps[style]() : this.modernChars.male.trendy;
    return [...new Set(charPool)];
  }

  /**
   * 获取传统风格字符
   * @param {string} gender - 性别
   * @returns {array} 字符数组
   * @private
   */
  _getTraditionalChars(gender) {
    const genderMaps = {
      male: [
        ...this.traditionalChars.male.virtue,
        ...this.traditionalChars.male.wisdom,
        ...this.traditionalChars.male.strength
      ],
      female: [
        ...this.traditionalChars.female.beauty,
        ...this.traditionalChars.female.elegance,
        ...this.traditionalChars.female.precious
      ]
    };

    return genderMaps[gender] || [
      ...this.traditionalChars.neutral.common,
      ...this.traditionalChars.neutral.aspiration
    ];
  }

  /**
   * 获取现代风格字符
   * @param {string} gender - 性别
   * @returns {array} 字符数组
   * @private
   */
  _getModernChars(gender) {
    const genderMaps = {
      male: [
        ...this.modernChars.male.trendy,
        ...this.modernChars.male.international
      ],
      female: [
        ...this.modernChars.female.trendy,
        ...this.modernChars.female.international
      ]
    };

    return genderMaps[gender] || this.modernChars.neutral.simple;
  }

  /**
   * 获取诗意风格字符
   * @returns {array} 字符数组
   * @private
   */
  _getPoeticChars() {
    return [
      ...this.poeticChars.classical,
      ...this.poeticChars.nature,
      ...this.poeticChars.emotion
    ];
  }

  /**
   * 获取简约风格字符
   * @returns {array} 字符数组
   * @private
   */
  _getSimpleChars() {
    return [
      ...this.traditionalChars.neutral.common,
      ...this.modernChars.neutral.simple
    ];
  }

  /**
   * 生成姓名详细信息
   * @param {string} fullName - 完整姓名
   * @param {string} givenName - 名字部分
   * @param {string} style - 风格
   * @param {string} gender - 性别
   * @returns {object} 姓名详细信息
   * @private
   */
  _generateNameDetails(fullName, givenName, style, gender) {
    const pinyinResult = pinyin(fullName, { toneType: 'symbol', type: 'array' });
    const pronunciation = pinyinResult.join(' ');
    const tones = pinyinResult.map(p => getTone(p));
    const strokes = fullName.split('').map(char => getStrokeCount(char));
    const meaning = generateMeaning(givenName, style);
    const scores = this._calculateScores(fullName, pronunciation, tones, style);
    const tags = generateTags(style, gender, scores);

    return {
      fullName,
      givenName,
      meaning,
      pronunciation,
      tones,
      strokes,
      elements: getElements(givenName),
      culturalScore: scores.cultural,
      phoneticScore: scores.phonetic,
      overallScore: scores.overall,
      tags
    };
  }

  /**
   * 计算各项评分
   * @param {string} fullName - 完整姓名
   * @param {string} pronunciation - 发音
   * @param {array} tones - 声调数组
   * @param {string} style - 风格
   * @returns {object} 评分对象
   * @private
   */
  _calculateScores(fullName, pronunciation, tones, style) {
    const cultural = this._calculateCulturalScore(fullName, style);
    const phonetic = this._calculatePhoneticScore(pronunciation, tones);
    const overall = Math.round((cultural + phonetic) / 2);

    return { cultural, phonetic, overall };
  }

  /**
   * 计算文化内涵评分
   * @param {string} fullName - 完整姓名
   * @param {string} style - 风格
   * @returns {number} 文化评分
   * @private
   */
  _calculateCulturalScore(fullName, style) {
    let score = CONSTANTS.BASE_CULTURAL_SCORE;

    const styleBonus = {
      traditional: CONSTANTS.TRADITIONAL_BONUS,
      poetic: CONSTANTS.POETIC_BONUS,
      modern: CONSTANTS.MODERN_BONUS
    };

    score += styleBonus[style] || CONSTANTS.MODERN_BONUS;
    score += Math.floor(Math.random() * CONSTANTS.CULTURAL_RANDOM_RANGE) - CONSTANTS.CULTURAL_RANDOM_OFFSET;

    return Math.max(CONSTANTS.MIN_SCORE, Math.min(CONSTANTS.MAX_SCORE, score));
  }

  /**
   * 计算音韵美学评分
   * @param {string} pronunciation - 发音
   * @param {array} tones - 声调数组
   * @returns {number} 音韵评分
   * @private
   */
  _calculatePhoneticScore(pronunciation, tones) {
    let score = CONSTANTS.BASE_PHONETIC_SCORE;

    if (tones.length > 1) {
      const toneVariation = new Set(tones).size;
      score += toneVariation * CONSTANTS.TONE_BONUS_MULTIPLIER;
    }

    score += Math.floor(Math.random() * CONSTANTS.PHONETIC_RANDOM_RANGE) - CONSTANTS.PHONETIC_RANDOM_OFFSET;
    return Math.max(CONSTANTS.MIN_SCORE, Math.min(CONSTANTS.MAX_SCORE, score));
  }

  /**
   * 计算统计信息
   * @param {array} names - 生成的姓名数组
   * @param {string} style - 风格
   * @returns {object} 统计信息
   * @private
   */
  _calculateStatistics(names, style) {
    if (names.length === 0) {
      return {
        totalGenerated: 0,
        averageScore: 0,
        styleDistribution: {}
      };
    }

    const totalScore = names.reduce((sum, name) => sum + name.overallScore, 0);
    const averageScore = Math.round(totalScore / names.length);
    const styleDistribution = {};
    styleDistribution[style] = names.length;

    return {
      totalGenerated: names.length,
      averageScore,
      styleDistribution
    };
  }

  /**
   * 获取参数模式
   * @returns {object} 参数模式
   */
  getParameterSchema() {
    return getParameterSchema();
  }

  /**
   * 获取使用示例
   * @returns {array} 示例数组
   */
  getExamples() {
    return getExamples();
  }
}

module.exports = ChineseNameGenerator;
