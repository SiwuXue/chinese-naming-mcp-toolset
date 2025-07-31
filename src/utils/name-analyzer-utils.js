/**
 * 姓名分析工具模块
 * 提供姓名分析相关的工具函数
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 *
 * cSpell:words wuxing Wuxing
 */

const { pinyin } = require('pinyin-pro');

// 常量定义
const HIGH_VARIATION = 3;
const MEDIUM_VARIATION = 2;
const MODULO_BASE = 5;
const MAX_DEVIATION = 3;
const DEFAULT_MIN_STROKES = 5;
const DEFAULT_MAX_STROKES = 15;

/**
 * 获取语音分析
 * @param {string} fullName - 完整姓名
 * @returns {object} 语音分析
 */
function getPhoneticAnalysis(fullName) {
  const pinyinResult = pinyin(fullName, { toneType: 'symbol' });

  const pronunciation = pinyinResult;
  const tones = pinyinResult.split(' ').map(p => getTone(p));

  return {
    pronunciation,
    tones,
    rhythm: analyzeRhythm(tones),
    harmony: analyzeHarmony(pronunciation),
    memorability: analyzeMemorability(pronunciation)
  };
}

/**
 * 获取发音
 * @param {string} char - 字符
 * @returns {string} 拼音
 */
function getPronunciation(char) {
  const result = pinyin(char, { toneType: 'symbol' });
  return result || char;
}

/**
 * 获取声调
 * @param {string} pinyinStr - 拼音字符串
 * @returns {number} 声调
 */
function getTone(pinyinStr) {
  const toneMarks = {
    ā: 1,
    á: 2,
    ǎ: 3,
    à: 4,
    ē: 1,
    é: 2,
    ě: 3,
    è: 4,
    ī: 1,
    í: 2,
    ǐ: 3,
    ì: 4,
    ō: 1,
    ó: 2,
    ǒ: 3,
    ò: 4,
    ū: 1,
    ú: 2,
    ǔ: 3,
    ù: 4
  };

  for (const char of pinyinStr) {
    if (toneMarks[char]) {
      return toneMarks[char];
    }
  }
  return 0;
}

/**
 * 分析节奏
 * @param {array} tones - 声调数组
 * @returns {string} 节奏分析结果
 */
function analyzeRhythm(tones) {
  const variation = new Set(tones).size;

  if (variation >= HIGH_VARIATION) return '节奏丰富，富有变化';
  if (variation === MEDIUM_VARIATION) return '节奏适中，朗朗上口';
  return '节奏平稳，简洁明快';
}

/**
 * 分析和谐度
 * @param {string} _pronunciation - 发音（未使用）
 * @returns {string} 和谐度分析结果
 */
function analyzeHarmony(_pronunciation) {
  return '音韵和谐，悦耳动听';
}

/**
 * 分析记忆度
 * @param {string} _pronunciation - 发音（未使用）
 * @returns {string} 记忆度分析结果
 */
function analyzeMemorability(_pronunciation) {
  return '易于记忆，朗朗上口';
}

/**
 * 获取数理分析
 * @param {string} fullName - 完整姓名
 * @returns {object} 数理分析
 */
function getNumerologyAnalysis(fullName) {
  const strokes = fullName.split('').map(char => getStrokeCount(char));
  const totalStrokes = strokes.reduce((sum, count) => sum + count, 0);

  return {
    individualStrokes: strokes,
    totalStrokes,
    numerologyMeaning: getNumerologyMeaning(totalStrokes),
    luckyNumbers: getLuckyNumbers(strokes),
    balanceAnalysis: analyzeStrokeBalance(strokes)
  };
}

/**
 * 获取数理意义
 * @param {number} totalStrokes - 总笔画数
 * @returns {string} 数理意义
 */
function getNumerologyMeaning(totalStrokes) {
  const meanings = {
    1: '独立自主，开拓进取',
    2: '合作协调，温和包容',
    3: '创意丰富，表达能力强',
    4: '踏实稳重，组织能力强',
    5: '自由活跃，适应性强'
  };

  const key = totalStrokes % MODULO_BASE || MODULO_BASE;
  return meanings[key];
}

/**
 * 获取幸运数字
 * @param {array} strokes - 笔画数组
 * @returns {array} 幸运数字数组
 */
function getLuckyNumbers(strokes) {
  return strokes.filter(s => s % 2 === 0);
}

/**
 * 分析笔画平衡性
 * @param {array} strokes - 笔画数组
 * @returns {string} 平衡性分析结果
 */
function analyzeStrokeBalance(strokes) {
  const avg = strokes.reduce((sum, s) => sum + s, 0) / strokes.length;
  return strokes.every(s => Math.abs(s - avg) <= MAX_DEVIATION) ? '笔画均衡' : '笔画有变化';
}

/**
 * 获取笔画数
 * @param {string} char - 字符
 * @returns {number} 笔画数
 */
function getStrokeCount(char) {
  // 常用汉字笔画数映射表
  const strokeMap = {
    雅: 12,
    智: 12,
    慧: 15,
    琪: 13,
    德: 15,
    仁: 4,
    山: 3,
    海: 10,
    云: 4,
    轩: 10,
    浩: 10,
    涵: 11
  };

  // 如果字符在映射表中，返回对应的笔画数，否则返回一个随机值
  return strokeMap[char] || Math.floor(Math.random() * (DEFAULT_MAX_STROKES - DEFAULT_MIN_STROKES + 1)) + DEFAULT_MIN_STROKES;
}

/**
 * 获取部首
 * @param {string} char - 字符
 * @returns {array} 部首数组
 */
function getRadicals(char) {
  const radicalMap = {
    雅: ['隹'],
    智: ['知', '日'],
    慧: ['心', '彗'],
    琪: ['玉'],
    德: ['彳', '心'],
    仁: ['人']
  };
  return radicalMap[char] || ['未知'];
}

module.exports = {
  getPhoneticAnalysis,
  getNumerologyAnalysis,
  getPronunciation,
  getTone,
  getStrokeCount,
  getRadicals
};
