/**
 * 姓名分析器初始化工具
 * Name Analyzer Initialization Utilities
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

const CharacterData = require('../data/character-data');

// 创建CharacterData实例
const characterData = new CharacterData();

/**
 * 初始化字符含义数据库
 * @returns {object} 字符含义数据库
 */
function initializeCharacterMeanings() {
  // 常用字的详细含义数据库
  const characterDataInstance = new CharacterData();
  return {
    ...characterDataInstance.getVirtueCharacters(),
    ...characterDataInstance.getQualityCharacters(),
    ...characterDataInstance.getNatureCharacters(),
    ...characterDataInstance.getModernCharacters()
  };
}

/**
 * 初始化姓氏起源数据库
 * @returns {object} 姓氏起源数据库
 */
function initializeSurnameOrigins() {
  // 姓氏文化背景
  const characterDataInstance = new CharacterData();
  return characterDataInstance.getSurnameOrigins();
}

/**
 * 初始化组合模板
 * @returns {void}
 */
function initializeCombinationTemplates() {
  // 这个方法在原代码中是空的，保留为空方法
}

module.exports = {
  initializeCharacterMeanings,
  initializeSurnameOrigins,
  initializeCombinationTemplates
};
