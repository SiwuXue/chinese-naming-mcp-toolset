/**
 * 中文起名辅助工具
 * Chinese Naming Helper Utilities
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

const { TONE_MARKS, STROKE_MAP } = require('../data/naming-data.js');

// 常量定义
const CONSTANTS = {
  STROKE_RANDOM_MAX: 15,
  STROKE_RANDOM_MIN: 5,
  WU_XING_ELEMENTS_COUNT: 5
};

/**
 * 获取拼音声调
 * @param {string} pinyinStr - 拼音字符串
 * @returns {number} 声调数字
 */
function getTone(pinyinStr) {
  for (const char of pinyinStr) {
    if (TONE_MARKS[char]) {
      return TONE_MARKS[char];
    }
  }
  return 0;
}

/**
 * 获取汉字笔画数
 * @param {string} char - 汉字
 * @returns {number} 笔画数
 */
function getStrokeCount(char) {
  return STROKE_MAP[char] || Math.floor(Math.random() * CONSTANTS.STROKE_RANDOM_MAX) + CONSTANTS.STROKE_RANDOM_MIN;
}

/**
 * 生成寓意描述
 * @param {string} givenName - 名字
 * @param {string} style - 风格
 * @returns {string} 寓意描述
 */
function generateMeaning(givenName, style) {
  const meaningTemplates = {
    traditional: '寓意品格高尚，德行兼备，承载着深厚的文化底蕴',
    modern: '体现现代气息，寓意前程似锦，充满活力与希望',
    poetic: '富有诗意韵味，如诗如画，展现优雅的文学气质',
    simple: '简洁明快，寓意纯真美好，朴实而不失内涵'
  };

  return meaningTemplates[style] || meaningTemplates.modern;
}

/**
 * 获取五行元素
 * @param {string} givenName - 名字
 * @returns {array} 五行元素数组
 */
function getElements(givenName) {
  const elements = [];
  for (let i = 0; i < givenName.length; i++) {
    const wuXing = ['木', '火', '土', '金', '水'];
    elements.push(wuXing[Math.floor(Math.random() * CONSTANTS.WU_XING_ELEMENTS_COUNT)]);
  }
  return elements;
}

/**
 * 生成标签
 * @param {string} style - 风格
 * @param {string} gender - 性别
 * @param {object} scores - 评分
 * @returns {array} 标签数组
 */
function generateTags(style, gender, scores) {
  const tags = [];
  const styleTags = {
    traditional: '传统',
    modern: '现代',
    poetic: '诗意',
    simple: '简约'
  };

  tags.push(styleTags[style] || '现代');

  if (gender === 'male') {
    tags.push('阳刚');
  } else if (gender === 'female') {
    tags.push('优雅');
  }

  const EXCELLENT_SCORE = 90;
  const GOOD_SCORE = 80;
  const HIGH_CULTURAL_SCORE = 85;
  const HIGH_PHONETIC_SCORE = 85;

  if (scores.overall >= EXCELLENT_SCORE) {
    tags.push('精品');
  } else if (scores.overall >= GOOD_SCORE) {
    tags.push('优秀');
  }

  if (scores.cultural >= HIGH_CULTURAL_SCORE) {
    tags.push('文化');
  }

  if (scores.phonetic >= HIGH_PHONETIC_SCORE) {
    tags.push('悦耳');
  }

  return tags;
}

/**
 * 生成总结信息
 * @param {array} names - 生成的姓名数组
 * @param {string} gender - 性别
 * @param {string} style - 风格
 * @returns {object} 总结对象
 */
function generateSummary(names, gender, style) {
  if (names.length === 0) {
    return {
      description: '未能生成符合条件的姓名，请调整参数后重试',
      gender,
      style,
      count: 0
    };
  }

  const styleDesc = {
    traditional: '传统文化',
    modern: '现代时尚',
    poetic: '诗意文雅',
    simple: '简洁明快'
  };

  const genderDesc = {
    male: '男性',
    female: '女性',
    neutral: '中性'
  };

  return {
    description: `基于${styleDesc[style] || '现代'}风格生成的${genderDesc[gender] || ''}姓名，注重音韵美感和文化内涵`,
    gender,
    style,
    count: names.length
  };
}

module.exports = {
  getTone,
  getStrokeCount,
  generateMeaning,
  getElements,
  generateTags,
  generateSummary
};
